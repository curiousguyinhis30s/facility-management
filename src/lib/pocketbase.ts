import PocketBase from 'pocketbase'

// PocketBase client singleton
let pb: PocketBase | null = null

export function getPocketBase(): PocketBase {
  if (!pb) {
    const url = process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090'
    pb = new PocketBase(url)

    // Disable auto-cancellation for better UX
    pb.autoCancellation(false)
  }
  return pb
}

// Type definitions for our collections
export interface PropertyRecord {
  id: string
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
  created: string
  updated: string
}

export interface TenantRecord {
  id: string
  name: string
  email: string
  phone: string
  property: string // relation to properties
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
  created: string
  updated: string
}

export interface LeaseRecord {
  id: string
  tenant: string // relation to tenants
  property: string // relation to properties
  unit: string
  startDate: string
  endDate: string
  monthlyRent: number
  securityDeposit: number
  status: 'active' | 'expiring' | 'expired'
  terms?: string
  created: string
  updated: string
}

export interface WorkOrderRecord {
  id: string
  title: string
  description: string
  property: string // relation to properties
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
  created: string
  updated: string
}

export interface EmployeeRecord {
  id: string
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
  created: string
  updated: string
}

export interface VendorRecord {
  id: string
  name: string
  type: string
  contact: string
  phone: string
  email: string
  status: 'active' | 'inactive'
  monthlyRate: number
  created: string
  updated: string
}

export interface CanvasRecord {
  id: string
  name: string
  type: 'floor-plan' | 'site-map' | 'diagram' | 'blank'
  description?: string
  thumbnail?: string
  notes?: string
  customFields?: string // JSON string
  created: string
  updated: string
}

export interface PaymentRecord {
  id: string
  tenant: string // relation to tenants
  property: string // relation to properties
  unit: string
  amount: number
  type: 'rent' | 'late_fee' | 'security_deposit' | 'maintenance' | 'utility'
  method: 'bank_transfer' | 'cash' | 'credit_card' | 'cheque'
  status: 'completed' | 'pending' | 'overdue' | 'cancelled'
  dueDate: string
  paidDate?: string
  receiptNumber?: string
  notes?: string
  created: string
  updated: string
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

// Helper functions for CRUD operations
export async function getAll<T>(collection: string): Promise<T[]> {
  const pb = getPocketBase()
  try {
    const records = await pb.collection(collection).getFullList<T>()
    return records
  } catch (error) {
    console.error(`Error fetching ${collection}:`, error)
    return []
  }
}

export async function getOne<T>(collection: string, id: string): Promise<T | null> {
  const pb = getPocketBase()
  try {
    const record = await pb.collection(collection).getOne<T>(id)
    return record
  } catch (error) {
    console.error(`Error fetching ${collection}/${id}:`, error)
    return null
  }
}

export async function create<T>(collection: string, data: Partial<T>): Promise<T | null> {
  const pb = getPocketBase()
  try {
    const record = await pb.collection(collection).create<T>(data)
    return record
  } catch (error) {
    console.error(`Error creating in ${collection}:`, error)
    return null
  }
}

export async function update<T>(collection: string, id: string, data: Partial<T>): Promise<T | null> {
  const pb = getPocketBase()
  try {
    const record = await pb.collection(collection).update<T>(id, data)
    return record
  } catch (error) {
    console.error(`Error updating ${collection}/${id}:`, error)
    return null
  }
}

export async function remove(collection: string, id: string): Promise<boolean> {
  const pb = getPocketBase()
  try {
    await pb.collection(collection).delete(id)
    return true
  } catch (error) {
    console.error(`Error deleting ${collection}/${id}:`, error)
    return false
  }
}

// Subscribe to real-time updates
export function subscribe<T>(
  collection: string,
  callback: (data: { action: string; record: T }) => void
): () => void {
  const pb = getPocketBase()
  pb.collection(collection).subscribe('*', callback)

  return () => {
    pb.collection(collection).unsubscribe('*')
  }
}
