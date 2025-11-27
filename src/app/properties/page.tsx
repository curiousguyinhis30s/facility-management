'use client'

import React from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { PropertyCardOptimized } from '@/components/features/properties/property-card-optimized'
import { PropertyForm } from '@/components/features/properties/property-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Card } from '@/components/ui/card'
import { EmptyState, SearchEmptyState } from '@/components/ui/empty-state'
import { BulkActionsBar } from '@/components/ui/bulk-actions-bar'
import { PropertyCardSkeletonGrid, Skeleton } from '@/components/ui/skeletons'
import { ResponsiveStats } from '@/components/ui/responsive-stats'
import { ConfirmationModal, useConfirmation } from '@/components/ui/confirmation-modal'
import { useToast } from '@/components/ui/toast/toast'
import { useCurrency } from '@/contexts/CurrencyContext'
import { exportToCSV, exportToPDF } from '@/lib/export'
import { useData } from '@/contexts/DataContext'
import type { Property } from '@/types/entities'

export default function PropertiesPage() {
  const { showToast } = useToast()
  const { confirmState, showConfirmation, hideConfirmation } = useConfirmation()
  const { formatAmount } = useCurrency()
  const [isFormOpen, setIsFormOpen] = React.useState(false)
  const [searchTerm, setSearchTerm] = React.useState('')
  const [typeFilter, setTypeFilter] = React.useState('all')
  const [sortBy, setSortBy] = React.useState('name')

  const { properties, addProperty, updateProperty, deleteProperty, isLoading } = useData()

  const [editingProperty, setEditingProperty] = React.useState<Property | null>(null)
  const [selectedIds, setSelectedIds] = React.useState<string[]>([])

  // Show skeleton while loading
  if (isLoading) {
    return (
      <DashboardLayout title="Properties">
        {/* Compact Stats Row Skeleton */}
        <div className="flex flex-wrap items-center gap-6 mb-4 pb-4 border-b border-black/[0.06]">
          {[...Array(5)].map((_, i) => (
            <React.Fragment key={i}>
              <div className="flex items-center gap-3">
                <Skeleton className="w-8 h-8 rounded-lg" />
                <div>
                  <Skeleton className="h-6 w-12 mb-1" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
              {i < 4 && <div className="w-px h-8 bg-black/10" />}
            </React.Fragment>
          ))}
        </div>

        {/* Filter Row Skeleton */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-8 w-32" />
        </div>

        {/* Property Grid Skeleton */}
        <PropertyCardSkeletonGrid count={6} />
      </DashboardLayout>
    )
  }

  // Transform and filter properties
  const propertiesForList = React.useMemo(() => {
    return properties
      .map((p) => ({
        id: p.id,
        name: p.name,
        address: `${p.address}, ${p.city}, ${p.state} ${p.zipCode}`,
        type: p.type as 'condo' | 'apartment' | 'warehouse' | 'shoplot' | 'house',
        totalUnits: p.totalUnits,
        occupiedUnits: p.occupiedUnits,
        monthlyRevenue: p.monthlyRevenue,
        imageUrl: p.imageUrl,
      }))
      .filter((p) => {
        const matchesSearch =
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.address.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesType = typeFilter === 'all' || p.type === typeFilter
        return matchesSearch && matchesType
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'revenue': return b.monthlyRevenue - a.monthlyRevenue
          case 'occupancy': return (b.occupiedUnits / b.totalUnits) - (a.occupiedUnits / a.totalUnits)
          case 'units': return b.totalUnits - a.totalUnits
          default: return a.name.localeCompare(b.name)
        }
      })
  }, [properties, searchTerm, typeFilter, sortBy])

  // Calculate stats properly
  const stats = React.useMemo(() => {
    const totalUnits = properties.reduce((sum, p) => sum + (p.totalUnits || 0), 0)
    const occupiedUnits = properties.reduce((sum, p) => sum + (p.occupiedUnits || 0), 0)
    const vacantUnits = Math.max(0, totalUnits - occupiedUnits)
    const monthlyRevenue = properties.reduce((sum, p) => sum + (p.monthlyRevenue || 0), 0)
    const occupancyRate = totalUnits > 0 ? Math.round((occupiedUnits / totalUnits) * 100) : 0

    return {
      total: properties.length,
      totalUnits,
      occupiedUnits,
      vacantUnits,
      monthlyRevenue,
      occupancyRate,
    }
  }, [properties])

  const handleAddProperty = (data: any) => {
    addProperty({
      name: data.name,
      address: data.address || '',
      city: data.city || 'Unknown',
      state: data.state || 'Unknown',
      zipCode: data.zipCode || '00000',
      type: data.type,
      totalUnits: data.totalUnits || 0,
      occupiedUnits: 0,
      monthlyRevenue: 0,
      imageUrl: data.imageUrl,
    })
    setIsFormOpen(false)
    showToast('Property created successfully', 'success')
  }

  const handleEditProperty = (data: any) => {
    if (editingProperty) {
      updateProperty(editingProperty.id, {
        name: data.name,
        address: data.address,
        type: data.type,
        totalUnits: data.totalUnits,
        imageUrl: data.imageUrl,
      })
    }
    setEditingProperty(null)
    setIsFormOpen(false)
    showToast('Property updated successfully', 'success')
  }

  const handleDeleteProperty = (id: string) => {
    showConfirmation({
      title: 'Delete Property',
      message: 'Are you sure you want to delete this property? This action cannot be undone.',
      confirmText: 'Delete',
      type: 'danger',
      onConfirm: () => {
        deleteProperty(id)
        setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id))
        showToast('Property deleted successfully', 'success')
      },
    })
  }

  const handleBulkDelete = () => {
    showConfirmation({
      title: 'Delete Multiple Properties',
      message: `Are you sure you want to delete ${selectedIds.length} properties? This action cannot be undone.`,
      confirmText: 'Delete All',
      type: 'danger',
      onConfirm: () => {
        selectedIds.forEach((id) => deleteProperty(id))
        setSelectedIds([])
        showToast(`${selectedIds.length} properties deleted successfully`, 'success')
      },
    })
  }

  const handleExportCSV = () => {
    const dataToExport = selectedIds.length > 0
      ? propertiesForList.filter((p) => selectedIds.includes(p.id))
      : propertiesForList

    exportToCSV(
      dataToExport,
      `properties-${new Date().toISOString().split('T')[0]}`,
      [
        { key: 'name', label: 'Property Name' },
        { key: 'address', label: 'Address' },
        { key: 'type', label: 'Type' },
        { key: 'totalUnits', label: 'Total Units' },
        { key: 'occupiedUnits', label: 'Occupied Units' },
        { key: 'monthlyRevenue', label: 'Monthly Revenue' },
      ]
    )
    showToast(`Exported ${dataToExport.length} properties to CSV`, 'success')
  }

  const handleExportPDF = () => {
    const dataToExport = selectedIds.length > 0
      ? propertiesForList.filter((p) => selectedIds.includes(p.id))
      : propertiesForList

    exportToPDF(
      'Properties Report',
      dataToExport.map((p) => ({
        'Property Name': p.name,
        Address: p.address,
        Type: p.type,
        'Total Units': p.totalUnits,
        'Occupied Units': p.occupiedUnits,
        'Monthly Revenue': formatAmount(p.monthlyRevenue),
      })),
      `properties-report-${new Date().toISOString().split('T')[0]}`
    )
  }

  return (
    <DashboardLayout
      title="Properties"
      actions={
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={handleExportCSV} className="hidden sm:flex h-8 text-xs">
            <svg className="mr-1.5 h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Export CSV
          </Button>
          <Button variant="secondary" onClick={handleExportPDF} className="hidden sm:flex h-8 text-xs">
            <svg className="mr-1.5 h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
            Export PDF
          </Button>
          <Button
            variant="primary"
            className="h-8 text-xs"
            onClick={() => {
              setEditingProperty(null)
              setIsFormOpen(true)
            }}
          >
            <svg className="mr-1.5 h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add Property
          </Button>
        </div>
      }
    >
      {/* Responsive Stats Row */}
      <ResponsiveStats
        stats={[
          {
            label: 'Properties',
            value: stats.total,
            color: 'blue',
            icon: (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
              </svg>
            ),
          },
          {
            label: 'Occupancy',
            value: `${stats.occupancyRate}%`,
            color: 'green',
            icon: (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
              </svg>
            ),
          },
          {
            label: 'Total Units',
            value: stats.totalUnits,
            color: 'amber',
            icon: (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
              </svg>
            ),
          },
          {
            label: 'Vacant',
            value: stats.vacantUnits,
            color: 'red',
            icon: (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
              </svg>
            ),
          },
          {
            label: 'Monthly Revenue',
            value: formatAmount(stats.monthlyRevenue),
            color: 'purple',
            icon: (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ),
          },
        ]}
      />

      {/* Filter Bar */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-xs">
          <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-black/40" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <Input
            type="search"
            placeholder="Search properties..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 h-8 text-sm"
          />
        </div>

        <Select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          options={[
            { value: 'all', label: 'All Types' },
            { value: 'condo', label: 'Condo' },
            { value: 'apartment', label: 'Apartment' },
            { value: 'warehouse', label: 'Warehouse' },
            { value: 'shoplot', label: 'Shoplot' },
            { value: 'house', label: 'House' },
          ]}
          className="min-w-[120px] h-8 text-sm"
        />

        <Select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          options={[
            { value: 'name', label: 'Sort: Name' },
            { value: 'revenue', label: 'Sort: Revenue' },
            { value: 'occupancy', label: 'Sort: Occupancy' },
            { value: 'units', label: 'Sort: Units' },
          ]}
          className="min-w-[140px] h-8 text-sm"
        />

        <span className="text-xs text-black/50 ml-auto whitespace-nowrap">
          {propertiesForList.length} of {properties.length} properties
        </span>
      </div>

      {/* Property Grid */}
      {propertiesForList.length === 0 ? (
        <Card>
          {searchTerm || typeFilter !== 'all' ? (
            <SearchEmptyState
              searchTerm={searchTerm || typeFilter}
              entityName="properties"
              onClear={() => {
                setSearchTerm('')
                setTypeFilter('all')
              }}
            />
          ) : (
            <EmptyState
              icon="properties"
              title="No properties yet"
              description="Properties are the foundation of your portfolio. Add your first property to start managing units, tenants, and finances."
              action={{
                label: 'Add Property',
                onClick: () => {
                  setEditingProperty(null)
                  setIsFormOpen(true)
                },
              }}
            />
          )}
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {propertiesForList.map((property) => (
            <PropertyCardOptimized
              key={property.id}
              {...property}
              onEdit={() => {
                const fullProperty = properties.find(p => p.id === property.id)
                if (fullProperty) {
                  setEditingProperty(fullProperty)
                  setIsFormOpen(true)
                }
              }}
              onDelete={() => handleDeleteProperty(property.id)}
              isSelected={selectedIds.includes(property.id)}
              onSelect={(id) => {
                setSelectedIds((prev) =>
                  prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
                )
              }}
            />
          ))}
        </div>
      )}

      {isFormOpen && (
        <PropertyForm
          property={editingProperty}
          onSubmit={editingProperty ? handleEditProperty : handleAddProperty}
          onClose={() => {
            setIsFormOpen(false)
            setEditingProperty(null)
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
