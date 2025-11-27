/**
 * Core Entity Type Definitions with Proper Foreign Key Relationships
 * This establishes the relational data model for FacilityPro
 */

// ============================================================================
// PROPERTY (Building) - The central entity
// ============================================================================
export interface Property {
  id: string
  name: string
  address: string
  city: string
  state: string
  zipCode: string
  type: 'condo' | 'apartment' | 'warehouse' | 'shoplot' | 'house' | 'commercial'
  totalUnits: number
  occupiedUnits: number
  monthlyRevenue: number
  imageUrl?: string
  images?: string[] // Multiple images for gallery
  description?: string
  amenities?: string[]
  yearBuilt?: number
  squareFootage?: number
  parkingSpaces?: number
  createdAt: Date
  updatedAt: Date
}

// ============================================================================
// UNIT - Individual rentable spaces within a property
// ============================================================================
export interface Unit {
  id: string
  propertyId: string // Foreign key to Property
  unitNumber: string
  floor?: number
  type: 'studio' | '1br' | '2br' | '3br' | '4br' | 'commercial' | 'storage' | 'parking'
  squareFootage: number
  bedrooms: number
  bathrooms: number
  monthlyRent: number
  status: 'available' | 'occupied' | 'maintenance' | 'reserved'
  amenities?: string[]
  imageUrl?: string
}

// ============================================================================
// TENANT - Individuals or businesses renting units
// ============================================================================
export interface Tenant {
  id: string
  propertyId: string // Foreign key to Property
  unitId?: string // Foreign key to Unit (optional - pending tenants may not have unit)
  name: string
  email: string
  phone: string
  secondaryPhone?: string
  emergencyContact?: {
    name: string
    phone: string
    relationship: string
  }
  type: 'individual' | 'business'
  companyName?: string
  nationalId?: string
  dateOfBirth?: Date
  avatar?: string
  status: 'active' | 'pending' | 'inactive' | 'evicted'
  moveInDate?: Date
  moveOutDate?: Date
  balance: number // Positive = owes money, Negative = credit
  notes?: string
  createdAt: Date
  updatedAt: Date
}

// ============================================================================
// LEASE - Contract between property owner and tenant
// ============================================================================
export interface Lease {
  id: string
  propertyId: string // Foreign key to Property
  unitId: string // Foreign key to Unit
  tenantId: string // Foreign key to Tenant
  leaseNumber?: string
  startDate: Date
  endDate: Date
  monthlyRent: number
  securityDeposit: number
  depositStatus: 'pending' | 'received' | 'partially_returned' | 'returned'
  status: 'draft' | 'active' | 'expiring' | 'expired' | 'terminated' | 'renewed'
  renewalStatus: 'none' | 'pending' | 'offered' | 'renewed' | 'declined'
  paymentDueDay: number // Day of month rent is due (1-28)
  lateFeeAmount?: number
  lateFeeGraceDays?: number
  terms?: string
  documents?: string[] // URLs to lease documents
  createdAt: Date
  updatedAt: Date
}

// ============================================================================
// FACILITY - Building systems, amenities, and infrastructure
// ============================================================================
export interface Facility {
  id: string
  propertyId: string // Foreign key to Property
  name: string
  category: 'amenity' | 'hvac' | 'plumbing' | 'electrical' | 'sewerage' | 'waste' | 'landscaping' | 'infrastructure' | 'security' | 'fire_safety'
  type: string // Specific type within category (e.g., "Swimming Pool", "Central AC")
  location: string
  status: 'operational' | 'maintenance' | 'offline' | 'decommissioned'
  condition: 'excellent' | 'good' | 'fair' | 'poor' | 'critical'
  lastMaintenanceDate?: Date
  nextMaintenanceDate?: Date
  maintenanceSchedule?: 'weekly' | 'bi-weekly' | 'monthly' | 'quarterly' | 'semi-annual' | 'annual'
  maintenanceCost: number
  responsiblePerson?: string
  vendor?: string
  warrantyExpiry?: Date
  installationDate?: Date
  serialNumber?: string
  notes?: string
  images?: string[]
  createdAt: Date
  updatedAt: Date
}

// ============================================================================
// WORK ORDER - Maintenance and repair requests
// ============================================================================
export interface WorkOrder {
  id: string
  propertyId: string // Foreign key to Property
  unitId?: string // Foreign key to Unit (optional - may be common area)
  tenantId?: string // Foreign key to Tenant (who reported it)
  facilityId?: string // Foreign key to Facility (if related to a facility)
  title: string
  description: string
  category: 'plumbing' | 'electrical' | 'hvac' | 'appliance' | 'structural' | 'pest_control' | 'landscaping' | 'cleaning' | 'security' | 'painting' | 'general' | 'emergency'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'open' | 'assigned' | 'scheduled' | 'in_progress' | 'on_hold' | 'completed' | 'cancelled'
  assignedTo?: string // Employee/vendor name
  assignedToId?: string // Foreign key to Employee (if internal)
  reportedBy: string
  reportedByType: 'tenant' | 'staff' | 'inspection' | 'automated'
  estimatedCost?: number
  actualCost?: number
  createdAt: Date
  scheduledDate?: Date
  startedAt?: Date
  completedAt?: Date
  notes?: string
  attachments?: string[] // Photos, documents
}

// ============================================================================
// PAYMENT - Financial transactions
// ============================================================================
export interface Payment {
  id: string
  propertyId: string // Foreign key to Property
  tenantId: string // Foreign key to Tenant
  leaseId: string // Foreign key to Lease
  amount: number
  type: 'rent' | 'deposit' | 'late_fee' | 'utility' | 'parking' | 'maintenance' | 'other' | 'refund'
  status: 'pending' | 'completed' | 'failed' | 'refunded' | 'cancelled'
  method: 'cash' | 'check' | 'bank_transfer' | 'credit_card' | 'online' | 'auto_debit'
  dueDate: Date
  paidDate?: Date
  periodStart?: Date
  periodEnd?: Date
  reference?: string
  notes?: string
  createdAt: Date
}

// ============================================================================
// EMPLOYEE - Staff managing properties
// ============================================================================
export interface Employee {
  id: string
  name: string
  email: string
  phone: string
  role: 'manager' | 'maintenance' | 'security' | 'cleaning' | 'admin' | 'accountant'
  department?: string
  assignedProperties?: string[] // Array of Property IDs
  status: 'active' | 'inactive' | 'on_leave'
  hireDate: Date
  salary?: number
  avatar?: string
  createdAt: Date
  updatedAt: Date
}

// ============================================================================
// VENDOR - External service providers
// ============================================================================
export interface Vendor {
  id: string
  name: string
  email: string
  phone: string
  category: string[] // Types of services: ['plumbing', 'electrical', 'hvac']
  address?: string
  contactPerson?: string
  rating?: number
  status: 'active' | 'inactive' | 'blacklisted'
  notes?: string
  createdAt: Date
  updatedAt: Date
}

// ============================================================================
// MAINTENANCE SCHEDULE - Planned maintenance items
// ============================================================================
export interface MaintenanceSchedule {
  id: string
  propertyId: string
  facilityId?: string
  title: string
  description?: string
  frequency: 'daily' | 'weekly' | 'bi-weekly' | 'monthly' | 'quarterly' | 'semi-annual' | 'annual'
  lastCompleted?: Date
  nextDue: Date
  assignedTo?: string
  estimatedDuration?: number // in minutes
  estimatedCost?: number
  status: 'active' | 'paused' | 'completed'
  createdAt: Date
  updatedAt: Date
}

// ============================================================================
// HELPER TYPES
// ============================================================================

// Type for lookup/dropdown options
export interface SelectOption {
  value: string
  label: string
}

// Aggregated stats for a property
export interface PropertyStats {
  totalUnits: number
  occupiedUnits: number
  vacantUnits: number
  occupancyRate: number
  totalTenants: number
  activeLeases: number
  expiringLeases: number
  monthlyRevenue: number
  outstandingBalance: number
  openWorkOrders: number
  urgentWorkOrders: number
  facilitiesOperational: number
  facilitiesUnderMaintenance: number
}

// For the Building Canvas view
export interface BuildingCanvasData {
  property: Property
  units: Unit[]
  tenants: Tenant[]
  leases: Lease[]
  facilities: Facility[]
  workOrders: WorkOrder[]
  payments: Payment[]
  stats: PropertyStats
}
