// PocketBase REST API Client (version-agnostic)
// Uses direct REST calls to avoid SDK version mismatches

const BASE_URL = process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090'

interface PBRecord {
  id: string
  created: string
  updated: string
  collectionId: string
  collectionName: string
  [key: string]: unknown
}

interface PBListResponse<T> {
  page: number
  perPage: number
  totalItems: number
  totalPages: number
  items: T[]
}

// Collection names
export const Collections = {
  PROPERTIES: 'properties',
  TENANTS: 'tenants',
  LEASES: 'leases',
  WORK_ORDERS: 'work_orders',
  EMPLOYEES: 'employees',
  VENDORS: 'vendors',
  CANVASES: 'canvases',
  PAYMENTS: 'payments',
} as const

// Generic fetch wrapper
async function pbFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${BASE_URL}${endpoint}`
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Unknown error' }))
    throw new Error(error.message || `HTTP ${response.status}`)
  }

  return response.json()
}

// Get all records from a collection
export async function getAll<T extends PBRecord>(
  collection: string,
  options?: { filter?: string; sort?: string; expand?: string }
): Promise<T[]> {
  const params = new URLSearchParams()
  params.set('perPage', '500') // Get all records
  if (options?.filter) params.set('filter', options.filter)
  if (options?.sort) params.set('sort', options.sort)
  if (options?.expand) params.set('expand', options.expand)

  const response = await pbFetch<PBListResponse<T>>(
    `/api/collections/${collection}/records?${params.toString()}`
  )
  return response.items
}

// Get a single record
export async function getOne<T extends PBRecord>(
  collection: string,
  id: string
): Promise<T> {
  return pbFetch<T>(`/api/collections/${collection}/records/${id}`)
}

// Create a record
export async function create<T extends PBRecord>(
  collection: string,
  data: Partial<T>
): Promise<T> {
  return pbFetch<T>(`/api/collections/${collection}/records`, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

// Update a record
export async function update<T extends PBRecord>(
  collection: string,
  id: string,
  data: Partial<T>
): Promise<T> {
  return pbFetch<T>(`/api/collections/${collection}/records/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  })
}

// Delete a record
export async function remove(collection: string, id: string): Promise<void> {
  await pbFetch(`/api/collections/${collection}/records/${id}`, {
    method: 'DELETE',
  })
}

// Check if PocketBase is available
export async function checkHealth(): Promise<boolean> {
  try {
    await fetch(`${BASE_URL}/api/health`)
    return true
  } catch {
    return false
  }
}

// Type definitions for our collections
export interface PropertyRecord extends PBRecord {
  name: string
  address: string
  city: string
  state: string
  zipCode: string
  type: 'condo' | 'apartment' | 'warehouse' | 'shoplot' | 'house'
  totalUnits: number
  occupiedUnits: number
  monthlyRevenue: number
  imageUrl?: string
}

export interface TenantRecord extends PBRecord {
  name: string
  email: string
  phone: string
  property: string
  unit: string
  leaseStart: string
  leaseEnd: string
  monthlyRent: number
  balance: number
  status: 'active' | 'pending' | 'expired'
  avatar?: string
  emergencyContact?: string
  emergencyPhone?: string
  notes?: string
}

export interface WorkOrderRecord extends PBRecord {
  title: string
  description: string
  property: string
  unit?: string
  category: 'plumbing' | 'electrical' | 'hvac' | 'appliance' | 'structural' | 'other'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'open' | 'in_progress' | 'completed' | 'cancelled'
  assignedTo?: string
  reportedBy?: string
  scheduledDate?: string
  completedDate?: string
  estimatedCost?: number
  actualCost?: number
  notes?: string
}

export interface EmployeeRecord extends PBRecord {
  name: string
  email: string
  phone: string
  role: string
  department: string
  status: 'active' | 'on_leave' | 'terminated'
  hireDate: string
  salary: number
  skills?: string[]
  certifications?: string[]
  assignedProperties?: string[]
  avatar?: string
}

export interface VendorRecord extends PBRecord {
  name: string
  type: string
  contact: string
  phone: string
  email: string
  status: 'active' | 'inactive'
  monthlyRate: number
}

export interface PaymentRecord extends PBRecord {
  tenant: string
  property: string
  unit: string
  amount: number
  type: 'rent' | 'late_fee' | 'security_deposit' | 'maintenance' | 'utility'
  method: 'bank_transfer' | 'cash' | 'credit_card' | 'cheque'
  status: 'completed' | 'pending' | 'overdue' | 'cancelled'
  dueDate: string
  paidDate?: string
  receiptNumber?: string
  notes?: string
}

export interface CanvasRecord extends PBRecord {
  name: string
  type: 'floor-plan' | 'site-map' | 'diagram' | 'blank'
  description?: string
  thumbnail?: string
  notes?: string
  customFields?: Record<string, unknown>
}

export interface LeaseRecord extends PBRecord {
  tenant: string
  property: string
  unit: string
  startDate: string
  endDate: string
  monthlyRent: number
  securityDeposit: number
  status: 'active' | 'expiring' | 'expired'
  terms?: string
}
