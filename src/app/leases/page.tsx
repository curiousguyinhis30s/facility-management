'use client'

import React from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { formatCurrency, formatDate } from '@/lib/utils'

// Mock lease data
const mockLeases = [
  {
    id: '1',
    tenant: 'John Doe',
    property: 'Sunset Apartments',
    unit: '101',
    startDate: new Date(2024, 0, 1),
    endDate: new Date(2025, 11, 31),
    monthlyRent: 2200,
    securityDeposit: 4400,
    status: 'active' as const,
    renewalStatus: 'pending' as const,
  },
  {
    id: '2',
    tenant: 'Jane Smith',
    property: 'Sunset Apartments',
    unit: '102',
    startDate: new Date(2024, 2, 1),
    endDate: new Date(2025, 1, 28),
    monthlyRent: 1500,
    securityDeposit: 3000,
    status: 'active' as const,
    renewalStatus: 'none' as const,
  },
  {
    id: '3',
    tenant: 'Mike Johnson',
    property: 'Sunset Apartments',
    unit: '104',
    startDate: new Date(2023, 6, 1),
    endDate: new Date(2024, 11, 15),
    monthlyRent: 2200,
    securityDeposit: 4400,
    status: 'expiring' as const,
    renewalStatus: 'offered' as const,
  },
  {
    id: '4',
    tenant: 'Sarah Williams',
    property: 'Downtown Condos',
    unit: '305',
    startDate: new Date(2024, 4, 1),
    endDate: new Date(2025, 3, 30),
    monthlyRent: 3200,
    securityDeposit: 6400,
    status: 'active' as const,
    renewalStatus: 'renewed' as const,
  },
  {
    id: '5',
    tenant: 'David Brown',
    property: 'Garden Houses',
    unit: '1A',
    startDate: new Date(2023, 0, 1),
    endDate: new Date(2024, 10, 1),
    monthlyRent: 2800,
    securityDeposit: 5600,
    status: 'expired' as const,
    renewalStatus: 'none' as const,
  },
]

export default function LeasesPage() {
  const [leases, setLeases] = React.useState(mockLeases)
  const [searchTerm, setSearchTerm] = React.useState('')
  const [statusFilter, setStatusFilter] = React.useState('all')

  const filteredLeases = React.useMemo(() => {
    return leases.filter((lease) => {
      const matchesSearch =
        lease.tenant.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lease.property.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lease.unit.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === 'all' || lease.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [leases, searchTerm, statusFilter])

  const stats = {
    active: leases.filter((l) => l.status === 'active').length,
    expiring: leases.filter((l) => l.status === 'expiring').length,
    expired: leases.filter((l) => l.status === 'expired').length,
    totalRevenue: leases.filter((l) => l.status === 'active').reduce((sum, l) => sum + l.monthlyRent, 0),
  }

  const getDaysUntilExpiry = (endDate: Date) => {
    const today = new Date()
    const diffTime = endDate.getTime() - today.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  return (
    <DashboardLayout
      title="Leases"
      actions={
        <Button variant="primary">
          <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Create Lease
        </Button>
      }
    >
      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-4 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-gray-500">Active Leases</div>
            <div className="mt-2 text-3xl font-semibold text-gray-900">{stats.active}</div>
            <div className="mt-2 text-sm text-success">Currently active</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-gray-500">Expiring Soon</div>
            <div className="mt-2 text-3xl font-semibold text-warning">{stats.expiring}</div>
            <div className="mt-2 text-sm text-gray-500">Within 60 days</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-gray-500">Expired</div>
            <div className="mt-2 text-3xl font-semibold text-danger">{stats.expired}</div>
            <div className="mt-2 text-sm text-gray-500">Need attention</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-gray-500">Monthly Revenue</div>
            <div className="mt-2 text-3xl font-semibold text-gray-900">
              {formatCurrency(stats.totalRevenue)}
            </div>
            <div className="mt-2 text-sm text-success">From active leases</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <Input
              type="search"
              placeholder="Search leases..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />

            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={[
                { value: 'all', label: 'All Statuses' },
                { value: 'active', label: 'Active' },
                { value: 'expiring', label: 'Expiring Soon' },
                { value: 'expired', label: 'Expired' },
              ]}
              className="w-40"
            />

            <div className="ml-auto text-sm text-gray-500">
              Showing {filteredLeases.length} of {leases.length} leases
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Leases List */}
      <Card>
        <CardContent className="p-6">
          {filteredLeases.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12">
              <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">No leases found</h3>
              <p className="mt-2 text-sm text-gray-500">
                {searchTerm || statusFilter !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Get started by creating your first lease'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-gray-200">
                  <tr>
                    <th className="pb-3 text-left text-sm font-semibold text-gray-900">Tenant</th>
                    <th className="pb-3 text-left text-sm font-semibold text-gray-900">Property & Unit</th>
                    <th className="pb-3 text-left text-sm font-semibold text-gray-900">Term</th>
                    <th className="pb-3 text-left text-sm font-semibold text-gray-900">Monthly Rent</th>
                    <th className="pb-3 text-left text-sm font-semibold text-gray-900">Security Deposit</th>
                    <th className="pb-3 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th className="pb-3 text-left text-sm font-semibold text-gray-900">Renewal</th>
                    <th className="pb-3 text-right text-sm font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredLeases.map((lease) => {
                    const daysUntilExpiry = getDaysUntilExpiry(lease.endDate)
                    return (
                      <tr key={lease.id} className="hover:bg-gray-50">
                        <td className="py-4 text-sm font-medium text-gray-900">{lease.tenant}</td>
                        <td className="py-4">
                          <div className="text-sm font-medium text-gray-900">{lease.property}</div>
                          <div className="text-sm text-gray-500">Unit {lease.unit}</div>
                        </td>
                        <td className="py-4">
                          <div className="text-sm text-gray-600">
                            {formatDate(lease.startDate, { month: 'short', day: 'numeric', year: 'numeric' })}
                          </div>
                          <div className="text-sm text-gray-600">
                            to {formatDate(lease.endDate, { month: 'short', day: 'numeric', year: 'numeric' })}
                          </div>
                          {lease.status === 'expiring' && (
                            <div className="mt-1 text-xs text-warning">
                              {daysUntilExpiry} days remaining
                            </div>
                          )}
                        </td>
                        <td className="py-4 text-sm font-medium text-gray-900">
                          {formatCurrency(lease.monthlyRent)}
                        </td>
                        <td className="py-4 text-sm text-gray-600">
                          {formatCurrency(lease.securityDeposit)}
                        </td>
                        <td className="py-4">
                          <Badge
                            variant={
                              lease.status === 'active'
                                ? 'success'
                                : lease.status === 'expiring'
                                ? 'warning'
                                : 'danger'
                            }
                          >
                            {lease.status}
                          </Badge>
                        </td>
                        <td className="py-4">
                          {lease.renewalStatus !== 'none' && (
                            <Badge
                              variant={
                                lease.renewalStatus === 'renewed'
                                  ? 'success'
                                  : lease.renewalStatus === 'offered'
                                  ? 'warning'
                                  : 'secondary'
                              }
                            >
                              {lease.renewalStatus}
                            </Badge>
                          )}
                        </td>
                        <td className="py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-900"
                              title="View lease"
                            >
                              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                            </button>
                            <button
                              className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-primary"
                              title="Renew lease"
                            >
                              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}
