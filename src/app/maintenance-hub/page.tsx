'use client'

import React from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge, BadgeProps } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { formatCurrency, formatDate } from '@/lib/utils'
import { FacilityForm } from '@/components/features/facilities/facility-form'
import { useToast } from '@/components/ui/toast/toast'
import { saveToStorage, loadFromStorage, StorageKeys } from '@/lib/storage'
import { ConfirmationModal, useConfirmation } from '@/components/ui/confirmation-modal'
import { BulkActionsBar } from '@/components/ui/bulk-actions-bar'
import { exportToCSV, exportToPDF } from '@/lib/export'
import { EmptyState, SearchEmptyState } from '@/components/ui/empty-state'

// Mock work order data
const mockWorkOrders = [
  {
    id: 'WO-001',
    title: 'HVAC Filter Replacement',
    description: 'Replace air filters in all units on 2nd floor',
    property: 'Sunset Apartments',
    unit: 'Building A - Common Area',
    priority: 'medium' as const,
    status: 'in_progress' as const,
    category: 'HVAC' as const,
    assignedTo: 'Mike Wilson',
    reportedBy: 'Property Manager',
    createdDate: new Date(2025, 10, 15),
    dueDate: new Date(2025, 10, 25),
  },
  {
    id: 'WO-002',
    title: 'Leaking Faucet - Unit 204',
    description: 'Kitchen faucet dripping continuously, needs immediate attention',
    property: 'Sunset Apartments',
    unit: '204',
    priority: 'high' as const,
    status: 'open' as const,
    category: 'Plumbing' as const,
    assignedTo: null,
    reportedBy: 'Sarah Smith (Tenant)',
    createdDate: new Date(2025, 10, 20),
    dueDate: new Date(2025, 10, 22),
  },
  {
    id: 'WO-003',
    title: 'Light Fixture Replacement',
    description: 'Replace broken light fixture in hallway',
    property: 'Downtown Condos',
    unit: '3rd Floor Hallway',
    priority: 'low' as const,
    status: 'completed' as const,
    category: 'Electrical' as const,
    assignedTo: 'John Davis',
    reportedBy: 'Building Manager',
    createdDate: new Date(2025, 10, 10),
    dueDate: new Date(2025, 10, 18),
    completedDate: new Date(2025, 10, 17),
  },
  {
    id: 'WO-004',
    title: 'Emergency: Water Leak in Basement',
    description: 'Major water leak detected in basement storage area',
    property: 'Commerce Warehouse',
    unit: 'Basement',
    priority: 'urgent' as const,
    status: 'in_progress' as const,
    category: 'Plumbing' as const,
    assignedTo: 'Emergency Team',
    reportedBy: 'Security Guard',
    createdDate: new Date(2025, 10, 22),
    dueDate: new Date(2025, 10, 22),
  },
  {
    id: 'WO-005',
    title: 'Paint Touch-up - Unit 105',
    description: 'Touch up wall paint after move-out',
    property: 'Sunset Apartments',
    unit: '105',
    priority: 'low' as const,
    status: 'scheduled' as const,
    category: 'Painting' as const,
    assignedTo: 'Painting Crew',
    reportedBy: 'Property Manager',
    createdDate: new Date(2025, 10, 18),
    dueDate: new Date(2025, 10, 28),
  },
]

// Mock maintenance schedule data
const mockMaintenanceSchedule = [
  {
    id: '1',
    title: 'HVAC System Inspection',
    property: 'Sunset Apartments',
    location: 'All Buildings',
    frequency: 'Quarterly' as const,
    lastCompleted: new Date(2025, 8, 15),
    nextDue: new Date(2025, 11, 15),
    assignedTo: 'HVAC Specialists Inc.',
    status: 'upcoming' as const,
    category: 'HVAC',
  },
  {
    id: '2',
    title: 'Fire Extinguisher Inspection',
    property: 'Downtown Condos',
    location: 'All Floors',
    frequency: 'Monthly' as const,
    lastCompleted: new Date(2025, 10, 1),
    nextDue: new Date(2025, 11, 1),
    assignedTo: 'Fire Safety Co.',
    status: 'upcoming' as const,
    category: 'Safety',
  },
  {
    id: '3',
    title: 'Elevator Maintenance',
    property: 'Downtown Condos',
    location: 'Main Elevator',
    frequency: 'Monthly' as const,
    lastCompleted: new Date(2025, 10, 18),
    nextDue: new Date(2025, 10, 26),
    assignedTo: 'Elevator Service Pro',
    status: 'overdue' as const,
    category: 'Elevator',
  },
  {
    id: '4',
    title: 'Pool Cleaning & Chemical Balance',
    property: 'Sunset Apartments',
    location: 'Rooftop Pool',
    frequency: 'Weekly' as const,
    lastCompleted: new Date(2025, 10, 20),
    nextDue: new Date(2025, 10, 27),
    assignedTo: 'Pool Maintenance Team',
    status: 'upcoming' as const,
    category: 'Pool',
  },
  {
    id: '5',
    title: 'Parking Lot Sweeping',
    property: 'Commerce Warehouse',
    location: 'Parking Area',
    frequency: 'Weekly' as const,
    lastCompleted: new Date(2025, 10, 21),
    nextDue: new Date(2025, 10, 28),
    assignedTo: 'Cleaning Services',
    status: 'scheduled' as const,
    category: 'Cleaning',
  },
  {
    id: '6',
    title: 'Landscape Maintenance',
    property: 'Garden Houses',
    location: 'Common Areas',
    frequency: 'Weekly' as const,
    lastCompleted: new Date(2025, 10, 22),
    nextDue: new Date(2025, 10, 29),
    assignedTo: 'Green Thumb Landscaping',
    status: 'upcoming' as const,
    category: 'Landscaping',
  },
]

// Mock facilities data
const mockFacilities = [
  {
    id: '1',
    name: 'Swimming Pool - Building A',
    category: 'amenity' as const,
    type: 'Swimming Pool',
    property: 'Sunset Apartments',
    location: 'Ground Floor, Building A',
    status: 'operational' as const,
    lastMaintenance: new Date(2025, 0, 15),
    nextMaintenance: new Date(2025, 1, 15),
    maintenanceCost: 1500,
    responsiblePerson: 'Ahmed Al-Rashid',
    maintenanceSchedule: 'Monthly',
    condition: 'excellent' as const,
  },
  {
    id: '2',
    name: 'Central AC System - Tower 1',
    category: 'hvac' as const,
    type: 'Air Conditioning',
    property: 'Downtown Condos',
    location: 'Rooftop, Tower 1',
    status: 'operational' as const,
    lastMaintenance: new Date(2025, 0, 20),
    nextMaintenance: new Date(2025, 3, 20),
    maintenanceCost: 3500,
    responsiblePerson: 'Mohammed bin Salman',
    maintenanceSchedule: 'Quarterly',
    condition: 'good' as const,
  },
  {
    id: '3',
    name: 'Fitness Gym',
    category: 'amenity' as const,
    type: 'Gym',
    property: 'Sunset Apartments',
    location: '1st Floor, Building B',
    status: 'operational' as const,
    lastMaintenance: new Date(2025, 0, 10),
    nextMaintenance: new Date(2025, 1, 10),
    maintenanceCost: 800,
    responsiblePerson: 'Fatima Al-Zahrani',
    maintenanceSchedule: 'Monthly',
    condition: 'good' as const,
  },
  {
    id: '4',
    name: 'Main Plumbing System',
    category: 'plumbing' as const,
    type: 'Water Supply',
    property: 'Sunset Apartments',
    location: 'Basement - All Buildings',
    status: 'maintenance' as const,
    lastMaintenance: new Date(2025, 0, 18),
    nextMaintenance: new Date(2025, 1, 18),
    maintenanceCost: 2200,
    responsiblePerson: 'Hassan Ibrahim',
    maintenanceSchedule: 'Monthly',
    condition: 'fair' as const,
  },
  {
    id: '5',
    name: 'Sewerage Treatment Plant',
    category: 'sewerage' as const,
    type: 'Sewerage',
    property: 'Downtown Condos',
    location: 'Underground Facility',
    status: 'operational' as const,
    lastMaintenance: new Date(2024, 11, 25),
    nextMaintenance: new Date(2025, 1, 25),
    maintenanceCost: 5000,
    responsiblePerson: 'Abdullah Yousef',
    maintenanceSchedule: 'Bi-Monthly',
    condition: 'good' as const,
  },
  {
    id: '6',
    name: 'Garbage Collection System',
    category: 'waste' as const,
    type: 'Waste Management',
    property: 'Sunset Apartments',
    location: 'Service Area - Rear',
    status: 'operational' as const,
    lastMaintenance: new Date(2025, 0, 22),
    nextMaintenance: new Date(2025, 1, 5),
    maintenanceCost: 600,
    responsiblePerson: 'Omar Khalid',
    maintenanceSchedule: 'Bi-Weekly',
    condition: 'excellent' as const,
  },
  {
    id: '7',
    name: 'Garden & Landscaping',
    category: 'landscaping' as const,
    type: 'Gardening',
    property: 'Garden Houses',
    location: 'Outdoor Common Areas',
    status: 'operational' as const,
    lastMaintenance: new Date(2025, 0, 20),
    nextMaintenance: new Date(2025, 1, 3),
    maintenanceCost: 1200,
    responsiblePerson: 'Saeed Al-Mutairi',
    maintenanceSchedule: 'Bi-Weekly',
    condition: 'excellent' as const,
  },
  {
    id: '8',
    name: 'Elevator System - Building C',
    category: 'infrastructure' as const,
    type: 'Elevator',
    property: 'Sunset Apartments',
    location: 'Building C - All Floors',
    status: 'offline' as const,
    lastMaintenance: new Date(2025, 0, 10),
    nextMaintenance: new Date(2025, 1, 10),
    maintenanceCost: 4500,
    responsiblePerson: 'Khalid Al-Saud',
    maintenanceSchedule: 'Monthly',
    condition: 'poor' as const,
  },
]

const categoryLabels = {
  amenity: 'Amenity',
  hvac: 'HVAC',
  plumbing: 'Plumbing',
  sewerage: 'Sewerage',
  waste: 'Waste Management',
  landscaping: 'Landscaping',
  infrastructure: 'Infrastructure',
}

const conditionColors = {
  excellent: 'success',
  good: 'success',
  fair: 'warning',
  poor: 'danger',
}

export default function MaintenanceHubPage() {
  const { showToast } = useToast()
  const { confirmState, showConfirmation, hideConfirmation } = useConfirmation()
  const [activeTab, setActiveTab] = React.useState('work-orders')

  // Work Orders state
  const [workOrders, setWorkOrders] = React.useState(mockWorkOrders)
  const [woSearchTerm, setWoSearchTerm] = React.useState('')
  const [woStatusFilter, setWoStatusFilter] = React.useState('all')
  const [woPriorityFilter, setWoPriorityFilter] = React.useState('all')

  // Maintenance Schedule state
  const [schedule, setSchedule] = React.useState(mockMaintenanceSchedule)
  const [schedStatusFilter, setSchedStatusFilter] = React.useState('all')
  const [schedFrequencyFilter, setSchedFrequencyFilter] = React.useState('all')

  // Facilities state
  const [facilities, setFacilities] = React.useState(() =>
    loadFromStorage(StorageKeys.FACILITIES, mockFacilities)
  )
  const [facSearchTerm, setFacSearchTerm] = React.useState('')
  const [facCategoryFilter, setFacCategoryFilter] = React.useState('all')
  const [facStatusFilter, setFacStatusFilter] = React.useState('all')
  const [selectedFacilityIds, setSelectedFacilityIds] = React.useState<string[]>([])
  const [isFacilityFormOpen, setIsFacilityFormOpen] = React.useState(false)
  const [editingFacility, setEditingFacility] = React.useState<any>(null)

  // Auto-save facilities to localStorage
  React.useEffect(() => {
    saveToStorage(StorageKeys.FACILITIES, facilities)
  }, [facilities])

  // Calculate unified dashboard stats
  const dashboardStats = {
    totalWorkOrders: workOrders.length,
    openWorkOrders: workOrders.filter((wo) => wo.status === 'open').length,
    urgentWorkOrders: workOrders.filter((wo) => wo.priority === 'urgent').length,
    scheduledMaintenance: schedule.filter((s) => s.status === 'upcoming' || s.status === 'scheduled').length,
    overdueMaintenance: schedule.filter((s) => s.status === 'overdue').length,
    totalFacilities: facilities.length,
    operationalFacilities: facilities.filter((f) => f.status === 'operational').length,
    offlineFacilities: facilities.filter((f) => f.status === 'offline').length,
    monthlyMaintenanceCost: facilities.reduce((sum, f) => sum + f.maintenanceCost, 0),
  }

  // Work Orders filtering
  const filteredWorkOrders = React.useMemo(() => {
    return workOrders.filter((wo) => {
      const matchesSearch =
        wo.title.toLowerCase().includes(woSearchTerm.toLowerCase()) ||
        wo.property.toLowerCase().includes(woSearchTerm.toLowerCase()) ||
        wo.id.toLowerCase().includes(woSearchTerm.toLowerCase())

      const matchesStatus = woStatusFilter === 'all' || wo.status === woStatusFilter
      const matchesPriority = woPriorityFilter === 'all' || wo.priority === woPriorityFilter

      return matchesSearch && matchesStatus && matchesPriority
    })
  }, [workOrders, woSearchTerm, woStatusFilter, woPriorityFilter])

  // Maintenance Schedule filtering
  const filteredSchedule = React.useMemo(() => {
    return schedule.filter((item) => {
      const matchesStatus = schedStatusFilter === 'all' || item.status === schedStatusFilter
      const matchesFrequency = schedFrequencyFilter === 'all' || item.frequency === schedFrequencyFilter
      return matchesStatus && matchesFrequency
    })
  }, [schedule, schedStatusFilter, schedFrequencyFilter])

  // Facilities filtering
  const filteredFacilities = React.useMemo(() => {
    return facilities.filter((facility) => {
      const matchesSearch =
        facility.name.toLowerCase().includes(facSearchTerm.toLowerCase()) ||
        facility.property.toLowerCase().includes(facSearchTerm.toLowerCase()) ||
        facility.type.toLowerCase().includes(facSearchTerm.toLowerCase())

      const matchesCategory = facCategoryFilter === 'all' || facility.category === facCategoryFilter
      const matchesStatus = facStatusFilter === 'all' || facility.status === facStatusFilter

      return matchesSearch && matchesCategory && matchesStatus
    })
  }, [facilities, facSearchTerm, facCategoryFilter, facStatusFilter])

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'text-danger'
      case 'high':
        return 'text-warning'
      case 'medium':
        return 'text-primary'
      case 'low':
        return 'text-black/70'
      default:
        return 'text-black/70'
    }
  }

  const getDaysUntil = (date: Date | string) => {
    const today = new Date()
    const targetDate = typeof date === 'string' ? new Date(date) : date
    const diffTime = targetDate.getTime() - today.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  const handleAddFacility = () => {
    setEditingFacility(null)
    setIsFacilityFormOpen(true)
  }

  const handleEditFacility = (facility: any) => {
    setEditingFacility(facility)
    setIsFacilityFormOpen(true)
  }

  const handleFacilitySubmit = (data: any) => {
    if (editingFacility) {
      setFacilities(facilities.map((f) => f.id === editingFacility.id ? { ...f, ...data } : f))
      showToast('Facility updated successfully', 'success')
    } else {
      const newFacility = { ...data, id: String(Date.now()), location: data.property || 'N/A' }
      setFacilities([...facilities, newFacility])
      showToast('Facility created successfully', 'success')
    }
    setIsFacilityFormOpen(false)
    setEditingFacility(null)
  }

  const handleDeleteFacility = (id: string) => {
    showConfirmation({
      title: 'Delete Facility',
      message: 'Are you sure you want to delete this facility? This action cannot be undone.',
      confirmText: 'Delete',
      type: 'danger',
      onConfirm: () => {
        setFacilities(facilities.filter((f) => f.id !== id))
        setSelectedFacilityIds(selectedFacilityIds.filter((selectedId) => selectedId !== id))
        showToast('Facility deleted successfully', 'success')
      },
    })
  }

  const handleBulkDelete = () => {
    showConfirmation({
      title: 'Delete Multiple Facilities',
      message: `Are you sure you want to delete ${selectedFacilityIds.length} facilities? This action cannot be undone.`,
      confirmText: 'Delete All',
      type: 'danger',
      onConfirm: () => {
        setFacilities(facilities.filter((f) => !selectedFacilityIds.includes(f.id)))
        setSelectedFacilityIds([])
        showToast(`${selectedFacilityIds.length} facilities deleted successfully`, 'success')
      },
    })
  }

  const handleExportCSV = () => {
    const dataToExport = selectedFacilityIds.length > 0
      ? facilities.filter((f) => selectedFacilityIds.includes(f.id))
      : facilities

    exportToCSV(
      dataToExport,
      `facilities-${new Date().toISOString().split('T')[0]}`,
      [
        { key: 'name', label: 'Facility Name' },
        { key: 'category', label: 'Category' },
        { key: 'type', label: 'Type' },
        { key: 'property', label: 'Property' },
        { key: 'location', label: 'Location' },
        { key: 'status', label: 'Status' },
        { key: 'condition', label: 'Condition' },
        { key: 'responsiblePerson', label: 'Responsible Person' },
      ]
    )
    showToast(`Exported ${dataToExport.length} facilities to CSV`, 'success')
  }

  const handleExportPDF = () => {
    const dataToExport = selectedFacilityIds.length > 0
      ? facilities.filter((f) => selectedFacilityIds.includes(f.id))
      : facilities

    exportToPDF(
      'Facilities Report',
      dataToExport.map((f) => ({
        'Facility': f.name,
        'Category': categoryLabels[f.category as keyof typeof categoryLabels],
        'Property': f.property,
        'Status': f.status,
        'Condition': f.condition,
        'Cost': formatCurrency(f.maintenanceCost),
      })),
      `facilities-report-${new Date().toISOString().split('T')[0]}`
    )
  }

  return (
    <DashboardLayout
      title="Maintenance Hub"
      actions={
        <Button variant="primary">
          <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          {activeTab === 'work-orders' && 'Create Work Order'}
          {activeTab === 'maintenance' && 'Add Schedule'}
          {activeTab === 'facilities' && 'Add Facility'}
        </Button>
      }
    >
      {/* Compact Stats Row */}
      <div className="flex flex-wrap items-center gap-6 mb-4 pb-4 border-b border-black/[0.06]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
            <svg className="w-4 h-4 text-orange-600" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
            </svg>
          </div>
          <div>
            <div className="text-xl font-semibold">{dashboardStats.openWorkOrders}</div>
            <div className="text-[11px] text-black/50">Open Work Orders</div>
          </div>
        </div>

        <div className="w-px h-8 bg-black/10" />

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
            <svg className="w-4 h-4 text-red-600" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          </div>
          <div>
            <div className="text-xl font-semibold text-red-600">{dashboardStats.urgentWorkOrders}</div>
            <div className="text-[11px] text-black/50">Urgent</div>
          </div>
        </div>

        <div className="w-px h-8 bg-black/10" />

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
            <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
            </svg>
          </div>
          <div>
            <div className="text-xl font-semibold text-blue-600">{dashboardStats.scheduledMaintenance}</div>
            <div className="text-[11px] text-black/50">Scheduled</div>
          </div>
        </div>

        <div className="w-px h-8 bg-black/10" />

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
            <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <div className="text-xl font-semibold text-green-600">{dashboardStats.operationalFacilities}</div>
            <div className="text-[11px] text-black/50">Operational</div>
          </div>
        </div>

        <div className="w-px h-8 bg-black/10" />

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-500/10 flex items-center justify-center">
            <svg className="w-4 h-4 text-slate-600" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <div className="text-xl font-semibold">{formatCurrency(dashboardStats.monthlyMaintenanceCost)}</div>
            <div className="text-[11px] text-black/50">Monthly Cost</div>
          </div>
        </div>
      </div>

      {/* Tabs for different sections */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full mb-3">
          <TabsTrigger value="work-orders">Work Orders</TabsTrigger>
          <TabsTrigger value="maintenance">Scheduled Maintenance</TabsTrigger>
          <TabsTrigger value="facilities">Facilities</TabsTrigger>
        </TabsList>

        {/* Work Orders Tab */}
        <TabsContent value="work-orders">
          {/* Filters - Compact inline row */}
          <div className="flex items-center gap-3 mb-4 px-3 py-2 bg-black/[0.02] rounded-lg border border-black/[0.06]">
            <Input
              type="search"
              placeholder="Search work orders..."
              value={woSearchTerm}
              onChange={(e) => setWoSearchTerm(e.target.value)}
              className="w-52 h-8 text-sm"
            />

            <Select
              value={woStatusFilter}
              onChange={(e) => setWoStatusFilter(e.target.value)}
              options={[
                { value: 'all', label: 'All Statuses' },
                { value: 'open', label: 'Open' },
                { value: 'scheduled', label: 'Scheduled' },
                { value: 'in_progress', label: 'In Progress' },
                { value: 'completed', label: 'Completed' },
              ]}
              className="w-32 h-8 text-sm"
            />

            <Select
              value={woPriorityFilter}
              onChange={(e) => setWoPriorityFilter(e.target.value)}
              options={[
                { value: 'all', label: 'All Priorities' },
                { value: 'urgent', label: 'Urgent' },
                { value: 'high', label: 'High' },
                { value: 'medium', label: 'Medium' },
                { value: 'low', label: 'Low' },
              ]}
              className="w-32 h-8 text-sm"
            />

            <span className="ml-auto text-xs text-black/50 whitespace-nowrap">
              {filteredWorkOrders.length} of {workOrders.length}
            </span>
          </div>

          {/* Work Orders List - Compact */}
          <div className="space-y-3">
            {filteredWorkOrders.length === 0 ? (
              <Card>
                <CardContent className="p-4">
                  {woSearchTerm || woStatusFilter !== 'all' || woPriorityFilter !== 'all' ? (
                    <SearchEmptyState
                      searchTerm={woSearchTerm || woStatusFilter || woPriorityFilter}
                      entityName="work orders"
                      onClear={() => {
                        setWoSearchTerm('')
                        setWoStatusFilter('all')
                        setWoPriorityFilter('all')
                      }}
                    />
                  ) : (
                    <EmptyState
                      icon="work-orders"
                      title="No work orders yet"
                      description="Track maintenance requests and repairs. Create work orders to manage your property maintenance efficiently."
                      action={{
                        label: 'Create Work Order',
                        onClick: () => {},
                      }}
                    />
                  )}
                </CardContent>
              </Card>
            ) : (
              filteredWorkOrders.map((wo) => (
                <Card key={wo.id} className="hover:shadow-md transition-shadow duration-150">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5">
                          <h3 className="text-base font-semibold text-black truncate">{wo.title}</h3>
                          <Badge
                            variant={
                              wo.status === 'completed'
                                ? 'success'
                                : wo.status === 'in_progress'
                                ? 'default'
                                : wo.status === 'scheduled'
                                ? 'warning'
                                : 'secondary'
                            }
                          >
                            {wo.status.replace('_', ' ')}
                          </Badge>
                          <span className={`text-xs font-medium uppercase ${getPriorityColor(wo.priority)}`}>
                            {wo.priority}
                          </span>
                        </div>

                        <p className="text-sm text-black/60 mb-3 line-clamp-1">{wo.description}</p>

                        <div className="grid grid-cols-4 md:grid-cols-7 gap-x-4 gap-y-2 text-xs">
                          <div>
                            <div className="text-black/40 uppercase tracking-wide">ID</div>
                            <div className="font-medium text-black">{wo.id}</div>
                          </div>
                          <div>
                            <div className="text-black/40 uppercase tracking-wide">Property</div>
                            <div className="font-medium text-black truncate" title={wo.property}>{wo.property}</div>
                          </div>
                          <div>
                            <div className="text-black/40 uppercase tracking-wide">Category</div>
                            <div className="font-medium text-black">{wo.category}</div>
                          </div>
                          <div>
                            <div className="text-black/40 uppercase tracking-wide">Assigned</div>
                            <div className="font-medium text-black truncate">{wo.assignedTo || 'Unassigned'}</div>
                          </div>
                          <div>
                            <div className="text-black/40 uppercase tracking-wide">Reported</div>
                            <div className="font-medium text-black truncate">{wo.reportedBy}</div>
                          </div>
                          <div>
                            <div className="text-black/40 uppercase tracking-wide">Created</div>
                            <div className="font-medium text-black">
                              {formatDate(wo.createdDate, { month: 'short', day: 'numeric' })}
                            </div>
                          </div>
                          <div>
                            <div className="text-black/40 uppercase tracking-wide">Due</div>
                            <div className={`font-medium ${wo.priority === 'urgent' ? 'text-danger' : 'text-black'}`}>
                              {formatDate(wo.dueDate, { month: 'short', day: 'numeric' })}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-1">
                        <button
                          className="rounded p-1.5 text-black/40 hover:bg-black/[0.04] hover:text-black transition-colors duration-150"
                          title="View details"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </button>
                        <button
                          className="rounded p-1.5 text-black/40 hover:bg-black/[0.04] hover:text-primary transition-colors duration-150"
                          title="Edit work order"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* Scheduled Maintenance Tab */}
        <TabsContent value="maintenance">
          {/* Filters - Compact */}
          <div className="flex flex-wrap items-center gap-3 mb-4 p-3 bg-black/[0.02] rounded-lg border border-black/[0.06]">
            <Select
              value={schedStatusFilter}
              onChange={(e) => setSchedStatusFilter(e.target.value)}
              options={[
                { value: 'all', label: 'All Statuses' },
                { value: 'upcoming', label: 'Upcoming' },
                { value: 'overdue', label: 'Overdue' },
                { value: 'scheduled', label: 'Scheduled' },
                { value: 'completed', label: 'Completed' },
              ]}
              className="w-36 h-9"
            />

            <Select
              value={schedFrequencyFilter}
              onChange={(e) => setSchedFrequencyFilter(e.target.value)}
              options={[
                { value: 'all', label: 'All Frequencies' },
                { value: 'Weekly', label: 'Weekly' },
                { value: 'Monthly', label: 'Monthly' },
                { value: 'Quarterly', label: 'Quarterly' },
                { value: 'Annually', label: 'Annually' },
              ]}
              className="w-36 h-9"
            />

            <div className="ml-auto text-xs text-black/50">
              {filteredSchedule.length} of {schedule.length} tasks
            </div>
          </div>

          {/* Maintenance Schedule Table */}
          <Card>
            <CardContent className="p-6">
              {filteredSchedule.length === 0 ? (
                schedStatusFilter !== 'all' || schedFrequencyFilter !== 'all' ? (
                  <SearchEmptyState
                    searchTerm={schedStatusFilter !== 'all' ? schedStatusFilter : schedFrequencyFilter}
                    entityName="maintenance tasks"
                    onClear={() => {
                      setSchedStatusFilter('all')
                      setSchedFrequencyFilter('all')
                    }}
                  />
                ) : (
                  <EmptyState
                    icon="work-orders"
                    title="No scheduled maintenance"
                    description="Set up recurring maintenance tasks to keep your properties in top condition. Schedule inspections, cleanings, and preventive maintenance."
                    action={{
                      label: 'Add Schedule',
                      onClick: () => {},
                    }}
                  />
                )
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-black/[0.08]">
                      <tr>
                        <th className="pb-3 text-left text-sm font-semibold text-black">Task</th>
                        <th className="pb-3 text-left text-sm font-semibold text-black">Property</th>
                        <th className="pb-3 text-left text-sm font-semibold text-black">Category</th>
                        <th className="pb-3 text-left text-sm font-semibold text-black">Frequency</th>
                        <th className="pb-3 text-left text-sm font-semibold text-black">Last Completed</th>
                        <th className="pb-3 text-left text-sm font-semibold text-black">Next Due</th>
                        <th className="pb-3 text-left text-sm font-semibold text-black">Assigned To</th>
                        <th className="pb-3 text-left text-sm font-semibold text-black">Status</th>
                        <th className="pb-3 text-right text-sm font-semibold text-black">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/[0.08]">
                      {filteredSchedule.map((task) => {
                        const daysUntil = getDaysUntil(task.nextDue)
                        return (
                          <tr key={task.id} className="hover:bg-black/[0.02] transition-colors duration-100">
                            <td className="py-4">
                              <div className="font-medium text-black">{task.title}</div>
                              <div className="text-sm text-black/50">{task.location}</div>
                            </td>
                            <td className="py-4 text-sm text-black/70">{task.property}</td>
                            <td className="py-4">
                              <Badge variant="secondary">{task.category}</Badge>
                            </td>
                            <td className="py-4 text-sm text-black/70">{task.frequency}</td>
                            <td className="py-4 text-sm text-black/70">
                              {formatDate(task.lastCompleted, { month: 'short', day: 'numeric' })}
                            </td>
                            <td className="py-4">
                              <div className={`text-sm font-medium ${task.status === 'overdue' ? 'text-danger' : 'text-black'}`}>
                                {formatDate(task.nextDue, { month: 'short', day: 'numeric' })}
                              </div>
                              {daysUntil >= 0 ? (
                                <div className="text-xs text-black/50">in {daysUntil} days</div>
                              ) : (
                                <div className="text-xs text-danger">{Math.abs(daysUntil)} days overdue</div>
                              )}
                            </td>
                            <td className="py-4 text-sm text-black/70">{task.assignedTo}</td>
                            <td className="py-4">
                              <Badge
                                variant={
                                  task.status === 'overdue'
                                    ? 'danger'
                                    : task.status === 'scheduled'
                                    ? 'success'
                                    : task.status === 'upcoming'
                                    ? 'warning'
                                    : 'secondary'
                                }
                              >
                                {task.status}
                              </Badge>
                            </td>
                            <td className="py-4 text-right">
                              <div className="flex justify-end gap-2">
                                <button
                                  className="rounded-lg p-2 text-black/40 hover:bg-black/[0.04] hover:text-success transition-colors duration-150"
                                  title="Mark as complete"
                                >
                                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                </button>
                                <button
                                  className="rounded-lg p-2 text-black/40 hover:bg-black/[0.04] hover:text-primary transition-colors duration-150"
                                  title="Edit schedule"
                                >
                                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                  </svg>
                                </button>
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Facilities Tab */}
        <TabsContent value="facilities">
          {/* Filters - Compact */}
          <div className="flex flex-wrap items-center gap-3 mb-4 p-3 bg-black/[0.02] rounded-lg border border-black/[0.06]">
            <Input
              type="search"
              placeholder="Search facilities..."
              value={facSearchTerm}
              onChange={(e) => setFacSearchTerm(e.target.value)}
              className="w-64 h-9"
            />

            <Select
              value={facCategoryFilter}
              onChange={(e) => setFacCategoryFilter(e.target.value)}
              options={[
                { value: 'all', label: 'All Categories' },
                { value: 'amenity', label: 'Amenities' },
                { value: 'hvac', label: 'HVAC' },
                { value: 'plumbing', label: 'Plumbing' },
                { value: 'sewerage', label: 'Sewerage' },
                { value: 'waste', label: 'Waste' },
                { value: 'landscaping', label: 'Landscaping' },
                { value: 'infrastructure', label: 'Infrastructure' },
              ]}
              className="w-40 h-9"
            />

            <Select
              value={facStatusFilter}
              onChange={(e) => setFacStatusFilter(e.target.value)}
              options={[
                { value: 'all', label: 'All Statuses' },
                { value: 'operational', label: 'Operational' },
                { value: 'maintenance', label: 'Maintenance' },
                { value: 'offline', label: 'Offline' },
              ]}
              className="w-36 h-9"
            />

            <div className="ml-auto text-xs text-black/50">
              {filteredFacilities.length} of {facilities.length} facilities
            </div>
          </div>

          {/* Facilities Table */}
          <Card>
            <CardContent className="p-0">
              {filteredFacilities.length === 0 ? (
                facSearchTerm || facCategoryFilter !== 'all' || facStatusFilter !== 'all' ? (
                  <SearchEmptyState
                    searchTerm={facSearchTerm || facCategoryFilter || facStatusFilter}
                    entityName="facilities"
                    onClear={() => {
                      setFacSearchTerm('')
                      setFacCategoryFilter('all')
                      setFacStatusFilter('all')
                    }}
                  />
                ) : (
                  <EmptyState
                    icon="properties"
                    title="No facilities tracked"
                    description="Track building systems, amenities, and equipment. Add facilities to monitor their status, condition, and maintenance schedules."
                    action={{
                      label: 'Add Facility',
                      onClick: handleAddFacility,
                    }}
                  />
                )
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-black/[0.08] bg-black/[0.02]">
                      <tr>
                        <th className="w-12 px-4 py-3">
                          <input
                            type="checkbox"
                            checked={selectedFacilityIds.length === filteredFacilities.length && filteredFacilities.length > 0}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedFacilityIds(filteredFacilities.map((f) => f.id))
                              } else {
                                setSelectedFacilityIds([])
                              }
                            }}
                            className="h-4 w-4 rounded border-black/20 text-primary focus:ring-primary"
                          />
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-black/70">
                          Facility
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-black/70">
                          Category
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-black/70">
                          Property
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-black/70">
                          Status
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-black/70">
                          Condition
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-black/70">
                          Next Maintenance
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-black/70">
                          Responsible
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-black/70">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/[0.06]">
                      {filteredFacilities.map((facility) => {
                        const daysUntil = getDaysUntil(facility.nextMaintenance)
                        return (
                          <tr key={facility.id} className="hover:bg-black/[0.02] transition-colors duration-100">
                            <td className="px-4 py-3">
                              <input
                                type="checkbox"
                                checked={selectedFacilityIds.includes(facility.id)}
                                onChange={() => {
                                  setSelectedFacilityIds((prev) =>
                                    prev.includes(facility.id)
                                      ? prev.filter((id) => id !== facility.id)
                                      : [...prev, facility.id]
                                  )
                                }}
                                className="h-4 w-4 rounded border-black/20 text-primary focus:ring-primary"
                              />
                            </td>
                            <td className="px-4 py-3">
                              <div className="font-medium text-black line-clamp-1" title={facility.name}>
                                {facility.name}
                              </div>
                              <div className="text-sm text-black/50 line-clamp-1" title={facility.location}>
                                {facility.location}
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <Badge variant="secondary">{categoryLabels[facility.category]}</Badge>
                            </td>
                            <td className="px-4 py-3 text-sm text-black/70 line-clamp-1" title={facility.property}>
                              {facility.property}
                            </td>
                            <td className="px-4 py-3">
                              <Badge
                                variant={
                                  facility.status === 'operational'
                                    ? 'success'
                                    : facility.status === 'maintenance'
                                    ? 'warning'
                                    : 'danger'
                                }
                              >
                                {facility.status}
                              </Badge>
                            </td>
                            <td className="px-4 py-3">
                              <Badge variant={conditionColors[facility.condition] as BadgeProps['variant']}>
                                {facility.condition}
                              </Badge>
                            </td>
                            <td className="px-4 py-3">
                              <div className="text-sm text-black">
                                {formatDate(facility.nextMaintenance, { month: 'short', day: 'numeric' })}
                              </div>
                              <div className={`text-xs ${daysUntil <= 7 ? 'text-danger font-medium' : 'text-black/50'}`}>
                                in {daysUntil} days
                              </div>
                            </td>
                            <td className="px-4 py-3 text-sm text-black/70 line-clamp-1" title={facility.responsiblePerson}>
                              {facility.responsiblePerson}
                            </td>
                            <td className="px-4 py-3 text-right">
                              <div className="flex justify-end gap-2">
                                <button
                                  className="rounded p-1.5 text-black/40 hover:bg-black/[0.04] hover:text-black transition-colors duration-150"
                                  title="View details"
                                >
                                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  </svg>
                                </button>
                                <button
                                  onClick={() => handleEditFacility(facility)}
                                  className="rounded p-1.5 text-black/40 hover:bg-black/[0.04] hover:text-primary transition-colors duration-150"
                                  title="Edit facility"
                                >
                                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                  </svg>
                                </button>
                                <button
                                  onClick={() => handleDeleteFacility(facility.id)}
                                  className="rounded p-1.5 text-black/40 hover:bg-danger/10 hover:text-danger transition-colors duration-150"
                                  title="Delete facility"
                                >
                                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                  </svg>
                                </button>
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Facility Form Modal */}
      {isFacilityFormOpen && (
        <FacilityForm
          facility={editingFacility}
          onSubmit={handleFacilitySubmit}
          onClose={() => {
            setIsFacilityFormOpen(false)
            setEditingFacility(null)
          }}
        />
      )}

      {/* Bulk Actions Bar - Only show on facilities tab */}
      {activeTab === 'facilities' && selectedFacilityIds.length > 0 && (
        <BulkActionsBar
          selectedCount={selectedFacilityIds.length}
          onExportCSV={handleExportCSV}
          onExportPDF={handleExportPDF}
          onDelete={handleBulkDelete}
          onClearSelection={() => setSelectedFacilityIds([])}
        />
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmState.isOpen}
        onClose={hideConfirmation}
        onConfirm={confirmState.onConfirm}
        title={confirmState.title}
        message={confirmState.message}
        confirmText={confirmState.confirmText}
        cancelText={confirmState.cancelText}
        type={confirmState.type}
      />
    </DashboardLayout>
  )
}
