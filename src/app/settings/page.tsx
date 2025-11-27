'use client'

import React from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { SubscriptionSettings } from '@/components/subscription/SubscriptionSettings'
import { CurrencySelector } from '@/components/ui/currency-selector'
import { useCurrency } from '@/contexts/CurrencyContext'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { DataTable } from '@/components/ui/data-table'
import { ColumnDef } from '@tanstack/react-table'

// User type definition
type User = {
  id: string
  name: string
  email: string
  role: 'superadmin' | 'property_manager' | 'accountant' | 'maintenance' | 'tenant'
  status: 'active' | 'inactive'
  lastLogin: Date
  avatar: string
  assignedProperties?: string[]
}

// Mock users data
const mockUsers = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@facilitypro.sa',
    role: 'superadmin' as const,
    status: 'active' as const,
    lastLogin: new Date(2025, 10, 23),
    avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=171717&color=fff',
  },
  {
    id: '2',
    name: 'Ahmed Al-Farsi',
    email: 'ahmed.farsi@facilitypro.sa',
    role: 'property_manager' as const,
    status: 'active' as const,
    lastLogin: new Date(2025, 10, 22),
    assignedProperties: ['Sunset Apartments', 'Downtown Condos'],
    avatar: 'https://ui-avatars.com/api/?name=Ahmed+Al-Farsi&background=22C55E&color=fff',
  },
  {
    id: '3',
    name: 'Fatima Al-Rashid',
    email: 'fatima.rashid@facilitypro.sa',
    role: 'maintenance' as const,
    status: 'active' as const,
    lastLogin: new Date(2025, 10, 23),
    avatar: 'https://ui-avatars.com/api/?name=Fatima+Al-Rashid&background=F59E0B&color=fff',
  },
  {
    id: '4',
    name: 'Sarah Al-Mutairi',
    email: 'sarah.mutairi@facilitypro.sa',
    role: 'accountant' as const,
    status: 'active' as const,
    lastLogin: new Date(2025, 10, 20),
    avatar: 'https://ui-avatars.com/api/?name=Sarah+Al-Mutairi&background=8B5CF6&color=fff',
  },
]

const roleConfig = {
  superadmin: {
    label: 'Superadmin',
    color: 'default' as const,
    permissions: ['All system access', 'User management', 'Settings configuration', 'Data export'],
  },
  property_manager: {
    label: 'Property Manager',
    color: 'success' as const,
    permissions: ['Manage properties', 'Manage tenants', 'Manage leases', 'Create work orders', 'View reports'],
  },
  accountant: {
    label: 'Accountant',
    color: 'secondary' as const,
    permissions: ['View all financial data', 'Process payments', 'Generate reports', 'Export financial statements'],
  },
  maintenance: {
    label: 'Maintenance Staff',
    color: 'warning' as const,
    permissions: ['View assigned work orders', 'Update work order status', 'Upload photos', 'View property details'],
  },
  tenant: {
    label: 'Tenant',
    color: 'secondary' as const,
    permissions: ['View own lease', 'Submit work orders', 'Make payments', 'View payment history'],
  },
}

// Column definitions for the users table
const userColumns: ColumnDef<User>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <input
        type="checkbox"
        checked={table.getIsAllPageRowsSelected()}
        onChange={(e) => table.toggleAllPageRowsSelected(!!e.target.checked)}
        className="h-4 w-4 rounded border-black/20 text-primary focus:ring-2 focus:ring-primary"
      />
    ),
    cell: ({ row }) => (
      <input
        type="checkbox"
        checked={row.getIsSelected()}
        onChange={(e) => row.toggleSelected(!!e.target.checked)}
        className="h-4 w-4 rounded border-black/20 text-primary focus:ring-2 focus:ring-primary"
      />
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'name',
    header: 'User',
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <img
          src={row.original.avatar}
          alt={row.original.name}
          className="h-10 w-10 rounded-full"
        />
        <div className="font-medium text-black">{row.original.name}</div>
      </div>
    ),
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: ({ row }) => (
      <div className="text-sm text-black/70">{row.original.email}</div>
    ),
  },
  {
    accessorKey: 'role',
    header: 'Role',
    cell: ({ row }) => (
      <Badge variant={roleConfig[row.original.role].color}>
        {roleConfig[row.original.role].label}
      </Badge>
    ),
  },
  {
    id: 'access',
    header: 'Access',
    cell: ({ row }) => (
      row.original.assignedProperties ? (
        <div className="text-sm text-black/70">
          {row.original.assignedProperties.length} properties
        </div>
      ) : (
        <span className="text-sm text-black/40">Full access</span>
      )
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <Badge variant={row.original.status === 'active' ? 'success' : 'secondary'}>
        {row.original.status}
      </Badge>
    ),
  },
  {
    id: 'actions',
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => (
      <div className="flex justify-end gap-2">
        <button
          className="rounded-lg p-2 text-black/40 hover:bg-black/[0.04] hover:text-primary transition-colors duration-150"
          title="Edit user"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
          </svg>
        </button>
        {row.original.role !== 'superadmin' && (
          <button
            className="rounded-lg p-2 text-black/40 hover:bg-black/[0.04] hover:text-danger transition-colors duration-150"
            title="Deactivate user"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
          </button>
        )}
      </div>
    ),
    enableSorting: false,
  },
]

export default function SettingsPage() {
  const [activeTab, setActiveTab] = React.useState<'users' | 'roles' | 'subscription' | 'general' | 'system'>('users')
  const [users, setUsers] = React.useState(mockUsers)
  const [selectedUsers, setSelectedUsers] = React.useState<User[]>([])

  // Check for subscription tab in URL
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const tab = params.get('tab')
    if (tab === 'subscription') {
      setActiveTab('subscription')
    }
  }, [])

  // Update URL when tab changes
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (activeTab !== 'users') {
      params.set('tab', activeTab)
    } else {
      params.delete('tab')
    }
    const newUrl = params.toString() ? `?${params.toString()}` : window.location.pathname
    window.history.replaceState({}, '', newUrl)
  }, [activeTab])

  return (
    <DashboardLayout
      title="Settings"
      actions={
        activeTab === 'users' && (
          <Button variant="primary">
            <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add User
          </Button>
        )
      }
    >
      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as typeof activeTab)}>
        <TabsList>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
          <TabsTrigger value="subscription">Subscription & Billing</TabsTrigger>
          <TabsTrigger value="general">General Settings</TabsTrigger>
          <TabsTrigger value="system">System Configuration</TabsTrigger>
        </TabsList>

        {/* User Management Tab */}
        <TabsContent value="users">
          <Card>
            <CardContent className="p-6">
              <DataTable
                columns={userColumns}
                data={users}
                searchKey="name"
                searchPlaceholder="Search users by name..."
                onRowSelectionChange={setSelectedUsers}
              />
              {selectedUsers.length > 0 && (
                <div className="mt-4 flex items-center justify-between rounded-lg border border-primary bg-primary/5 p-4">
                  <div className="text-sm font-medium text-black">
                    {selectedUsers.length} user(s) selected
                  </div>
                  <div className="flex gap-2">
                    <Button variant="secondary" size="sm">
                      Bulk Edit
                    </Button>
                    <Button variant="danger" size="sm">
                      Deactivate Selected
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Roles & Permissions Tab */}
        <TabsContent value="roles">
        <div className="grid gap-6 md:grid-cols-2">
          {Object.entries(roleConfig).map(([role, config]) => (
            <Card key={role}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{config.label}</CardTitle>
                  <Badge variant={config.color}>{role}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm font-medium text-black/70">Permissions:</div>
                  <ul className="space-y-2">
                    {config.permissions.map((permission) => (
                      <li key={permission} className="flex items-start gap-2 text-sm text-black/70">
                        <svg className="h-5 w-5 flex-shrink-0 text-success" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {permission}
                      </li>
                    ))}
                  </ul>
                  <div className="pt-4">
                    <Button variant="secondary" size="sm" className="w-full">
                      Edit Permissions
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        </TabsContent>

        {/* General Settings Tab */}
        <TabsContent value="general">
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input label="Company Name" value="Manara" />
              <Input label="Contact Email" value="info@facilitypro.sa" type="email" />
              <Input label="Phone Number" value="+966 11 234 5678" type="tel" />
              <div className="pt-4">
                <Button variant="primary">Save Changes</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Regional Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-black/70">
                  Currency
                </label>
                <CurrencySelector className="max-w-xs" />
                <p className="mt-1 text-xs text-black/50">
                  All monetary values will be displayed in the selected currency
                </p>
              </div>
              <Select
                label="Timezone"
                value="Asia/Riyadh"
                options={[
                  { value: 'Asia/Riyadh', label: 'Arabia Standard Time (GMT+3)' },
                  { value: 'UTC', label: 'UTC' },
                ]}
              />
              <Select
                label="Date Format"
                value="DD/MM/YYYY"
                options={[
                  { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
                  { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
                  { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
                ]}
              />
              <div className="pt-4">
                <Button variant="primary">Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </div>
        </TabsContent>

        {/* System Configuration Tab */}
        <TabsContent value="system">
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Email Notifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-black">Lease Expiry Notifications</div>
                  <div className="text-sm text-black/50">Send reminders 60, 30, and 7 days before lease expiry</div>
                </div>
                <input type="checkbox" defaultChecked className="h-5 w-5" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-black">Payment Due Reminders</div>
                  <div className="text-sm text-black/50">Send payment reminders to tenants</div>
                </div>
                <input type="checkbox" defaultChecked className="h-5 w-5" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-black">Work Order Updates</div>
                  <div className="text-sm text-black/50">Notify when work order status changes</div>
                </div>
                <input type="checkbox" defaultChecked className="h-5 w-5" />
              </div>
              <div className="pt-4">
                <Button variant="primary">Save Preferences</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>System Maintenance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="secondary" className="w-full">
                Export All Data
              </Button>
              <Button variant="secondary" className="w-full">
                Generate System Report
              </Button>
              <Button variant="danger" className="w-full">
                Reset to Factory Settings
              </Button>
            </CardContent>
          </Card>
        </div>
        </TabsContent>

        {/* Subscription & Billing Tab */}
        <TabsContent value="subscription">
          <SubscriptionSettings />
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  )
}
