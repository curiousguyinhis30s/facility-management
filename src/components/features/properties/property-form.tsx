'use client'

import React from 'react'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { ImageUpload } from '@/components/ui/image-upload'
import { FormSidePanel } from '@/components/ui/side-panel'
import { CustomFields, CustomField, serializeCustomFields, deserializeCustomFields } from '@/components/ui/custom-fields'

type PropertyType = 'condo' | 'apartment' | 'warehouse' | 'shoplot' | 'house' | 'commercial'

interface PropertyFormData {
  name: string
  address: string
  type: PropertyType
  totalUnits: number
  imageUrl: string
  notes: string
  customFields: Record<string, { value: string; type: string }>
}

interface PropertyFormProps {
  property?: {
    id: string
    name: string
    address: string
    type: PropertyType
    totalUnits: number
    imageUrl?: string
    notes?: string
    customFields?: Record<string, { value: string; type: string }>
  } | null
  onSubmit: (data: PropertyFormData) => void
  onClose: () => void
}

export function PropertyForm({ property, onSubmit, onClose }: PropertyFormProps) {
  const [formData, setFormData] = React.useState({
    name: property?.name || '',
    address: property?.address || '',
    type: property?.type || 'apartment',
    totalUnits: property?.totalUnits || 0,
    imageUrl: property?.imageUrl || '',
    notes: property?.notes || '',
    yearBuilt: '',
    parkingSpaces: '',
    amenities: '',
    managementContact: '',
    managementEmail: '',
  })

  const [customFields, setCustomFields] = React.useState<CustomField[]>(
    deserializeCustomFields(property?.customFields)
  )

  const [errors, setErrors] = React.useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = React.useState(false)

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) {
      setIsSubmitting(true)
      await new Promise((resolve) => setTimeout(resolve, 500))
      onSubmit({
        ...formData,
        type: formData.type as PropertyType,
        customFields: serializeCustomFields(customFields),
      })
      setIsSubmitting(false)
    }
  }

  const propertyTypes = [
    { value: 'apartment', label: 'Apartment' },
    { value: 'condo', label: 'Condominium' },
    { value: 'warehouse', label: 'Warehouse' },
    { value: 'shoplot', label: 'Shop Lot' },
    { value: 'house', label: 'House' },
    { value: 'commercial', label: 'Commercial' },
  ]

  return (
    <FormSidePanel
      isOpen={true}
      onClose={onClose}
      title={property ? 'Edit Property' : 'Add New Property'}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      submitText={property ? 'Update Property' : 'Add Property'}
      width="lg"
    >
      {/* Basic Info - Compact Grid */}
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-black/70 mb-1">
            Property Name <span className="text-danger">*</span>
          </label>
          <Input
            placeholder="e.g., Sunset Apartments"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={errors.name}
            required
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-black/70 mb-1">
            Address <span className="text-danger">*</span>
          </label>
          <Input
            placeholder="e.g., 123 Main St, Los Angeles, CA 90001"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            error={errors.address}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-black/70 mb-1">
            Property Type
          </label>
          <Select
            value={formData.type}
            options={propertyTypes}
            onChange={(e) => setFormData({ ...formData, type: e.target.value as PropertyType })}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-black/70 mb-1">
            Total Units <span className="text-danger">*</span>
          </label>
          <Input
            type="number"
            min="1"
            value={formData.totalUnits}
            onChange={(e) =>
              setFormData({ ...formData, totalUnits: parseInt(e.target.value) || 0 })
            }
            error={errors.totalUnits}
            required
          />
        </div>
      </div>

      {/* Property Details - Compact */}
      <div className="border-t border-black/[0.08] pt-4">
        <h3 className="text-sm font-semibold text-black mb-3">Property Details</h3>
        <div className="grid gap-3 sm:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-black/70 mb-1">
              Year Built
            </label>
            <Input
              type="number"
              placeholder="2010"
              value={formData.yearBuilt}
              onChange={(e) => setFormData({ ...formData, yearBuilt: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black/70 mb-1">
              Parking Spaces
            </label>
            <Input
              type="number"
              placeholder="50"
              value={formData.parkingSpaces}
              onChange={(e) => setFormData({ ...formData, parkingSpaces: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black/70 mb-1">
              Amenities
            </label>
            <Input
              placeholder="Pool, Gym..."
              value={formData.amenities}
              onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* Management Contact - Compact */}
      <div className="border-t border-black/[0.08] pt-4">
        <h3 className="text-sm font-semibold text-black mb-3">Management Contact</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-black/70 mb-1">
              Contact Name
            </label>
            <Input
              placeholder="John Smith"
              value={formData.managementContact}
              onChange={(e) => setFormData({ ...formData, managementContact: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black/70 mb-1">
              Contact Email
            </label>
            <Input
              type="email"
              placeholder="manager@property.com"
              value={formData.managementEmail}
              onChange={(e) => setFormData({ ...formData, managementEmail: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* Property Image - Compact */}
      <div className="border-t border-black/[0.08] pt-4">
        <h3 className="text-sm font-semibold text-black mb-3">Property Image</h3>
        <ImageUpload
          value={formData.imageUrl}
          onChange={(imageData) => setFormData({ ...formData, imageUrl: imageData })}
          helperText="Upload a photo (optional)"
          maxSizeMB={5}
          aspectRatio="16/9"
        />
      </div>

      {/* Notes - Compact */}
      <div className="border-t border-black/[0.08] pt-4">
        <label className="block text-sm font-medium text-black/70 mb-1">
          Notes
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Property notes (maintenance, HOA info)..."
          rows={2}
          className="w-full rounded-lg border border-black/20 bg-white px-3 py-2 text-sm text-black placeholder:text-black/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
        />
      </div>

      {/* Custom Fields */}
      <div className="border-t border-black/[0.08] pt-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-black">Custom Fields</h3>
          <span className="text-xs text-black/50">{customFields.length}/10</span>
        </div>
        <CustomFields
          fields={customFields}
          onChange={setCustomFields}
          maxFields={10}
        />
      </div>
    </FormSidePanel>
  )
}
