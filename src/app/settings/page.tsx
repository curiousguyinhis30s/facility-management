'use client'

import React from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'

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

export default function SettingsPage() {
  const [activeTab, setActiveTab] = React.useState<'users' | 'roles' | 'general' | 'system'>('users')
  const [users, setUsers] = React.useState(mockUsers)

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
      <div className="mb-6 flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'users'
              ? 'border-b-2 border-primary text-gray-900'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          User Management
        </button>
        <button
          onClick={() => setActiveTab('roles')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'roles'
              ? 'border-b-2 border-primary text-gray-900'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          Roles & Permissions
        </button>
        <button
          onClick={() => setActiveTab('general')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'general'
              ? 'border-b-2 border-primary text-gray-900'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          General Settings
        </button>
        <button
          onClick={() => setActiveTab('system')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'system'
              ? 'border-b-2 border-primary text-gray-900'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          System Configuration
        </button>
      </div>

      {/* User Management Tab */}
      {activeTab === 'users' && (
        <Card>
          <CardContent className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-gray-200">
                  <tr>
                    <th className="pb-3 text-left text-sm font-semibold text-gray-900">User</th>
                    <th className="pb-3 text-left text-sm font-semibold text-gray-900">Email</th>
                    <th className="pb-3 text-left text-sm font-semibold text-gray-900">Role</th>
                    <th className="pb-3 text-left text-sm font-semibold text-gray-900">Access</th>
                    <th className="pb-3 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th className="pb-3 text-right text-sm font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <img src={user.avatar} alt={user.name} className="h-10 w-10 rounded-full" />
                          <div className="font-medium text-gray-900">{user.name}</div>
                        </div>
                      </td>
                      <td className="py-4 text-sm text-gray-600">{user.email}</td>
                      <td className="py-4">
                        <Badge variant={roleConfig[user.role].color}>
                          {roleConfig[user.role].label}
                        </Badge>
                      </td>
                      <td className="py-4">
                        {user.assignedProperties ? (
                          <div className="text-sm text-gray-600">
                            {user.assignedProperties.length} properties
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">Full access</span>
                        )}
                      </td>
                      <td className="py-4">
                        <Badge variant={user.status === 'active' ? 'success' : 'secondary'}>
                          {user.status}
                        </Badge>
                      </td>
                      <td className="py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-primary"
                            title="Edit user"
                          >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                            </svg>
                          </button>
                          {user.role !== 'superadmin' && (
                            <button
                              className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-danger"
                              title="Deactivate user"
                            >
                              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
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
          </CardContent>
        </Card>
      )}

      {/* Roles & Permissions Tab */}
      {activeTab === 'roles' && (
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
                  <div className="text-sm font-medium text-gray-700">Permissions:</div>
                  <ul className="space-y-2">
                    {config.permissions.map((permission) => (
                      <li key={permission} className="flex items-start gap-2 text-sm text-gray-600">
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
      )}

      {/* General Settings Tab */}
      {activeTab === 'general' && (
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input label="Company Name" value="FacilityPro" />
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
              <Select
                label="Currency"
                value="SAR"
                options={[
                  { value: 'SAR', label: 'Saudi Riyal (SAR)' },
                  { value: 'USD', label: 'US Dollar (USD)' },
                  { value: 'EUR', label: 'Euro (EUR)' },
                ]}
              />
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
      )}

      {/* System Configuration Tab */}
      {activeTab === 'system' && (
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Email Notifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">Lease Expiry Notifications</div>
                  <div className="text-sm text-gray-500">Send reminders 60, 30, and 7 days before lease expiry</div>
                </div>
                <input type="checkbox" defaultChecked className="h-5 w-5" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">Payment Due Reminders</div>
                  <div className="text-sm text-gray-500">Send payment reminders to tenants</div>
                </div>
                <input type="checkbox" defaultChecked className="h-5 w-5" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">Work Order Updates</div>
                  <div className="text-sm text-gray-500">Notify when work order status changes</div>
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
      )}
    </DashboardLayout>
  )
}
