'use client'

import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'

interface FacilityFormProps {
  facility?: any
  onSubmit: (data: any) => void
  onClose: () => void
}

export function FacilityForm({ facility, onSubmit, onClose }: FacilityFormProps) {
  const [formData, setFormData] = React.useState({
    name: facility?.name || '',
    category: facility?.category || 'amenity',
    type: facility?.type || 'Swimming Pool',
    property: facility?.property || '',
    responsiblePerson: facility?.responsiblePerson || '',
    maintenanceCost: facility?.maintenanceCost || '',
    condition: facility?.condition || 'good',
    status: facility?.status || 'operational',
  })

  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 800))
    const processedData = { ...formData, maintenanceCost: parseFloat(formData.maintenanceCost) || 0, lastMaintenance: new Date(), nextMaintenance: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) }
    onSubmit(processedData)
    setIsSubmitting(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
        <CardHeader className="border-b border-black/[0.04]">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-semibold">{facility ? 'Edit Facility' : 'Add New Facility'}</CardTitle>
            <button onClick={onClose} className="rounded-lg p-2 text-black/40 hover:bg-black/[0.04] hover:text-black transition-colors"><svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></button>
          </div>
        </CardHeader>
        <CardContent className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4"><h3 className="text-sm font-semibold text-black">Facility Information</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2"><label className="block text-sm font-medium text-black/70">Facility Name <span className="text-danger">*</span></label><Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Swimming Pool - Building A" required className="mt-1" /></div>
                <div><label className="block text-sm font-medium text-black/70">Category <span className="text-danger">*</span></label><Select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} options={[{ value: 'amenity', label: 'Amenity' }, { value: 'hvac', label: 'HVAC' }, { value: 'plumbing', label: 'Plumbing' }, { value: 'sewerage', label: 'Sewerage' }, { value: 'waste', label: 'Waste Management' }, { value: 'landscape', label: 'Landscaping' }, { value: 'infrastructure', label: 'Infrastructure' }]} className="mt-1" /></div>
                <div><label className="block text-sm font-medium text-black/70">Type <span className="text-danger">*</span></label><Input value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} placeholder="Swimming Pool" required className="mt-1" /></div>
                <div><label className="block text-sm font-medium text-black/70">Property</label><Input value={formData.property} onChange={(e) => setFormData({ ...formData, property: e.target.value })} placeholder="Sunset Apartments" className="mt-1" /></div>
                <div><label className="block text-sm font-medium text-black/70">Responsible Person</label><Input value={formData.responsiblePerson} onChange={(e) => setFormData({ ...formData, responsiblePerson: e.target.value })} placeholder="Ahmed Al-Rashid" className="mt-1" /></div>
                <div><label className="block text-sm font-medium text-black/70">Monthly Cost (SAR)</label><Input type="number" value={formData.maintenanceCost} onChange={(e) => setFormData({ ...formData, maintenanceCost: e.target.value })} placeholder="1500" className="mt-1" /></div>
                <div><label className="block text-sm font-medium text-black/70">Condition</label><Select value={formData.condition} onChange={(e) => setFormData({ ...formData, condition: e.target.value })} options={[{ value: 'excellent', label: 'Excellent' }, { value: 'good', label: 'Good' }, { value: 'fair', label: 'Fair' }, { value: 'poor', label: 'Poor' }]} className="mt-1" /></div>
                <div><label className="block text-sm font-medium text-black/70">Status</label><Select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} options={[{ value: 'operational', label: 'Operational' }, { value: 'maintenance', label: 'Under Maintenance' }, { value: 'offline', label: 'Offline' }]} className="mt-1" /></div>
              </div>
            </div>
            <div className="flex justify-end gap-3 border-t border-black/[0.04] pt-4">
              <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
              <Button type="submit" variant="primary" disabled={isSubmitting} className="min-w-[120px]">{isSubmitting ? (<div className="flex items-center gap-2"><svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Saving...</div>) : (<>{facility ? 'Update' : 'Add'} Facility</>)}</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
