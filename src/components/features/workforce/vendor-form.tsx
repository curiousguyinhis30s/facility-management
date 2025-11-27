'use client'

import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'

interface VendorFormProps {
  vendor?: any
  onSubmit: (data: any) => void
  onClose: () => void
}

export function VendorForm({ vendor, onSubmit, onClose }: VendorFormProps) {
  const [formData, setFormData] = React.useState({
    name: vendor?.name || '',
    type: vendor?.type || 'HVAC Services',
    contact: vendor?.contact || '',
    phone: vendor?.phone || '',
    email: vendor?.email || '',
    monthlyRate: vendor?.monthlyRate || '',
    status: vendor?.status || 'active',
    address: vendor?.address || '',
    licenseNumber: vendor?.licenseNumber || '',
    contractStartDate: vendor?.contractStartDate ? vendor.contractStartDate.toISOString().split('T')[0] : '',
    contractEndDate: vendor?.contractEndDate ? vendor.contractEndDate.toISOString().split('T')[0] : '',
  })

  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800))

    const processedData = {
      ...formData,
      monthlyRate: parseFloat(formData.monthlyRate) || 0,
      contractStartDate: formData.contractStartDate ? new Date(formData.contractStartDate) : undefined,
      contractEndDate: formData.contractEndDate ? new Date(formData.contractEndDate) : undefined,
    }

    onSubmit(processedData)
    setIsSubmitting(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
        <CardHeader className="border-b border-black/[0.04]">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-semibold">
              {vendor ? 'Edit Vendor' : 'Add New Vendor'}
            </CardTitle>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-black/40 hover:bg-black/[0.04] hover:text-black transition-colors"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </CardHeader>

        <CardContent className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Company Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-black">Company Information</h3>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-black/70">
                    Company Name <span className="text-danger">*</span>
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Saudi HVAC Specialists"
                    required
                    className="mt-1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black/70">
                    Service Type <span className="text-danger">*</span>
                  </label>
                  <Select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    options={[
                      { value: 'HVAC Services', label: 'HVAC Services' },
                      { value: 'Landscaping', label: 'Landscaping' },
                      { value: 'Cleaning', label: 'Cleaning' },
                      { value: 'Security', label: 'Security' },
                      { value: 'Plumbing', label: 'Plumbing' },
                      { value: 'Electrical', label: 'Electrical' },
                      { value: 'Painting', label: 'Painting' },
                      { value: 'Pest Control', label: 'Pest Control' },
                      { value: 'Other', label: 'Other' },
                    ]}
                    className="mt-1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black/70">
                    License Number
                  </label>
                  <Input
                    value={formData.licenseNumber}
                    onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                    placeholder="LIC-12345-SA"
                    className="mt-1"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-black/70">
                    Address
                  </label>
                  <Input
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="123 Business District, Riyadh"
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4 border-t border-black/[0.04] pt-4">
              <h3 className="text-sm font-semibold text-black">Contact Information</h3>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-black/70">
                    Contact Person <span className="text-danger">*</span>
                  </label>
                  <Input
                    value={formData.contact}
                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                    placeholder="Ali Hassan"
                    required
                    className="mt-1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black/70">
                    Phone <span className="text-danger">*</span>
                  </label>
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+966 11 234 5678"
                    required
                    className="mt-1"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-black/70">
                    Email <span className="text-danger">*</span>
                  </label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="info@vendor.sa"
                    required
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            {/* Contract Details */}
            <div className="space-y-4 border-t border-black/[0.04] pt-4">
              <h3 className="text-sm font-semibold text-black">Contract Details</h3>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-black/70">
                    Monthly Rate (SAR) <span className="text-danger">*</span>
                  </label>
                  <Input
                    type="number"
                    value={formData.monthlyRate}
                    onChange={(e) => setFormData({ ...formData, monthlyRate: e.target.value })}
                    placeholder="5000"
                    required
                    className="mt-1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black/70">
                    Status
                  </label>
                  <Select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    options={[
                      { value: 'active', label: 'Active' },
                      { value: 'inactive', label: 'Inactive' },
                      { value: 'suspended', label: 'Suspended' },
                    ]}
                    className="mt-1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black/70">
                    Contract Start Date
                  </label>
                  <Input
                    type="date"
                    value={formData.contractStartDate}
                    onChange={(e) => setFormData({ ...formData, contractStartDate: e.target.value })}
                    className="mt-1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black/70">
                    Contract End Date
                  </label>
                  <Input
                    type="date"
                    value={formData.contractEndDate}
                    onChange={(e) => setFormData({ ...formData, contractEndDate: e.target.value })}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-3 border-t border-black/[0.04] pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={isSubmitting}
                className="min-w-[120px]"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </div>
                ) : (
                  <>{vendor ? 'Update Vendor' : 'Add Vendor'}</>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
