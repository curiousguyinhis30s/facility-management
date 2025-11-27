import PocketBase from 'pocketbase'

const pb = new PocketBase('http://127.0.0.1:8090')

// Collection schemas for FacilityPro
const collections = [
  {
    name: 'properties',
    type: 'base',
    schema: [
      { name: 'name', type: 'text', required: true },
      { name: 'address', type: 'text', required: true },
      { name: 'city', type: 'text', required: true },
      { name: 'state', type: 'text', required: true },
      { name: 'zipCode', type: 'text', required: true },
      { name: 'type', type: 'select', options: { values: ['condo', 'apartment', 'warehouse', 'shoplot', 'house'] } },
      { name: 'totalUnits', type: 'number', required: true },
      { name: 'occupiedUnits', type: 'number' },
      { name: 'monthlyRevenue', type: 'number' },
      { name: 'imageUrl', type: 'url' },
    ],
  },
  {
    name: 'tenants',
    type: 'base',
    schema: [
      { name: 'name', type: 'text', required: true },
      { name: 'email', type: 'email', required: true },
      { name: 'phone', type: 'text' },
      { name: 'property', type: 'relation', options: { collectionId: '', maxSelect: 1 } }, // Will be updated
      { name: 'unit', type: 'text', required: true },
      { name: 'leaseStart', type: 'date' },
      { name: 'leaseEnd', type: 'date' },
      { name: 'monthlyRent', type: 'number', required: true },
      { name: 'balance', type: 'number' },
      { name: 'status', type: 'select', options: { values: ['active', 'pending', 'expired'] } },
      { name: 'avatar', type: 'url' },
      { name: 'emergencyContact', type: 'text' },
      { name: 'emergencyPhone', type: 'text' },
      { name: 'notes', type: 'text' },
    ],
  },
  {
    name: 'work_orders',
    type: 'base',
    schema: [
      { name: 'title', type: 'text', required: true },
      { name: 'description', type: 'text' },
      { name: 'property', type: 'relation', options: { collectionId: '', maxSelect: 1 } },
      { name: 'unit', type: 'text' },
      { name: 'category', type: 'select', options: { values: ['plumbing', 'electrical', 'hvac', 'appliance', 'structural', 'other'] } },
      { name: 'priority', type: 'select', options: { values: ['low', 'medium', 'high', 'urgent'] } },
      { name: 'status', type: 'select', options: { values: ['open', 'in_progress', 'completed', 'cancelled'] } },
      { name: 'assignedTo', type: 'text' },
      { name: 'reportedBy', type: 'text' },
      { name: 'scheduledDate', type: 'date' },
      { name: 'completedDate', type: 'date' },
      { name: 'estimatedCost', type: 'number' },
      { name: 'actualCost', type: 'number' },
      { name: 'notes', type: 'text' },
    ],
  },
  {
    name: 'employees',
    type: 'base',
    schema: [
      { name: 'name', type: 'text', required: true },
      { name: 'email', type: 'email', required: true },
      { name: 'phone', type: 'text' },
      { name: 'role', type: 'text', required: true },
      { name: 'department', type: 'text' },
      { name: 'status', type: 'select', options: { values: ['active', 'on_leave', 'terminated'] } },
      { name: 'hireDate', type: 'date' },
      { name: 'salary', type: 'number' },
      { name: 'skills', type: 'json' },
      { name: 'certifications', type: 'json' },
      { name: 'assignedProperties', type: 'json' },
      { name: 'avatar', type: 'url' },
    ],
  },
  {
    name: 'vendors',
    type: 'base',
    schema: [
      { name: 'name', type: 'text', required: true },
      { name: 'type', type: 'text', required: true },
      { name: 'contact', type: 'text' },
      { name: 'phone', type: 'text' },
      { name: 'email', type: 'email' },
      { name: 'status', type: 'select', options: { values: ['active', 'inactive'] } },
      { name: 'monthlyRate', type: 'number' },
    ],
  },
  {
    name: 'payments',
    type: 'base',
    schema: [
      { name: 'tenant', type: 'relation', options: { collectionId: '', maxSelect: 1 } },
      { name: 'property', type: 'relation', options: { collectionId: '', maxSelect: 1 } },
      { name: 'unit', type: 'text' },
      { name: 'amount', type: 'number', required: true },
      { name: 'type', type: 'select', options: { values: ['rent', 'late_fee', 'security_deposit', 'maintenance', 'utility'] } },
      { name: 'method', type: 'select', options: { values: ['bank_transfer', 'cash', 'credit_card', 'cheque'] } },
      { name: 'status', type: 'select', options: { values: ['completed', 'pending', 'overdue', 'cancelled'] } },
      { name: 'dueDate', type: 'date' },
      { name: 'paidDate', type: 'date' },
      { name: 'receiptNumber', type: 'text' },
      { name: 'notes', type: 'text' },
    ],
  },
  {
    name: 'canvases',
    type: 'base',
    schema: [
      { name: 'name', type: 'text', required: true },
      { name: 'type', type: 'select', options: { values: ['floor-plan', 'site-map', 'diagram', 'blank'] } },
      { name: 'description', type: 'text' },
      { name: 'thumbnail', type: 'url' },
      { name: 'notes', type: 'text' },
      { name: 'customFields', type: 'json' },
    ],
  },
  {
    name: 'leases',
    type: 'base',
    schema: [
      { name: 'tenant', type: 'relation', options: { collectionId: '', maxSelect: 1 } },
      { name: 'property', type: 'relation', options: { collectionId: '', maxSelect: 1 } },
      { name: 'unit', type: 'text', required: true },
      { name: 'startDate', type: 'date', required: true },
      { name: 'endDate', type: 'date', required: true },
      { name: 'monthlyRent', type: 'number', required: true },
      { name: 'securityDeposit', type: 'number' },
      { name: 'status', type: 'select', options: { values: ['active', 'expiring', 'expired'] } },
      { name: 'terms', type: 'text' },
    ],
  },
]

async function setupDatabase() {
  console.log('Setting up PocketBase collections...\n')

  try {
    // First, we need admin auth - use superusers collection for PocketBase v0.20+
    console.log('Authenticating as admin...')

    try {
      // PocketBase v0.20+ uses _superusers collection for admin auth
      await pb.collection('_superusers').authWithPassword('admin@facilitypro.sa', 'admin123456')
      console.log('✓ Admin authenticated')
    } catch (e: unknown) {
      const error = e as Error
      console.log('Auth error:', error.message)
      console.log('\nNote: Create admin via CLI first:')
      console.log('cd pocketbase && ./pocketbase admin create admin@facilitypro.sa admin123456')
      return
    }

    // Get existing collections
    const existingCollections = await pb.collections.getFullList()
    const existingNames = existingCollections.map(c => c.name)
    console.log(`\nExisting collections: ${existingNames.length > 0 ? existingNames.join(', ') : 'none'}`)

    // Create collections
    const createdCollections: Record<string, string> = {}

    for (const collection of collections) {
      if (existingNames.includes(collection.name)) {
        console.log(`  → ${collection.name} already exists, skipping`)
        const existing = existingCollections.find(c => c.name === collection.name)
        if (existing) createdCollections[collection.name] = existing.id
        continue
      }

      try {
        const result = await pb.collections.create({
          name: collection.name,
          type: collection.type,
          schema: collection.schema,
        })
        createdCollections[collection.name] = result.id
        console.log(`  ✓ Created collection: ${collection.name}`)
      } catch (e: unknown) {
        const error = e as Error
        console.log(`  ✗ Failed to create ${collection.name}:`, error.message)
      }
    }

    // Update relation fields with correct collection IDs
    console.log('\nUpdating relation fields...')

    const propertyId = createdCollections['properties']
    const tenantId = createdCollections['tenants']

    if (propertyId && tenantId) {
      // Update tenants collection - property relation
      const tenantsCollection = await pb.collections.getOne(tenantId)
      const tenantsSchema = tenantsCollection.schema.map((field: { name: string; type: string; options?: { collectionId?: string } }) => {
        if (field.name === 'property' && field.type === 'relation') {
          return { ...field, options: { ...field.options, collectionId: propertyId } }
        }
        return field
      })
      await pb.collections.update(tenantId, { schema: tenantsSchema })
      console.log('  ✓ Updated tenants.property relation')

      // Update work_orders collection
      const workOrdersId = createdCollections['work_orders']
      if (workOrdersId) {
        const workOrdersCollection = await pb.collections.getOne(workOrdersId)
        const workOrdersSchema = workOrdersCollection.schema.map((field: { name: string; type: string; options?: { collectionId?: string } }) => {
          if (field.name === 'property' && field.type === 'relation') {
            return { ...field, options: { ...field.options, collectionId: propertyId } }
          }
          return field
        })
        await pb.collections.update(workOrdersId, { schema: workOrdersSchema })
        console.log('  ✓ Updated work_orders.property relation')
      }

      // Update payments collection
      const paymentsId = createdCollections['payments']
      if (paymentsId) {
        const paymentsCollection = await pb.collections.getOne(paymentsId)
        const paymentsSchema = paymentsCollection.schema.map((field: { name: string; type: string; options?: { collectionId?: string } }) => {
          if (field.name === 'property' && field.type === 'relation') {
            return { ...field, options: { ...field.options, collectionId: propertyId } }
          }
          if (field.name === 'tenant' && field.type === 'relation') {
            return { ...field, options: { ...field.options, collectionId: tenantId } }
          }
          return field
        })
        await pb.collections.update(paymentsId, { schema: paymentsSchema })
        console.log('  ✓ Updated payments relations')
      }

      // Update leases collection
      const leasesId = createdCollections['leases']
      if (leasesId) {
        const leasesCollection = await pb.collections.getOne(leasesId)
        const leasesSchema = leasesCollection.schema.map((field: { name: string; type: string; options?: { collectionId?: string } }) => {
          if (field.name === 'property' && field.type === 'relation') {
            return { ...field, options: { ...field.options, collectionId: propertyId } }
          }
          if (field.name === 'tenant' && field.type === 'relation') {
            return { ...field, options: { ...field.options, collectionId: tenantId } }
          }
          return field
        })
        await pb.collections.update(leasesId, { schema: leasesSchema })
        console.log('  ✓ Updated leases relations')
      }
    }

    console.log('\n✓ Setup completed successfully!')
    console.log('\nNext steps:')
    console.log('1. Run: npx ts-node scripts/seed-data.ts')
    console.log('2. Visit: http://127.0.0.1:8090/_/')

  } catch (error) {
    console.error('Setup error:', error)
  }
}

setupDatabase()
