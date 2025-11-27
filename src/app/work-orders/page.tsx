'use client'

import React from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { formatDate } from '@/lib/utils'

// Mock work order data
const mockWorkOrders = [
  {
    id: 'WO-001',
    title: 'HVAC Filter Replacement',
    description: 'Replace air filters in all units on 2nd floor',
    property: 'Sunset Apartments',
    unit: 'Building A - Common Area',
    priority: 'medium' as const,
    status: 'in_progress' as const,
    category: 'HVAC' as const,
    assignedTo: 'Mike Wilson',
    reportedBy: 'Property Manager',
    createdDate: new Date(2025, 10, 15),
    dueDate: new Date(2025, 10, 25),
  },
  {
    id: 'WO-002',
    title: 'Leaking Faucet - Unit 204',
    description: 'Kitchen faucet dripping continuously, needs immediate attention',
    property: 'Sunset Apartments',
    unit: '204',
    priority: 'high' as const,
    status: 'open' as const,
    category: 'Plumbing' as const,
    assignedTo: null,
    reportedBy: 'Sarah Smith (Tenant)',
    createdDate: new Date(2025, 10, 20),
    dueDate: new Date(2025, 10, 22),
  },
  {
    id: 'WO-003',
    title: 'Light Fixture Replacement',
    description: 'Replace broken light fixture in hallway',
    property: 'Downtown Condos',
    unit: '3rd Floor Hallway',
    priority: 'low' as const,
    status: 'completed' as const,
    category: 'Electrical' as const,
    assignedTo: 'John Davis',
    reportedBy: 'Building Manager',
    createdDate: new Date(2025, 10, 10),
    dueDate: new Date(2025, 10, 18),
    completedDate: new Date(2025, 10, 17),
  },
  {
    id: 'WO-004',
    title: 'Emergency: Water Leak in Basement',
    description: 'Major water leak detected in basement storage area',
    property: 'Commerce Warehouse',
    unit: 'Basement',
    priority: 'urgent' as const,
    status: 'in_progress' as const,
    category: 'Plumbing' as const,
    assignedTo: 'Emergency Team',
    reportedBy: 'Security Guard',
    createdDate: new Date(2025, 10, 22),
    dueDate: new Date(2025, 10, 22),
  },
  {
    id: 'WO-005',
    title: 'Paint Touch-up - Unit 105',
    description: 'Touch up wall paint after move-out',
    property: 'Sunset Apartments',
    unit: '105',
    priority: 'low' as const,
    status: 'scheduled' as const,
    category: 'Painting' as const,
    assignedTo: 'Painting Crew',
    reportedBy: 'Property Manager',
    createdDate: new Date(2025, 10, 18),
    dueDate: new Date(2025, 10, 28),
  },
]

export default function WorkOrdersPage() {
  const [workOrders, setWorkOrders] = React.useState(mockWorkOrders)
  const [searchTerm, setSearchTerm] = React.useState('')
  const [statusFilter, setStatusFilter] = React.useState('all')
  const [priorityFilter, setPriorityFilter] = React.useState('all')

  const filteredWorkOrders = React.useMemo(() => {
    return workOrders.filter((wo) => {
      const matchesSearch =
        wo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        wo.property.toLowerCase().includes(searchTerm.toLowerCase()) ||
        wo.id.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === 'all' || wo.status === statusFilter
      const matchesPriority = priorityFilter === 'all' || wo.priority === priorityFilter

      return matchesSearch && matchesStatus && matchesPriority
    })
  }, [workOrders, searchTerm, statusFilter, priorityFilter])

  const stats = {
    open: workOrders.filter((wo) => wo.status === 'open').length,
    inProgress: workOrders.filter((wo) => wo.status === 'in_progress').length,
    urgent: workOrders.filter((wo) => wo.priority === 'urgent').length,
    completed: workOrders.filter((wo) => wo.status === 'completed').length,
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'text-danger'
      case 'high':
        return 'text-warning'
      case 'medium':
        return 'text-primary'
      case 'low':
        return 'text-black/70'
      default:
        return 'text-black/70'
    }
  }

  return (
    <DashboardLayout
      title="Work Orders"
      actions={
        <Button variant="primary">
          <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Create Work Order
        </Button>
      }
    >
      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-4 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-black/50">Open</div>
            <div className="mt-2 text-3xl font-semibold text-black">{stats.open}</div>
            <div className="mt-2 text-sm text-black/50">Pending assignment</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-black/50">In Progress</div>
            <div className="mt-2 text-3xl font-semibold text-primary">{stats.inProgress}</div>
            <div className="mt-2 text-sm text-black/50">Currently active</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-black/50">Urgent</div>
            <div className="mt-2 text-3xl font-semibold text-danger">{stats.urgent}</div>
            <div className="mt-2 text-sm text-danger">Requires immediate attention</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-black/50">Completed</div>
            <div className="mt-2 text-3xl font-semibold text-success">{stats.completed}</div>
            <div className="mt-2 text-sm text-success">This month</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <Input
              type="search"
              placeholder="Search work orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />

            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={[
                { value: 'all', label: 'All Statuses' },
                { value: 'open', label: 'Open' },
                { value: 'scheduled', label: 'Scheduled' },
                { value: 'in_progress', label: 'In Progress' },
                { value: 'completed', label: 'Completed' },
              ]}
              className="w-40"
            />

            <Select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              options={[
                { value: 'all', label: 'All Priorities' },
                { value: 'urgent', label: 'Urgent' },
                { value: 'high', label: 'High' },
                { value: 'medium', label: 'Medium' },
                { value: 'low', label: 'Low' },
              ]}
              className="w-40"
            />

            <div className="ml-auto text-sm text-black/50">
              Showing {filteredWorkOrders.length} of {workOrders.length} work orders
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Work Orders List */}
      <div className="space-y-4">
        {filteredWorkOrders.length === 0 ? (
          <Card>
            <CardContent className="p-12">
              <div className="flex flex-col items-center justify-center">
                <svg className="h-12 w-12 text-black/30" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
                </svg>
                <h3 className="mt-4 text-lg font-semibold text-black">No work orders found</h3>
                <p className="mt-2 text-sm text-black/50">
                  {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all'
                    ? 'Try adjusting your search or filters'
                    : 'Get started by creating your first work order'}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredWorkOrders.map((wo) => (
            <Card key={wo.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-black">{wo.title}</h3>
                      <Badge
                        variant={
                          wo.status === 'completed'
                            ? 'success'
                            : wo.status === 'in_progress'
                            ? 'default'
                            : wo.status === 'scheduled'
                            ? 'warning'
                            : 'secondary'
                        }
                      >
                        {wo.status.replace('_', ' ')}
                      </Badge>
                      <span className={`text-sm font-medium uppercase ${getPriorityColor(wo.priority)}`}>
                        {wo.priority === 'urgent' && '🔴 '}
                        {wo.priority}
                      </span>
                    </div>

                    <p className="text-sm text-black/70 mb-4">{wo.description}</p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="text-black/50">Work Order ID</div>
                        <div className="font-medium text-black">{wo.id}</div>
                      </div>
                      <div>
                        <div className="text-black/50">Property</div>
                        <div className="font-medium text-black">{wo.property}</div>
                        <div className="text-black/50">{wo.unit}</div>
                      </div>
                      <div>
                        <div className="text-black/50">Category</div>
                        <div className="font-medium text-black">{wo.category}</div>
                      </div>
                      <div>
                        <div className="text-black/50">Assigned To</div>
                        <div className="font-medium text-black">{wo.assignedTo || 'Unassigned'}</div>
                      </div>
                      <div>
                        <div className="text-black/50">Reported By</div>
                        <div className="font-medium text-black">{wo.reportedBy}</div>
                      </div>
                      <div>
                        <div className="text-black/50">Created</div>
                        <div className="font-medium text-black">
                          {formatDate(wo.createdDate, { month: 'short', day: 'numeric' })}
                        </div>
                      </div>
                      <div>
                        <div className="text-black/50">Due Date</div>
                        <div className={`font-medium ${wo.priority === 'urgent' ? 'text-danger' : 'text-black'}`}>
                          {formatDate(wo.dueDate, { month: 'short', day: 'numeric' })}
                        </div>
                      </div>
                      {wo.completedDate && (
                        <div>
                          <div className="text-black/50">Completed</div>
                          <div className="font-medium text-success">
                            {formatDate(wo.completedDate, { month: 'short', day: 'numeric' })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 ml-4">
                    <button
                      className="rounded-lg p-2 text-black/40 hover:bg-black/[0.04] hover:text-black transition-colors duration-150"
                      title="View details"
                    >
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </button>
                    <button
                      className="rounded-lg p-2 text-black/40 hover:bg-black/[0.04] hover:text-primary transition-colors duration-150"
                      title="Edit work order"
                    >
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                      </svg>
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </DashboardLayout>
  )
}
