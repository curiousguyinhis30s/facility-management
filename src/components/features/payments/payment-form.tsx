'use client'

import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'

interface PaymentFormProps {
  payment?: any
  onSubmit: (data: any) => void
  onClose: () => void
}

export function PaymentForm({ payment, onSubmit, onClose }: PaymentFormProps) {
  const [formData, setFormData] = React.useState({
    tenantName: payment?.tenantName || '',
    property: payment?.property || '',
    unit: payment?.unit || '',
    amount: payment?.amount || '',
    type: payment?.type || 'rent',
    method: payment?.method || 'bank_transfer',
    dueDate: payment?.dueDate ? payment.dueDate.toISOString().split('T')[0] : '',
    status: payment?.status || 'pending',
  })

  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 800))
    const processedData = { ...formData, amount: parseFloat(formData.amount) || 0, dueDate: formData.dueDate ? new Date(formData.dueDate) : new Date(), paidDate: null }
    onSubmit(processedData)
    setIsSubmitting(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
        <CardHeader className="border-b border-black/[0.04]">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-semibold">{payment ? 'Edit Payment' : 'Record Payment'}</CardTitle>
            <button onClick={onClose} className="rounded-lg p-2 text-black/40 hover:bg-black/[0.04] hover:text-black transition-colors"><svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></button>
          </div>
        </CardHeader>
        <CardContent className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4"><h3 className="text-sm font-semibold text-black">Payment Details</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2"><label className="block text-sm font-medium text-black/70">Tenant Name <span className="text-danger">*</span></label><Input value={formData.tenantName} onChange={(e) => setFormData({ ...formData, tenantName: e.target.value })} placeholder="John Doe" required className="mt-1" /></div>
                <div><label className="block text-sm font-medium text-black/70">Property <span className="text-danger">*</span></label><Input value={formData.property} onChange={(e) => setFormData({ ...formData, property: e.target.value })} placeholder="Sunset Apartments" required className="mt-1" /></div>
                <div><label className="block text-sm font-medium text-black/70">Unit <span className="text-danger">*</span></label><Input value={formData.unit} onChange={(e) => setFormData({ ...formData, unit: e.target.value })} placeholder="101" required className="mt-1" /></div>
                <div><label className="block text-sm font-medium text-black/70">Amount (SAR) <span className="text-danger">*</span></label><Input type="number" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} placeholder="2200" required className="mt-1" /></div>
                <div><label className="block text-sm font-medium text-black/70">Type <span className="text-danger">*</span></label><Select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} options={[{ value: 'rent', label: 'Rent' }, { value: 'deposit', label: 'Security Deposit' }, { value: 'utility', label: 'Utility' }, { value: 'late_fee', label: 'Late Fee' }, { value: 'other', label: 'Other' }]} className="mt-1" /></div>
                <div><label className="block text-sm font-medium text-black/70">Payment Method</label><Select value={formData.method} onChange={(e) => setFormData({ ...formData, method: e.target.value })} options={[{ value: 'bank_transfer', label: 'Bank Transfer' }, { value: 'cash', label: 'Cash' }, { value: 'check', label: 'Check' }, { value: 'online', label: 'Online' }]} className="mt-1" /></div>
                <div><label className="block text-sm font-medium text-black/70">Due Date <span className="text-danger">*</span></label><Input type="date" value={formData.dueDate} onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })} required className="mt-1" /></div>
                <div><label className="block text-sm font-medium text-black/70">Status</label><Select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} options={[{ value: 'pending', label: 'Pending' }, { value: 'paid', label: 'Paid' }, { value: 'overdue', label: 'Overdue' }]} className="mt-1" /></div>
              </div>
            </div>
            <div className="flex justify-end gap-3 border-t border-black/[0.04] pt-4">
              <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
              <Button type="submit" variant="primary" disabled={isSubmitting} className="min-w-[120px]">{isSubmitting ? (<div className="flex items-center gap-2"><svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Saving...</div>) : (<>Record Payment</>)}</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
