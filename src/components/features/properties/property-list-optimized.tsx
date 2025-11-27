'use client'

import * as React from 'react'
import { PropertyCardOptimized } from './property-card-optimized'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'

interface Property {
  id: string
  name: string
  address: string
  type: 'condo' | 'apartment' | 'warehouse' | 'shoplot' | 'house' | 'commercial'
  totalUnits: number
  occupiedUnits: number
  monthlyRevenue: number
  imageUrl?: string
}

interface PropertyListProps {
  properties: Property[]
  onEdit?: (property: Property) => void
  onDelete?: (id: string) => void
  selectedIds?: string[]
  onSelectProperty?: (id: string) => void
}

export function PropertyListOptimized({
  properties,
  onEdit,
  onDelete,
  selectedIds = [],
  onSelectProperty
}: PropertyListProps) {
  const [searchTerm, setSearchTerm] = React.useState('')
  const [typeFilter, setTypeFilter] = React.useState('all')
  const [sortBy, setSortBy] = React.useState('name')

  // Filter properties
  const filteredProperties = React.useMemo(() => {
    return properties.filter((property) => {
      const matchesSearch =
        property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.address.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesType = typeFilter === 'all' || property.type === typeFilter

      return matchesSearch && matchesType
    })
  }, [properties, searchTerm, typeFilter])

  // Sort properties
  const sortedProperties = React.useMemo(() => {
    return [...filteredProperties].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'revenue':
          return b.monthlyRevenue - a.monthlyRevenue
        case 'occupancy':
          const aOccupancy = (a.occupiedUnits / a.totalUnits) * 100
          const bOccupancy = (b.occupiedUnits / b.totalUnits) * 100
          return bOccupancy - aOccupancy
        case 'units':
          return b.totalUnits - a.totalUnits
        default:
          return 0
      }
    })
  }, [filteredProperties, sortBy])

  return (
    <div className="space-y-4">
      {/* Fixed Width Filter Bar - Prevents layout shifts */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
            {/* Search - Fixed width */}
            <div className="sm:col-span-2">
              <Input
                type="search"
                placeholder="Search properties..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>

            {/* Type Filter - Fixed width */}
            <div>
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
                className="w-full"
              />
            </div>

            {/* Sort - Fixed width */}
            <div>
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                options={[
                  { value: 'name', label: 'Name' },
                  { value: 'revenue', label: 'Revenue' },
                  { value: 'occupancy', label: 'Occupancy' },
                  { value: 'units', label: 'Units' },
                ]}
                className="w-full"
              />
            </div>
          </div>

          {/* Results Count - Consistent positioning */}
          <div className="mt-2 text-sm text-black/50">
            Showing {sortedProperties.length} of {properties.length} properties
          </div>
        </CardContent>
      </Card>

      {/* Property Grid */}
      {sortedProperties.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <svg
              className="h-12 w-12 text-black/30"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z"
              />
            </svg>
            <h3 className="mt-4 text-lg font-semibold text-black">No properties found</h3>
            <p className="mt-2 text-sm text-black/50 text-center max-w-sm">
              {searchTerm || typeFilter !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Get started by adding your first property'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sortedProperties.map((property) => (
            <PropertyCardOptimized
              key={property.id}
              {...property}
              onEdit={onEdit ? () => onEdit(property) : undefined}
              onDelete={onDelete ? () => onDelete(property.id) : undefined}
              isSelected={selectedIds.includes(property.id)}
              onSelect={onSelectProperty}
            />
          ))}
        </div>
      )}
    </div>
  )
}
