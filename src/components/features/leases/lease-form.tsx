'use client'

import React from 'react'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { FormSidePanel } from '@/components/ui/side-panel'
import { CustomFields, CustomField, serializeCustomFields, deserializeCustomFields } from '@/components/ui/custom-fields'

interface LeaseFormProps {
  lease?: any
  onSubmit: (data: any) => void
  onClose: () => void
}

export function LeaseForm({ lease, onSubmit, onClose }: LeaseFormProps) {
  const formatDateValue = (date: any) => {
    if (!date) return ''
    const d = date instanceof Date ? date : new Date(date)
    return d.toISOString().split('T')[0]
  }

  const [formData, setFormData] = React.useState({
    tenantName: lease?.tenant || lease?.tenantName || '',
    property: lease?.property || '',
    unit: lease?.unit || '',
    startDate: formatDateValue(lease?.startDate),
    endDate: formatDateValue(lease?.endDate),
    monthlyRent: lease?.monthlyRent || '',
    securityDeposit: lease?.securityDeposit || '',
    status: lease?.status || 'active',
    notes: lease?.notes || '',
    paymentTerms: lease?.paymentTerms || 'monthly',
    lateFee: lease?.lateFee || '',
    gracePeriod: lease?.gracePeriod || '5',
  })

  const [customFields, setCustomFields] = React.useState<CustomField[]>(
    deserializeCustomFields(lease?.customFields)
  )

  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    await new Promise((resolve) => setTimeout(resolve, 500))

    const processedData = {
      ...formData,
      monthlyRent: parseFloat(formData.monthlyRent) || 0,
      securityDeposit: parseFloat(formData.securityDeposit) || 0,
      lateFee: parseFloat(formData.lateFee) || 0,
      gracePeriod: parseInt(formData.gracePeriod) || 5,
      startDate: formData.startDate ? new Date(formData.startDate) : new Date(),
      endDate: formData.endDate ? new Date(formData.endDate) : new Date(),
      customFields: serializeCustomFields(customFields),
    }

    onSubmit(processedData)
    setIsSubmitting(false)
  }

  return (
    <FormSidePanel
      isOpen={true}
      onClose={onClose}
      title={lease ? 'Edit Lease' : 'Create New Lease'}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      submitText={lease ? 'Update Lease' : 'Create Lease'}
      width="lg"
    >
      {/* Tenant & Property - Compact */}
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="sm:col-span-3">
          <label className="block text-sm font-medium text-black/70 mb-1">
            Tenant Name <span className="text-danger">*</span>
          </label>
          <Input
            value={formData.tenantName}
            onChange={(e) => setFormData({ ...formData, tenantName: e.target.value })}
            placeholder="John Doe"
            required
          />
        </div>

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
              { value: 'expiring', label: 'Expiring Soon' },
              { value: 'expired', label: 'Expired' },
              { value: 'terminated', label: 'Terminated' },
            ]}
          />
        </div>
      </div>

      {/* Lease Terms - Compact */}
      <div className="border-t border-black/[0.08] pt-4">
        <h3 className="text-sm font-semibold text-black mb-3">Lease Terms</h3>
        <div className="grid gap-3 sm:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-black/70 mb-1">
              Start Date <span className="text-danger">*</span>
            </label>
            <Input
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black/70 mb-1">
              End Date <span className="text-danger">*</span>
            </label>
            <Input
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black/70 mb-1">
              Payment Terms
            </label>
            <Select
              value={formData.paymentTerms}
              onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
              options={[
                { value: 'monthly', label: 'Monthly' },
                { value: 'quarterly', label: 'Quarterly' },
                { value: 'semi-annual', label: 'Semi-Annual' },
                { value: 'annual', label: 'Annual' },
              ]}
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
              Security Deposit <span className="text-danger">*</span>
            </label>
            <Input
              type="number"
              value={formData.securityDeposit}
              onChange={(e) => setFormData({ ...formData, securityDeposit: e.target.value })}
              placeholder="4400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black/70 mb-1">
              Late Fee (SAR)
            </label>
            <Input
              type="number"
              value={formData.lateFee}
              onChange={(e) => setFormData({ ...formData, lateFee: e.target.value })}
              placeholder="100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black/70 mb-1">
              Grace Period (Days)
            </label>
            <Input
              type="number"
              value={formData.gracePeriod}
              onChange={(e) => setFormData({ ...formData, gracePeriod: e.target.value })}
              placeholder="5"
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
          placeholder="Lease notes (special terms, conditions)..."
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
