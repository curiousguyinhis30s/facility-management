'use client'

import React from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { formatDate } from '@/lib/utils'

// Mock maintenance schedule data
const mockMaintenanceSchedule = [
  {
    id: '1',
    title: 'HVAC System Inspection',
    property: 'Sunset Apartments',
    location: 'All Buildings',
    frequency: 'Quarterly' as const,
    lastCompleted: new Date(2025, 8, 15),
    nextDue: new Date(2025, 11, 15),
    assignedTo: 'HVAC Specialists Inc.',
    status: 'upcoming' as const,
    category: 'HVAC',
  },
  {
    id: '2',
    title: 'Fire Extinguisher Inspection',
    property: 'Downtown Condos',
    location: 'All Floors',
    frequency: 'Monthly' as const,
    lastCompleted: new Date(2025, 10, 1),
    nextDue: new Date(2025, 11, 1),
    assignedTo: 'Fire Safety Co.',
    status: 'upcoming' as const,
    category: 'Safety',
  },
  {
    id: '3',
    title: 'Elevator Maintenance',
    property: 'Downtown Condos',
    location: 'Main Elevator',
    frequency: 'Monthly' as const,
    lastCompleted: new Date(2025, 10, 18),
    nextDue: new Date(2025, 10, 26),
    assignedTo: 'Elevator Service Pro',
    status: 'overdue' as const,
    category: 'Elevator',
  },
  {
    id: '4',
    title: 'Pool Cleaning & Chemical Balance',
    property: 'Sunset Apartments',
    location: 'Rooftop Pool',
    frequency: 'Weekly' as const,
    lastCompleted: new Date(2025, 10, 20),
    nextDue: new Date(2025, 10, 27),
    assignedTo: 'Pool Maintenance Team',
    status: 'upcoming' as const,
    category: 'Pool',
  },
  {
    id: '5',
    title: 'Parking Lot Sweeping',
    property: 'Commerce Warehouse',
    location: 'Parking Area',
    frequency: 'Weekly' as const,
    lastCompleted: new Date(2025, 10, 21),
    nextDue: new Date(2025, 10, 28),
    assignedTo: 'Cleaning Services',
    status: 'scheduled' as const,
    category: 'Cleaning',
  },
  {
    id: '6',
    title: 'Landscape Maintenance',
    property: 'Garden Houses',
    location: 'Common Areas',
    frequency: 'Weekly' as const,
    lastCompleted: new Date(2025, 10, 22),
    nextDue: new Date(2025, 10, 29),
    assignedTo: 'Green Thumb Landscaping',
    status: 'upcoming' as const,
    category: 'Landscaping',
  },
]

export default function MaintenancePage() {
  const [schedule, setSchedule] = React.useState(mockMaintenanceSchedule)
  const [statusFilter, setStatusFilter] = React.useState('all')
  const [frequencyFilter, setFrequencyFilter] = React.useState('all')

  const filteredSchedule = React.useMemo(() => {
    return schedule.filter((item) => {
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter
      const matchesFrequency = frequencyFilter === 'all' || item.frequency === frequencyFilter
      return matchesStatus && matchesFrequency
    })
  }, [schedule, statusFilter, frequencyFilter])

  const stats = {
    total: schedule.length,
    upcoming: schedule.filter((s) => s.status === 'upcoming').length,
    overdue: schedule.filter((s) => s.status === 'overdue').length,
    scheduled: schedule.filter((s) => s.status === 'scheduled').length,
  }

  const getDaysUntil = (date: Date) => {
    const today = new Date()
    const diffTime = date.getTime() - today.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  return (
    <DashboardLayout
      title="Maintenance Schedule"
      actions={
        <Button variant="primary">
          <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Schedule
        </Button>
      }
    >
      {/* Mobile Stats */}
      <div className="grid grid-cols-3 gap-2 mb-4 md:hidden">
        <div className="bg-slate-50 rounded-lg p-3 text-center">
          <div className="text-xl font-bold">{stats.total}</div>
          <div className="text-[10px] text-black/50">Total</div>
        </div>
        <div className="bg-amber-50 rounded-lg p-3 text-center">
          <div className="text-xl font-bold text-amber-600">{stats.upcoming}</div>
          <div className="text-[10px] text-amber-700/60">Upcoming</div>
        </div>
        <div className="bg-red-50 rounded-lg p-3 text-center">
          <div className="text-xl font-bold text-red-600">{stats.overdue}</div>
          <div className="text-[10px] text-red-700/60">Overdue</div>
        </div>
      </div>

      {/* Desktop Stats */}
      <div className="hidden md:grid gap-6 md:grid-cols-4 mb-6">
        <Card><CardContent className="p-6"><div className="text-sm text-black/50">Total Tasks</div><div className="mt-2 text-3xl font-semibold text-black">{stats.total}</div></CardContent></Card>
        <Card><CardContent className="p-6"><div className="text-sm text-black/50">Upcoming</div><div className="mt-2 text-3xl font-semibold text-primary">{stats.upcoming}</div></CardContent></Card>
        <Card><CardContent className="p-6"><div className="text-sm text-black/50">Overdue</div><div className="mt-2 text-3xl font-semibold text-danger">{stats.overdue}</div></CardContent></Card>
        <Card><CardContent className="p-6"><div className="text-sm text-black/50">Scheduled</div><div className="mt-2 text-3xl font-semibold text-success">{stats.scheduled}</div></CardContent></Card>
      </div>

      {/* Mobile Filters */}
      <div className="flex gap-2 mb-4 md:hidden">
        <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} options={[{ value: 'all', label: 'Status' }, { value: 'upcoming', label: 'Upcoming' }, { value: 'overdue', label: 'Overdue' }, { value: 'scheduled', label: 'Scheduled' }]} className="flex-1 h-9 text-sm" />
        <Select value={frequencyFilter} onChange={(e) => setFrequencyFilter(e.target.value)} options={[{ value: 'all', label: 'Frequency' }, { value: 'Weekly', label: 'Weekly' }, { value: 'Monthly', label: 'Monthly' }, { value: 'Quarterly', label: 'Quarterly' }]} className="flex-1 h-9 text-sm" />
      </div>

      {/* Desktop Filters */}
      <Card className="mb-6 hidden md:block">
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} options={[{ value: 'all', label: 'All Statuses' }, { value: 'upcoming', label: 'Upcoming' }, { value: 'overdue', label: 'Overdue' }, { value: 'scheduled', label: 'Scheduled' }, { value: 'completed', label: 'Completed' }]} className="w-40" />
            <Select value={frequencyFilter} onChange={(e) => setFrequencyFilter(e.target.value)} options={[{ value: 'all', label: 'All Frequencies' }, { value: 'Weekly', label: 'Weekly' }, { value: 'Monthly', label: 'Monthly' }, { value: 'Quarterly', label: 'Quarterly' }, { value: 'Annually', label: 'Annually' }]} className="w-40" />
            <div className="ml-auto text-sm text-black/50">Showing {filteredSchedule.length} of {schedule.length} tasks</div>
          </div>
        </CardContent>
      </Card>

      {/* Mobile Card View */}
      <div className="space-y-3 md:hidden">
        {filteredSchedule.length === 0 ? (
          <Card><CardContent className="p-6 text-center text-sm text-black/50">No tasks found</CardContent></Card>
        ) : (
          filteredSchedule.map((task) => {
            const daysUntil = getDaysUntil(task.nextDue)
            return (
              <Card key={task.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-black truncate">{task.title}</div>
                      <div className="text-xs text-black/50">{task.property}</div>
                    </div>
                    <Badge variant={task.status === 'overdue' ? 'danger' : task.status === 'scheduled' ? 'success' : 'warning'}>
                      {task.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-black/[0.06]">
                    <div className="text-xs">
                      <span className="text-black/40">Due: </span>
                      <span className={task.status === 'overdue' ? 'text-red-600 font-medium' : ''}>{formatDate(task.nextDue, { month: 'short', day: 'numeric' })}</span>
                    </div>
                    <Badge variant="secondary" className="text-[10px]">{task.frequency}</Badge>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>

      {/* Desktop Table */}
      <Card className="hidden md:block">
        <CardContent className="p-6">
          {filteredSchedule.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12">
              <svg className="h-12 w-12 text-black/30" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
              </svg>
              <h3 className="mt-4 text-lg font-semibold text-black">No maintenance tasks found</h3>
              <p className="mt-2 text-sm text-black/50">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-black/[0.08]">
                  <tr>
                    <th className="pb-3 text-left text-sm font-semibold text-black">Task</th>
                    <th className="pb-3 text-left text-sm font-semibold text-black">Property</th>
                    <th className="pb-3 text-left text-sm font-semibold text-black">Category</th>
                    <th className="pb-3 text-left text-sm font-semibold text-black">Frequency</th>
                    <th className="pb-3 text-left text-sm font-semibold text-black">Last Completed</th>
                    <th className="pb-3 text-left text-sm font-semibold text-black">Next Due</th>
                    <th className="pb-3 text-left text-sm font-semibold text-black">Assigned To</th>
                    <th className="pb-3 text-left text-sm font-semibold text-black">Status</th>
                    <th className="pb-3 text-right text-sm font-semibold text-black">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/[0.08]">
                  {filteredSchedule.map((task) => {
                    const daysUntil = getDaysUntil(task.nextDue)
                    return (
                      <tr key={task.id} className="hover:bg-black/[0.02] transition-colors duration-100">
                        <td className="py-4">
                          <div className="font-medium text-black">{task.title}</div>
                          <div className="text-sm text-black/50">{task.location}</div>
                        </td>
                        <td className="py-4 text-sm text-black/70">{task.property}</td>
                        <td className="py-4">
                          <Badge variant="secondary">{task.category}</Badge>
                        </td>
                        <td className="py-4 text-sm text-black/70">{task.frequency}</td>
                        <td className="py-4 text-sm text-black/70">
                          {formatDate(task.lastCompleted, { month: 'short', day: 'numeric' })}
                        </td>
                        <td className="py-4">
                          <div className={`text-sm font-medium ${task.status === 'overdue' ? 'text-danger' : 'text-black'}`}>
                            {formatDate(task.nextDue, { month: 'short', day: 'numeric' })}
                          </div>
                          {daysUntil >= 0 ? (
                            <div className="text-xs text-black/50">in {daysUntil} days</div>
                          ) : (
                            <div className="text-xs text-danger">{Math.abs(daysUntil)} days overdue</div>
                          )}
                        </td>
                        <td className="py-4 text-sm text-black/70">{task.assignedTo}</td>
                        <td className="py-4">
                          <Badge
                            variant={
                              task.status === 'overdue'
                                ? 'danger'
                                : task.status === 'scheduled'
                                ? 'success'
                                : task.status === 'upcoming'
                                ? 'warning'
                                : 'secondary'
                            }
                          >
                            {task.status}
                          </Badge>
                        </td>
                        <td className="py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              className="rounded-lg p-2 text-black/40 hover:bg-black/[0.04] hover:text-success transition-colors duration-150"
                              title="Mark as complete"
                            >
                              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </button>
                            <button
                              className="rounded-lg p-2 text-black/40 hover:bg-black/[0.04] hover:text-primary transition-colors duration-150"
                              title="Edit schedule"
                            >
                              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
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
