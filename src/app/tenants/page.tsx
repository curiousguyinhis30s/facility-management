'use client'

import React from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { formatCurrency, formatDate } from '@/lib/utils'

// Mock tenant data
const mockTenants = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@email.com',
    phone: '(555) 123-4567',
    property: 'Sunset Apartments',
    unit: '101',
    leaseStart: new Date(2024, 0, 1),
    leaseEnd: new Date(2025, 11, 31),
    monthlyRent: 2200,
    balance: 0,
    status: 'active' as const,
    avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=2563EB&color=fff',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@email.com',
    phone: '(555) 234-5678',
    property: 'Sunset Apartments',
    unit: '102',
    leaseStart: new Date(2024, 2, 1),
    leaseEnd: new Date(2025, 1, 28),
    monthlyRent: 1500,
    balance: 150,
    status: 'active' as const,
    avatar: 'https://ui-avatars.com/api/?name=Jane+Smith&background=10B981&color=fff',
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike.j@email.com',
    phone: '(555) 345-6789',
    property: 'Sunset Apartments',
    unit: '104',
    leaseStart: new Date(2023, 6, 1),
    leaseEnd: new Date(2024, 5, 30),
    monthlyRent: 2200,
    balance: -300,
    status: 'pending' as const,
    avatar: 'https://ui-avatars.com/api/?name=Mike+Johnson&background=F59E0B&color=fff',
  },
  {
    id: '4',
    name: 'Sarah Williams',
    email: 'sarah.w@email.com',
    phone: '(555) 456-7890',
    property: 'Downtown Condos',
    unit: '305',
    leaseStart: new Date(2024, 4, 1),
    leaseEnd: new Date(2025, 3, 30),
    monthlyRent: 3200,
    balance: 0,
    status: 'active' as const,
    avatar: 'https://ui-avatars.com/api/?name=Sarah+Williams&background=8B5CF6&color=fff',
  },
]

export default function TenantsPage() {
  const [tenants, setTenants] = React.useState(mockTenants)
  const [searchTerm, setSearchTerm] = React.useState('')
  const [statusFilter, setStatusFilter] = React.useState('all')

  const filteredTenants = React.useMemo(() => {
    return tenants.filter((tenant) => {
      const matchesSearch =
        tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tenant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tenant.property.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === 'all' || tenant.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [tenants, searchTerm, statusFilter])

  return (
    <DashboardLayout
      title="Tenants"
      actions={
        <Button variant="primary">
          <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Tenant
        </Button>
      }
    >
      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-4 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-gray-500">Total Tenants</div>
            <div className="mt-2 text-3xl font-semibold text-gray-900">{tenants.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-gray-500">Active Leases</div>
            <div className="mt-2 text-3xl font-semibold text-gray-900">
              {tenants.filter((t) => t.status === 'active').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-gray-500">Outstanding Balance</div>
            <div className="mt-2 text-3xl font-semibold text-danger">
              {formatCurrency(tenants.filter((t) => t.balance > 0).reduce((sum, t) => sum + t.balance, 0))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-gray-500">Pending Applications</div>
            <div className="mt-2 text-3xl font-semibold text-warning">
              {tenants.filter((t) => t.status === 'pending').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <Input
              type="search"
              placeholder="Search tenants..."
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
                { value: 'pending', label: 'Pending' },
                { value: 'inactive', label: 'Inactive' },
              ]}
              className="w-40"
            />

            <div className="ml-auto text-sm text-gray-500">
              Showing {filteredTenants.length} of {tenants.length} tenants
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tenants List */}
      <Card>
        <CardContent className="p-6">
          {filteredTenants.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12">
              <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
              </svg>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">No tenants found</h3>
              <p className="mt-2 text-sm text-gray-500">
                {searchTerm || statusFilter !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Get started by adding your first tenant'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-gray-200">
                  <tr>
                    <th className="pb-3 text-left text-sm font-semibold text-gray-900">Tenant</th>
                    <th className="pb-3 text-left text-sm font-semibold text-gray-900">Contact</th>
                    <th className="pb-3 text-left text-sm font-semibold text-gray-900">Property & Unit</th>
                    <th className="pb-3 text-left text-sm font-semibold text-gray-900">Lease</th>
                    <th className="pb-3 text-left text-sm font-semibold text-gray-900">Rent</th>
                    <th className="pb-3 text-left text-sm font-semibold text-gray-900">Balance</th>
                    <th className="pb-3 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th className="pb-3 text-right text-sm font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredTenants.map((tenant) => (
                    <tr key={tenant.id} className="hover:bg-gray-50">
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={tenant.avatar}
                            alt={tenant.name}
                            className="h-10 w-10 rounded-full"
                          />
                          <div>
                            <div className="font-medium text-gray-900">{tenant.name}</div>
                            <div className="text-sm text-gray-500">{tenant.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 text-sm text-gray-600">{tenant.phone}</td>
                      <td className="py-4">
                        <div className="text-sm font-medium text-gray-900">{tenant.property}</div>
                        <div className="text-sm text-gray-500">Unit {tenant.unit}</div>
                      </td>
                      <td className="py-4">
                        <div className="text-sm text-gray-600">
                          {formatDate(tenant.leaseStart, { month: 'short', year: 'numeric' })} -{' '}
                          {formatDate(tenant.leaseEnd, { month: 'short', year: 'numeric' })}
                        </div>
                      </td>
                      <td className="py-4 text-sm font-medium text-gray-900">
                        {formatCurrency(tenant.monthlyRent)}
                      </td>
                      <td className="py-4">
                        <span
                          className={`text-sm font-medium ${
                            tenant.balance > 0
                              ? 'text-danger'
                              : tenant.balance < 0
                              ? 'text-success'
                              : 'text-gray-600'
                          }`}
                        >
                          {tenant.balance === 0
                            ? 'Paid'
                            : tenant.balance > 0
                            ? formatCurrency(tenant.balance)
                            : formatCurrency(Math.abs(tenant.balance)) + ' credit'}
                        </span>
                      </td>
                      <td className="py-4">
                        <Badge
                          variant={
                            tenant.status === 'active'
                              ? 'success'
                              : tenant.status === 'pending'
                              ? 'warning'
                              : 'secondary'
                          }
                        >
                          {tenant.status}
                        </Badge>
                      </td>
                      <td className="py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-900"
                            title="View tenant"
                          >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          </button>
                          <button
                            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-primary"
                            title="Edit tenant"
                          >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                            </svg>
                          </button>
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
