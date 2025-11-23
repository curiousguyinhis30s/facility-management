'use client'

import React from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { formatCurrency, formatDate } from '@/lib/utils'

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
      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-4 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-gray-500">Total Collected</div>
            <div className="mt-2 text-3xl font-semibold text-gray-900">
              {formatCurrency(stats.totalCollected)}
            </div>
            <div className="mt-2 text-sm text-success">All time</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-gray-500">This Month</div>
            <div className="mt-2 text-3xl font-semibold text-gray-900">
              {formatCurrency(stats.thisMonth)}
            </div>
            <div className="mt-2 text-sm text-success">Collected</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-gray-500">Pending</div>
            <div className="mt-2 text-3xl font-semibold text-warning">
              {formatCurrency(stats.pending)}
            </div>
            <div className="mt-2 text-sm text-gray-500">Awaiting payment</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-gray-500">Overdue</div>
            <div className="mt-2 text-3xl font-semibold text-danger">
              {formatCurrency(stats.overdue)}
            </div>
            <div className="mt-2 text-sm text-danger">Requires action</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <Input
              type="search"
              placeholder="Search payments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />

            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={[
                { value: 'all', label: 'All Statuses' },
                { value: 'completed', label: 'Completed' },
                { value: 'pending', label: 'Pending' },
                { value: 'overdue', label: 'Overdue' },
              ]}
              className="w-40"
            />

            <Select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              options={[
                { value: 'all', label: 'All Types' },
                { value: 'rent', label: 'Rent' },
                { value: 'late_fee', label: 'Late Fee' },
                { value: 'security_deposit', label: 'Security Deposit' },
                { value: 'maintenance', label: 'Maintenance' },
              ]}
              className="w-48"
            />

            <div className="ml-auto text-sm text-gray-500">
              Showing {filteredPayments.length} of {payments.length} payments
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payments List */}
      <Card>
        <CardContent className="p-6">
          {filteredPayments.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12">
              <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
              </svg>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">No payments found</h3>
              <p className="mt-2 text-sm text-gray-500">
                {searchTerm || statusFilter !== 'all' || typeFilter !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Payment transactions will appear here'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-gray-200">
                  <tr>
                    <th className="pb-3 text-left text-sm font-semibold text-gray-900">Payment ID</th>
                    <th className="pb-3 text-left text-sm font-semibold text-gray-900">Tenant</th>
                    <th className="pb-3 text-left text-sm font-semibold text-gray-900">Property & Unit</th>
                    <th className="pb-3 text-left text-sm font-semibold text-gray-900">Type</th>
                    <th className="pb-3 text-left text-sm font-semibold text-gray-900">Amount</th>
                    <th className="pb-3 text-left text-sm font-semibold text-gray-900">Method</th>
                    <th className="pb-3 text-left text-sm font-semibold text-gray-900">Due Date</th>
                    <th className="pb-3 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th className="pb-3 text-right text-sm font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredPayments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-gray-50">
                      <td className="py-4 text-sm font-medium text-gray-900">{payment.id}</td>
                      <td className="py-4 text-sm text-gray-600">{payment.tenant}</td>
                      <td className="py-4">
                        <div className="text-sm font-medium text-gray-900">{payment.property}</div>
                        <div className="text-sm text-gray-500">Unit {payment.unit}</div>
                      </td>
                      <td className="py-4">
                        <Badge variant="secondary">{getTypeLabel(payment.type)}</Badge>
                      </td>
                      <td className="py-4 text-sm font-semibold text-gray-900">
                        {formatCurrency(payment.amount)}
                      </td>
                      <td className="py-4 text-sm text-gray-600">{getMethodLabel(payment.method)}</td>
                      <td className="py-4">
                        <div className="text-sm text-gray-600">
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
                              className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-900"
                              title="View receipt"
                            >
                              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                              </svg>
                            </button>
                          )}
                          {payment.status !== 'completed' && (
                            <button
                              className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-success"
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
