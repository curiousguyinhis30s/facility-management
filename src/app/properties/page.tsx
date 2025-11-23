'use client'

import React from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { PropertyList } from '@/components/features/properties/property-list'
import { PropertyForm } from '@/components/features/properties/property-form'
import { Button } from '@/components/ui/button'

// Mock data
const mockProperties = [
  {
    id: '1',
    name: 'Sunset Apartments',
    address: '123 Main St, Los Angeles, CA 90001',
    type: 'apartment' as const,
    totalUnits: 24,
    occupiedUnits: 22,
    monthlyRevenue: 48000,
    imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400',
  },
  {
    id: '2',
    name: 'Downtown Condos',
    address: '456 Oak Ave, San Francisco, CA 94102',
    type: 'condo' as const,
    totalUnits: 18,
    occupiedUnits: 18,
    monthlyRevenue: 72000,
    imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400',
  },
  {
    id: '3',
    name: 'Commerce Warehouse',
    address: '789 Industrial Blvd, Oakland, CA 94601',
    type: 'warehouse' as const,
    totalUnits: 8,
    occupiedUnits: 6,
    monthlyRevenue: 32000,
    imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400',
  },
  {
    id: '4',
    name: 'Retail Plaza',
    address: '321 Market St, San Jose, CA 95113',
    type: 'shoplot' as const,
    totalUnits: 12,
    occupiedUnits: 10,
    monthlyRevenue: 45000,
    imageUrl: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=400',
  },
  {
    id: '5',
    name: 'Garden Houses',
    address: '555 Elm St, Sacramento, CA 95814',
    type: 'house' as const,
    totalUnits: 6,
    occupiedUnits: 5,
    monthlyRevenue: 18000,
    imageUrl: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400',
  },
]

export default function PropertiesPage() {
  const [isFormOpen, setIsFormOpen] = React.useState(false)
  const [properties, setProperties] = React.useState(mockProperties)
  const [editingProperty, setEditingProperty] = React.useState<typeof mockProperties[0] | null>(null)

  const handleAddProperty = (data: any) => {
    const newProperty = {
      id: String(properties.length + 1),
      ...data,
      monthlyRevenue: 0,
      occupiedUnits: 0,
    }
    setProperties([...properties, newProperty])
    setIsFormOpen(false)
  }

  const handleEditProperty = (data: any) => {
    setProperties(
      properties.map((p) =>
        p.id === editingProperty?.id ? { ...p, ...data } : p
      )
    )
    setEditingProperty(null)
    setIsFormOpen(false)
  }

  const handleDeleteProperty = (id: string) => {
    if (confirm('Are you sure you want to delete this property?')) {
      setProperties(properties.filter((p) => p.id !== id))
    }
  }

  return (
    <DashboardLayout
      title="Properties"
      actions={
        <Button
          variant="primary"
          onClick={() => {
            setEditingProperty(null)
            setIsFormOpen(true)
          }}
        >
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
      }
    >
      <PropertyList
        properties={properties}
        onEdit={(property) => {
          setEditingProperty(property)
          setIsFormOpen(true)
        }}
        onDelete={handleDeleteProperty}
      />

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
    </DashboardLayout>
  )
}
