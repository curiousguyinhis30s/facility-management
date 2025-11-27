'use client'

import React from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge, BadgeProps } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { formatCurrency, formatDate } from '@/lib/utils'
import { FacilityForm } from '@/components/features/facilities/facility-form'
import { useToast } from '@/components/ui/toast/toast'
import { saveToStorage, loadFromStorage, StorageKeys } from '@/lib/storage'
import { ConfirmationModal, useConfirmation } from '@/components/ui/confirmation-modal'
import { BulkActionsBar } from '@/components/ui/bulk-actions-bar'
import { exportToCSV, exportToPDF } from '@/lib/export'

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

export default function FacilitiesPage() {
  const { showToast } = useToast()
  const { confirmState, showConfirmation, hideConfirmation } = useConfirmation()
  const [facilities, setFacilities] = React.useState(() =>
    loadFromStorage(StorageKeys.FACILITIES, mockFacilities)
  )
  const [searchTerm, setSearchTerm] = React.useState('')
  const [categoryFilter, setCategoryFilter] = React.useState('all')
  const [statusFilter, setStatusFilter] = React.useState('all')
  const [selectedIds, setSelectedIds] = React.useState<string[]>([])

  // Auto-save to localStorage whenever facilities change
  React.useEffect(() => {
    saveToStorage(StorageKeys.FACILITIES, facilities)
  }, [facilities])

  // Auto-clear selection when filters change
  React.useEffect(() => {
    setSelectedIds([])
  }, [searchTerm, categoryFilter, statusFilter])

  const filteredFacilities = React.useMemo(() => {
    return facilities.filter((facility) => {
      const matchesSearch =
        facility.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        facility.property.toLowerCase().includes(searchTerm.toLowerCase()) ||
        facility.type.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesCategory = categoryFilter === 'all' || facility.category === categoryFilter
      const matchesStatus = statusFilter === 'all' || facility.status === statusFilter

      return matchesSearch && matchesCategory && matchesStatus
    })
  }, [facilities, searchTerm, categoryFilter, statusFilter])

  const stats = {
    total: facilities.length,
    operational: facilities.filter((f) => f.status === 'operational').length,
    maintenance: facilities.filter((f) => f.status === 'maintenance').length,
    offline: facilities.filter((f) => f.status === 'offline').length,
    monthlyMaintenanceCost: facilities.reduce((sum, f) => sum + f.maintenanceCost, 0),
  }

  const [isFacilityFormOpen, setIsFacilityFormOpen] = React.useState(false)
  const [editingFacility, setEditingFacility] = React.useState<any>(null)

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
        setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id))
        showToast('Facility deleted successfully', 'success')
      },
    })
  }

  const handleBulkDelete = () => {
    showConfirmation({
      title: 'Delete Multiple Facilities',
      message: `Are you sure you want to delete ${selectedIds.length} facilities? This action cannot be undone.`,
      confirmText: 'Delete All',
      type: 'danger',
      onConfirm: () => {
        setFacilities(facilities.filter((f) => !selectedIds.includes(f.id)))
        setSelectedIds([])
        showToast(`${selectedIds.length} facilities deleted successfully`, 'success')
      },
    })
  }

  const handleExportCSV = () => {
    const dataToExport = selectedIds.length > 0
      ? facilities.filter((f) => selectedIds.includes(f.id))
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
    const dataToExport = selectedIds.length > 0
      ? facilities.filter((f) => selectedIds.includes(f.id))
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

  const getDaysUntilMaintenance = (nextDate: Date | string) => {
    const today = new Date()
    const date = nextDate instanceof Date ? nextDate : new Date(nextDate)
    const diffTime = date.getTime() - today.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  return (
    <DashboardLayout
      title="Facilities Management"
      actions={
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            onClick={handleExportCSV}
            className="hidden sm:flex"
          >
            <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Export CSV
          </Button>
          <Button
            variant="secondary"
            onClick={handleExportPDF}
            className="hidden sm:flex"
          >
            <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
            Export PDF
          </Button>
          <Button variant="primary" onClick={handleAddFacility}>
            <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add Facility
          </Button>
        </div>
      }
    >
      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-black/50">Total Facilities</div>
            <div className="mt-2 text-3xl font-semibold text-black">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-black/50">Operational</div>
            <div className="mt-2 text-3xl font-semibold text-success">{stats.operational}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-black/50">Under Maintenance</div>
            <div className="mt-2 text-3xl font-semibold text-warning">{stats.maintenance}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-black/50">Monthly Cost</div>
            <div className="mt-2 text-3xl font-semibold text-black">
              {formatCurrency(stats.monthlyMaintenanceCost)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-4">
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="sm:col-span-2">
              <Input
                type="search"
                placeholder="Search facilities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>

            <div>
              <Select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
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
                className="w-full"
              />
            </div>

            <div>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                options={[
                  { value: 'all', label: 'All Statuses' },
                  { value: 'operational', label: 'Operational' },
                  { value: 'maintenance', label: 'Maintenance' },
                  { value: 'offline', label: 'Offline' },
                ]}
                className="w-full"
              />
            </div>
          </div>

          <div className="mt-2 text-sm text-black/50">
            Showing {filteredFacilities.length} of {facilities.length} facilities
          </div>
        </CardContent>
      </Card>

      {/* Facilities List */}
      <Card>
        <CardContent className="p-0">
          {filteredFacilities.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <svg className="h-12 w-12 text-black/30" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1m1.5.5l-1.5-.5M6.75 7.364V3h-3v18m3-13.636l10.5-3.819" />
              </svg>
              <h3 className="mt-4 text-lg font-semibold text-black">No facilities found</h3>
              <p className="mt-2 text-sm text-black/50 text-center max-w-sm">
                {searchTerm || categoryFilter !== 'all' || statusFilter !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Get started by adding your first facility'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-black/[0.08] bg-black/[0.02]">
                  <tr>
                    <th className="w-12 px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.length === filteredFacilities.length && filteredFacilities.length > 0}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedIds(filteredFacilities.map((f) => f.id))
                          } else {
                            setSelectedIds([])
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
                    const daysUntil = getDaysUntilMaintenance(facility.nextMaintenance)
                    return (
                      <tr key={facility.id} className="hover:bg-black/[0.02] transition-colors duration-100">
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(facility.id)}
                            onChange={() => {
                              setSelectedIds((prev) =>
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

      {/* Bulk Actions Bar */}
      {selectedIds.length > 0 && (
        <BulkActionsBar
          selectedCount={selectedIds.length}
          onExportCSV={handleExportCSV}
          onExportPDF={handleExportPDF}
          onDelete={handleBulkDelete}
          onClearSelection={() => setSelectedIds([])}
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
