'use client'

import React from 'react'
import { useParams, useRouter } from 'next/navigation'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatCurrency, formatDate } from '@/lib/utils'

// Enhanced mock work order data
const mockWorkOrder = {
  id: 'WO-2024-0347',
  title: 'AC Unit Not Cooling - Master Bedroom',
  description: 'Air conditioning in master bedroom is running but not cooling properly. Temperature remains at 28°C even when set to 18°C.',

  // Request Details
  request: {
    submittedBy: {
      id: 'T1',
      name: 'Mohammed Al-Dosari',
      phone: '+966 55 987 6543',
      email: 'mohammed.dosari@email.sa',
      type: 'tenant' as const,
    },
    submittedDate: new Date(2024, 8, 15, 14, 30),
    priority: 'high' as const,
    category: 'HVAC',
    locationInUnit: 'Master Bedroom',
    issueType: 'Not Working',
    impactLevel: 'Comfort Issue - High Priority',
    tenantAvailability: [
      { date: new Date(2024, 8, 16), times: '8 AM - 12 PM, 4 PM - 8 PM' },
      { date: new Date(2024, 8, 17), times: 'All day' },
    ],
    preferredResolutionTime: '24-48 hours',
  },

  // Property & Unit Information
  property: {
    id: 'P1',
    name: 'Sunset Apartments',
    address: '123 King Fahd Road, Riyadh',
  },
  unit: {
    id: 'U405',
    number: '405',
    type: '2BR',
    floor: 4,
  },

  // Photos - Before
  photosBefore: [
    {
      id: 'PB1',
      url: 'https://images.unsplash.com/photo-1631545806609-4b0e8b4b3702?w=400&h=300&fit=crop',
      caption: 'AC thermostat showing 28°C',
      uploadedBy: 'Mohammed Al-Dosari',
      uploadedDate: new Date(2024, 8, 15, 14, 35),
    },
    {
      id: 'PB2',
      url: 'https://images.unsplash.com/photo-1635427962950-e6fc1c0d3e46?w=400&h=300&fit=crop',
      caption: 'AC unit exterior - no visible damage',
      uploadedBy: 'Mohammed Al-Dosari',
      uploadedDate: new Date(2024, 8, 15, 14, 36),
    },
  ],

  // Assignment Details
  assignment: {
    assignedTo: {
      id: 'V1',
      name: 'Cool Breeze HVAC Services',
      type: 'vendor' as const,
      phone: '+966 11 234 5678',
      email: 'service@coolbreezehvac.sa',
      specialization: 'HVAC Systems',
    },
    assignedBy: 'Ahmed Al-Farsi (Property Manager)',
    assignedDate: new Date(2024, 8, 15, 15, 0),
    technician: {
      name: 'Khalid Al-Mutairi',
      phone: '+966 55 876 5432',
      certification: 'Certified HVAC Technician',
    },
    estimatedCost: {
      labor: 500,
      parts: 1200,
      total: 1700,
    },
    approvedBudget: 2000,
    scheduledDate: new Date(2024, 8, 16, 9, 0),
    estimatedCompletionTime: '3-4 hours',
    partsRequired: [
      { name: 'Compressor Capacitor', quantity: 1, cost: 800 },
      { name: 'Refrigerant R-410A', quantity: 2, unit: 'kg', cost: 400 },
    ],
  },

  // Work Progress
  progress: {
    status: 'completed' as const,
    startedDate: new Date(2024, 8, 16, 9, 15),
    completedDate: new Date(2024, 8, 16, 12, 30),
    timeSpent: 3.25, // hours
    workPerformed: [
      { time: '09:15', action: 'Arrived on site, met with tenant' },
      { time: '09:30', action: 'Diagnosed issue - faulty compressor capacitor' },
      { time: '09:45', action: 'Ordered replacement part from warehouse' },
      { time: '10:30', action: 'Part arrived, began installation' },
      { time: '11:15', action: 'Replaced capacitor, refilled refrigerant' },
      { time: '11:45', action: 'Tested system - cooling properly' },
      { time: '12:00', action: 'Cleaned work area, explained repair to tenant' },
      { time: '12:30', action: 'Work completed, tenant signed off' },
    ],
  },

  // Completion Details
  completion: {
    actualCost: {
      labor: 500,
      parts: 1150,
      total: 1650,
    },
    partsUsed: [
      { name: 'Compressor Capacitor - 35/5 MFD', quantity: 1, cost: 750 },
      { name: 'Refrigerant R-410A', quantity: 1.5, unit: 'kg', cost: 400 },
    ],
    warrantyOnWork: {
      duration: 6,
      unit: 'months',
      expiryDate: new Date(2025, 2, 16),
      covered: 'Parts and labor for capacitor replacement',
    },
    tenantSatisfaction: {
      rating: 5,
      feedback: 'Excellent service! Khalid was professional, explained everything clearly, and fixed the issue quickly. AC is working perfectly now.',
      ratedDate: new Date(2024, 8, 16, 12, 35),
    },
    followUpRequired: false,
    followUpDate: null,
  },

  // Photos - After
  photosAfter: [
    {
      id: 'PA1',
      url: 'https://images.unsplash.com/photo-1635427962950-e6fc1c0d3e46?w=400&h=300&fit=crop',
      caption: 'New capacitor installed',
      uploadedBy: 'Khalid Al-Mutairi (Technician)',
      uploadedDate: new Date(2024, 8, 16, 11, 50),
    },
    {
      id: 'PA2',
      url: 'https://images.unsplash.com/photo-1631545806609-4b0e8b4b3702?w=400&h=300&fit=crop',
      caption: 'Thermostat showing 20°C - cooling achieved',
      uploadedBy: 'Khalid Al-Mutairi (Technician)',
      uploadedDate: new Date(2024, 8, 16, 12, 0),
    },
    {
      id: 'PA3',
      url: 'https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=400&h=300&fit=crop',
      caption: 'Work area cleaned, no debris',
      uploadedBy: 'Khalid Al-Mutairi (Technician)',
      uploadedDate: new Date(2024, 8, 16, 12, 10),
    },
  ],

  // Communication Trail
  communications: [
    {
      id: 'C1',
      date: new Date(2024, 8, 15, 14, 30),
      from: 'Mohammed Al-Dosari (Tenant)',
      to: 'Property Management',
      type: 'Work Order Submission',
      message: 'Submitted work order via tenant portal',
    },
    {
      id: 'C2',
      date: new Date(2024, 8, 15, 14, 45),
      from: 'System',
      to: 'Mohammed Al-Dosari',
      type: 'Auto-Notification',
      message: 'Work order WO-2024-0347 received. Reference number sent via SMS.',
    },
    {
      id: 'C3',
      date: new Date(2024, 8, 15, 15, 0),
      from: 'Ahmed Al-Farsi (Property Manager)',
      to: 'Cool Breeze HVAC Services',
      type: 'Assignment',
      message: 'Work order assigned. Scheduled for tomorrow 9 AM.',
    },
    {
      id: 'C4',
      date: new Date(2024, 8, 15, 16, 30),
      from: 'Cool Breeze HVAC Services',
      to: 'Mohammed Al-Dosari',
      type: 'Confirmation Call',
      message: 'Technician Khalid will arrive tomorrow at 9 AM. Confirmed availability.',
    },
    {
      id: 'C5',
      date: new Date(2024, 8, 16, 9, 0),
      from: 'Khalid Al-Mutairi (Technician)',
      to: 'Mohammed Al-Dosari',
      type: 'Arrival Notification',
      message: 'Arrived at Unit 405. Beginning diagnosis.',
    },
    {
      id: 'C6',
      date: new Date(2024, 8, 16, 12, 30),
      from: 'System',
      to: 'Mohammed Al-Dosari',
      type: 'Completion Notification',
      message: 'Work completed. Please rate your experience.',
    },
  ],

  // Internal Notes
  internalNotes: [
    {
      id: 'N1',
      date: new Date(2024, 8, 15, 15, 5),
      author: 'Ahmed Al-Farsi',
      note: 'High priority - tenant has young children. Assigned to our most reliable HVAC vendor.',
    },
    {
      id: 'N2',
      date: new Date(2024, 8, 16, 12, 35),
      author: 'Ahmed Al-Farsi',
      note: 'Excellent work by Cool Breeze. Tenant very satisfied. Update vendor performance rating.',
    },
  ],

  // Cost Variance Analysis
  costAnalysis: {
    budgetVariance: -350, // Under budget
    variancePercentage: -17.5,
    reasonForVariance: 'Used less refrigerant than estimated (1.5kg vs 2kg). Saved on labor time due to efficient technician.',
  },
}

export default function WorkOrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [activeTab, setActiveTab] = React.useState<'overview' | 'progress' | 'photos' | 'costs' | 'communications' | 'completion'>('overview')
  const workOrder = mockWorkOrder

  const priorityColors = {
    low: 'secondary' as const,
    medium: 'warning' as const,
    high: 'danger' as const,
    urgent: 'danger' as const,
  }

  const statusColors = {
    pending: 'secondary' as const,
    assigned: 'warning' as const,
    in_progress: 'warning' as const,
    completed: 'success' as const,
    cancelled: 'secondary' as const,
  }

  return (
    <DashboardLayout
      title={`Work Order ${workOrder.id}`}
      actions={
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => router.push(`/tenants/${workOrder.request.submittedBy.id}`)}>
            <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
            View Tenant
          </Button>
          <Button variant="secondary" onClick={() => router.push(`/properties/${workOrder.property.id}`)}>
            <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
            </svg>
            View Property
          </Button>
          <Button variant="primary">
            <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z" />
            </svg>
            Print Report
          </Button>
        </div>
      }
    >
      {/* Status Header */}
      <Card className={`mb-6 ${workOrder.progress.status === 'completed' ? 'border-success bg-success/5' : 'border-warning bg-warning/5'}`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <Badge variant={statusColors[workOrder.progress.status]} className="text-base">
                  {workOrder.progress.status.toUpperCase().replace('_', ' ')}
                </Badge>
              </div>
              <div className="h-8 w-px bg-black/[0.12]" />
              <div>
                <div className="text-sm text-black/60">Priority</div>
                <Badge variant={priorityColors[workOrder.request.priority]} className="mt-1">
                  {workOrder.request.priority.toUpperCase()}
                </Badge>
              </div>
              <div className="h-8 w-px bg-black/[0.12]" />
              <div>
                <div className="text-sm text-black/60">Category</div>
                <div className="mt-1 font-semibold text-black">{workOrder.request.category}</div>
              </div>
            </div>
            {workOrder.progress.status === 'completed' && (
              <div className="text-right">
                <div className="text-sm text-black/60">Completed in</div>
                <div className="mt-1 text-2xl font-bold text-success">{workOrder.progress.timeSpent} hours</div>
                <div className="text-sm text-black/60">
                  {formatDate(workOrder.progress.completedDate!)}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tab Navigation */}
      <div className="mb-6 flex gap-2 border-b border-black/[0.08]">
        {[
          { id: 'overview', label: '📋 Overview' },
          { id: 'progress', label: '⚙️ Work Progress' },
          { id: 'photos', label: '📸 Before/After Photos' },
          { id: 'costs', label: '💰 Cost Analysis' },
          { id: 'communications', label: '💬 Communications' },
          { id: 'completion', label: '✅ Completion Details' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'border-b-2 border-primary text-black'
                : 'text-black/50 hover:text-black'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="grid gap-6">
          {/* Work Order Details */}
          <Card>
            <CardHeader>
              <CardTitle>{workOrder.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="text-sm font-semibold text-black/70">Description</div>
                  <div className="mt-2 text-black">{workOrder.description}</div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <div className="text-sm font-semibold text-black/70">Location</div>
                    <div className="mt-2 space-y-1">
                      <div className="font-medium text-black">{workOrder.property.name}</div>
                      <div className="text-sm text-black/60">{workOrder.property.address}</div>
                      <div className="mt-2 flex gap-2">
                        <Badge variant="secondary">Unit {workOrder.unit.number}</Badge>
                        <Badge variant="secondary">Floor {workOrder.unit.floor}</Badge>
                        <Badge variant="secondary">{workOrder.request.locationInUnit}</Badge>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-semibold text-black/70">Request Details</div>
                    <div className="mt-2 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-black/60">Submitted:</span>
                        <span className="font-medium text-black">{formatDate(workOrder.request.submittedDate)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-black/60">Issue Type:</span>
                        <span className="font-medium text-black">{workOrder.request.issueType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-black/60">Impact:</span>
                        <span className="font-medium text-warning">{workOrder.request.impactLevel}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-black/60">Preferred Resolution:</span>
                        <span className="font-medium text-black">{workOrder.request.preferredResolutionTime}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submitted By & Assigned To */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Submitted By</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="font-semibold text-black">{workOrder.request.submittedBy.name}</div>
                    <Badge variant="secondary" className="mt-1">
                      {workOrder.request.submittedBy.type}
                    </Badge>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <svg className="h-4 w-4 text-black/40" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                      </svg>
                      <a href={`tel:${workOrder.request.submittedBy.phone}`} className="text-primary hover:underline">
                        {workOrder.request.submittedBy.phone}
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="h-4 w-4 text-black/40" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                      </svg>
                      <a href={`mailto:${workOrder.request.submittedBy.email}`} className="text-primary hover:underline">
                        {workOrder.request.submittedBy.email}
                      </a>
                    </div>
                  </div>
                  <div className="mt-4 rounded-lg bg-black/[0.02] p-3">
                    <div className="text-sm font-semibold text-black/70">Availability for Access</div>
                    <div className="mt-2 space-y-1 text-sm">
                      {workOrder.request.tenantAvailability.map((avail, index) => (
                        <div key={index}>
                          <strong>{formatDate(avail.date)}:</strong> {avail.times}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Assigned To</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="font-semibold text-black">{workOrder.assignment.assignedTo.name}</div>
                    <Badge variant="secondary" className="mt-1">
                      {workOrder.assignment.assignedTo.type}
                    </Badge>
                    <div className="mt-1 text-sm text-black/60">{workOrder.assignment.assignedTo.specialization}</div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <svg className="h-4 w-4 text-black/40" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                      </svg>
                      <a href={`tel:${workOrder.assignment.assignedTo.phone}`} className="text-primary hover:underline">
                        {workOrder.assignment.assignedTo.phone}
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="h-4 w-4 text-black/40" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                      </svg>
                      <a href={`mailto:${workOrder.assignment.assignedTo.email}`} className="text-primary hover:underline">
                        {workOrder.assignment.assignedTo.email}
                      </a>
                    </div>
                  </div>
                  <div className="mt-4 rounded-lg bg-primary/5 p-3">
                    <div className="text-sm font-semibold text-black/70">Assigned Technician</div>
                    <div className="mt-2 space-y-1">
                      <div className="font-medium text-black">{workOrder.assignment.technician.name}</div>
                      <div className="text-sm text-black/60">{workOrder.assignment.technician.certification}</div>
                      <a href={`tel:${workOrder.assignment.technician.phone}`} className="text-sm text-primary hover:underline">
                        {workOrder.assignment.technician.phone}
                      </a>
                    </div>
                  </div>
                  <div className="text-sm text-black/60">
                    Assigned by: <strong>{workOrder.assignment.assignedBy}</strong>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Internal Notes */}
          {workOrder.internalNotes.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>📝 Internal Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {workOrder.internalNotes.map((note) => (
                    <div key={note.id} className="rounded-lg bg-black/[0.02] p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="text-sm text-black">{note.note}</div>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center gap-2 text-xs text-black/50">
                        <span>{note.author}</span>
                        <span>•</span>
                        <span>{formatDate(note.date)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Work Progress Tab */}
      {activeTab === 'progress' && (
        <Card>
          <CardHeader>
            <CardTitle>⚙️ Work Progress Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {workOrder.progress.workPerformed.map((step, index) => (
                <div key={index} className="flex items-start gap-4 border-l-2 border-black/[0.08] pl-4 pb-4 last:border-0">
                  <div className="flex-shrink-0 rounded-full bg-primary px-3 py-1 text-sm font-semibold text-white">
                    {step.time}
                  </div>
                  <div className="flex-1">
                    <div className="text-black">{step.action}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 grid gap-4 rounded-lg bg-success/10 p-4 md:grid-cols-3">
              <div>
                <div className="text-sm text-black/60">Started</div>
                <div className="mt-1 font-semibold text-black">{formatDate(workOrder.progress.startedDate!)}</div>
              </div>
              <div>
                <div className="text-sm text-black/60">Completed</div>
                <div className="mt-1 font-semibold text-black">{formatDate(workOrder.progress.completedDate!)}</div>
              </div>
              <div>
                <div className="text-sm text-black/60">Total Time</div>
                <div className="mt-1 text-2xl font-bold text-success">{workOrder.progress.timeSpent} hours</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Photos Tab */}
      {activeTab === 'photos' && (
        <div className="grid gap-6">
          {/* Before Photos */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>📸 Before Photos ({workOrder.photosBefore.length})</CardTitle>
                <Button variant="secondary" size="sm">
                  <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  Add Photo
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                {workOrder.photosBefore.map((photo) => (
                  <div key={photo.id} className="overflow-hidden rounded-lg border border-black/[0.08]">
                    <img src={photo.url} alt={photo.caption} className="h-48 w-full object-cover" />
                    <div className="p-3">
                      <div className="text-sm font-medium text-black">{photo.caption}</div>
                      <div className="mt-1 text-xs text-black/50">
                        By: {photo.uploadedBy}
                      </div>
                      <div className="text-xs text-black/50">
                        {formatDate(photo.uploadedDate)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* After Photos */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>✅ After Photos ({workOrder.photosAfter.length})</CardTitle>
                <Button variant="secondary" size="sm">
                  <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  Add Photo
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                {workOrder.photosAfter.map((photo) => (
                  <div key={photo.id} className="overflow-hidden rounded-lg border border-success">
                    <img src={photo.url} alt={photo.caption} className="h-48 w-full object-cover" />
                    <div className="bg-success/5 p-3">
                      <div className="text-sm font-medium text-black">{photo.caption}</div>
                      <div className="mt-1 text-xs text-black/50">
                        By: {photo.uploadedBy}
                      </div>
                      <div className="text-xs text-black/50">
                        {formatDate(photo.uploadedDate)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Cost Analysis Tab */}
      {activeTab === 'costs' && (
        <div className="grid gap-6">
          {/* Cost Comparison */}
          <Card>
            <CardHeader>
              <CardTitle>💰 Cost Breakdown & Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                {/* Estimated vs Actual */}
                <div className="space-y-4">
                  <div className="text-sm font-semibold text-black/70">Estimated Cost</div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-black/60">Labor</span>
                      <span className="font-medium text-black">{formatCurrency(workOrder.assignment.estimatedCost.labor)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-black/60">Parts</span>
                      <span className="font-medium text-black">{formatCurrency(workOrder.assignment.estimatedCost.parts)}</span>
                    </div>
                    <div className="flex justify-between border-t border-black/[0.08] pt-2">
                      <span className="font-semibold text-black">Total Estimated</span>
                      <span className="font-semibold text-black">{formatCurrency(workOrder.assignment.estimatedCost.total)}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="text-sm font-semibold text-black/70">Actual Cost</div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-black/60">Labor</span>
                      <span className="font-medium text-black">{formatCurrency(workOrder.completion.actualCost.labor)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-black/60">Parts</span>
                      <span className="font-medium text-black">{formatCurrency(workOrder.completion.actualCost.parts)}</span>
                    </div>
                    <div className="flex justify-between border-t border-black/[0.08] pt-2">
                      <span className="font-semibold text-black">Total Actual</span>
                      <span className="font-semibold text-success">{formatCurrency(workOrder.completion.actualCost.total)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Variance Analysis */}
              <div className="mt-6 rounded-lg bg-success/10 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold text-black/70">Budget Variance</div>
                    <div className="mt-1 text-sm text-black/60">{workOrder.costAnalysis.reasonForVariance}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-success">
                      {formatCurrency(Math.abs(workOrder.costAnalysis.budgetVariance))} saved
                    </div>
                    <div className="text-sm text-success">
                      {Math.abs(workOrder.costAnalysis.variancePercentage)}% under budget
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Parts Breakdown */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Parts Required (Estimated)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {workOrder.assignment.partsRequired.map((part, index) => (
                    <div key={index} className="flex justify-between rounded-lg bg-black/[0.02] p-3">
                      <div>
                        <div className="font-medium text-black">{part.name}</div>
                        <div className="text-sm text-black/60">
                          Qty: {part.quantity} {part.unit || 'unit(s)'}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-black">{formatCurrency(part.cost)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Parts Used (Actual)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {workOrder.completion.partsUsed.map((part, index) => (
                    <div key={index} className="flex justify-between rounded-lg bg-success/5 p-3">
                      <div>
                        <div className="font-medium text-black">{part.name}</div>
                        <div className="text-sm text-black/60">
                          Qty: {part.quantity} {part.unit || 'unit(s)'}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-success">{formatCurrency(part.cost)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Budget Approval */}
          <Card>
            <CardHeader>
              <CardTitle>Budget Approval</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-black/60">Approved Budget</div>
                  <div className="mt-1 text-2xl font-semibold text-black">
                    {formatCurrency(workOrder.assignment.approvedBudget)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-black/60">Actual Spent</div>
                  <div className="mt-1 text-2xl font-semibold text-success">
                    {formatCurrency(workOrder.completion.actualCost.total)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-black/60">Remaining</div>
                  <div className="mt-1 text-2xl font-semibold text-black">
                    {formatCurrency(workOrder.assignment.approvedBudget - workOrder.completion.actualCost.total)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Communications Tab */}
      {activeTab === 'communications' && (
        <Card>
          <CardHeader>
            <CardTitle>💬 Communication Trail ({workOrder.communications.length} messages)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {workOrder.communications.map((comm) => (
                <div key={comm.id} className="rounded-lg border border-black/[0.08] p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{comm.type}</Badge>
                        <span className="text-sm text-black/50">{formatDate(comm.date)}</span>
                      </div>
                      <div className="mt-2 text-sm">
                        <strong className="text-black">{comm.from}</strong>
                        {comm.to && (
                          <>
                            <span className="mx-2 text-black/40">→</span>
                            <span className="text-black/60">{comm.to}</span>
                          </>
                        )}
                      </div>
                      <div className="mt-2 text-black">{comm.message}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Completion Details Tab */}
      {activeTab === 'completion' && workOrder.progress.status === 'completed' && (
        <div className="grid gap-6">
          {/* Tenant Satisfaction */}
          <Card className="border-success bg-success/5">
            <CardHeader>
              <CardTitle>⭐ Tenant Satisfaction</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="text-6xl font-bold text-success">{workOrder.completion.tenantSatisfaction.rating}.0</div>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        className={`h-8 w-8 ${
                          star <= workOrder.completion.tenantSatisfaction.rating ? 'text-warning' : 'text-black/[0.12]'
                        }`}
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <div className="rounded-lg bg-white p-4">
                  <div className="text-sm font-semibold text-black/70">Tenant Feedback</div>
                  <div className="mt-2 text-black">{workOrder.completion.tenantSatisfaction.feedback}</div>
                  <div className="mt-2 text-xs text-black/50">
                    Rated on {formatDate(workOrder.completion.tenantSatisfaction.ratedDate)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Warranty Information */}
          <Card>
            <CardHeader>
              <CardTitle>🛡️ Warranty on Work</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <div className="text-sm text-black/60">Warranty Duration</div>
                  <div className="mt-1 text-2xl font-semibold text-black">
                    {workOrder.completion.warrantyOnWork.duration} {workOrder.completion.warrantyOnWork.unit}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-black/60">Warranty Expires</div>
                  <div className="mt-1 text-2xl font-semibold text-warning">
                    {formatDate(workOrder.completion.warrantyOnWork.expiryDate)}
                  </div>
                </div>
              </div>
              <div className="mt-4 rounded-lg bg-black/[0.02] p-3">
                <div className="text-sm font-semibold text-black/70">Coverage</div>
                <div className="mt-1 text-sm text-black">{workOrder.completion.warrantyOnWork.covered}</div>
              </div>
            </CardContent>
          </Card>

          {/* Follow-up */}
          <Card>
            <CardHeader>
              <CardTitle>🔄 Follow-up Status</CardTitle>
            </CardHeader>
            <CardContent>
              {workOrder.completion.followUpRequired ? (
                <div className="rounded-lg bg-warning/10 p-4">
                  <div className="font-semibold text-warning">Follow-up Required</div>
                  <div className="mt-2 text-sm text-black/70">
                    Scheduled for: {formatDate(workOrder.completion.followUpDate!)}
                  </div>
                </div>
              ) : (
                <div className="rounded-lg bg-success/10 p-4">
                  <div className="font-semibold text-success">✅ No Follow-up Required</div>
                  <div className="mt-2 text-sm text-black/70">
                    Work completed successfully. Issue fully resolved.
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </DashboardLayout>
  )
}
