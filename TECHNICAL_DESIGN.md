# FacilityPro - Technical Design Document
## Critical Gap Resolution & Implementation Details

**Version:** 1.0
**Date:** 2025-11-23
**Status:** Phase 0 - Foundation & Gap Closure

---

## Table of Contents
1. [Multi-Currency Support (CG-01)](#cg-01-multi-currency-support)
2. [Soft Delete Strategy (CG-02)](#cg-02-soft-delete-strategy)
3. [API Rate Limiting (CG-03)](#cg-03-api-rate-limiting)
4. [Bulk Operations (CG-05)](#cg-05-bulk-operations)
5. [Optimistic Locking (CG-10)](#cg-10-optimistic-locking)
6. [Distributed Transactions (CG-07)](#cg-07-distributed-transactions)
7. [Database Architecture](#database-architecture)
8. [Security Implementation](#security-implementation)

---

## CG-01: Multi-Currency Support

### Problem Statement
System must support international customers with multiple currencies for rent, payments, and financial reporting.

### Solution Design

#### Database Schema Additions

```sql
-- Currency lookup table
CREATE TABLE currencies (
  code VARCHAR(3) PRIMARY KEY, -- ISO 4217 code (USD, EUR, GBP, etc.)
  name VARCHAR(100) NOT NULL,
  symbol VARCHAR(10) NOT NULL,
  decimal_places SMALLINT DEFAULT 2,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Exchange rates (updated daily)
CREATE TABLE exchange_rates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_currency VARCHAR(3) REFERENCES currencies(code),
  to_currency VARCHAR(3) REFERENCES currencies(code),
  rate DECIMAL(20, 10) NOT NULL,
  effective_date DATE NOT NULL,
  source VARCHAR(50), -- 'Open Exchange Rates', 'Manual', etc.
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(from_currency, to_currency, effective_date)
);

-- Add currency fields to properties
ALTER TABLE properties ADD COLUMN default_currency VARCHAR(3) REFERENCES currencies(code) DEFAULT 'USD';

-- Add currency fields to leases
ALTER TABLE leases ADD COLUMN currency VARCHAR(3) REFERENCES currencies(code) DEFAULT 'USD';
ALTER TABLE leases ADD COLUMN rent_amount DECIMAL(10, 2) NOT NULL;

-- Payments with exchange rate snapshot
ALTER TABLE payments ADD COLUMN currency VARCHAR(3) REFERENCES currencies(code);
ALTER TABLE payments ADD COLUMN amount DECIMAL(10, 2) NOT NULL;
ALTER TABLE payments ADD COLUMN exchange_rate_snapshot DECIMAL(20, 10); -- Rate at time of transaction
ALTER TABLE payments ADD COLUMN base_currency_amount DECIMAL(10, 2); -- Converted to org base currency
```

#### Implementation Strategy

**1. Currency Conversion Service**

```typescript
// src/lib/currency/exchange-rate-service.ts
interface ExchangeRateProvider {
  fetchRates(baseCurrency: string): Promise<Record<string, number>>;
}

class OpenExchangeRatesProvider implements ExchangeRateProvider {
  async fetchRates(baseCurrency: string) {
    const response = await fetch(
      `https://openexchangerates.org/api/latest.json?app_id=${process.env.OPENEXCHANGERATES_API_KEY}&base=${baseCurrency}`
    );
    const data = await response.json();
    return data.rates;
  }
}

class CurrencyService {
  async convert(
    amount: number,
    fromCurrency: string,
    toCurrency: string,
    date: Date = new Date()
  ): Promise<{ amount: number; rate: number }> {
    if (fromCurrency === toCurrency) {
      return { amount, rate: 1 };
    }

    const rate = await this.getExchangeRate(fromCurrency, toCurrency, date);
    return {
      amount: amount * rate,
      rate,
    };
  }

  private async getExchangeRate(
    fromCurrency: string,
    toCurrency: string,
    date: Date
  ): Promise<number> {
    // Try to get rate from database (cached)
    const cachedRate = await db
      .from('exchange_rates')
      .select('rate')
      .eq('from_currency', fromCurrency)
      .eq('to_currency', toCurrency)
      .eq('effective_date', date.toISOString().split('T')[0])
      .single();

    if (cachedRate) return cachedRate.rate;

    // Fetch from API and cache
    const rates = await this.provider.fetchRates(fromCurrency);
    await this.cacheRates(fromCurrency, rates, date);

    return rates[toCurrency];
  }
}
```

**2. Payment Processing with Currency**

```typescript
async function processPayment(payment: {
  amount: number;
  currency: string;
  tenantId: string;
  leaseId: string;
}) {
  // Get organization base currency
  const org = await getOrganization();
  const baseCurrency = org.base_currency;

  // Convert to base currency and snapshot exchange rate
  const { amount: baseAmount, rate } = await currencyService.convert(
    payment.amount,
    payment.currency,
    baseCurrency
  );

  // Store payment with both amounts
  await db.from('payments').insert({
    tenant_id: payment.tenantId,
    lease_id: payment.leaseId,
    currency: payment.currency,
    amount: payment.amount,
    exchange_rate_snapshot: rate,
    base_currency_amount: baseAmount,
    base_currency: baseCurrency,
  });
}
```

**3. Multi-Currency Reporting**

```typescript
// Financial reports show both currencies
interface FinancialReport {
  revenue: {
    original_currency: Record<string, number>; // { 'USD': 50000, 'EUR': 30000 }
    base_currency_total: number; // Converted total
  };
}
```

---

## CG-02: Soft Delete Strategy

### Problem Statement
Must retain deleted records for recovery, legal compliance, and data integrity.

### Solution Design

#### Universal Soft Delete Schema

```sql
-- Add to ALL entities (properties, units, tenants, leases, work_orders, etc.)
ALTER TABLE {table_name} ADD COLUMN deleted_at TIMESTAMPTZ;
ALTER TABLE {table_name} ADD COLUMN deleted_by UUID REFERENCES users(id);
ALTER TABLE {table_name} ADD COLUMN deletion_reason TEXT;
ALTER TABLE {table_name} ADD COLUMN restored_at TIMESTAMPTZ;
ALTER TABLE {table_name} ADD COLUMN restored_by UUID REFERENCES users(id);

-- Index for efficient queries
CREATE INDEX idx_{table_name}_deleted_at ON {table_name}(deleted_at) WHERE deleted_at IS NULL;
```

#### Row-Level Security (RLS) with Soft Delete

```sql
-- Example for properties table
CREATE POLICY "Users see only non-deleted properties of their organization"
ON properties
FOR SELECT
USING (
  organization_id = current_setting('app.current_organization_id')::uuid
  AND deleted_at IS NULL
);

-- Special policy for viewing deleted items (admin only)
CREATE POLICY "Admins can view deleted properties"
ON properties
FOR SELECT
USING (
  organization_id = current_setting('app.current_organization_id')::uuid
  AND has_role('admin')
);
```

#### Soft Delete Service

```typescript
// src/lib/soft-delete/service.ts
class SoftDeleteService {
  async delete<T>(
    table: string,
    id: string,
    reason: string,
    userId: string
  ): Promise<void> {
    // Check cascade rules
    await this.checkDependencies(table, id);

    // Soft delete
    await db
      .from(table)
      .update({
        deleted_at: new Date().toISOString(),
        deleted_by: userId,
        deletion_reason: reason,
      })
      .eq('id', id);

    // Cascade soft delete to dependent entities
    await this.cascadeDelete(table, id, userId, reason);
  }

  async restore<T>(table: string, id: string, userId: string): Promise<void> {
    const record = await db.from(table).select('*').eq('id', id).single();

    if (!record.deleted_at) {
      throw new Error('Record is not deleted');
    }

    const daysSinceDeleted = Math.floor(
      (Date.now() - new Date(record.deleted_at).getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysSinceDeleted > 30) {
      throw new Error('Recovery window expired (30 days)');
    }

    await db
      .from(table)
      .update({
        deleted_at: null,
        deleted_by: null,
        deletion_reason: null,
        restored_at: new Date().toISOString(),
        restored_by: userId,
      })
      .eq('id', id);
  }

  private async checkDependencies(table: string, id: string): Promise<void> {
    const rules = this.cascadeRules[table];

    for (const rule of rules) {
      const count = await db
        .from(rule.dependentTable)
        .select('count')
        .eq(rule.foreignKey, id)
        .is('deleted_at', null)
        .single();

      if (count > 0 && rule.preventDelete) {
        throw new Error(
          `Cannot delete: ${count} active ${rule.dependentTable} records depend on this`
        );
      }
    }
  }

  private cascadeRules = {
    properties: [
      {
        dependentTable: 'units',
        foreignKey: 'property_id',
        action: 'cascade', // Auto-delete units when property deleted
        preventDelete: false,
      },
      {
        dependentTable: 'leases',
        foreignKey: 'property_id',
        action: 'prevent', // Cannot delete property with active leases
        preventDelete: true,
      },
    ],
  };
}
```

#### Retention Policy & Permanent Deletion

```typescript
// Scheduled job: permanent deletion after retention period
async function permanentDeletionJob() {
  const retentionPeriod = 7 * 365; // 7 years for legal compliance

  const expiredRecords = await db
    .from('all_tables_view') // Union of all tables
    .select('table_name, id')
    .lt('deleted_at', new Date(Date.now() - retentionPeriod * 24 * 60 * 60 * 1000))
    .is('deleted_at', 'NOT NULL');

  for (const record of expiredRecords) {
    // Archive to cold storage (S3 Glacier)
    await archiveToGlacier(record.table_name, record.id);

    // Permanent database deletion
    await db.from(record.table_name).delete().eq('id', record.id);
  }
}
```

---

## CG-03: API Rate Limiting

### Problem Statement
Prevent DoS attacks, abuse, and ensure fair resource allocation with clear error messages.

### Solution Design

#### Sliding Window Algorithm

```typescript
// src/middleware/rate-limiter.ts
import { Redis } from '@upstash/redis';

interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Max requests per window
  keyPrefix: string; // Redis key prefix
}

class SlidingWindowRateLimiter {
  private redis: Redis;

  constructor() {
    this.redis = new Redis({
      url: process.env.UPSTASH_REDIS_URL!,
      token: process.env.UPSTASH_REDIS_TOKEN!,
    });
  }

  async checkLimit(
    userId: string,
    endpoint: string,
    config: RateLimitConfig
  ): Promise<{
    allowed: boolean;
    remaining: number;
    resetAt: number;
  }> {
    const now = Date.now();
    const windowStart = now - config.windowMs;
    const key = `${config.keyPrefix}:${userId}:${endpoint}`;

    // Remove old requests outside window
    await this.redis.zremrangebyscore(key, 0, windowStart);

    // Count requests in current window
    const requestCount = await this.redis.zcard(key);

    if (requestCount >= config.maxRequests) {
      // Get oldest request timestamp to calculate reset time
      const oldestRequest = await this.redis.zrange(key, 0, 0, {
        withScores: true,
      });
      const resetAt = oldestRequest[0] + config.windowMs;

      return {
        allowed: false,
        remaining: 0,
        resetAt,
      };
    }

    // Add current request to sorted set
    await this.redis.zadd(key, { score: now, member: `${now}:${Math.random()}` });

    // Set TTL on key
    await this.redis.expire(key, Math.ceil(config.windowMs / 1000));

    return {
      allowed: true,
      remaining: config.maxRequests - requestCount - 1,
      resetAt: now + config.windowMs,
    };
  }
}

// Rate limit configurations per endpoint
const RATE_LIMITS = {
  global: { windowMs: 60 * 60 * 1000, maxRequests: 1000, keyPrefix: 'rl:global' },
  '/api/auth': { windowMs: 60 * 1000, maxRequests: 10, keyPrefix: 'rl:auth' },
  '/api/payments': { windowMs: 60 * 60 * 1000, maxRequests: 30, keyPrefix: 'rl:payments' },
  '/api/bulk/*': { windowMs: 60 * 60 * 1000, maxRequests: 5, keyPrefix: 'rl:bulk' },
  '/api/reports': { windowMs: 60 * 60 * 1000, maxRequests: 20, keyPrefix: 'rl:reports' },
};

// Next.js middleware
export async function rateLimitMiddleware(req: NextRequest) {
  const userId = await getUserIdFromRequest(req);
  const endpoint = getEndpointPattern(req.nextUrl.pathname);

  const config = RATE_LIMITS[endpoint] || RATE_LIMITS.global;
  const limiter = new SlidingWindowRateLimiter();

  const result = await limiter.checkLimit(userId, endpoint, config);

  if (!result.allowed) {
    const retryAfter = Math.ceil((result.resetAt - Date.now()) / 1000);

    return new NextResponse(
      JSON.stringify({
        error: 'Too many requests',
        message: `Rate limit exceeded. Please retry after ${retryAfter} seconds.`,
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'X-RateLimit-Limit': config.maxRequests.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': result.resetAt.toString(),
          'Retry-After': retryAfter.toString(),
        },
      }
    );
  }

  // Add rate limit headers to response
  const response = NextResponse.next();
  response.headers.set('X-RateLimit-Limit', config.maxRequests.toString());
  response.headers.set('X-RateLimit-Remaining', result.remaining.toString());
  response.headers.set('X-RateLimit-Reset', result.resetAt.toString());

  return response;
}
```

#### Burst Allowance (10% over limit in 1-minute window)

```typescript
async function checkWithBurst(userId: string, endpoint: string) {
  const hourlyLimit = await checkLimit(userId, endpoint, RATE_LIMITS[endpoint]);

  // Allow 10% burst in 1-minute window
  const burstConfig = {
    windowMs: 60 * 1000,
    maxRequests: Math.ceil(RATE_LIMITS[endpoint].maxRequests * 0.1),
    keyPrefix: 'rl:burst',
  };

  if (!hourlyLimit.allowed) {
    const burstLimit = await checkLimit(userId, endpoint, burstConfig);
    return burstLimit;
  }

  return hourlyLimit;
}
```

---

## CG-05: Bulk Operations

### Problem Statement
Enterprise customers with 500+ units need bulk lease renewals, rent increases, work order assignments, etc.

### Solution Design

#### Bulk Operation Manager

```typescript
// src/lib/bulk-operations/manager.ts
interface BulkOperation {
  type: 'lease_renewal' | 'rent_increase' | 'work_order_assignment' | 'notification';
  filters: Record<string, any>;
  action: Record<string, any>;
  userId: string;
  organizationId: string;
}

interface BulkOperationJob {
  id: string;
  operation: BulkOperation;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  progress: {
    total: number;
    completed: number;
    failed: number;
    errors: Array<{ itemId: string; error: string; retryable: boolean }>;
  };
  startedAt?: Date;
  completedAt?: Date;
  cancelable: boolean;
}

class BulkOperationManager {
  async executeBulkOperation(operation: BulkOperation): Promise<BulkOperationJob> {
    // 1. Selection Phase
    const selectedItems = await this.getSelectedItems(operation.filters);

    if (selectedItems.length === 0) {
      throw new Error('No items match the filters');
    }

    if (selectedItems.length > 10000) {
      throw new Error('Bulk operation limited to 10,000 items. Please refine filters.');
    }

    // 2. Preview Phase
    const preview = {
      affectedCount: selectedItems.length,
      estimatedTime: this.estimateProcessingTime(selectedItems.length),
      sample: selectedItems.slice(0, 5),
      warnings: this.validateOperation(operation, selectedItems),
    };

    // 3. Confirmation Phase (required for destructive ops)
    if (this.isDestructive(operation.type)) {
      // Store pending operation, return preview
      const jobId = await this.createPendingJob(operation, selectedItems, preview);

      return {
        id: jobId,
        operation,
        status: 'pending',
        progress: { total: selectedItems.length, completed: 0, failed: 0, errors: [] },
        cancelable: true,
        preview, // User must confirm before execution
      };
    }

    // 4. Background Processing
    const jobId = await this.queueBackgroundJob(operation, selectedItems);

    return {
      id: jobId,
      operation,
      status: 'running',
      progress: { total: selectedItems.length, completed: 0, failed: 0, errors: [] },
      cancelable: true,
    };
  }

  private async queueBackgroundJob(
    operation: BulkOperation,
    items: any[]
  ): Promise<string> {
    const jobId = crypto.randomUUID();

    // Process in batches of 100
    const batchSize = 100;

    for (let i = 0; i < items.length; i += batchSize) {
      const batch = items.slice(i, i + batchSize);

      await this.processBatch(jobId, operation, batch);

      // Update progress
      await this.updateProgress(jobId, i + batch.length, items.length);

      // Check for cancellation
      if (await this.isCancelled(jobId)) {
        await this.markJobCancelled(jobId);
        return jobId;
      }
    }

    await this.completeJob(jobId);
    return jobId;
  }

  private async processBatch(
    jobId: string,
    operation: BulkOperation,
    batch: any[]
  ): Promise<void> {
    const results = await Promise.allSettled(
      batch.map((item) => this.processItem(operation, item))
    );

    // Track errors
    const errors = results
      .map((result, index) => ({
        result,
        item: batch[index],
      }))
      .filter(({ result }) => result.status === 'rejected')
      .map(({ result, item }) => ({
        itemId: item.id,
        error: (result as PromiseRejectedResult).reason.message,
        retryable: this.isRetryableError((result as PromiseRejectedResult).reason),
      }));

    if (errors.length > 0) {
      await this.recordErrors(jobId, errors);
    }
  }

  private async processItem(operation: BulkOperation, item: any): Promise<void> {
    switch (operation.type) {
      case 'lease_renewal':
        await this.renewLease(item, operation.action);
        break;
      case 'rent_increase':
        await this.increaseRent(item, operation.action);
        break;
      case 'work_order_assignment':
        await this.assignWorkOrder(item, operation.action);
        break;
      case 'notification':
        await this.sendNotification(item, operation.action);
        break;
    }
  }

  async getJobStatus(jobId: string): Promise<BulkOperationJob> {
    const job = await db.from('bulk_operations').select('*').eq('id', jobId).single();
    return job;
  }

  async cancelJob(jobId: string): Promise<void> {
    await db
      .from('bulk_operations')
      .update({ status: 'cancelling' })
      .eq('id', jobId);
  }

  async downloadErrorReport(jobId: string): Promise<string> {
    const errors = await db
      .from('bulk_operation_errors')
      .select('*')
      .eq('job_id', jobId);

    // Generate CSV report
    const csv = this.generateCSVReport(errors);
    return csv;
  }

  private estimateProcessingTime(count: number): string {
    const itemsPerSecond = 10; // Conservative estimate
    const seconds = Math.ceil(count / itemsPerSecond);

    if (seconds < 60) return `${seconds} seconds`;
    if (seconds < 3600) return `${Math.ceil(seconds / 60)} minutes`;
    return `${Math.ceil(seconds / 3600)} hours`;
  }

  private isDestructive(type: string): boolean {
    return ['delete', 'cancel', 'terminate'].some(word => type.includes(word));
  }
}
```

#### Bulk Operation UI Pattern

```typescript
// src/components/bulk-operations/LeaseRenewalBulk.tsx
export function BulkLeaseRenewal() {
  const [step, setStep] = useState<'select' | 'preview' | 'confirm' | 'processing'>('select');
  const [selectedLeases, setSelectedLeases] = useState([]);
  const [preview, setPreview] = useState(null);
  const [job, setJob] = useState(null);

  async function handlePreview() {
    const result = await bulkOperationManager.executeBulkOperation({
      type: 'lease_renewal',
      filters: { expiring_in_days: 90, building: 'A' },
      action: { rent_increase_percent: 3 },
    });

    setPreview(result.preview);
    setJob(result);
    setStep('preview');
  }

  async function handleConfirm() {
    await bulkOperationManager.confirmJob(job.id);
    setStep('processing');

    // Poll for progress
    const interval = setInterval(async () => {
      const status = await bulkOperationManager.getJobStatus(job.id);
      setJob(status);

      if (status.status === 'completed' || status.status === 'failed') {
        clearInterval(interval);
      }
    }, 2000);
  }

  return (
    <div>
      {step === 'select' && (
        <SelectLeases onNext={handlePreview} />
      )}

      {step === 'preview' && (
        <div>
          <h2>Preview: {preview.affectedCount} leases selected</h2>
          <ul>
            {preview.sample.map(lease => (
              <li key={lease.id}>
                Unit {lease.unit_number}: ${lease.current_rent} → ${lease.new_rent}
              </li>
            ))}
          </ul>
          <p>Estimated time: {preview.estimatedTime}</p>
          {preview.warnings.length > 0 && (
            <div className="warnings">
              {preview.warnings.map(w => <div key={w}>{w}</div>)}
            </div>
          )}
          <button onClick={handleConfirm}>Confirm & Process</button>
        </div>
      )}

      {step === 'processing' && (
        <div>
          <h2>Processing...</h2>
          <ProgressBar
            current={job.progress.completed}
            total={job.progress.total}
          />
          <p>
            {job.progress.completed} / {job.progress.total} completed
            {job.progress.failed > 0 && ` (${job.progress.failed} errors)`}
          </p>
          {job.cancelable && (
            <button onClick={() => bulkOperationManager.cancelJob(job.id)}>
              Cancel
            </button>
          )}
        </div>
      )}
    </div>
  );
}
```

---

## CG-10: Optimistic Locking for Concurrent Edits

### Problem Statement
Two users editing the same record simultaneously can cause data loss without conflict detection.

### Solution Design

#### Version-Based Optimistic Locking

```sql
-- Add to all editable entities
ALTER TABLE {table_name} ADD COLUMN version INTEGER DEFAULT 1 NOT NULL;

-- Trigger to auto-increment version on update
CREATE OR REPLACE FUNCTION increment_version()
RETURNS TRIGGER AS $$
BEGIN
  NEW.version = OLD.version + 1;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_increment_version
BEFORE UPDATE ON {table_name}
FOR EACH ROW
EXECUTE FUNCTION increment_version();
```

#### TypeScript Implementation

```typescript
// src/lib/optimistic-locking/service.ts
class ConcurrentModificationError extends Error {
  constructor(
    public currentVersion: number,
    public yourVersion: number,
    public currentData: any
  ) {
    super('Record was modified by another user');
    this.name = 'ConcurrentModificationError';
  }
}

class OptimisticLockingService {
  async update<T>(
    table: string,
    id: string,
    data: Partial<T>,
    expectedVersion: number
  ): Promise<T> {
    const result = await db
      .from(table)
      .update({
        ...data,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('version', expectedVersion) // Critical: version check
      .select()
      .single();

    if (!result.data) {
      // Version mismatch - fetch current version
      const current = await db
        .from(table)
        .select('*')
        .eq('id', id)
        .single();

      throw new ConcurrentModificationError(
        current.data.version,
        expectedVersion,
        current.data
      );
    }

    return result.data;
  }

  async attemptMerge<T>(
    table: string,
    id: string,
    yourChanges: Partial<T>,
    currentData: T
  ): Promise<T> {
    // Attempt automatic merge for non-conflicting fields
    const merged = { ...currentData };
    let conflicts: string[] = [];

    for (const [key, value] of Object.entries(yourChanges)) {
      if (currentData[key] !== yourChanges[key]) {
        // Field was modified by both users
        conflicts.push(key);
      } else {
        // Safe to apply your change
        merged[key] = value;
      }
    }

    if (conflicts.length > 0) {
      throw new Error(
        `Cannot auto-merge. Conflicting fields: ${conflicts.join(', ')}`
      );
    }

    // Retry update with current version
    return this.update(table, id, merged, currentData.version);
  }
}
```

#### UI Conflict Resolution

```typescript
// src/components/edit-forms/LeaseEditForm.tsx
export function LeaseEditForm({ leaseId }: { leaseId: string }) {
  const [lease, setLease] = useState(null);
  const [formData, setFormData] = useState({});
  const [conflict, setConflict] = useState(null);

  async function handleSubmit() {
    try {
      await optimisticLockingService.update(
        'leases',
        leaseId,
        formData,
        lease.version
      );
      toast.success('Lease updated successfully');
    } catch (error) {
      if (error instanceof ConcurrentModificationError) {
        setConflict({
          yourVersion: error.yourVersion,
          currentVersion: error.currentVersion,
          currentData: error.currentData,
        });
      }
    }
  }

  async function handleConflictResolution(action: 'override' | 'merge' | 'cancel') {
    if (action === 'override') {
      // Force update with current version
      await optimisticLockingService.update(
        'leases',
        leaseId,
        formData,
        conflict.currentData.version
      );
    } else if (action === 'merge') {
      // Attempt auto-merge
      await optimisticLockingService.attemptMerge(
        'leases',
        leaseId,
        formData,
        conflict.currentData
      );
    } else {
      // Cancel - reload current data
      setLease(conflict.currentData);
      setFormData(conflict.currentData);
    }

    setConflict(null);
  }

  if (conflict) {
    return (
      <ConflictDialog
        yourChanges={formData}
        currentData={conflict.currentData}
        onResolve={handleConflictResolution}
      />
    );
  }

  return <form onSubmit={handleSubmit}>...</form>;
}

// Conflict resolution UI
function ConflictDialog({ yourChanges, currentData, onResolve }) {
  return (
    <div className="conflict-dialog">
      <h2>Conflict Detected</h2>
      <p>Another user modified this record while you were editing.</p>

      <div className="comparison">
        <div>
          <h3>Your Changes</h3>
          <DiffView data={yourChanges} />
        </div>
        <div>
          <h3>Current Version</h3>
          <DiffView data={currentData} />
        </div>
      </div>

      <div className="actions">
        <button onClick={() => onResolve('cancel')}>
          Cancel (discard my changes)
        </button>
        <button onClick={() => onResolve('merge')}>
          Try Auto-Merge
        </button>
        <button onClick={() => onResolve('override')} className="danger">
          Override (keep my changes)
        </button>
      </div>
    </div>
  );
}
```

#### Real-Time Presence Indicators

```typescript
// Show who's editing using Supabase Realtime
const channel = supabase.channel(`lease:${leaseId}`);

// Broadcast presence
channel.on('presence', { event: 'sync' }, () => {
  const state = channel.presenceState();
  const editors = Object.values(state).flat();
  setActiveEditors(editors);
});

channel.subscribe(async (status) => {
  if (status === 'SUBSCRIBED') {
    await channel.track({
      user_id: currentUser.id,
      user_name: currentUser.name,
      editing: true,
    });
  }
});

// UI indicator
{activeEditors.length > 1 && (
  <div className="presence-indicator">
    <span>⚠️ {activeEditors.filter(e => e.user_id !== currentUser.id).map(e => e.user_name).join(', ')} {activeEditors.length > 2 ? 'are' : 'is'} also editing this lease</span>
  </div>
)}
```

---

## CG-07: Distributed Transactions (Saga Pattern)

### Problem Statement
Complex workflows like move-out involve multiple steps across entities. If one step fails, entire operation must be rolled back consistently.

### Solution Design

#### Saga Orchestrator

```typescript
// src/lib/saga/orchestrator.ts
interface SagaStep {
  name: string;
  execute: () => Promise<any>;
  compensate: (result?: any) => Promise<void>; // Rollback logic
}

interface Saga {
  id: string;
  name: string;
  steps: SagaStep[];
  status: 'pending' | 'running' | 'completed' | 'failed' | 'compensating';
  completedSteps: string[];
  failedStep?: string;
  error?: Error;
}

class SagaOrchestrator {
  async execute(saga: Saga): Promise<void> {
    const results: Record<string, any> = {};

    try {
      for (const step of saga.steps) {
        console.log(`Executing step: ${step.name}`);

        const result = await step.execute();
        results[step.name] = result;
        saga.completedSteps.push(step.name);

        // Persist saga state after each step
        await this.persistSagaState(saga);
      }

      saga.status = 'completed';
      await this.persistSagaState(saga);
    } catch (error) {
      console.error(`Step failed: ${error}`);
      saga.status = 'compensating';
      saga.error = error;

      // Execute compensation in reverse order
      for (let i = saga.completedSteps.length - 1; i >= 0; i--) {
        const stepName = saga.completedSteps[i];
        const step = saga.steps.find((s) => s.name === stepName);

        try {
          console.log(`Compensating step: ${stepName}`);
          await step.compensate(results[stepName]);
        } catch (compensateError) {
          console.error(`Compensation failed for ${stepName}:`, compensateError);
          // Log but continue compensating other steps
        }
      }

      saga.status = 'failed';
      await this.persistSagaState(saga);

      throw error;
    }
  }

  private async persistSagaState(saga: Saga): Promise<void> {
    await db.from('saga_executions').upsert({
      id: saga.id,
      name: saga.name,
      status: saga.status,
      completed_steps: saga.completedSteps,
      failed_step: saga.failedStep,
      error: saga.error?.message,
      updated_at: new Date().toISOString(),
    });
  }
}
```

#### Example: Move-Out Saga

```typescript
// src/lib/sagas/move-out-saga.ts
async function executeMoveOutSaga(leaseId: string, moveOutDate: Date) {
  const saga: Saga = {
    id: crypto.randomUUID(),
    name: 'tenant-move-out',
    steps: [
      {
        name: 'update-lease-status',
        execute: async () => {
          const result = await db
            .from('leases')
            .update({ status: 'ended', end_date: moveOutDate })
            .eq('id', leaseId)
            .select()
            .single();
          return result.data;
        },
        compensate: async (result) => {
          // Rollback lease status
          await db
            .from('leases')
            .update({ status: 'active', end_date: null })
            .eq('id', leaseId);
        },
      },
      {
        name: 'create-move-out-inspection',
        execute: async () => {
          const inspection = await db
            .from('inspections')
            .insert({
              lease_id: leaseId,
              type: 'move_out',
              scheduled_date: moveOutDate,
              status: 'scheduled',
            })
            .select()
            .single();
          return inspection.data;
        },
        compensate: async (result) => {
          // Delete inspection
          await db.from('inspections').delete().eq('id', result.id);
        },
      },
      {
        name: 'calculate-security-deposit',
        execute: async () => {
          const disposition = await calculateSecurityDepositDisposition(leaseId);

          const result = await db
            .from('security_deposit_dispositions')
            .insert(disposition)
            .select()
            .single();

          return result.data;
        },
        compensate: async (result) => {
          // Delete disposition
          await db
            .from('security_deposit_dispositions')
            .delete()
            .eq('id', result.id);
        },
      },
      {
        name: 'send-disposition-letter',
        execute: async () => {
          const tenant = await getTenantFromLease(leaseId);
          const disposition = await getLatestDisposition(leaseId);

          await sendEmail({
            to: tenant.email,
            subject: 'Security Deposit Disposition',
            template: 'security-deposit-disposition',
            data: disposition,
          });

          return { sent: true, email: tenant.email };
        },
        compensate: async () => {
          // Cannot un-send email, but log compensation attempt
          console.log('Email was sent, cannot be recalled');
        },
      },
      {
        name: 'process-refund',
        execute: async () => {
          const disposition = await getLatestDisposition(leaseId);

          if (disposition.refund_amount > 0) {
            const refund = await processStripeRefund({
              leaseId,
              amount: disposition.refund_amount,
            });
            return refund;
          }

          return { refund_amount: 0 };
        },
        compensate: async (result) => {
          if (result.refund_amount > 0) {
            // Cannot reverse Stripe refund automatically
            // Create manual task for accounting team
            await db.from('manual_tasks').insert({
              type: 'reverse_refund',
              lease_id: leaseId,
              amount: result.refund_amount,
              stripe_refund_id: result.id,
            });
          }
        },
      },
      {
        name: 'mark-unit-vacant',
        execute: async () => {
          const lease = await db
            .from('leases')
            .select('unit_id')
            .eq('id', leaseId)
            .single();

          const result = await db
            .from('units')
            .update({ status: 'vacant', available_date: moveOutDate })
            .eq('id', lease.data.unit_id)
            .select()
            .single();

          return result.data;
        },
        compensate: async (result) => {
          // Rollback unit status
          await db
            .from('units')
            .update({ status: 'occupied', available_date: null })
            .eq('id', result.id);
        },
      },
    ],
    status: 'pending',
    completedSteps: [],
  };

  const orchestrator = new SagaOrchestrator();
  await orchestrator.execute(saga);
}
```

#### Idempotency Keys for External APIs

```typescript
// Prevent duplicate API calls if saga is retried
async function processStripeRefund(params: { leaseId: string; amount: number }) {
  const idempotencyKey = `refund:${params.leaseId}:${params.amount}`;

  // Check if already processed
  const existing = await db
    .from('idempotency_keys')
    .select('*')
    .eq('key', idempotencyKey)
    .single();

  if (existing) {
    console.log('Refund already processed, returning cached result');
    return existing.data.result;
  }

  // Process refund
  const refund = await stripe.refunds.create(
    {
      amount: Math.round(params.amount * 100), // Convert to cents
      reason: 'requested_by_customer',
    },
    {
      idempotencyKey, // Stripe's built-in idempotency
    }
  );

  // Cache result
  await db.from('idempotency_keys').insert({
    key: idempotencyKey,
    result: refund,
    created_at: new Date().toISOString(),
  });

  return refund;
}
```

---

## Database Architecture

### Multi-Tenancy with Row-Level Security

```sql
-- Enable RLS on all tables
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE units ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
-- ... etc for all tables

-- Set organization context (called from application)
CREATE OR REPLACE FUNCTION set_organization_context(org_id UUID)
RETURNS VOID AS $$
BEGIN
  PERFORM set_config('app.current_organization_id', org_id::text, false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RLS Policy Example
CREATE POLICY "Users can only access their organization's properties"
ON properties
FOR ALL
USING (organization_id = current_setting('app.current_organization_id')::uuid);
```

### Database Indexes for Performance

```sql
-- Critical indexes for query performance
CREATE INDEX idx_properties_organization ON properties(organization_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_units_property ON units(property_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_leases_unit ON leases(unit_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_leases_tenant ON leases(tenant_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_leases_status ON leases(status) WHERE deleted_at IS NULL;
CREATE INDEX idx_work_orders_property ON work_orders(property_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_work_orders_status ON work_orders(status) WHERE deleted_at IS NULL;
CREATE INDEX idx_payments_tenant ON payments(tenant_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_payments_date ON payments(payment_date);

-- Full-text search indexes
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX idx_properties_search ON properties USING GIN (to_tsvector('english', name || ' ' || address));
CREATE INDEX idx_tenants_search ON tenants USING GIN (to_tsvector('english', first_name || ' ' || last_name || ' ' || email));
```

---

## Security Implementation

### Field-Level Encryption for PII

```typescript
// src/lib/encryption/field-encryption.ts
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

class FieldEncryption {
  private algorithm = 'aes-256-gcm';
  private key = Buffer.from(process.env.ENCRYPTION_KEY!, 'hex'); // 32 bytes

  encrypt(plaintext: string): string {
    const iv = randomBytes(16);
    const cipher = createCipheriv(this.algorithm, this.key, iv);

    let encrypted = cipher.update(plaintext, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const authTag = cipher.getAuthTag();

    // Format: iv:authTag:ciphertext
    return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
  }

  decrypt(ciphertext: string): string {
    const [ivHex, authTagHex, encrypted] = ciphertext.split(':');

    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');

    const decipher = createDecipheriv(this.algorithm, this.key, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }
}

// Usage: Encrypt SSN, bank account numbers, etc.
const encrypted = fieldEncryption.encrypt(tenant.ssn);
await db.from('tenants').insert({ ...tenant, ssn_encrypted: encrypted });
```

### JWT Authentication with Refresh Tokens

```typescript
// src/lib/auth/jwt.ts
interface JWTPayload {
  userId: string;
  organizationId: string;
  roles: string[];
}

function generateAccessToken(payload: JWTPayload): string {
  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: '15m', // Short-lived
  });
}

function generateRefreshToken(payload: JWTPayload): string {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, {
    expiresIn: '7d', // Long-lived
  });
}

async function refreshAccessToken(refreshToken: string): Promise<string> {
  const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as JWTPayload;

  // Check if refresh token is blacklisted (logout)
  const isBlacklisted = await db
    .from('token_blacklist')
    .select('id')
    .eq('token', refreshToken)
    .single();

  if (isBlacklisted) {
    throw new Error('Token has been revoked');
  }

  return generateAccessToken(payload);
}
```

---

## Next Steps

### Immediate Actions (Week 1-2)
1. ✅ Set up project structure
2. ⏳ Initialize Supabase database
3. ⏳ Implement core database schema with critical gaps addressed
4. ⏳ Set up authentication with JWT
5. ⏳ Implement multi-currency support
6. ⏳ Implement soft delete strategy

### Week 3-4
1. Implement API rate limiting
2. Build bulk operations framework
3. Implement optimistic locking
4. Build saga orchestrator for distributed transactions
5. Security: field encryption, 2FA

### Week 5-6
1. Testing: Write unit tests for all critical gap resolutions
2. Documentation: API docs, developer guides
3. Code review and refactoring
4. Prepare for Phase 1 (MVP development)

---

**End of Technical Design Document**
