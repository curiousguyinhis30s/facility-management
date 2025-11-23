'use client'

import React from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { formatCurrency } from '@/lib/utils'

// Mock workforce data
const mockEmployees = [
  {
    id: '1',
    name: 'Ahmed Al-Farsi',
    email: 'ahmed.farsi@facilitypro.sa',
    phone: '+966 50 123 4567',
    role: 'Property Manager',
    department: 'Operations',
    status: 'active' as const,
    hireDate: new Date(2023, 0, 15),
    salary: 15000,
    assignedProperties: ['Sunset Apartments', 'Downtown Condos'],
    avatar: 'https://ui-avatars.com/api/?name=Ahmed+Al-Farsi&background=171717&color=fff',
  },
  {
    id: '2',
    name: 'Fatima Al-Rashid',
    email: 'fatima.rashid@facilitypro.sa',
    phone: '+966 55 234 5678',
    role: 'Maintenance Supervisor',
    department: 'Maintenance',
    status: 'active' as const,
    hireDate: new Date(2023, 2, 1),
    salary: 12000,
    skills: ['HVAC', 'Plumbing', 'Electrical'],
    avatar: 'https://ui-avatars.com/api/?name=Fatima+Al-Rashid&background=22C55E&color=fff',
  },
  {
    id: '3',
    name: 'Mohammed bin Saleh',
    email: 'mohammed.saleh@facilitypro.sa',
    phone: '+966 50 345 6789',
    role: 'Electrician',
    department: 'Maintenance',
    status: 'active' as const,
    hireDate: new Date(2023, 5, 10),
    salary: 8000,
    skills: ['Electrical', 'Solar Panels'],
    certifications: ['Licensed Electrician', 'Safety Training'],
    avatar: 'https://ui-avatars.com/api/?name=Mohammed+Saleh&background=F59E0B&color=fff',
  },
  {
    id: '4',
    name: 'Sarah Al-Mutairi',
    email: 'sarah.mutairi@facilitypro.sa',
    phone: '+966 55 456 7890',
    role: 'Accountant',
    department: 'Finance',
    status: 'active' as const,
    hireDate: new Date(2022, 10, 1),
    salary: 13000,
    avatar: 'https://ui-avatars.com/api/?name=Sarah+Al-Mutairi&background=8B5CF6&color=fff',
  },
  {
    id: '5',
    name: 'Khalid Al-Otaibi',
    email: 'khalid.otaibi@facilitypro.sa',
    phone: '+966 50 567 8901',
    role: 'Plumber',
    department: 'Maintenance',
    status: 'on_leave' as const,
    hireDate: new Date(2023, 8, 1),
    salary: 7500,
    skills: ['Plumbing', 'Pipe Fitting'],
    avatar: 'https://ui-avatars.com/api/?name=Khalid+Al-Otaibi&background=EF4444&color=fff',
  },
]

// Mock vendors/contractors
const mockVendors = [
  {
    id: 'V1',
    name: 'Saudi HVAC Specialists',
    type: 'HVAC Services',
    contact: 'Ali Hassan',
    phone: '+966 11 234 5678',
    email: 'info@saudihvac.sa',
    status: 'active' as const,
    monthlyRate: 5000,
  },
  {
    id: 'V2',
    name: 'Green Landscape Co.',
    type: 'Landscaping',
    contact: 'Ibrahim Al-Zahrani',
    phone: '+966 12 345 6789',
    email: 'contact@greenlandscape.sa',
    status: 'active' as const,
    monthlyRate: 3500,
  },
  {
    id: 'V3',
    name: 'Elite Cleaning Services',
    type: 'Cleaning',
    contact: 'Maha Al-Qahtani',
    phone: '+966 13 456 7890',
    email: 'service@eliteclean.sa',
    status: 'active' as const,
    monthlyRate: 4200,
  },
]

export default function WorkforcePage() {
  const [view, setView] = React.useState<'employees' | 'vendors'>('employees')
  const [employees, setEmployees] = React.useState(mockEmployees)
  const [vendors, setVendors] = React.useState(mockVendors)
  const [searchTerm, setSearchTerm] = React.useState('')
  const [departmentFilter, setDepartmentFilter] = React.useState('all')

  const filteredEmployees = React.useMemo(() => {
    return employees.filter((emp) => {
      const matchesSearch =
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.role.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesDepartment = departmentFilter === 'all' || emp.department === departmentFilter

      return matchesSearch && matchesDepartment
    })
  }, [employees, searchTerm, departmentFilter])

  const filteredVendors = React.useMemo(() => {
    return vendors.filter((vendor) => {
      const matchesSearch =
        vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.type.toLowerCase().includes(searchTerm.toLowerCase())
      return matchesSearch
    })
  }, [vendors, searchTerm])

  const stats = {
    totalEmployees: employees.length,
    activeEmployees: employees.filter((e) => e.status === 'active').length,
    totalVendors: vendors.length,
    monthlyCost: employees.reduce((sum, e) => sum + e.salary, 0) + vendors.reduce((sum, v) => sum + v.monthlyRate, 0),
  }

  return (
    <DashboardLayout
      title="Workforce Management"
      actions={
        <div className="flex gap-2">
          <Button
            variant={view === 'employees' ? 'primary' : 'secondary'}
            onClick={() => setView('employees')}
          >
            Employees
          </Button>
          <Button
            variant={view === 'vendors' ? 'primary' : 'secondary'}
            onClick={() => setView('vendors')}
          >
            Vendors
          </Button>
          <Button variant="primary">
            <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add {view === 'employees' ? 'Employee' : 'Vendor'}
          </Button>
        </div>
      }
    >
      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-4 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-gray-500">Total Employees</div>
            <div className="mt-2 text-3xl font-semibold text-gray-900">{stats.totalEmployees}</div>
            <div className="mt-2 text-sm text-success">{stats.activeEmployees} active</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-gray-500">Active Vendors</div>
            <div className="mt-2 text-3xl font-semibold text-gray-900">{stats.totalVendors}</div>
            <div className="mt-2 text-sm text-gray-500">Service contractors</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-gray-500">Monthly Workforce Cost</div>
            <div className="mt-2 text-3xl font-semibold text-gray-900">
              {formatCurrency(stats.monthlyCost)}
            </div>
            <div className="mt-2 text-sm text-gray-500">Salaries + contracts</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-gray-500">Departments</div>
            <div className="mt-2 text-3xl font-semibold text-gray-900">4</div>
            <div className="mt-2 text-sm text-gray-500">Operations, Maintenance, Finance, Admin</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <Input
              type="search"
              placeholder={`Search ${view}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />

            {view === 'employees' && (
              <Select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                options={[
                  { value: 'all', label: 'All Departments' },
                  { value: 'Operations', label: 'Operations' },
                  { value: 'Maintenance', label: 'Maintenance' },
                  { value: 'Finance', label: 'Finance' },
                  { value: 'Admin', label: 'Admin' },
                ]}
                className="w-48"
              />
            )}

            <div className="ml-auto text-sm text-gray-500">
              Showing {view === 'employees' ? filteredEmployees.length : filteredVendors.length} of{' '}
              {view === 'employees' ? employees.length : vendors.length} {view}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Employees/Vendors List */}
      {view === 'employees' ? (
        <Card>
          <CardContent className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-gray-200">
                  <tr>
                    <th className="pb-3 text-left text-sm font-semibold text-gray-900">Employee</th>
                    <th className="pb-3 text-left text-sm font-semibold text-gray-900">Role</th>
                    <th className="pb-3 text-left text-sm font-semibold text-gray-900">Department</th>
                    <th className="pb-3 text-left text-sm font-semibold text-gray-900">Contact</th>
                    <th className="pb-3 text-left text-sm font-semibold text-gray-900">Salary</th>
                    <th className="pb-3 text-left text-sm font-semibold text-gray-900">Skills</th>
                    <th className="pb-3 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th className="pb-3 text-right text-sm font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredEmployees.map((employee) => (
                    <tr key={employee.id} className="hover:bg-gray-50">
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={employee.avatar}
                            alt={employee.name}
                            className="h-10 w-10 rounded-full"
                          />
                          <div>
                            <div className="font-medium text-gray-900">{employee.name}</div>
                            <div className="text-sm text-gray-500">{employee.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 text-sm text-gray-900">{employee.role}</td>
                      <td className="py-4">
                        <Badge variant="secondary">{employee.department}</Badge>
                      </td>
                      <td className="py-4 text-sm text-gray-600">{employee.phone}</td>
                      <td className="py-4 text-sm font-medium text-gray-900">
                        {formatCurrency(employee.salary)}/mo
                      </td>
                      <td className="py-4">
                        {employee.skills ? (
                          <div className="flex flex-wrap gap-1">
                            {employee.skills.slice(0, 2).map((skill) => (
                              <Badge key={skill} variant="secondary" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                            {employee.skills.length > 2 && (
                              <Badge variant="secondary" className="text-xs">
                                +{employee.skills.length - 2}
                              </Badge>
                            )}
                          </div>
                        ) : employee.assignedProperties ? (
                          <div className="text-xs text-gray-500">
                            {employee.assignedProperties.length} properties
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">-</span>
                        )}
                      </td>
                      <td className="py-4">
                        <Badge
                          variant={employee.status === 'active' ? 'success' : 'warning'}
                        >
                          {employee.status.replace('_', ' ')}
                        </Badge>
                      </td>
                      <td className="py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-900"
                            title="View employee"
                          >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          </button>
                          <button
                            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-primary"
                            title="Edit employee"
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
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-gray-200">
                  <tr>
                    <th className="pb-3 text-left text-sm font-semibold text-gray-900">Vendor ID</th>
                    <th className="pb-3 text-left text-sm font-semibold text-gray-900">Company Name</th>
                    <th className="pb-3 text-left text-sm font-semibold text-gray-900">Service Type</th>
                    <th className="pb-3 text-left text-sm font-semibold text-gray-900">Contact Person</th>
                    <th className="pb-3 text-left text-sm font-semibold text-gray-900">Phone</th>
                    <th className="pb-3 text-left text-sm font-semibold text-gray-900">Monthly Rate</th>
                    <th className="pb-3 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th className="pb-3 text-right text-sm font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredVendors.map((vendor) => (
                    <tr key={vendor.id} className="hover:bg-gray-50">
                      <td className="py-4 text-sm font-medium text-gray-900">{vendor.id}</td>
                      <td className="py-4">
                        <div className="font-medium text-gray-900">{vendor.name}</div>
                        <div className="text-sm text-gray-500">{vendor.email}</div>
                      </td>
                      <td className="py-4">
                        <Badge variant="secondary">{vendor.type}</Badge>
                      </td>
                      <td className="py-4 text-sm text-gray-600">{vendor.contact}</td>
                      <td className="py-4 text-sm text-gray-600">{vendor.phone}</td>
                      <td className="py-4 text-sm font-medium text-gray-900">
                        {formatCurrency(vendor.monthlyRate)}/mo
                      </td>
                      <td className="py-4">
                        <Badge variant="success">{vendor.status}</Badge>
                      </td>
                      <td className="py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-900"
                            title="View vendor"
                          >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          </button>
                          <button
                            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-primary"
                            title="Edit vendor"
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
          </CardContent>
        </Card>
      )}
    </DashboardLayout>
  )
}
