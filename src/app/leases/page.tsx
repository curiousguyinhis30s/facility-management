'use client'

import React from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { formatCurrency, formatDate } from '@/lib/utils'
import { LeaseForm } from '@/components/features/leases/lease-form'
import { useToast } from '@/components/ui/toast/toast'
import { saveToStorage, loadFromStorage, StorageKeys } from '@/lib/storage'
import { ConfirmationModal, useConfirmation } from '@/components/ui/confirmation-modal'
import { BulkActionsBar } from '@/components/ui/bulk-actions-bar'
import { exportToCSV, exportToPDF } from '@/lib/export'
import { EmptyState, SearchEmptyState } from '@/components/ui/empty-state'

// Mock lease data
const mockLeases = [
  {
    id: '1',
    tenant: 'John Doe',
    property: 'Sunset Apartments',
    unit: '101',
    startDate: new Date(2024, 0, 1),
    endDate: new Date(2025, 11, 31),
    monthlyRent: 2200,
    securityDeposit: 4400,
    status: 'active' as const,
    renewalStatus: 'pending' as const,
  },
  {
    id: '2',
    tenant: 'Jane Smith',
    property: 'Sunset Apartments',
    unit: '102',
    startDate: new Date(2024, 2, 1),
    endDate: new Date(2025, 1, 28),
    monthlyRent: 1500,
    securityDeposit: 3000,
    status: 'active' as const,
    renewalStatus: 'none' as const,
  },
  {
    id: '3',
    tenant: 'Mike Johnson',
    property: 'Sunset Apartments',
    unit: '104',
    startDate: new Date(2023, 6, 1),
    endDate: new Date(2024, 11, 15),
    monthlyRent: 2200,
    securityDeposit: 4400,
    status: 'expiring' as const,
    renewalStatus: 'offered' as const,
  },
  {
    id: '4',
    tenant: 'Sarah Williams',
    property: 'Downtown Condos',
    unit: '305',
    startDate: new Date(2024, 4, 1),
    endDate: new Date(2025, 3, 30),
    monthlyRent: 3200,
    securityDeposit: 6400,
    status: 'active' as const,
    renewalStatus: 'renewed' as const,
  },
  {
    id: '5',
    tenant: 'David Brown',
    property: 'Garden Houses',
    unit: '1A',
    startDate: new Date(2023, 0, 1),
    endDate: new Date(2024, 10, 1),
    monthlyRent: 2800,
    securityDeposit: 5600,
    status: 'expired' as const,
    renewalStatus: 'none' as const,
  },
]

export default function LeasesPage() {
  const { showToast } = useToast()
  const { confirmState, showConfirmation, hideConfirmation } = useConfirmation()
  const [leases, setLeases] = React.useState(() =>
    loadFromStorage(StorageKeys.LEASES, mockLeases)
  )
  const [searchTerm, setSearchTerm] = React.useState('')
  const [statusFilter, setStatusFilter] = React.useState('all')
  const [isLeaseFormOpen, setIsLeaseFormOpen] = React.useState(false)
  const [editingLease, setEditingLease] = React.useState<any>(null)
  const [selectedIds, setSelectedIds] = React.useState<string[]>([])

  // Auto-save to localStorage whenever leases change
  React.useEffect(() => {
    saveToStorage(StorageKeys.LEASES, leases)
  }, [leases])

  const filteredLeases = React.useMemo(() => {
    return leases.filter((lease) => {
      const matchesSearch =
        lease.tenant.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lease.property.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lease.unit.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === 'all' || lease.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [leases, searchTerm, statusFilter])

  const stats = {
    active: leases.filter((l) => l.status === 'active').length,
    expiring: leases.filter((l) => l.status === 'expiring').length,
    expired: leases.filter((l) => l.status === 'expired').length,
    totalRevenue: leases.filter((l) => l.status === 'active').reduce((sum, l) => sum + l.monthlyRent, 0),
  }

  const getDaysUntilExpiry = (endDate: Date | string) => {
    const today = new Date()
    const end = endDate instanceof Date ? endDate : new Date(endDate)
    const diffTime = end.getTime() - today.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  const handleAddLease = () => {
    setEditingLease(null)
    setIsLeaseFormOpen(true)
  }

  const handleEditLease = (lease: any) => {
    setEditingLease(lease)
    setIsLeaseFormOpen(true)
  }

  const handleLeaseSubmit = (data: any) => {
    if (editingLease) {
      setLeases(leases.map((l) => (l.id === editingLease.id ? { ...l, tenant: data.tenantName, property: data.property, unit: data.unit, startDate: data.startDate, endDate: data.endDate, monthlyRent: data.monthlyRent, securityDeposit: data.securityDeposit, status: data.status } : l)))
      showToast('Lease updated successfully', 'success')
    } else {
      const newLease = { ...data, id: String(Date.now()), tenant: data.tenantName, renewalStatus: 'none' as const }
      setLeases([...leases, newLease])
      showToast('Lease created successfully', 'success')
    }
    setIsLeaseFormOpen(false)
    setEditingLease(null)
  }

  const handleDeleteLease = (id: string) => {
    showConfirmation({
      title: 'Delete Lease',
      message: 'Are you sure you want to delete this lease? This action cannot be undone.',
      confirmText: 'Delete',
      type: 'danger',
      onConfirm: () => {
        setLeases(leases.filter((l) => l.id !== id))
        setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id))
        showToast('Lease deleted successfully', 'success')
      },
    })
  }

  const handleBulkDelete = () => {
    showConfirmation({
      title: 'Delete Multiple Leases',
      message: `Are you sure you want to delete ${selectedIds.length} leases? This action cannot be undone.`,
      confirmText: 'Delete All',
      type: 'danger',
      onConfirm: () => {
        setLeases(leases.filter((l) => !selectedIds.includes(l.id)))
        setSelectedIds([])
        showToast(`${selectedIds.length} leases deleted successfully`, 'success')
      },
    })
  }

  const handleExportCSV = () => {
    const dataToExport = selectedIds.length > 0
      ? leases.filter((l) => selectedIds.includes(l.id))
      : leases

    exportToCSV(
      dataToExport,
      `leases-${new Date().toISOString().split('T')[0]}`,
      [
        { key: 'tenant', label: 'Tenant' },
        { key: 'property', label: 'Property' },
        { key: 'unit', label: 'Unit' },
        { key: 'startDate', label: 'Start Date' },
        { key: 'endDate', label: 'End Date' },
        { key: 'monthlyRent', label: 'Monthly Rent' },
        { key: 'securityDeposit', label: 'Security Deposit' },
        { key: 'status', label: 'Status' },
      ]
    )
    showToast(`Exported ${dataToExport.length} leases to CSV`, 'success')
  }

  const handleExportPDF = () => {
    const dataToExport = selectedIds.length > 0
      ? leases.filter((l) => selectedIds.includes(l.id))
      : leases

    exportToPDF(
      'Leases Report',
      dataToExport.map((l) => ({
        'Tenant': l.tenant,
        'Property': l.property,
        'Unit': l.unit,
        'Start Date': formatDate(l.startDate),
        'End Date': formatDate(l.endDate),
        'Monthly Rent': formatCurrency(l.monthlyRent),
        'Security Deposit': formatCurrency(l.securityDeposit),
        'Status': l.status,
      })),
      `leases-report-${new Date().toISOString().split('T')[0]}`
    )
    showToast(`Exported ${dataToExport.length} leases to PDF`, 'success')
  }

  return (
    <DashboardLayout
      title="Leases"
      actions={
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={handleExportCSV} className="hidden sm:flex">
            <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Export CSV
          </Button>
          <Button variant="secondary" onClick={handleExportPDF} className="hidden sm:flex">
            <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
            Export PDF
          </Button>
          <Button variant="primary" onClick={handleAddLease}>
            <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Create Lease
          </Button>
        </div>
      }
    >
      {/* Compact Stats Row */}
      <div className="flex flex-wrap items-center gap-6 mb-4 pb-4 border-b border-black/[0.06]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
            <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
          </div>
          <div>
            <div className="text-xl font-semibold">{leases.length}</div>
            <div className="text-[11px] text-black/50">Total Leases</div>
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
            <div className="text-xl font-semibold text-green-600">{stats.active}</div>
            <div className="text-[11px] text-black/50">Active</div>
          </div>
        </div>

        <div className="w-px h-8 bg-black/10" />

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
            <svg className="w-4 h-4 text-amber-600" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <div className="text-xl font-semibold text-amber-600">{stats.expiring}</div>
            <div className="text-[11px] text-black/50">Expiring</div>
          </div>
        </div>

        <div className="w-px h-8 bg-black/10" />

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
            <svg className="w-4 h-4 text-red-600" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>
          <div>
            <div className="text-xl font-semibold text-red-600">{stats.expired}</div>
            <div className="text-[11px] text-black/50">Expired</div>
          </div>
        </div>

        <div className="w-px h-8 bg-black/10" />

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
            <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <div className="text-xl font-semibold text-emerald-600">{formatCurrency(stats.totalRevenue)}</div>
            <div className="text-[11px] text-black/50">Monthly Revenue</div>
          </div>
        </div>
      </div>

      {/* Filters - Compact inline */}
      <div className="flex items-center gap-3 mb-4 px-3 py-2 bg-black/[0.02] rounded-lg border border-black/[0.06]">
        <Input
          type="search"
          placeholder="Search leases..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-52 h-8 text-sm"
        />

        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          options={[
            { value: 'all', label: 'All Statuses' },
            { value: 'active', label: 'Active' },
            { value: 'expiring', label: 'Expiring Soon' },
            { value: 'expired', label: 'Expired' },
          ]}
          className="w-36 h-8 text-sm"
        />

        <span className="ml-auto text-xs text-black/50 whitespace-nowrap">
          {filteredLeases.length} of {leases.length}
        </span>
      </div>

      {/* Leases List */}
      <Card>
        <CardContent className="p-6">
          {filteredLeases.length === 0 ? (
            searchTerm || statusFilter !== 'all' ? (
              <SearchEmptyState
                searchTerm={searchTerm || statusFilter}
                entityName="leases"
                onClear={() => {
                  setSearchTerm('')
                  setStatusFilter('all')
                }}
              />
            ) : (
              <EmptyState
                icon="leases"
                title="No leases yet"
                description="Leases formalize tenant agreements. Create a lease to track rent, deposit, and lease terms for your tenants."
                action={{
                  label: 'Create Lease',
                  onClick: handleAddLease,
                }}
              />
            )
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-black/[0.08]">
                  <tr>
                    <th className="w-12 pb-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.length === filteredLeases.length && filteredLeases.length > 0}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedIds(filteredLeases.map((l) => l.id))
                          } else {
                            setSelectedIds([])
                          }
                        }}
                        className="h-4 w-4 rounded border-black/20 text-primary focus:ring-primary"
                      />
                    </th>
                    <th className="pb-3 text-left text-sm font-semibold text-black">Tenant</th>
                    <th className="pb-3 text-left text-sm font-semibold text-black">Property & Unit</th>
                    <th className="pb-3 text-left text-sm font-semibold text-black">Term</th>
                    <th className="pb-3 text-left text-sm font-semibold text-black">Monthly Rent</th>
                    <th className="pb-3 text-left text-sm font-semibold text-black">Security Deposit</th>
                    <th className="pb-3 text-left text-sm font-semibold text-black">Status</th>
                    <th className="pb-3 text-left text-sm font-semibold text-black">Renewal</th>
                    <th className="pb-3 text-right text-sm font-semibold text-black">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/[0.08]">
                  {filteredLeases.map((lease) => {
                    const daysUntilExpiry = getDaysUntilExpiry(lease.endDate)
                    const isSelected = selectedIds.includes(lease.id)
                    return (
                      <tr key={lease.id} className="hover:bg-black/[0.02] transition-colors duration-100">
                        <td className="w-12">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedIds([...selectedIds, lease.id])
                              } else {
                                setSelectedIds(selectedIds.filter((id) => id !== lease.id))
                              }
                            }}
                            className="h-4 w-4 rounded border-black/20 text-primary focus:ring-primary"
                          />
                        </td>
                        <td className="py-4 text-sm text-black">{lease.tenant}</td>
                        <td className="py-4">
                          <div className="text-sm text-black">{lease.property}</div>
                          <div className="text-xs text-black/50">Unit {lease.unit}</div>
                        </td>
                        <td className="py-4">
                          <div className="text-sm text-black">
                            {formatDate(lease.startDate, { month: 'short', day: 'numeric', year: 'numeric' })}
                          </div>
                          <div className="text-xs text-black/50">
                            to {formatDate(lease.endDate, { month: 'short', day: 'numeric', year: 'numeric' })}
                          </div>
                          {lease.status === 'expiring' && (
                            <div className="mt-1 text-xs text-warning">
                              {daysUntilExpiry} days remaining
                            </div>
                          )}
                        </td>
                        <td className="py-4 text-sm text-black">
                          {formatCurrency(lease.monthlyRent)}
                        </td>
                        <td className="py-4 text-sm text-black/50">
                          {formatCurrency(lease.securityDeposit)}
                        </td>
                        <td className="py-4">
                          <Badge
                            variant={
                              lease.status === 'active'
                                ? 'success'
                                : lease.status === 'expiring'
                                ? 'warning'
                                : 'danger'
                            }
                          >
                            {lease.status}
                          </Badge>
                        </td>
                        <td className="py-4">
                          {lease.renewalStatus !== 'none' && (
                            <Badge
                              variant={
                                lease.renewalStatus === 'renewed'
                                  ? 'success'
                                  : lease.renewalStatus === 'offered'
                                  ? 'warning'
                                  : 'secondary'
                              }
                            >
                              {lease.renewalStatus}
                            </Badge>
                          )}
                        </td>
                        <td className="py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              className="rounded-lg p-2 text-black/40 hover:bg-black/[0.04] hover:text-black transition-colors duration-150"
                              title="View lease"
                            >
                              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleEditLease(lease)}
                              className="rounded-lg p-2 text-black/40 hover:bg-black/[0.04] hover:text-primary transition-colors duration-150"
                              title="Edit lease"
                            >
                              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDeleteLease(lease.id)}
                              className="rounded-lg p-2 text-black/40 hover:bg-red-50 hover:text-red-600 transition-colors duration-150"
                              title="Delete lease"
                            >
                              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
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

      {isLeaseFormOpen && (
        <LeaseForm
          lease={editingLease}
          onSubmit={handleLeaseSubmit}
          onClose={() => {
            setIsLeaseFormOpen(false)
            setEditingLease(null)
          }}
        />
      )}

      {selectedIds.length > 0 && (
        <BulkActionsBar
          selectedCount={selectedIds.length}
          onExportCSV={handleExportCSV}
          onExportPDF={handleExportPDF}
          onDelete={handleBulkDelete}
          onClearSelection={() => setSelectedIds([])}
        />
      )}

      <ConfirmationModal
        isOpen={confirmState.isOpen}
        title={confirmState.title}
        message={confirmState.message}
        confirmText={confirmState.confirmText}
        type={confirmState.type}
        onConfirm={() => {
          confirmState.onConfirm?.()
          hideConfirmation()
        }}
        onClose={hideConfirmation}
      />
    </DashboardLayout>
  )
}
