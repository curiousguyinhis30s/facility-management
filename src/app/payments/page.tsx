'use client'

import React from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { formatCurrency, formatDate } from '@/lib/utils'
import { EmptyState, SearchEmptyState } from '@/components/ui/empty-state'

// Mock payment data
const mockPayments = [
  {
    id: 'PAY-001',
    tenant: 'John Doe',
    property: 'Sunset Apartments',
    unit: '101',
    amount: 2200,
    type: 'rent' as const,
    method: 'bank_transfer' as const,
    status: 'completed' as const,
    date: new Date(2025, 10, 1),
    dueDate: new Date(2025, 10, 1),
    receiptNumber: 'RCP-2025-001',
  },
  {
    id: 'PAY-002',
    tenant: 'Jane Smith',
    property: 'Sunset Apartments',
    unit: '102',
    amount: 1500,
    type: 'rent' as const,
    method: 'cash' as const,
    status: 'completed' as const,
    date: new Date(2025, 10, 3),
    dueDate: new Date(2025, 10, 1),
    receiptNumber: 'RCP-2025-002',
  },
  {
    id: 'PAY-003',
    tenant: 'Mike Johnson',
    property: 'Sunset Apartments',
    unit: '104',
    amount: 2200,
    type: 'rent' as const,
    method: 'bank_transfer' as const,
    status: 'pending' as const,
    dueDate: new Date(2025, 10, 1),
  },
  {
    id: 'PAY-004',
    tenant: 'Sarah Williams',
    property: 'Downtown Condos',
    unit: '305',
    amount: 500,
    type: 'late_fee' as const,
    method: 'bank_transfer' as const,
    status: 'overdue' as const,
    dueDate: new Date(2025, 9, 15),
  },
  {
    id: 'PAY-005',
    tenant: 'David Brown',
    property: 'Garden Houses',
    unit: '1A',
    amount: 6400,
    type: 'security_deposit' as const,
    method: 'bank_transfer' as const,
    status: 'completed' as const,
    date: new Date(2024, 11, 28),
    dueDate: new Date(2024, 11, 28),
    receiptNumber: 'RCP-2024-089',
  },
]

export default function PaymentsPage() {
  const [payments, setPayments] = React.useState(mockPayments)
  const [searchTerm, setSearchTerm] = React.useState('')
  const [statusFilter, setStatusFilter] = React.useState('all')
  const [typeFilter, setTypeFilter] = React.useState('all')

  const filteredPayments = React.useMemo(() => {
    return payments.filter((payment) => {
      const matchesSearch =
        payment.tenant.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.property.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.id.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === 'all' || payment.status === statusFilter
      const matchesType = typeFilter === 'all' || payment.type === typeFilter

      return matchesSearch && matchesStatus && matchesType
    })
  }, [payments, searchTerm, statusFilter, typeFilter])

  const stats = {
    totalCollected: payments
      .filter((p) => p.status === 'completed')
      .reduce((sum, p) => sum + p.amount, 0),
    pending: payments
      .filter((p) => p.status === 'pending')
      .reduce((sum, p) => sum + p.amount, 0),
    overdue: payments
      .filter((p) => p.status === 'overdue')
      .reduce((sum, p) => sum + p.amount, 0),
    thisMonth: payments
      .filter((p) => p.status === 'completed' && p.date && p.date.getMonth() === new Date().getMonth())
      .reduce((sum, p) => sum + p.amount, 0),
  }

  const getTypeLabel = (type: string) => {
    const labels = {
      rent: 'Rent',
      late_fee: 'Late Fee',
      security_deposit: 'Security Deposit',
      maintenance: 'Maintenance',
      utility: 'Utility',
    }
    return labels[type as keyof typeof labels] || type
  }

  const getMethodLabel = (method: string) => {
    const labels = {
      bank_transfer: 'Bank Transfer',
      cash: 'Cash',
      credit_card: 'Credit Card',
      cheque: 'Cheque',
    }
    return labels[method as keyof typeof labels] || method
  }

  return (
    <DashboardLayout
      title="Payments"
      actions={
        <Button variant="primary">
          <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Record Payment
        </Button>
      }
    >
      {/* Mobile Stats */}
      <div className="grid grid-cols-2 gap-3 mb-4 pb-4 border-b border-black/[0.06] md:hidden">
        <div className="bg-green-50 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-green-600">{formatCurrency(stats.totalCollected)}</div>
          <div className="text-[10px] text-green-700/60">Collected</div>
        </div>
        <div className="bg-amber-50 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-amber-600">{formatCurrency(stats.pending)}</div>
          <div className="text-[10px] text-amber-700/60">Pending</div>
        </div>
      </div>

      {/* Desktop Stats Row */}
      <div className="hidden md:flex flex-wrap items-center gap-6 mb-4 pb-4 border-b border-black/[0.06]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
            <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <div className="text-xl font-semibold text-green-600">{formatCurrency(stats.totalCollected)}</div>
            <div className="text-[11px] text-black/50">Total Collected</div>
          </div>
        </div>
        <div className="w-px h-8 bg-black/10" />
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
            <svg className="w-4 h-4 text-amber-600" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <div className="text-xl font-semibold text-amber-600">{formatCurrency(stats.pending)}</div>
            <div className="text-[11px] text-black/50">Pending</div>
          </div>
        </div>
        <div className="w-px h-8 bg-black/10" />
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
            <svg className="w-4 h-4 text-red-600" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>
          <div>
            <div className="text-xl font-semibold text-red-600">{formatCurrency(stats.overdue)}</div>
            <div className="text-[11px] text-black/50">Overdue</div>
          </div>
        </div>
      </div>

      {/* Mobile Filters */}
      <div className="flex flex-col gap-2 mb-4 md:hidden">
        <Input type="search" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="h-9 text-sm" />
        <div className="flex gap-2">
          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} options={[{ value: 'all', label: 'Status' }, { value: 'completed', label: 'Paid' }, { value: 'pending', label: 'Pending' }, { value: 'overdue', label: 'Overdue' }]} className="flex-1 h-9 text-sm" />
          <Select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} options={[{ value: 'all', label: 'Type' }, { value: 'rent', label: 'Rent' }, { value: 'late_fee', label: 'Fee' }, { value: 'security_deposit', label: 'Deposit' }]} className="flex-1 h-9 text-sm" />
        </div>
      </div>

      {/* Desktop Filters */}
      <div className="hidden md:flex items-center gap-3 mb-4 px-3 py-2 bg-black/[0.02] rounded-lg border border-black/[0.06]">
        <Input type="search" placeholder="Search payments..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-52 h-8 text-sm" />
        <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} options={[{ value: 'all', label: 'All Statuses' }, { value: 'completed', label: 'Completed' }, { value: 'pending', label: 'Pending' }, { value: 'overdue', label: 'Overdue' }]} className="w-32 h-8 text-sm" />
        <Select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} options={[{ value: 'all', label: 'All Types' }, { value: 'rent', label: 'Rent' }, { value: 'late_fee', label: 'Late Fee' }, { value: 'security_deposit', label: 'Deposit' }, { value: 'maintenance', label: 'Maintenance' }]} className="w-32 h-8 text-sm" />
        <span className="ml-auto text-xs text-black/50 whitespace-nowrap">{filteredPayments.length} of {payments.length}</span>
      </div>

      {/* Mobile Card View */}
      <div className="space-y-3 md:hidden">
        {filteredPayments.length === 0 ? (
          <Card><CardContent className="p-6 text-center text-sm text-black/50">No payments found</CardContent></Card>
        ) : (
          filteredPayments.map((payment) => (
            <Card key={payment.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="font-medium text-black">{payment.tenant}</div>
                    <div className="text-xs text-black/50">{payment.property} • {payment.unit}</div>
                  </div>
                  <Badge variant={payment.status === 'completed' ? 'success' : payment.status === 'pending' ? 'warning' : 'danger'}>
                    {payment.status}
                  </Badge>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-black/[0.06]">
                  <div>
                    <div className="text-lg font-bold">{formatCurrency(payment.amount)}</div>
                    <div className="text-[10px] text-black/40">{getTypeLabel(payment.type)}</div>
                  </div>
                  <div className="text-right text-xs text-black/50">
                    Due {formatDate(payment.dueDate, { month: 'short', day: 'numeric' })}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Desktop Table */}
      <Card className="hidden md:block">
        <CardContent className="p-6">
          {filteredPayments.length === 0 ? (
            searchTerm || statusFilter !== 'all' || typeFilter !== 'all' ? (
              <SearchEmptyState
                searchTerm={searchTerm || statusFilter || typeFilter}
                entityName="payments"
                onClear={() => {
                  setSearchTerm('')
                  setStatusFilter('all')
                  setTypeFilter('all')
                }}
              />
            ) : (
              <EmptyState
                icon="payments"
                title="No payments recorded"
                description="Track rent payments, deposits, and other financial transactions. Record your first payment to get started."
                action={{
                  label: 'Record Payment',
                  onClick: () => {},
                }}
              />
            )
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-black/[0.08]">
                  <tr>
                    <th className="pb-3 text-left text-sm font-semibold text-black">Payment ID</th>
                    <th className="pb-3 text-left text-sm font-semibold text-black">Tenant</th>
                    <th className="pb-3 text-left text-sm font-semibold text-black">Property & Unit</th>
                    <th className="pb-3 text-left text-sm font-semibold text-black">Type</th>
                    <th className="pb-3 text-left text-sm font-semibold text-black">Amount</th>
                    <th className="pb-3 text-left text-sm font-semibold text-black">Method</th>
                    <th className="pb-3 text-left text-sm font-semibold text-black">Due Date</th>
                    <th className="pb-3 text-left text-sm font-semibold text-black">Status</th>
                    <th className="pb-3 text-right text-sm font-semibold text-black">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/[0.08]">
                  {filteredPayments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-black/[0.02] transition-colors duration-100">
                      <td className="py-4 text-sm font-medium text-black">{payment.id}</td>
                      <td className="py-4 text-sm text-black/70">{payment.tenant}</td>
                      <td className="py-4">
                        <div className="text-sm font-medium text-black">{payment.property}</div>
                        <div className="text-sm text-black/50">Unit {payment.unit}</div>
                      </td>
                      <td className="py-4">
                        <Badge variant="secondary">{getTypeLabel(payment.type)}</Badge>
                      </td>
                      <td className="py-4 text-sm font-semibold text-black">
                        {formatCurrency(payment.amount)}
                      </td>
                      <td className="py-4 text-sm text-black/70">{getMethodLabel(payment.method)}</td>
                      <td className="py-4">
                        <div className="text-sm text-black/70">
                          {formatDate(payment.dueDate, { month: 'short', day: 'numeric' })}
                        </div>
                        {payment.date && payment.status === 'completed' && (
                          <div className="text-xs text-success">
                            Paid {formatDate(payment.date, { month: 'short', day: 'numeric' })}
                          </div>
                        )}
                      </td>
                      <td className="py-4">
                        <Badge
                          variant={
                            payment.status === 'completed'
                              ? 'success'
                              : payment.status === 'pending'
                              ? 'warning'
                              : 'danger'
                          }
                        >
                          {payment.status}
                        </Badge>
                      </td>
                      <td className="py-4 text-right">
                        <div className="flex justify-end gap-2">
                          {payment.receiptNumber && (
                            <button
                              className="rounded-lg p-2 text-black/40 hover:bg-black/[0.04] hover:text-black transition-colors duration-150"
                              title="View receipt"
                            >
                              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                              </svg>
                            </button>
                          )}
                          {payment.status !== 'completed' && (
                            <button
                              className="rounded-lg p-2 text-black/40 hover:bg-emerald-50 hover:text-success transition-colors duration-150"
                              title="Mark as paid"
                            >
                              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}
