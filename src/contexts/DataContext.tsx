'use client'

import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react'
import {
  Property,
  Unit,
  Tenant,
  Lease,
  Facility,
  WorkOrder,
  Payment,
  Employee,
  PropertyStats,
  BuildingCanvasData,
} from '@/types/entities'
import { saveToStorage, loadFromStorage } from '@/lib/storage'
import * as pb from '@/lib/pocketbase-client'

// ============================================================================
// MOCK DATA - Properly linked with foreign keys
// ============================================================================

const mockProperties: Property[] = [
  {
    id: 'prop-1',
    name: 'Sunset Apartments',
    address: '1250 Ocean Boulevard',
    city: 'Santa Monica',
    state: 'California',
    zipCode: '90401',
    type: 'apartment',
    totalUnits: 32,
    occupiedUnits: 28,
    monthlyRevenue: 168000,
    imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
    ],
    description: 'Premium residential apartments in the heart of Santa Monica with modern amenities and excellent accessibility.',
    amenities: ['Swimming Pool', 'Fitness Center', 'Underground Parking', 'Rooftop Deck', '24/7 Security'],
    yearBuilt: 2021,
    squareFootage: 52000,
    parkingSpaces: 64,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'prop-2',
    name: 'Harbor View Tower',
    address: '500 Waterfront Drive',
    city: 'Miami',
    state: 'Florida',
    zipCode: '33131',
    type: 'condo',
    totalUnits: 24,
    occupiedUnits: 24,
    monthlyRevenue: 216000,
    imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
    ],
    description: 'Luxury waterfront condominiums with stunning ocean views and world-class facilities.',
    amenities: ['Ocean View', 'Concierge', 'Rooftop Lounge', 'Valet Parking', 'Private Pool'],
    yearBuilt: 2022,
    squareFootage: 38000,
    parkingSpaces: 48,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: 'prop-3',
    name: 'Metro Business Center',
    address: '8200 Industrial Parkway',
    city: 'Chicago',
    state: 'Illinois',
    zipCode: '60616',
    type: 'warehouse',
    totalUnits: 12,
    occupiedUnits: 9,
    monthlyRevenue: 84000,
    imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800',
    description: 'Modern logistics and storage facility with excellent connectivity to highways and rail.',
    amenities: ['Loading Docks', '24/7 Access', 'Security System', 'Fire Suppression', 'Climate Control'],
    yearBuilt: 2019,
    squareFootage: 95000,
    parkingSpaces: 30,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01'),
  },
  {
    id: 'prop-4',
    name: 'Oakwood Villas',
    address: '425 Maple Lane',
    city: 'Austin',
    state: 'Texas',
    zipCode: '78701',
    type: 'house',
    totalUnits: 8,
    occupiedUnits: 7,
    monthlyRevenue: 56000,
    imageUrl: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800',
    description: 'Spacious family villas in a quiet, family-friendly neighborhood with excellent schools nearby.',
    amenities: ['Private Garden', 'Guest Suite', 'Double Garage', 'Central AC', 'BBQ Area'],
    yearBuilt: 2018,
    squareFootage: 24000,
    parkingSpaces: 16,
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2024-02-15'),
  },
]

const mockUnits: Unit[] = [
  { id: 'unit-1', propertyId: 'prop-1', unitNumber: 'A-101', floor: 1, type: '1br', squareFootage: 85, bedrooms: 1, bathrooms: 1, monthlyRent: 4500, status: 'occupied' },
  { id: 'unit-2', propertyId: 'prop-1', unitNumber: 'A-102', floor: 1, type: '1br', squareFootage: 85, bedrooms: 1, bathrooms: 1, monthlyRent: 4500, status: 'occupied' },
  { id: 'unit-3', propertyId: 'prop-1', unitNumber: 'A-201', floor: 2, type: '2br', squareFootage: 120, bedrooms: 2, bathrooms: 2, monthlyRent: 6500, status: 'available' },
  { id: 'unit-4', propertyId: 'prop-1', unitNumber: 'A-202', floor: 2, type: '2br', squareFootage: 120, bedrooms: 2, bathrooms: 2, monthlyRent: 6500, status: 'occupied' },
  { id: 'unit-5', propertyId: 'prop-2', unitNumber: '1205', floor: 12, type: '3br', squareFootage: 180, bedrooms: 3, bathrooms: 3, monthlyRent: 9000, status: 'occupied' },
  { id: 'unit-6', propertyId: 'prop-4', unitNumber: 'Villa-3', floor: 1, type: '4br', squareFootage: 350, bedrooms: 4, bathrooms: 3, monthlyRent: 8000, status: 'occupied' },
]

const mockTenants: Tenant[] = [
  {
    id: 'tenant-1',
    propertyId: 'prop-1',
    unitId: 'unit-1',
    name: 'James Wilson',
    email: 'james.wilson@gmail.com',
    phone: '(555) 123-4567',
    type: 'individual',
    status: 'active',
    balance: 0,
    moveInDate: new Date('2024-01-15'),
    avatar: 'https://ui-avatars.com/api/?name=James+Wilson&background=2563EB&color=fff',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: 'tenant-2',
    propertyId: 'prop-1',
    unitId: 'unit-2',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@outlook.com',
    phone: '(555) 234-5678',
    type: 'individual',
    status: 'active',
    balance: 450,
    moveInDate: new Date('2024-03-01'),
    avatar: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=10B981&color=fff',
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-03-01'),
  },
  {
    id: 'tenant-3',
    propertyId: 'prop-1',
    unitId: 'unit-4',
    name: 'Michael Chen',
    email: 'michael.chen@techcorp.com',
    phone: '(555) 345-6789',
    type: 'individual',
    status: 'pending',
    balance: -900,
    avatar: 'https://ui-avatars.com/api/?name=Michael+Chen&background=F59E0B&color=fff',
    createdAt: new Date('2023-07-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'tenant-4',
    propertyId: 'prop-2',
    unitId: 'unit-5',
    name: 'Emily Davis',
    email: 'emily.davis@gmail.com',
    phone: '(555) 456-7890',
    type: 'individual',
    status: 'active',
    balance: 0,
    moveInDate: new Date('2024-05-01'),
    avatar: 'https://ui-avatars.com/api/?name=Emily+Davis&background=8B5CF6&color=fff',
    createdAt: new Date('2024-05-01'),
    updatedAt: new Date('2024-05-01'),
  },
  {
    id: 'tenant-5',
    propertyId: 'prop-4',
    unitId: 'unit-6',
    name: 'Robert Martinez',
    email: 'robert.martinez@company.com',
    phone: '(555) 567-8901',
    type: 'individual',
    status: 'active',
    balance: 0,
    avatar: 'https://ui-avatars.com/api/?name=Robert+Martinez&background=EF4444&color=fff',
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
]

const mockLeases: Lease[] = [
  {
    id: 'lease-1',
    propertyId: 'prop-1',
    unitId: 'unit-1',
    tenantId: 'tenant-1',
    startDate: new Date('2024-01-15'),
    endDate: new Date('2025-01-14'),
    monthlyRent: 4500,
    securityDeposit: 9000,
    depositStatus: 'received',
    status: 'active',
    renewalStatus: 'pending',
    paymentDueDay: 1,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: 'lease-2',
    propertyId: 'prop-1',
    unitId: 'unit-2',
    tenantId: 'tenant-2',
    startDate: new Date('2024-03-01'),
    endDate: new Date('2025-02-28'),
    monthlyRent: 4500,
    securityDeposit: 9000,
    depositStatus: 'received',
    status: 'active',
    renewalStatus: 'none',
    paymentDueDay: 1,
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-03-01'),
  },
  {
    id: 'lease-3',
    propertyId: 'prop-1',
    unitId: 'unit-4',
    tenantId: 'tenant-3',
    startDate: new Date('2023-07-01'),
    endDate: new Date('2024-12-31'),
    monthlyRent: 6500,
    securityDeposit: 13000,
    depositStatus: 'received',
    status: 'expiring',
    renewalStatus: 'offered',
    paymentDueDay: 1,
    createdAt: new Date('2023-07-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'lease-4',
    propertyId: 'prop-2',
    unitId: 'unit-5',
    tenantId: 'tenant-4',
    startDate: new Date('2024-05-01'),
    endDate: new Date('2025-04-30'),
    monthlyRent: 9000,
    securityDeposit: 18000,
    depositStatus: 'received',
    status: 'active',
    renewalStatus: 'renewed',
    paymentDueDay: 1,
    createdAt: new Date('2024-05-01'),
    updatedAt: new Date('2024-05-01'),
  },
  {
    id: 'lease-5',
    propertyId: 'prop-4',
    unitId: 'unit-6',
    tenantId: 'tenant-5',
    startDate: new Date('2023-01-01'),
    endDate: new Date('2024-12-31'),
    monthlyRent: 8000,
    securityDeposit: 16000,
    depositStatus: 'received',
    status: 'active',
    renewalStatus: 'none',
    paymentDueDay: 1,
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
]

const mockFacilities: Facility[] = [
  {
    id: 'fac-1',
    propertyId: 'prop-1',
    name: 'Swimming Pool - Al Olaya',
    category: 'amenity',
    type: 'Swimming Pool',
    location: 'Ground Floor, Main Building',
    status: 'operational',
    condition: 'excellent',
    lastMaintenanceDate: new Date('2025-01-15'),
    nextMaintenanceDate: new Date('2025-02-15'),
    maintenanceSchedule: 'monthly',
    maintenanceCost: 1500,
    responsiblePerson: 'Ahmed Al-Mutairi',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2025-01-15'),
  },
  {
    id: 'fac-2',
    propertyId: 'prop-2',
    name: 'Central AC System - Corniche',
    category: 'hvac',
    type: 'Air Conditioning',
    location: 'Rooftop, Corniche Tower',
    status: 'operational',
    condition: 'good',
    lastMaintenanceDate: new Date('2025-01-20'),
    nextMaintenanceDate: new Date('2025-04-20'),
    maintenanceSchedule: 'quarterly',
    maintenanceCost: 3500,
    responsiblePerson: 'Saad Al-Dosari',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2025-01-20'),
  },
  {
    id: 'fac-3',
    propertyId: 'prop-1',
    name: 'Fitness Center',
    category: 'amenity',
    type: 'Gym',
    location: '1st Floor, Recreation Wing',
    status: 'operational',
    condition: 'good',
    lastMaintenanceDate: new Date('2025-01-10'),
    nextMaintenanceDate: new Date('2025-02-10'),
    maintenanceSchedule: 'monthly',
    maintenanceCost: 800,
    responsiblePerson: 'Yasser Al-Qahtani',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2025-01-10'),
  },
  {
    id: 'fac-4',
    propertyId: 'prop-1',
    name: 'Main Water System',
    category: 'plumbing',
    type: 'Water Supply',
    location: 'Basement - All Buildings',
    status: 'maintenance',
    condition: 'fair',
    lastMaintenanceDate: new Date('2025-01-18'),
    nextMaintenanceDate: new Date('2025-02-18'),
    maintenanceSchedule: 'monthly',
    maintenanceCost: 2200,
    responsiblePerson: 'Hassan Al-Shehri',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2025-01-18'),
  },
  {
    id: 'fac-5',
    propertyId: 'prop-1',
    name: 'Elevator System - Tower A',
    category: 'infrastructure',
    type: 'Elevator',
    location: 'Tower A - All Floors',
    status: 'offline',
    condition: 'poor',
    lastMaintenanceDate: new Date('2025-01-10'),
    nextMaintenanceDate: new Date('2025-02-10'),
    maintenanceSchedule: 'monthly',
    maintenanceCost: 4500,
    responsiblePerson: 'Omar Al-Subaie',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2025-01-10'),
  },
]

const mockWorkOrders: WorkOrder[] = [
  {
    id: 'wo-1',
    propertyId: 'prop-1',
    unitId: undefined,
    tenantId: undefined,
    facilityId: 'fac-2',
    title: 'AC Filter Replacement - 2nd Floor',
    description: 'Replace air conditioning filters in all units on 2nd floor before summer season',
    category: 'hvac',
    priority: 'medium',
    status: 'in_progress',
    assignedTo: 'Fahad Al-Tamimi',
    reportedBy: 'Building Supervisor',
    reportedByType: 'staff',
    createdAt: new Date('2025-11-15'),
    scheduledDate: new Date('2025-11-25'),
  },
  {
    id: 'wo-2',
    propertyId: 'prop-1',
    unitId: 'unit-2',
    tenantId: 'tenant-2',
    title: 'Leaking Faucet - Unit A-102',
    description: 'Kitchen faucet dripping continuously, needs washer replacement',
    category: 'plumbing',
    priority: 'high',
    status: 'open',
    reportedBy: 'Fatima Al-Zahrani (Tenant)',
    reportedByType: 'tenant',
    createdAt: new Date('2025-11-20'),
  },
  {
    id: 'wo-3',
    propertyId: 'prop-2',
    title: 'Hallway Light Fixture Repair',
    description: 'Replace broken LED light fixture in 3rd floor hallway near elevator',
    category: 'electrical',
    priority: 'low',
    status: 'completed',
    assignedTo: 'Majid Al-Ansari',
    reportedBy: 'Property Supervisor',
    reportedByType: 'staff',
    createdAt: new Date('2025-11-10'),
    completedAt: new Date('2025-11-17'),
  },
  {
    id: 'wo-4',
    propertyId: 'prop-3',
    title: 'Emergency: Water Leak in Storage',
    description: 'Major water leak detected in basement storage area near loading dock - affecting inventory',
    category: 'emergency',
    priority: 'urgent',
    status: 'in_progress',
    assignedTo: 'Emergency Response Team',
    reportedBy: 'Night Security (Rashid)',
    reportedByType: 'staff',
    createdAt: new Date('2025-11-22'),
  },
  {
    id: 'wo-5',
    propertyId: 'prop-1',
    unitId: 'unit-3',
    title: 'Paint Touch-up - Unit A-201',
    description: 'Touch up wall paint and repair minor wall damage after tenant move-out',
    category: 'painting',
    priority: 'low',
    status: 'scheduled',
    assignedTo: 'Al-Riyadh Painting Services',
    reportedBy: 'Property Manager',
    reportedByType: 'staff',
    createdAt: new Date('2025-11-18'),
    scheduledDate: new Date('2025-11-28'),
  },
]

// ============================================================================
// CONTEXT TYPES
// ============================================================================

interface DataContextType {
  // Loading State
  isLoading: boolean

  // Data
  properties: Property[]
  units: Unit[]
  tenants: Tenant[]
  leases: Lease[]
  facilities: Facility[]
  workOrders: WorkOrder[]

  // CRUD Operations
  addProperty: (property: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>) => Property
  updateProperty: (id: string, updates: Partial<Property>) => void
  deleteProperty: (id: string) => void

  addTenant: (tenant: Omit<Tenant, 'id' | 'createdAt' | 'updatedAt'>) => Tenant
  updateTenant: (id: string, updates: Partial<Tenant>) => void
  deleteTenant: (id: string) => void

  addLease: (lease: Omit<Lease, 'id' | 'createdAt' | 'updatedAt'>) => Lease
  updateLease: (id: string, updates: Partial<Lease>) => void
  deleteLease: (id: string) => void

  addFacility: (facility: Omit<Facility, 'id' | 'createdAt' | 'updatedAt'>) => Facility
  updateFacility: (id: string, updates: Partial<Facility>) => void
  deleteFacility: (id: string) => void

  addWorkOrder: (workOrder: Omit<WorkOrder, 'id' | 'createdAt'>) => WorkOrder
  updateWorkOrder: (id: string, updates: Partial<WorkOrder>) => void
  deleteWorkOrder: (id: string) => void

  // Relationship Queries
  getPropertyById: (id: string) => Property | undefined
  getUnitsForProperty: (propertyId: string) => Unit[]
  getTenantsForProperty: (propertyId: string) => Tenant[]
  getLeasesForProperty: (propertyId: string) => Lease[]
  getFacilitiesForProperty: (propertyId: string) => Facility[]
  getWorkOrdersForProperty: (propertyId: string) => WorkOrder[]

  getTenantById: (id: string) => Tenant | undefined
  getLeaseForTenant: (tenantId: string) => Lease | undefined
  getUnitForTenant: (tenantId: string) => Unit | undefined

  // Aggregated Data
  getPropertyStats: (propertyId: string) => PropertyStats
  getBuildingCanvasData: (propertyId: string) => BuildingCanvasData | undefined

  // Global Stats
  getTotalStats: () => {
    totalProperties: number
    totalUnits: number
    totalTenants: number
    totalRevenue: number
    occupancyRate: number
    openWorkOrders: number
  }
}

const DataContext = createContext<DataContextType | undefined>(undefined)

// ============================================================================
// STORAGE KEYS
// ============================================================================
const STORAGE_KEYS = {
  PROPERTIES: 'facilitypro_v2_properties',
  UNITS: 'facilitypro_v2_units',
  TENANTS: 'facilitypro_v2_tenants',
  LEASES: 'facilitypro_v2_leases',
  FACILITIES: 'facilitypro_v2_facilities',
  WORK_ORDERS: 'facilitypro_v2_work_orders',
}

// ============================================================================
// PROVIDER COMPONENT
// ============================================================================

export function DataProvider({ children }: { children: ReactNode }) {
  const [properties, setProperties] = useState<Property[]>([])
  const [units, setUnits] = useState<Unit[]>([])
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [leases, setLeases] = useState<Lease[]>([])
  const [facilities, setFacilities] = useState<Facility[]>([])
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Load data - try PocketBase first, fallback to localStorage
  useEffect(() => {
    async function loadData() {
      try {
        // Check if PocketBase is available
        const isHealthy = await pb.checkHealth()

        if (isHealthy) {
          console.log('Loading data from PocketBase...')

          // Fetch from PocketBase
          const [pbProperties, pbTenants, pbWorkOrders] = await Promise.all([
            pb.getAll<pb.PropertyRecord>(pb.Collections.PROPERTIES),
            pb.getAll<pb.TenantRecord>(pb.Collections.TENANTS),
            pb.getAll<pb.WorkOrderRecord>(pb.Collections.WORK_ORDERS),
          ])

          // Transform PocketBase records to app format
          if (pbProperties.length > 0) {
            const transformedProperties: Property[] = pbProperties.map(p => ({
              id: p.id,
              name: p.name,
              address: p.address,
              city: p.city,
              state: p.state,
              zipCode: p.zipCode,
              type: p.type,
              totalUnits: p.totalUnits,
              occupiedUnits: p.occupiedUnits || 0,
              monthlyRevenue: p.monthlyRevenue || 0,
              imageUrl: p.imageUrl,
              createdAt: new Date(p.created),
              updatedAt: new Date(p.updated),
            }))
            setProperties(transformedProperties)
          } else {
            setProperties(loadFromStorage(STORAGE_KEYS.PROPERTIES, mockProperties))
          }

          if (pbTenants.length > 0) {
            // Map PocketBase status to app status
            const mapTenantStatus = (status: string): 'active' | 'pending' | 'inactive' | 'evicted' => {
              if (status === 'expired') return 'inactive'
              if (status === 'active' || status === 'pending') return status
              return 'inactive'
            }

            const transformedTenants: Tenant[] = pbTenants.map(t => ({
              id: t.id,
              propertyId: t.property,
              name: t.name,
              email: t.email,
              phone: t.phone,
              type: 'individual' as const,
              status: mapTenantStatus(t.status),
              balance: t.balance || 0,
              avatar: t.avatar,
              createdAt: new Date(t.created),
              updatedAt: new Date(t.updated),
            }))
            setTenants(transformedTenants)
          } else {
            setTenants(loadFromStorage(STORAGE_KEYS.TENANTS, mockTenants))
          }

          if (pbWorkOrders.length > 0) {
            // Map PocketBase category to app category
            type WorkOrderCategory = 'hvac' | 'plumbing' | 'electrical' | 'appliance' | 'structural' | 'security' | 'landscaping' | 'pest_control' | 'cleaning' | 'painting' | 'general' | 'emergency'
            const mapWorkOrderCategory = (category: string): WorkOrderCategory => {
              if (category === 'other') return 'general'
              const validCategories: WorkOrderCategory[] = ['hvac', 'plumbing', 'electrical', 'appliance', 'structural', 'security', 'landscaping', 'pest_control', 'cleaning', 'painting', 'general', 'emergency']
              if (validCategories.includes(category as WorkOrderCategory)) return category as WorkOrderCategory
              return 'general'
            }

            const transformedWorkOrders: WorkOrder[] = pbWorkOrders.map(w => ({
              id: w.id,
              propertyId: w.property,
              title: w.title,
              description: w.description || '',
              category: mapWorkOrderCategory(w.category),
              priority: w.priority,
              status: w.status,
              assignedTo: w.assignedTo,
              reportedBy: w.reportedBy || 'Unknown',
              reportedByType: 'tenant' as const,
              createdAt: new Date(w.created),
              scheduledDate: w.scheduledDate ? new Date(w.scheduledDate) : undefined,
              completedAt: w.completedDate ? new Date(w.completedDate) : undefined,
            }))
            setWorkOrders(transformedWorkOrders)
          } else {
            setWorkOrders(loadFromStorage(STORAGE_KEYS.WORK_ORDERS, mockWorkOrders))
          }

          // Load remaining from localStorage (not yet in PocketBase)
          setUnits(loadFromStorage(STORAGE_KEYS.UNITS, mockUnits))
          setLeases(loadFromStorage(STORAGE_KEYS.LEASES, mockLeases))
          setFacilities(loadFromStorage(STORAGE_KEYS.FACILITIES, mockFacilities))

          console.log('✓ Data loaded from PocketBase')
        } else {
          throw new Error('PocketBase not available')
        }
      } catch (error) {
        console.log('PocketBase not available, loading from localStorage...', error)
        // Fallback to localStorage
        setProperties(loadFromStorage(STORAGE_KEYS.PROPERTIES, mockProperties))
        setUnits(loadFromStorage(STORAGE_KEYS.UNITS, mockUnits))
        setTenants(loadFromStorage(STORAGE_KEYS.TENANTS, mockTenants))
        setLeases(loadFromStorage(STORAGE_KEYS.LEASES, mockLeases))
        setFacilities(loadFromStorage(STORAGE_KEYS.FACILITIES, mockFacilities))
        setWorkOrders(loadFromStorage(STORAGE_KEYS.WORK_ORDERS, mockWorkOrders))
      }

      setIsLoaded(true)
    }

    loadData()
  }, [])

  // Save to localStorage when data changes
  useEffect(() => {
    if (isLoaded) {
      saveToStorage(STORAGE_KEYS.PROPERTIES, properties)
    }
  }, [properties, isLoaded])

  useEffect(() => {
    if (isLoaded) {
      saveToStorage(STORAGE_KEYS.UNITS, units)
    }
  }, [units, isLoaded])

  useEffect(() => {
    if (isLoaded) {
      saveToStorage(STORAGE_KEYS.TENANTS, tenants)
    }
  }, [tenants, isLoaded])

  useEffect(() => {
    if (isLoaded) {
      saveToStorage(STORAGE_KEYS.LEASES, leases)
    }
  }, [leases, isLoaded])

  useEffect(() => {
    if (isLoaded) {
      saveToStorage(STORAGE_KEYS.FACILITIES, facilities)
    }
  }, [facilities, isLoaded])

  useEffect(() => {
    if (isLoaded) {
      saveToStorage(STORAGE_KEYS.WORK_ORDERS, workOrders)
    }
  }, [workOrders, isLoaded])

  // ============================================================================
  // CRUD OPERATIONS
  // ============================================================================

  const addProperty = (data: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>): Property => {
    const newProperty: Property = {
      ...data,
      id: `prop-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setProperties((prev) => [...prev, newProperty])
    return newProperty
  }

  const updateProperty = (id: string, updates: Partial<Property>) => {
    setProperties((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates, updatedAt: new Date() } : p))
    )
  }

  const deleteProperty = (id: string) => {
    setProperties((prev) => prev.filter((p) => p.id !== id))
    // Also clean up related entities
    setUnits((prev) => prev.filter((u) => u.propertyId !== id))
    setTenants((prev) => prev.filter((t) => t.propertyId !== id))
    setLeases((prev) => prev.filter((l) => l.propertyId !== id))
    setFacilities((prev) => prev.filter((f) => f.propertyId !== id))
    setWorkOrders((prev) => prev.filter((w) => w.propertyId !== id))
  }

  const addTenant = (data: Omit<Tenant, 'id' | 'createdAt' | 'updatedAt'>): Tenant => {
    const newTenant: Tenant = {
      ...data,
      id: `tenant-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setTenants((prev) => [...prev, newTenant])
    return newTenant
  }

  const updateTenant = (id: string, updates: Partial<Tenant>) => {
    setTenants((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates, updatedAt: new Date() } : t))
    )
  }

  const deleteTenant = (id: string) => {
    setTenants((prev) => prev.filter((t) => t.id !== id))
  }

  const addLease = (data: Omit<Lease, 'id' | 'createdAt' | 'updatedAt'>): Lease => {
    const newLease: Lease = {
      ...data,
      id: `lease-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setLeases((prev) => [...prev, newLease])
    return newLease
  }

  const updateLease = (id: string, updates: Partial<Lease>) => {
    setLeases((prev) =>
      prev.map((l) => (l.id === id ? { ...l, ...updates, updatedAt: new Date() } : l))
    )
  }

  const deleteLease = (id: string) => {
    setLeases((prev) => prev.filter((l) => l.id !== id))
  }

  const addFacility = (data: Omit<Facility, 'id' | 'createdAt' | 'updatedAt'>): Facility => {
    const newFacility: Facility = {
      ...data,
      id: `fac-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setFacilities((prev) => [...prev, newFacility])
    return newFacility
  }

  const updateFacility = (id: string, updates: Partial<Facility>) => {
    setFacilities((prev) =>
      prev.map((f) => (f.id === id ? { ...f, ...updates, updatedAt: new Date() } : f))
    )
  }

  const deleteFacility = (id: string) => {
    setFacilities((prev) => prev.filter((f) => f.id !== id))
  }

  const addWorkOrder = (data: Omit<WorkOrder, 'id' | 'createdAt'>): WorkOrder => {
    const newWorkOrder: WorkOrder = {
      ...data,
      id: `wo-${Date.now()}`,
      createdAt: new Date(),
    }
    setWorkOrders((prev) => [...prev, newWorkOrder])
    return newWorkOrder
  }

  const updateWorkOrder = (id: string, updates: Partial<WorkOrder>) => {
    setWorkOrders((prev) => prev.map((w) => (w.id === id ? { ...w, ...updates } : w)))
  }

  const deleteWorkOrder = (id: string) => {
    setWorkOrders((prev) => prev.filter((w) => w.id !== id))
  }

  // ============================================================================
  // RELATIONSHIP QUERIES
  // ============================================================================

  const getPropertyById = (id: string) => properties.find((p) => p.id === id)

  const getUnitsForProperty = (propertyId: string) => units.filter((u) => u.propertyId === propertyId)

  const getTenantsForProperty = (propertyId: string) => tenants.filter((t) => t.propertyId === propertyId)

  const getLeasesForProperty = (propertyId: string) => leases.filter((l) => l.propertyId === propertyId)

  const getFacilitiesForProperty = (propertyId: string) => facilities.filter((f) => f.propertyId === propertyId)

  const getWorkOrdersForProperty = (propertyId: string) => workOrders.filter((w) => w.propertyId === propertyId)

  const getTenantById = (id: string) => tenants.find((t) => t.id === id)

  const getLeaseForTenant = (tenantId: string) => leases.find((l) => l.tenantId === tenantId)

  const getUnitForTenant = (tenantId: string) => {
    const tenant = getTenantById(tenantId)
    if (!tenant?.unitId) return undefined
    return units.find((u) => u.id === tenant.unitId)
  }

  // ============================================================================
  // AGGREGATED DATA
  // ============================================================================

  const getPropertyStats = (propertyId: string): PropertyStats => {
    const propertyUnits = getUnitsForProperty(propertyId)
    const propertyTenants = getTenantsForProperty(propertyId)
    const propertyLeases = getLeasesForProperty(propertyId)
    const propertyFacilities = getFacilitiesForProperty(propertyId)
    const propertyWorkOrders = getWorkOrdersForProperty(propertyId)

    const totalUnits = propertyUnits.length
    const occupiedUnits = propertyUnits.filter((u) => u.status === 'occupied').length
    const vacantUnits = totalUnits - occupiedUnits

    return {
      totalUnits,
      occupiedUnits,
      vacantUnits,
      occupancyRate: totalUnits > 0 ? Math.round((occupiedUnits / totalUnits) * 100) : 0,
      totalTenants: propertyTenants.filter((t) => t.status === 'active').length,
      activeLeases: propertyLeases.filter((l) => l.status === 'active').length,
      expiringLeases: propertyLeases.filter((l) => l.status === 'expiring').length,
      monthlyRevenue: propertyLeases
        .filter((l) => l.status === 'active')
        .reduce((sum, l) => sum + l.monthlyRent, 0),
      outstandingBalance: propertyTenants
        .filter((t) => t.balance > 0)
        .reduce((sum, t) => sum + t.balance, 0),
      openWorkOrders: propertyWorkOrders.filter(
        (w) => w.status === 'open' || w.status === 'in_progress'
      ).length,
      urgentWorkOrders: propertyWorkOrders.filter((w) => w.priority === 'urgent').length,
      facilitiesOperational: propertyFacilities.filter((f) => f.status === 'operational').length,
      facilitiesUnderMaintenance: propertyFacilities.filter(
        (f) => f.status === 'maintenance' || f.status === 'offline'
      ).length,
    }
  }

  const getBuildingCanvasData = (propertyId: string): BuildingCanvasData | undefined => {
    const property = getPropertyById(propertyId)
    if (!property) return undefined

    return {
      property,
      units: getUnitsForProperty(propertyId),
      tenants: getTenantsForProperty(propertyId),
      leases: getLeasesForProperty(propertyId),
      facilities: getFacilitiesForProperty(propertyId),
      workOrders: getWorkOrdersForProperty(propertyId),
      payments: [], // TODO: Add payments
      stats: getPropertyStats(propertyId),
    }
  }

  const getTotalStats = useMemo(() => () => {
    const totalUnits = units.length
    const occupiedUnits = units.filter((u) => u.status === 'occupied').length

    return {
      totalProperties: properties.length,
      totalUnits,
      totalTenants: tenants.filter((t) => t.status === 'active').length,
      totalRevenue: leases
        .filter((l) => l.status === 'active')
        .reduce((sum, l) => sum + l.monthlyRent, 0),
      occupancyRate: totalUnits > 0 ? Math.round((occupiedUnits / totalUnits) * 100) : 0,
      openWorkOrders: workOrders.filter(
        (w) => w.status === 'open' || w.status === 'in_progress'
      ).length,
    }
  }, [properties, units, tenants, leases, workOrders])

  // ============================================================================
  // CONTEXT VALUE
  // ============================================================================

  const value: DataContextType = {
    isLoading: !isLoaded,
    properties,
    units,
    tenants,
    leases,
    facilities,
    workOrders,
    addProperty,
    updateProperty,
    deleteProperty,
    addTenant,
    updateTenant,
    deleteTenant,
    addLease,
    updateLease,
    deleteLease,
    addFacility,
    updateFacility,
    deleteFacility,
    addWorkOrder,
    updateWorkOrder,
    deleteWorkOrder,
    getPropertyById,
    getUnitsForProperty,
    getTenantsForProperty,
    getLeasesForProperty,
    getFacilitiesForProperty,
    getWorkOrdersForProperty,
    getTenantById,
    getLeaseForTenant,
    getUnitForTenant,
    getPropertyStats,
    getBuildingCanvasData,
    getTotalStats,
  }

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

// ============================================================================
// HOOK
// ============================================================================

export function useData() {
  const context = useContext(DataContext)
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider')
  }
  return context
}
