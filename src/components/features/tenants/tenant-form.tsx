'use client'

import React from 'react'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { FormSidePanel } from '@/components/ui/side-panel'
import { CustomFields, CustomField, serializeCustomFields, deserializeCustomFields } from '@/components/ui/custom-fields'

interface TenantFormProps {
  tenant?: any
  onSubmit: (data: any) => void
  onClose: () => void
}

export function TenantForm({ tenant, onSubmit, onClose }: TenantFormProps) {
  const [formData, setFormData] = React.useState({
    name: tenant?.name || '',
    email: tenant?.email || '',
    phone: tenant?.phone || '',
    property: tenant?.property || '',
    unit: tenant?.unit || '',
    leaseStart: tenant?.leaseStart ? (tenant.leaseStart instanceof Date ? tenant.leaseStart : new Date(tenant.leaseStart)).toISOString().split('T')[0] : '',
    leaseEnd: tenant?.leaseEnd ? (tenant.leaseEnd instanceof Date ? tenant.leaseEnd : new Date(tenant.leaseEnd)).toISOString().split('T')[0] : '',
    monthlyRent: tenant?.monthlyRent || '',
    balance: tenant?.balance || '0',
    status: tenant?.status || 'active',
    emergencyContact: tenant?.emergencyContact || '',
    emergencyPhone: tenant?.emergencyPhone || '',
    notes: tenant?.notes || '',
  })

  const [customFields, setCustomFields] = React.useState<CustomField[]>(
    deserializeCustomFields(tenant?.customFields)
  )

  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    await new Promise((resolve) => setTimeout(resolve, 500))

    const processedData = {
      ...formData,
      monthlyRent: parseFloat(formData.monthlyRent) || 0,
      balance: parseFloat(formData.balance) || 0,
      leaseStart: formData.leaseStart ? new Date(formData.leaseStart) : new Date(),
      leaseEnd: formData.leaseEnd ? new Date(formData.leaseEnd) : new Date(),
      avatar: tenant?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=2563EB&color=fff`,
      customFields: serializeCustomFields(customFields),
    }

    onSubmit(processedData)
    setIsSubmitting(false)
  }

  return (
    <FormSidePanel
      isOpen={true}
      onClose={onClose}
      title={tenant ? 'Edit Tenant' : 'Add New Tenant'}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      submitText={tenant ? 'Update Tenant' : 'Add Tenant'}
      width="lg"
    >
      {/* Personal Info - Compact Grid */}
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-black/70 mb-1">
            Full Name <span className="text-danger">*</span>
          </label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="John Doe"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-black/70 mb-1">
            Email <span className="text-danger">*</span>
          </label>
          <Input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="john.doe@email.com"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-black/70 mb-1">
            Phone <span className="text-danger">*</span>
          </label>
          <Input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="(555) 123-4567"
            required
          />
        </div>
      </div>

      {/* Lease Info - Compact */}
      <div className="border-t border-black/[0.08] pt-4">
        <h3 className="text-sm font-semibold text-black mb-3">Lease Information</h3>
        <div className="grid gap-3 sm:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-black/70 mb-1">
              Property <span className="text-danger">*</span>
            </label>
            <Input
              value={formData.property}
              onChange={(e) => setFormData({ ...formData, property: e.target.value })}
              placeholder="Sunset Apts"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black/70 mb-1">
              Unit <span className="text-danger">*</span>
            </label>
            <Input
              value={formData.unit}
              onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
              placeholder="101"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black/70 mb-1">
              Status
            </label>
            <Select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              options={[
                { value: 'active', label: 'Active' },
                { value: 'pending', label: 'Pending' },
                { value: 'expired', label: 'Expired' },
              ]}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black/70 mb-1">
              Start Date <span className="text-danger">*</span>
            </label>
            <Input
              type="date"
              value={formData.leaseStart}
              onChange={(e) => setFormData({ ...formData, leaseStart: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black/70 mb-1">
              End Date <span className="text-danger">*</span>
            </label>
            <Input
              type="date"
              value={formData.leaseEnd}
              onChange={(e) => setFormData({ ...formData, leaseEnd: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black/70 mb-1">
              Monthly Rent <span className="text-danger">*</span>
            </label>
            <Input
              type="number"
              value={formData.monthlyRent}
              onChange={(e) => setFormData({ ...formData, monthlyRent: e.target.value })}
              placeholder="2200"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black/70 mb-1">
              Balance (SAR)
            </label>
            <Input
              type="number"
              value={formData.balance}
              onChange={(e) => setFormData({ ...formData, balance: e.target.value })}
              placeholder="0"
            />
          </div>
        </div>
      </div>

      {/* Emergency Contact - Compact */}
      <div className="border-t border-black/[0.08] pt-4">
        <h3 className="text-sm font-semibold text-black mb-3">Emergency Contact</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-black/70 mb-1">
              Contact Name
            </label>
            <Input
              value={formData.emergencyContact}
              onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
              placeholder="Jane Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black/70 mb-1">
              Contact Phone
            </label>
            <Input
              type="tel"
              value={formData.emergencyPhone}
              onChange={(e) => setFormData({ ...formData, emergencyPhone: e.target.value })}
              placeholder="(555) 987-6543"
            />
          </div>
        </div>
      </div>

      {/* Notes - Compact */}
      <div className="border-t border-black/[0.08] pt-4">
        <label className="block text-sm font-medium text-black/70 mb-1">
          Notes
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Internal notes..."
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
