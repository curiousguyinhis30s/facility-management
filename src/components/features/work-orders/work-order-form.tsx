'use client'

import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'

interface WorkOrderFormProps {
  workOrder?: any
  onSubmit: (data: any) => void
  onClose: () => void
}

export function WorkOrderForm({ workOrder, onSubmit, onClose }: WorkOrderFormProps) {
  const [formData, setFormData] = React.useState({
    title: workOrder?.title || '',
    property: workOrder?.property || '',
    unit: workOrder?.unit || '',
    category: workOrder?.category || 'plumbing',
    priority: workOrder?.priority || 'medium',
    description: workOrder?.description || '',
    assignedTo: workOrder?.assignedTo || '',
    estimatedCost: workOrder?.estimatedCost || '',
    status: workOrder?.status || 'open',
  })

  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 800))
    const processedData = { ...formData, estimatedCost: parseFloat(formData.estimatedCost) || 0, createdDate: new Date(), completedDate: null }
    onSubmit(processedData)
    setIsSubmitting(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
        <CardHeader className="border-b border-black/[0.04]">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-semibold">{workOrder ? 'Edit Work Order' : 'Create Work Order'}</CardTitle>
            <button onClick={onClose} className="rounded-lg p-2 text-black/40 hover:bg-black/[0.04] hover:text-black transition-colors"><svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></button>
          </div>
        </CardHeader>
        <CardContent className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4"><h3 className="text-sm font-semibold text-black">Work Order Details</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2"><label className="block text-sm font-medium text-black/70">Title <span className="text-danger">*</span></label><Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Fix leaking faucet" required className="mt-1" /></div>
                <div><label className="block text-sm font-medium text-black/70">Property <span className="text-danger">*</span></label><Input value={formData.property} onChange={(e) => setFormData({ ...formData, property: e.target.value })} placeholder="Sunset Apartments" required className="mt-1" /></div>
                <div><label className="block text-sm font-medium text-black/70">Unit</label><Input value={formData.unit} onChange={(e) => setFormData({ ...formData, unit: e.target.value })} placeholder="101" className="mt-1" /></div>
                <div><label className="block text-sm font-medium text-black/70">Category <span className="text-danger">*</span></label><Select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} options={[{ value: 'plumbing', label: 'Plumbing' }, { value: 'electrical', label: 'Electrical' }, { value: 'hvac', label: 'HVAC' }, { value: 'appliance', label: 'Appliance' }, { value: 'structural', label: 'Structural' }, { value: 'other', label: 'Other' }]} className="mt-1" /></div>
                <div><label className="block text-sm font-medium text-black/70">Priority <span className="text-danger">*</span></label><Select value={formData.priority} onChange={(e) => setFormData({ ...formData, priority: e.target.value })} options={[{ value: 'low', label: 'Low' }, { value: 'medium', label: 'Medium' }, { value: 'high', label: 'High' }, { value: 'urgent', label: 'Urgent' }]} className="mt-1" /></div>
                <div className="sm:col-span-2"><label className="block text-sm font-medium text-black/70">Description <span className="text-danger">*</span></label><Input value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Detailed description..." required className="mt-1" /></div>
                <div><label className="block text-sm font-medium text-black/70">Assigned To</label><Input value={formData.assignedTo} onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })} placeholder="Technician name" className="mt-1" /></div>
                <div><label className="block text-sm font-medium text-black/70">Estimated Cost (SAR)</label><Input type="number" value={formData.estimatedCost} onChange={(e) => setFormData({ ...formData, estimatedCost: e.target.value })} placeholder="500" className="mt-1" /></div>
              </div>
            </div>
            <div className="flex justify-end gap-3 border-t border-black/[0.04] pt-4">
              <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
              <Button type="submit" variant="primary" disabled={isSubmitting} className="min-w-[120px]">{isSubmitting ? (<div className="flex items-center gap-2"><svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Saving...</div>) : (<>{workOrder ? 'Update' : 'Create'} Work Order</>)}</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
