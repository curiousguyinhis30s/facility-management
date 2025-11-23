'use client'

import React from 'react'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'

interface PropertyFormProps {
  property?: {
    id: string
    name: string
    address: string
    type: 'condo' | 'apartment' | 'warehouse' | 'shoplot' | 'house'
    totalUnits: number
    imageUrl?: string
  } | null
  onSubmit: (data: any) => void
  onClose: () => void
}

export function PropertyForm({ property, onSubmit, onClose }: PropertyFormProps) {
  const [formData, setFormData] = React.useState({
    name: property?.name || '',
    address: property?.address || '',
    type: property?.type || 'apartment',
    totalUnits: property?.totalUnits || 0,
    imageUrl: property?.imageUrl || '',
  })

  const [errors, setErrors] = React.useState<Record<string, string>>({})

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Property name is required'
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required'
    }

    if (formData.totalUnits < 1) {
      newErrors.totalUnits = 'Total units must be at least 1'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) {
      onSubmit(formData)
    }
  }

  const propertyTypes = [
    { value: 'apartment', label: 'Apartment' },
    { value: 'condo', label: 'Condominium' },
    { value: 'warehouse', label: 'Warehouse' },
    { value: 'shoplot', label: 'Shop Lot' },
    { value: 'house', label: 'House' },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-900">
            {property ? 'Edit Property' : 'Add New Property'}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-900"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Property Name"
            placeholder="e.g., Sunset Apartments"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={errors.name}
            required
          />

          <Input
            label="Address"
            placeholder="e.g., 123 Main St, Los Angeles, CA 90001"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            error={errors.address}
            required
          />

          <Select
            label="Property Type"
            value={formData.type}
            options={propertyTypes}
            onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
            required
          />

          <Input
            label="Total Units"
            type="number"
            min="1"
            value={formData.totalUnits}
            onChange={(e) =>
              setFormData({ ...formData, totalUnits: parseInt(e.target.value) || 0 })
            }
            error={errors.totalUnits}
            required
          />

          <Input
            label="Image URL"
            placeholder="https://example.com/image.jpg (optional)"
            value={formData.imageUrl}
            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
            helperText="Optional: Add an image URL for the property"
          />

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {property ? 'Update Property' : 'Add Property'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
