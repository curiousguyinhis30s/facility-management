'use client'

import * as React from 'react'
import { PropertyCard } from './property-card'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'

interface Property {
  id: string
  name: string
  address: string
  type: 'condo' | 'apartment' | 'warehouse' | 'shoplot' | 'house'
  totalUnits: number
  occupiedUnits: number
  monthlyRevenue: number
  imageUrl?: string
}

interface PropertyListProps {
  properties: Property[]
}

export function PropertyList({ properties }: PropertyListProps) {
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
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 gap-4">
          {/* Search */}
          <Input
            type="search"
            placeholder="Search properties..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />

          {/* Type Filter */}
          <Select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            options={[
              { value: 'all', label: 'All Types' },
              { value: 'condo', label: 'Condominium' },
              { value: 'apartment', label: 'Apartment' },
              { value: 'warehouse', label: 'Warehouse' },
              { value: 'shoplot', label: 'Shoplot' },
              { value: 'house', label: 'House' },
            ]}
            className="w-40"
          />

          {/* Sort */}
          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            options={[
              { value: 'name', label: 'Name' },
              { value: 'revenue', label: 'Revenue' },
              { value: 'occupancy', label: 'Occupancy' },
              { value: 'units', label: 'Units' },
            ]}
            className="w-40"
          />
        </div>

        {/* Add Property Button */}
        <Button variant="primary">
          <svg
            className="mr-2 h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          Add Property
        </Button>
      </div>

      {/* Results Count */}
      <div className="text-sm text-gray-500">
        Showing {sortedProperties.length} of {properties.length} properties
      </div>

      {/* Property Grid */}
      {sortedProperties.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-12">
          <svg
            className="h-12 w-12 text-gray-400"
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
          <h3 className="mt-4 text-lg font-semibold text-gray-900">No properties found</h3>
          <p className="mt-2 text-sm text-gray-500">
            {searchTerm || typeFilter !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Get started by adding your first property'}
          </p>
          {!searchTerm && typeFilter === 'all' && (
            <Button variant="primary" size="lg" className="mt-6">
              Add Your First Property
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sortedProperties.map((property) => (
            <PropertyCard key={property.id} {...property} />
          ))}
        </div>
      )}
    </div>
  )
}
