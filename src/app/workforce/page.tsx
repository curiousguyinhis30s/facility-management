'use client'

import React from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { formatCurrency } from '@/lib/utils'
import { EmployeeForm } from '@/components/features/workforce/employee-form'
import { VendorForm } from '@/components/features/workforce/vendor-form'
import { useToast } from '@/components/ui/toast/toast'
import { saveToStorage, loadFromStorage, StorageKeys } from '@/lib/storage'
import { ConfirmationModal, useConfirmation } from '@/components/ui/confirmation-modal'
import { BulkActionsBar } from '@/components/ui/bulk-actions-bar'
import { exportToCSV, exportToPDF } from '@/lib/export'

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
  const { showToast } = useToast()
  const { confirmState, showConfirmation, hideConfirmation } = useConfirmation()
  const [view, setView] = React.useState<'employees' | 'vendors'>('employees')
  const [employees, setEmployees] = React.useState(() =>
    loadFromStorage(StorageKeys.EMPLOYEES, mockEmployees)
  )
  const [vendors, setVendors] = React.useState(() =>
    loadFromStorage(StorageKeys.VENDORS, mockVendors)
  )
  const [searchTerm, setSearchTerm] = React.useState('')
  const [departmentFilter, setDepartmentFilter] = React.useState('all')
  const [selectedIds, setSelectedIds] = React.useState<string[]>([])

  // Modal and editing state
  const [isEmployeeFormOpen, setIsEmployeeFormOpen] = React.useState(false)
  const [isVendorFormOpen, setIsVendorFormOpen] = React.useState(false)
  const [editingEmployee, setEditingEmployee] = React.useState<any>(null)
  const [editingVendor, setEditingVendor] = React.useState<any>(null)

  // Auto-save to localStorage whenever employees change
  React.useEffect(() => {
    saveToStorage(StorageKeys.EMPLOYEES, employees)
  }, [employees])

  // Auto-save to localStorage whenever vendors change
  React.useEffect(() => {
    saveToStorage(StorageKeys.VENDORS, vendors)
  }, [vendors])

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

  // Employee handlers
  const handleAddEmployee = () => {
    setEditingEmployee(null)
    setIsEmployeeFormOpen(true)
  }

  const handleEditEmployee = (employee: any) => {
    setEditingEmployee(employee)
    setIsEmployeeFormOpen(true)
  }

  const handleEmployeeSubmit = (data: any) => {
    if (editingEmployee) {
      // Update existing employee
      setEmployees(employees.map((e) => (e.id === editingEmployee.id ? { ...e, ...data } : e)))
      showToast('Employee updated successfully', 'success')
    } else {
      // Add new employee
      const newEmployee = {
        ...data,
        id: String(Date.now()),
      }
      setEmployees([...employees, newEmployee])
      showToast('Employee created successfully', 'success')
    }
    setIsEmployeeFormOpen(false)
    setEditingEmployee(null)
  }

  const handleDeleteEmployee = (id: string) => {
    showConfirmation({
      title: 'Delete Employee',
      message: 'Are you sure you want to delete this employee? This action cannot be undone.',
      confirmText: 'Delete',
      type: 'danger',
      onConfirm: () => {
        setEmployees(employees.filter((e) => e.id !== id))
        setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id))
        showToast('Employee deleted successfully', 'success')
      },
    })
  }

  // Vendor handlers
  const handleAddVendor = () => {
    setEditingVendor(null)
    setIsVendorFormOpen(true)
  }

  const handleEditVendor = (vendor: any) => {
    setEditingVendor(vendor)
    setIsVendorFormOpen(true)
  }

  const handleVendorSubmit = (data: any) => {
    if (editingVendor) {
      // Update existing vendor
      setVendors(vendors.map((v) => (v.id === editingVendor.id ? { ...v, ...data } : v)))
      showToast('Vendor updated successfully', 'success')
    } else {
      // Add new vendor
      const newVendor = {
        ...data,
        id: String(Date.now()),
      }
      setVendors([...vendors, newVendor])
      showToast('Vendor created successfully', 'success')
    }
    setIsVendorFormOpen(false)
    setEditingVendor(null)
  }

  const handleDeleteVendor = (id: string) => {
    showConfirmation({
      title: 'Delete Vendor',
      message: 'Are you sure you want to delete this vendor? This action cannot be undone.',
      confirmText: 'Delete',
      type: 'danger',
      onConfirm: () => {
        setVendors(vendors.filter((v) => v.id !== id))
        setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id))
        showToast('Vendor deleted successfully', 'success')
      },
    })
  }

  // Bulk handlers
  const handleBulkDelete = () => {
    const itemType = view === 'employees' ? 'employees' : 'vendors'
    showConfirmation({
      title: `Delete Multiple ${itemType.charAt(0).toUpperCase() + itemType.slice(1)}`,
      message: `Are you sure you want to delete ${selectedIds.length} ${itemType}? This action cannot be undone.`,
      confirmText: 'Delete All',
      type: 'danger',
      onConfirm: () => {
        if (view === 'employees') {
          setEmployees(employees.filter((e) => !selectedIds.includes(e.id)))
        } else {
          setVendors(vendors.filter((v) => !selectedIds.includes(v.id)))
        }
        setSelectedIds([])
        showToast(`${selectedIds.length} ${itemType} deleted successfully`, 'success')
      },
    })
  }

  const handleExportCSV = () => {
    if (view === 'employees') {
      const dataToExport = selectedIds.length > 0
        ? employees.filter((e) => selectedIds.includes(e.id))
        : employees

      exportToCSV(
        dataToExport,
        `employees-${new Date().toISOString().split('T')[0]}`,
        [
          { key: 'name', label: 'Name' },
          { key: 'email', label: 'Email' },
          { key: 'phone', label: 'Phone' },
          { key: 'role', label: 'Role' },
          { key: 'department', label: 'Department' },
          { key: 'salary', label: 'Salary' },
          { key: 'status', label: 'Status' },
        ]
      )
      showToast(`Exported ${dataToExport.length} employees to CSV`, 'success')
    } else {
      const dataToExport = selectedIds.length > 0
        ? vendors.filter((v) => selectedIds.includes(v.id))
        : vendors

      exportToCSV(
        dataToExport,
        `vendors-${new Date().toISOString().split('T')[0]}`,
        [
          { key: 'id', label: 'Vendor ID' },
          { key: 'name', label: 'Company Name' },
          { key: 'type', label: 'Service Type' },
          { key: 'contact', label: 'Contact Person' },
          { key: 'phone', label: 'Phone' },
          { key: 'email', label: 'Email' },
          { key: 'monthlyRate', label: 'Monthly Rate' },
          { key: 'status', label: 'Status' },
        ]
      )
      showToast(`Exported ${dataToExport.length} vendors to CSV`, 'success')
    }
  }

  const handleExportPDF = () => {
    if (view === 'employees') {
      const dataToExport = selectedIds.length > 0
        ? employees.filter((e) => selectedIds.includes(e.id))
        : employees

      exportToPDF(
        'Employees Report',
        dataToExport.map((e) => ({
          'Name': e.name,
          'Email': e.email,
          'Phone': e.phone,
          'Role': e.role,
          'Department': e.department,
          'Salary': formatCurrency(e.salary),
          'Status': e.status,
        })),
        `employees-report-${new Date().toISOString().split('T')[0]}`
      )
      showToast(`Exported ${dataToExport.length} employees to PDF`, 'success')
    } else {
      const dataToExport = selectedIds.length > 0
        ? vendors.filter((v) => selectedIds.includes(v.id))
        : vendors

      exportToPDF(
        'Vendors Report',
        dataToExport.map((v) => ({
          'Vendor ID': v.id,
          'Company Name': v.name,
          'Service Type': v.type,
          'Contact': v.contact,
          'Phone': v.phone,
          'Email': v.email,
          'Monthly Rate': formatCurrency(v.monthlyRate),
          'Status': v.status,
        })),
        `vendors-report-${new Date().toISOString().split('T')[0]}`
      )
      showToast(`Exported ${dataToExport.length} vendors to PDF`, 'success')
    }
  }

  // Clear selection when switching views
  React.useEffect(() => {
    setSelectedIds([])
  }, [view])

  return (
    <DashboardLayout
      title="Workforce Management"
      actions={
        <div className="flex gap-2">
          <Button variant="secondary" onClick={handleExportCSV} className="hidden sm:flex">
            <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Export CSV
          </Button>
          <Button variant="secondary" onClick={handleExportPDF} className="hidden sm:flex">
            <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
            Export PDF
          </Button>
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
          <Button
            variant="primary"
            onClick={view === 'employees' ? handleAddEmployee : handleAddVendor}
          >
            <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add {view === 'employees' ? 'Employee' : 'Vendor'}
          </Button>
        </div>
      }
    >
      {/* Stats - Compact */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 mb-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-black/50 uppercase tracking-wide">Total Employees</div>
                <div className="mt-1 text-2xl font-semibold text-black">{stats.totalEmployees}</div>
              </div>
              <div className="text-xs text-success">{stats.activeEmployees} active</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-black/50 uppercase tracking-wide">Active Vendors</div>
                <div className="mt-1 text-2xl font-semibold text-black">{stats.totalVendors}</div>
              </div>
              <div className="text-xs text-black/50">contractors</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-black/50 uppercase tracking-wide">Monthly Cost</div>
                <div className="mt-1 text-2xl font-semibold text-primary">
                  {formatCurrency(stats.monthlyCost)}
                </div>
              </div>
              <div className="text-xs text-black/50">total</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-black/50 uppercase tracking-wide">Departments</div>
                <div className="mt-1 text-2xl font-semibold text-black">4</div>
              </div>
              <div className="text-xs text-black/50">active</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters - Compact inline */}
      <div className="flex items-center gap-3 mb-4 px-3 py-2 bg-black/[0.02] rounded-lg border border-black/[0.06]">
        <Input
          type="search"
          placeholder={`Search ${view}...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-52 h-8 text-sm"
        />

        {view === 'employees' && (
          <Select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            options={[
              { value: 'all', label: 'All Depts' },
              { value: 'Operations', label: 'Operations' },
              { value: 'Maintenance', label: 'Maintenance' },
              { value: 'Finance', label: 'Finance' },
              { value: 'Admin', label: 'Admin' },
            ]}
            className="w-32 h-8 text-sm"
          />
        )}

        <span className="ml-auto text-xs text-black/50 whitespace-nowrap">
          {view === 'employees' ? filteredEmployees.length : filteredVendors.length} of{' '}
          {view === 'employees' ? employees.length : vendors.length}
        </span>
      </div>

      {/* Employees/Vendors List */}
      {view === 'employees' ? (
        <Card>
          <CardContent className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-black/[0.08]">
                  <tr>
                    <th className="w-12 pb-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.length === filteredEmployees.length && filteredEmployees.length > 0}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedIds(filteredEmployees.map((e) => e.id))
                          } else {
                            setSelectedIds([])
                          }
                        }}
                        className="h-4 w-4 rounded border-black/20 text-primary focus:ring-primary"
                      />
                    </th>
                    <th className="pb-3 text-left text-sm font-semibold text-black">Employee</th>
                    <th className="pb-3 text-left text-sm font-semibold text-black">Role</th>
                    <th className="pb-3 text-left text-sm font-semibold text-black">Department</th>
                    <th className="pb-3 text-left text-sm font-semibold text-black">Contact</th>
                    <th className="pb-3 text-left text-sm font-semibold text-black">Salary</th>
                    <th className="pb-3 text-left text-sm font-semibold text-black">Skills</th>
                    <th className="pb-3 text-left text-sm font-semibold text-black">Status</th>
                    <th className="pb-3 text-right text-sm font-semibold text-black">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/[0.08]">
                  {filteredEmployees.map((employee) => {
                    const isSelected = selectedIds.includes(employee.id)
                    return (
                    <tr key={employee.id} className="hover:bg-black/[0.02] transition-colors duration-100">
                      <td className="w-12">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedIds([...selectedIds, employee.id])
                            } else {
                              setSelectedIds(selectedIds.filter((id) => id !== employee.id))
                            }
                          }}
                          className="h-4 w-4 rounded border-black/20 text-primary focus:ring-primary"
                        />
                      </td>
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={employee.avatar}
                            alt={employee.name}
                            className="h-10 w-10 rounded-full"
                          />
                          <div>
                            <div className="font-medium text-black">{employee.name}</div>
                            <div className="text-sm text-black/50">{employee.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 text-sm text-black">{employee.role}</td>
                      <td className="py-4">
                        <Badge variant="secondary">{employee.department}</Badge>
                      </td>
                      <td className="py-4 text-sm text-black/70">{employee.phone}</td>
                      <td className="py-4 text-sm font-medium text-black">
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
                          <div className="text-xs text-black/50">
                            {employee.assignedProperties.length} properties
                          </div>
                        ) : (
                          <span className="text-sm text-black/40">-</span>
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
                            onClick={() => handleEditEmployee(employee)}
                            className="rounded-lg p-2 text-black/40 hover:bg-black/[0.04] hover:text-primary transition-colors duration-150"
                            title="Edit employee"
                          >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDeleteEmployee(employee.id)}
                            className="rounded-lg p-2 text-black/40 hover:bg-red-50 hover:text-danger transition-colors duration-150"
                            title="Delete employee"
                          >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
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
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-black/[0.08]">
                  <tr>
                    <th className="w-12 pb-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.length === filteredVendors.length && filteredVendors.length > 0}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedIds(filteredVendors.map((v) => v.id))
                          } else {
                            setSelectedIds([])
                          }
                        }}
                        className="h-4 w-4 rounded border-black/20 text-primary focus:ring-primary"
                      />
                    </th>
                    <th className="pb-3 text-left text-sm font-semibold text-black">Vendor ID</th>
                    <th className="pb-3 text-left text-sm font-semibold text-black">Company Name</th>
                    <th className="pb-3 text-left text-sm font-semibold text-black">Service Type</th>
                    <th className="pb-3 text-left text-sm font-semibold text-black">Contact Person</th>
                    <th className="pb-3 text-left text-sm font-semibold text-black">Phone</th>
                    <th className="pb-3 text-left text-sm font-semibold text-black">Monthly Rate</th>
                    <th className="pb-3 text-left text-sm font-semibold text-black">Status</th>
                    <th className="pb-3 text-right text-sm font-semibold text-black">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/[0.08]">
                  {filteredVendors.map((vendor) => {
                    const isSelected = selectedIds.includes(vendor.id)
                    return (
                    <tr key={vendor.id} className="hover:bg-black/[0.02] transition-colors duration-100">
                      <td className="w-12">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedIds([...selectedIds, vendor.id])
                            } else {
                              setSelectedIds(selectedIds.filter((id) => id !== vendor.id))
                            }
                          }}
                          className="h-4 w-4 rounded border-black/20 text-primary focus:ring-primary"
                        />
                      </td>
                      <td className="py-4 text-sm font-medium text-black">{vendor.id}</td>
                      <td className="py-4">
                        <div className="font-medium text-black">{vendor.name}</div>
                        <div className="text-sm text-black/50">{vendor.email}</div>
                      </td>
                      <td className="py-4">
                        <Badge variant="secondary">{vendor.type}</Badge>
                      </td>
                      <td className="py-4 text-sm text-black/70">{vendor.contact}</td>
                      <td className="py-4 text-sm text-black/70">{vendor.phone}</td>
                      <td className="py-4 text-sm font-medium text-black">
                        {formatCurrency(vendor.monthlyRate)}/mo
                      </td>
                      <td className="py-4">
                        <Badge variant="success">{vendor.status}</Badge>
                      </td>
                      <td className="py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEditVendor(vendor)}
                            className="rounded-lg p-2 text-black/40 hover:bg-black/[0.04] hover:text-primary transition-colors duration-150"
                            title="Edit vendor"
                          >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDeleteVendor(vendor.id)}
                            className="rounded-lg p-2 text-black/40 hover:bg-red-50 hover:text-danger transition-colors duration-150"
                            title="Delete vendor"
                          >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
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
          </CardContent>
        </Card>
      )}

      {/* Employee Form Modal */}
      {isEmployeeFormOpen && (
        <EmployeeForm
          employee={editingEmployee}
          onSubmit={handleEmployeeSubmit}
          onClose={() => {
            setIsEmployeeFormOpen(false)
            setEditingEmployee(null)
          }}
        />
      )}

      {/* Vendor Form Modal */}
      {isVendorFormOpen && (
        <VendorForm
          vendor={editingVendor}
          onSubmit={handleVendorSubmit}
          onClose={() => {
            setIsVendorFormOpen(false)
            setEditingVendor(null)
          }}
        />
      )}

      {selectedIds.length > 0 && (
        <BulkActionsBar
          selectedCount={selectedIds.length}
          onExportCSV={handleExportCSV}
          onExportPDF={handleExportPDF}
          onDelete={handleBulkDelete}
          onClearSelection={() => setSelectedIds([])}
        />
      )}

      <ConfirmationModal
        isOpen={confirmState.isOpen}
        title={confirmState.title}
        message={confirmState.message}
        confirmText={confirmState.confirmText}
        type={confirmState.type}
        onConfirm={() => {
          confirmState.onConfirm?.()
          hideConfirmation()
        }}
        onClose={hideConfirmation}
      />
    </DashboardLayout>
  )
}
