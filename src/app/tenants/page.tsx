'use client'

import React from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent } from '@/components/ui/card'
import { EmptyState, SearchEmptyState } from '@/components/ui/empty-state'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { formatCurrency, formatDate } from '@/lib/utils'
import { TenantForm } from '@/components/features/tenants/tenant-form'
import { useToast } from '@/components/ui/toast/toast'
import { saveToStorage, loadFromStorage, StorageKeys } from '@/lib/storage'
import { ConfirmationModal, useConfirmation } from '@/components/ui/confirmation-modal'
import { BulkActionsBar } from '@/components/ui/bulk-actions-bar'
import { exportToCSV, exportToPDF } from '@/lib/export'

// Mock tenant data
const mockTenants = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@email.com',
    phone: '(555) 123-4567',
    property: 'Sunset Apartments',
    unit: '101',
    leaseStart: new Date(2024, 0, 1),
    leaseEnd: new Date(2025, 11, 31),
    monthlyRent: 2200,
    balance: 0,
    status: 'active' as const,
    avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=2563EB&color=fff',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@email.com',
    phone: '(555) 234-5678',
    property: 'Sunset Apartments',
    unit: '102',
    leaseStart: new Date(2024, 2, 1),
    leaseEnd: new Date(2025, 1, 28),
    monthlyRent: 1500,
    balance: 150,
    status: 'active' as const,
    avatar: 'https://ui-avatars.com/api/?name=Jane+Smith&background=10B981&color=fff',
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike.j@email.com',
    phone: '(555) 345-6789',
    property: 'Sunset Apartments',
    unit: '104',
    leaseStart: new Date(2023, 6, 1),
    leaseEnd: new Date(2024, 5, 30),
    monthlyRent: 2200,
    balance: -300,
    status: 'pending' as const,
    avatar: 'https://ui-avatars.com/api/?name=Mike+Johnson&background=F59E0B&color=fff',
  },
  {
    id: '4',
    name: 'Sarah Williams',
    email: 'sarah.w@email.com',
    phone: '(555) 456-7890',
    property: 'Downtown Condos',
    unit: '305',
    leaseStart: new Date(2024, 4, 1),
    leaseEnd: new Date(2025, 3, 30),
    monthlyRent: 3200,
    balance: 0,
    status: 'active' as const,
    avatar: 'https://ui-avatars.com/api/?name=Sarah+Williams&background=8B5CF6&color=fff',
  },
]

export default function TenantsPage() {
  const { showToast } = useToast()
  const { confirmState, showConfirmation, hideConfirmation } = useConfirmation()
  const [tenants, setTenants] = React.useState(() =>
    loadFromStorage(StorageKeys.TENANTS, mockTenants)
  )
  const [searchTerm, setSearchTerm] = React.useState('')
  const [statusFilter, setStatusFilter] = React.useState('all')
  const [selectedIds, setSelectedIds] = React.useState<string[]>([])

  // Modal and editing state
  const [isTenantFormOpen, setIsTenantFormOpen] = React.useState(false)
  const [editingTenant, setEditingTenant] = React.useState<any>(null)

  // Auto-save to localStorage whenever tenants change
  React.useEffect(() => {
    saveToStorage(StorageKeys.TENANTS, tenants)
  }, [tenants])

  const filteredTenants = React.useMemo(() => {
    return tenants.filter((tenant) => {
      const matchesSearch =
        tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tenant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tenant.property.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === 'all' || tenant.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [tenants, searchTerm, statusFilter])

  // Tenant handlers
  const handleAddTenant = () => {
    setEditingTenant(null)
    setIsTenantFormOpen(true)
  }

  const handleEditTenant = (tenant: any) => {
    setEditingTenant(tenant)
    setIsTenantFormOpen(true)
  }

  const handleTenantSubmit = (data: any) => {
    if (editingTenant) {
      // Update existing tenant
      setTenants(tenants.map((t) => (t.id === editingTenant.id ? { ...t, ...data } : t)))
      showToast('Tenant updated successfully', 'success')
    } else {
      // Add new tenant
      const newTenant = {
        ...data,
        id: String(Date.now()),
      }
      setTenants([...tenants, newTenant])
      showToast('Tenant created successfully', 'success')
    }
    setIsTenantFormOpen(false)
    setEditingTenant(null)
  }

  const handleDeleteTenant = (id: string) => {
    showConfirmation({
      title: 'Delete Tenant',
      message: 'Are you sure you want to delete this tenant? This action cannot be undone.',
      confirmText: 'Delete',
      type: 'danger',
      onConfirm: () => {
        setTenants(tenants.filter((t) => t.id !== id))
        setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id))
        showToast('Tenant deleted successfully', 'success')
      },
    })
  }

  const handleBulkDelete = () => {
    showConfirmation({
      title: 'Delete Multiple Tenants',
      message: `Are you sure you want to delete ${selectedIds.length} tenants? This action cannot be undone.`,
      confirmText: 'Delete All',
      type: 'danger',
      onConfirm: () => {
        setTenants(tenants.filter((t) => !selectedIds.includes(t.id)))
        setSelectedIds([])
        showToast(`${selectedIds.length} tenants deleted successfully`, 'success')
      },
    })
  }

  const handleExportCSV = () => {
    const dataToExport = selectedIds.length > 0
      ? tenants.filter((t) => selectedIds.includes(t.id))
      : tenants

    exportToCSV(
      dataToExport,
      `tenants-${new Date().toISOString().split('T')[0]}`,
      [
        { key: 'name', label: 'Name' },
        { key: 'email', label: 'Email' },
        { key: 'phone', label: 'Phone' },
        { key: 'property', label: 'Property' },
        { key: 'unit', label: 'Unit' },
        { key: 'leaseStart', label: 'Lease Start' },
        { key: 'leaseEnd', label: 'Lease End' },
        { key: 'monthlyRent', label: 'Monthly Rent' },
        { key: 'balance', label: 'Balance' },
        { key: 'status', label: 'Status' },
      ]
    )
    showToast(`Exported ${dataToExport.length} tenants to CSV`, 'success')
  }

  const handleExportPDF = () => {
    const dataToExport = selectedIds.length > 0
      ? tenants.filter((t) => selectedIds.includes(t.id))
      : tenants

    exportToPDF(
      'Tenants Report',
      dataToExport.map((t) => ({
        'Name': t.name,
        'Email': t.email,
        'Phone': t.phone,
        'Property': t.property,
        'Unit': t.unit,
        'Lease Start': formatDate(t.leaseStart),
        'Lease End': formatDate(t.leaseEnd),
        'Monthly Rent': formatCurrency(t.monthlyRent),
        'Balance': t.balance === 0 ? 'Paid' : formatCurrency(t.balance),
        'Status': t.status,
      })),
      `tenants-report-${new Date().toISOString().split('T')[0]}`
    )
    showToast(`Exported ${dataToExport.length} tenants to PDF`, 'success')
  }

  return (
    <DashboardLayout
      title="Tenants"
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
          <Button variant="primary" onClick={handleAddTenant}>
            <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add Tenant
          </Button>
        </div>
      }
    >
      {/* Compact Stats Row - Mobile optimized */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        <div className="flex items-center gap-3 p-3 bg-blue-50/50 rounded-xl">
          <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center">
            <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
            </svg>
          </div>
          <div>
            <div className="text-lg font-bold">{tenants.length}</div>
            <div className="text-[10px] text-black/50 uppercase tracking-wide">Total</div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-green-50/50 rounded-xl">
          <div className="w-9 h-9 rounded-lg bg-green-500/10 flex items-center justify-center">
            <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <div className="text-lg font-bold text-green-600">{tenants.filter((t) => t.status === 'active').length}</div>
            <div className="text-[10px] text-black/50 uppercase tracking-wide">Active</div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-amber-50/50 rounded-xl">
          <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center">
            <svg className="w-4 h-4 text-amber-600" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <div className="text-lg font-bold text-amber-600">{tenants.filter((t) => t.status === 'pending').length}</div>
            <div className="text-[10px] text-black/50 uppercase tracking-wide">Pending</div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-red-50/50 rounded-xl">
          <div className="w-9 h-9 rounded-lg bg-red-500/10 flex items-center justify-center">
            <svg className="w-4 h-4 text-red-600" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <div className="text-lg font-bold text-red-600">{formatCurrency(tenants.filter((t) => t.balance > 0).reduce((sum, t) => sum + t.balance, 0))}</div>
            <div className="text-[10px] text-black/50 uppercase tracking-wide">Owed</div>
          </div>
        </div>
      </div>

      {/* Filters - Mobile responsive */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-4 p-3 bg-black/[0.02] rounded-xl border border-black/[0.06]">
        <Input
          type="search"
          placeholder="Search tenants..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 sm:max-w-[200px] h-10 sm:h-8 text-sm"
        />

        <div className="flex items-center gap-3">
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: 'all', label: 'All Statuses' },
              { value: 'active', label: 'Active' },
              { value: 'pending', label: 'Pending' },
              { value: 'inactive', label: 'Inactive' },
            ]}
            className="flex-1 sm:w-32 h-10 sm:h-8 text-sm"
          />

          <span className="text-xs text-black/50 whitespace-nowrap">
            {filteredTenants.length} of {tenants.length}
          </span>
        </div>
      </div>

      {/* Tenants List */}
      {filteredTenants.length === 0 ? (
        <Card>
          <CardContent className="p-6">
            {searchTerm || statusFilter !== 'all' ? (
              <SearchEmptyState
                searchTerm={searchTerm || statusFilter}
                entityName="tenants"
                onClear={() => {
                  setSearchTerm('')
                  setStatusFilter('all')
                }}
              />
            ) : (
              <EmptyState
                icon="tenants"
                title="No tenants yet"
                description="Tenants are the heart of your business. Add your first tenant to start tracking leases, payments, and communications."
                action={{
                  label: 'Add Tenant',
                  onClick: () => setIsTenantFormOpen(true),
                }}
              />
            )}
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Mobile Card View */}
          <div className="space-y-3 md:hidden">
            {filteredTenants.map((tenant) => {
              const isSelected = selectedIds.includes(tenant.id)
              return (
                <Card key={tenant.id} className={`transition-all ${isSelected ? 'ring-2 ring-primary' : ''}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedIds([...selectedIds, tenant.id])
                            } else {
                              setSelectedIds(selectedIds.filter((id) => id !== tenant.id))
                            }
                          }}
                          className="h-4 w-4 rounded border-black/20 text-primary focus:ring-primary"
                        />
                        <img src={tenant.avatar} alt={tenant.name} className="h-10 w-10 rounded-full" />
                        <div>
                          <div className="font-semibold text-black">{tenant.name}</div>
                          <div className="text-xs text-black/50">{tenant.property} • Unit {tenant.unit}</div>
                        </div>
                      </div>
                      <Badge
                        variant={
                          tenant.status === 'active' ? 'success' : tenant.status === 'pending' ? 'warning' : 'secondary'
                        }
                      >
                        {tenant.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                      <div>
                        <div className="text-[10px] text-black/40 uppercase">Monthly Rent</div>
                        <div className="font-medium">{formatCurrency(tenant.monthlyRent)}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-black/40 uppercase">Balance</div>
                        <div className={`font-medium ${tenant.balance > 0 ? 'text-red-600' : tenant.balance < 0 ? 'text-green-600' : ''}`}>
                          {tenant.balance === 0 ? 'Paid' : tenant.balance > 0 ? formatCurrency(tenant.balance) : formatCurrency(Math.abs(tenant.balance)) + ' credit'}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-black/5">
                      <div className="text-xs text-black/50">
                        {formatDate(tenant.leaseStart, { month: 'short', year: 'numeric' })} - {formatDate(tenant.leaseEnd, { month: 'short', year: 'numeric' })}
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleEditTenant(tenant)}
                          className="rounded-lg p-2 text-black/40 hover:bg-black/[0.04] hover:text-primary"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteTenant(tenant.id)}
                          className="rounded-lg p-2 text-black/40 hover:bg-red-50 hover:text-red-600"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Desktop Table View */}
          <Card className="hidden md:block">
            <CardContent className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-black/[0.08]">
                    <tr>
                      <th className="w-12 pb-3">
                        <input
                          type="checkbox"
                          checked={selectedIds.length === filteredTenants.length && filteredTenants.length > 0}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedIds(filteredTenants.map((t) => t.id))
                            } else {
                              setSelectedIds([])
                            }
                          }}
                          className="h-4 w-4 rounded border-black/20 text-primary focus:ring-primary"
                        />
                      </th>
                      <th className="pb-3 text-left text-sm font-semibold text-black">Tenant</th>
                      <th className="pb-3 text-left text-sm font-semibold text-black">Contact</th>
                      <th className="pb-3 text-left text-sm font-semibold text-black">Property & Unit</th>
                      <th className="pb-3 text-left text-sm font-semibold text-black">Lease</th>
                      <th className="pb-3 text-left text-sm font-semibold text-black">Rent</th>
                      <th className="pb-3 text-left text-sm font-semibold text-black">Balance</th>
                      <th className="pb-3 text-left text-sm font-semibold text-black">Status</th>
                      <th className="pb-3 text-right text-sm font-semibold text-black">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/[0.08]">
                    {filteredTenants.map((tenant) => {
                      const isSelected = selectedIds.includes(tenant.id)
                      return (
                        <tr key={tenant.id} className="hover:bg-black/[0.02] transition-colors duration-100">
                          <td className="w-12">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedIds([...selectedIds, tenant.id])
                                } else {
                                  setSelectedIds(selectedIds.filter((id) => id !== tenant.id))
                                }
                              }}
                              className="h-4 w-4 rounded border-black/20 text-primary focus:ring-primary"
                            />
                          </td>
                          <td className="py-4">
                            <div className="flex items-center gap-3">
                              <img src={tenant.avatar} alt={tenant.name} className="h-10 w-10 rounded-full" />
                              <div>
                                <div className="font-medium text-black">{tenant.name}</div>
                                <div className="text-sm text-black/50">{tenant.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 text-sm text-black/70">{tenant.phone}</td>
                          <td className="py-4">
                            <div className="text-sm font-medium text-black">{tenant.property}</div>
                            <div className="text-sm text-black/50">Unit {tenant.unit}</div>
                          </td>
                          <td className="py-4">
                            <div className="text-sm text-black/70">
                              {formatDate(tenant.leaseStart, { month: 'short', year: 'numeric' })} -{' '}
                              {formatDate(tenant.leaseEnd, { month: 'short', year: 'numeric' })}
                            </div>
                          </td>
                          <td className="py-4 text-sm font-medium text-black">
                            {formatCurrency(tenant.monthlyRent)}
                          </td>
                          <td className="py-4">
                            <span className={`text-sm font-medium ${tenant.balance > 0 ? 'text-danger' : tenant.balance < 0 ? 'text-success' : 'text-black/70'}`}>
                              {tenant.balance === 0 ? 'Paid' : tenant.balance > 0 ? formatCurrency(tenant.balance) : formatCurrency(Math.abs(tenant.balance)) + ' credit'}
                            </span>
                          </td>
                          <td className="py-4">
                            <Badge variant={tenant.status === 'active' ? 'success' : tenant.status === 'pending' ? 'warning' : 'secondary'}>
                              {tenant.status}
                            </Badge>
                          </td>
                          <td className="py-4 text-right">
                            <div className="flex justify-end gap-2">
                              <button onClick={() => handleEditTenant(tenant)} className="rounded-lg p-2 text-black/40 hover:bg-black/[0.04] hover:text-primary transition-colors duration-150" title="Edit tenant">
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                </svg>
                              </button>
                              <button onClick={() => handleDeleteTenant(tenant.id)} className="rounded-lg p-2 text-black/40 hover:bg-red-50 hover:text-red-600 transition-colors duration-150" title="Delete tenant">
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
            </CardContent>
          </Card>
        </>
      )}

      {/* Tenant Form Modal */}
      {isTenantFormOpen && (
        <TenantForm
          tenant={editingTenant}
          onSubmit={handleTenantSubmit}
          onClose={() => {
            setIsTenantFormOpen(false)
            setEditingTenant(null)
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
