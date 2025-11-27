'use client'

import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'

interface EmployeeFormProps {
  employee?: any
  onSubmit: (data: any) => void
  onClose: () => void
}

export function EmployeeForm({ employee, onSubmit, onClose }: EmployeeFormProps) {
  const [formData, setFormData] = React.useState({
    name: employee?.name || '',
    email: employee?.email || '',
    phone: employee?.phone || '',
    role: employee?.role || '',
    department: employee?.department || 'Operations',
    salary: employee?.salary || '',
    hireDate: employee?.hireDate ? employee.hireDate.toISOString().split('T')[0] : '',
    status: employee?.status || 'active',
    skills: employee?.skills?.join(', ') || '',
    certifications: employee?.certifications?.join(', ') || '',
    assignedProperties: employee?.assignedProperties?.join(', ') || '',
  })

  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800))

    const processedData = {
      ...formData,
      salary: parseFloat(formData.salary) || 0,
      hireDate: formData.hireDate ? new Date(formData.hireDate) : new Date(),
      skills: formData.skills.split(',').map((s: string) => s.trim()).filter(Boolean),
      certifications: formData.certifications.split(',').map((c: string) => c.trim()).filter(Boolean),
      assignedProperties: formData.assignedProperties.split(',').map((p: string) => p.trim()).filter(Boolean),
      avatar: employee?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=171717&color=fff`,
    }

    onSubmit(processedData)
    setIsSubmitting(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
        <CardHeader className="border-b border-black/[0.04]">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-semibold">
              {employee ? 'Edit Employee' : 'Add New Employee'}
            </CardTitle>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-black/40 hover:bg-black/[0.04] hover:text-black transition-colors"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </CardHeader>

        <CardContent className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-black">Basic Information</h3>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-black/70">
                    Full Name <span className="text-danger">*</span>
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ahmed Al-Farsi"
                    required
                    className="mt-1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black/70">
                    Email <span className="text-danger">*</span>
                  </label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="ahmed@facilitypro.sa"
                    required
                    className="mt-1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black/70">
                    Phone <span className="text-danger">*</span>
                  </label>
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+966 50 123 4567"
                    required
                    className="mt-1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black/70">
                    Hire Date <span className="text-danger">*</span>
                  </label>
                  <Input
                    type="date"
                    value={formData.hireDate}
                    onChange={(e) => setFormData({ ...formData, hireDate: e.target.value })}
                    required
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            {/* Job Details */}
            <div className="space-y-4 border-t border-black/[0.04] pt-4">
              <h3 className="text-sm font-semibold text-black">Job Details</h3>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-black/70">
                    Role <span className="text-danger">*</span>
                  </label>
                  <Input
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    placeholder="Property Manager"
                    required
                    className="mt-1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black/70">
                    Department <span className="text-danger">*</span>
                  </label>
                  <Select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    options={[
                      { value: 'Operations', label: 'Operations' },
                      { value: 'Maintenance', label: 'Maintenance' },
                      { value: 'Finance', label: 'Finance' },
                      { value: 'Admin', label: 'Admin' },
                    ]}
                    className="mt-1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black/70">
                    Monthly Salary (SAR) <span className="text-danger">*</span>
                  </label>
                  <Input
                    type="number"
                    value={formData.salary}
                    onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                    placeholder="15000"
                    required
                    className="mt-1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black/70">
                    Status
                  </label>
                  <Select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    options={[
                      { value: 'active', label: 'Active' },
                      { value: 'on_leave', label: 'On Leave' },
                      { value: 'inactive', label: 'Inactive' },
                    ]}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            {/* Skills & Certifications */}
            <div className="space-y-4 border-t border-black/[0.04] pt-4">
              <h3 className="text-sm font-semibold text-black">Skills & Certifications</h3>

              <div>
                <label className="block text-sm font-medium text-black/70">
                  Skills (comma separated)
                </label>
                <Input
                  value={formData.skills}
                  onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                  placeholder="HVAC, Plumbing, Electrical"
                  className="mt-1"
                />
                <p className="mt-1 text-xs text-black/50">Separate multiple skills with commas</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-black/70">
                  Certifications (comma separated)
                </label>
                <Input
                  value={formData.certifications}
                  onChange={(e) => setFormData({ ...formData, certifications: e.target.value })}
                  placeholder="Licensed Electrician, Safety Training"
                  className="mt-1"
                />
                <p className="mt-1 text-xs text-black/50">Separate multiple certifications with commas</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-black/70">
                  Assigned Properties (comma separated)
                </label>
                <Input
                  value={formData.assignedProperties}
                  onChange={(e) => setFormData({ ...formData, assignedProperties: e.target.value })}
                  placeholder="Sunset Apartments, Downtown Condos"
                  className="mt-1"
                />
                <p className="mt-1 text-xs text-black/50">Properties this employee manages</p>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-3 border-t border-black/[0.04] pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={isSubmitting}
                className="min-w-[120px]"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </div>
                ) : (
                  <>{employee ? 'Update Employee' : 'Add Employee'}</>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
