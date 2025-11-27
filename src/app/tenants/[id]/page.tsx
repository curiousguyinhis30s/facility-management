'use client'

import React from 'react'
import { useParams, useRouter } from 'next/navigation'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatCurrency, formatDate } from '@/lib/utils'

// Enhanced mock tenant data with comprehensive fields
const mockTenant = {
  id: '1',
  name: 'Mohammed Al-Dosari',
  email: 'mohammed.dosari@email.sa',
  phone: '+966 55 987 6543',
  status: 'active' as const,

  // Personal Information
  personalInfo: {
    dateOfBirth: new Date(1988, 4, 15),
    nationality: 'Saudi',
    idType: 'Saudi National ID',
    idNumber: '1088765432',
    idExpiryDate: new Date(2029, 11, 31),
    maritalStatus: 'Married',
    numberOfDependents: 3,
    preferredLanguage: 'Arabic',
    communicationMethod: 'WhatsApp',
  },

  // Employment Information
  employment: {
    employerName: 'Saudi Aramco',
    jobTitle: 'Senior Engineer',
    monthlyIncome: 28000,
    employmentLetter: 'Employment_Letter_Mohammed_AlDosari.pdf',
    workPhone: '+966 13 876 5432',
  },

  // Current Lease Information
  currentLease: {
    id: 'L001',
    property: 'Sunset Apartments',
    propertyId: '1',
    unit: 'Unit 405',
    unitId: 'U405',
    startDate: new Date(2023, 0, 1),
    endDate: new Date(2024, 11, 31),
    monthlyRent: 4500,
    securityDeposit: 9000,
    paymentMethod: 'Bank Transfer',
    autoRenewal: true,
  },

  // Occupancy Details
  occupancy: {
    moveInDate: new Date(2023, 0, 1),
    numberOfOccupants: 4,
    vehicles: [
      { make: 'Toyota', model: 'Camry 2021', plateNumber: 'ABC-1234', color: 'White' },
      { make: 'Honda', model: 'CR-V 2022', plateNumber: 'XYZ-5678', color: 'Silver' },
    ],
    pets: [],
    parkingSpaces: ['P-405A', 'P-405B'],
  },

  // Emergency Contacts
  emergencyContacts: [
    {
      id: 'EC1',
      name: 'Fatima Al-Dosari',
      relationship: 'Spouse',
      phone: '+966 55 123 4567',
      email: 'fatima.dosari@email.sa',
      priority: 1,
      available: '24/7',
    },
    {
      id: 'EC2',
      name: 'Abdullah Al-Dosari',
      relationship: 'Brother',
      phone: '+966 50 987 6543',
      email: 'abdullah.dosari@email.sa',
      priority: 2,
      available: 'Business hours',
    },
    {
      id: 'EC3',
      name: 'Saudi Aramco HR',
      relationship: 'Employer',
      phone: '+966 13 876 0000',
      email: 'hr@aramco.sa',
      priority: 2,
      available: 'Business hours',
    },
  ],

  // Documents
  documents: [
    { id: 'D1', type: 'National ID', name: 'National_ID_Front.pdf', uploadDate: new Date(2023, 0, 1), size: '1.2 MB', status: 'verified' },
    { id: 'D2', type: 'Employment Letter', name: 'Employment_Letter.pdf', uploadDate: new Date(2023, 0, 1), size: '850 KB', status: 'verified' },
    { id: 'D3', type: 'Bank Statement', name: 'Bank_Statement_3months.pdf', uploadDate: new Date(2023, 0, 1), size: '2.1 MB', status: 'verified' },
    { id: 'D4', type: 'Signed Lease', name: 'Lease_Agreement_Signed.pdf', uploadDate: new Date(2023, 0, 1), size: '3.4 MB', status: 'verified' },
    { id: 'D5', type: 'Move-in Inspection', name: 'Move_In_Report.pdf', uploadDate: new Date(2023, 0, 5), size: '5.2 MB', status: 'verified' },
  ],

  // Payment History
  paymentHistory: [
    { id: 'P1', date: new Date(2024, 10, 1), amount: 4500, type: 'Rent', status: 'paid', method: 'Bank Transfer', reference: 'TXN-20241101-001' },
    { id: 'P2', date: new Date(2024, 9, 1), amount: 4500, type: 'Rent', status: 'paid', method: 'Bank Transfer', reference: 'TXN-20241001-001' },
    { id: 'P3', date: new Date(2024, 8, 1), amount: 4500, type: 'Rent', status: 'paid', method: 'Bank Transfer', reference: 'TXN-20240901-001' },
    { id: 'P4', date: new Date(2024, 7, 1), amount: 4500, type: 'Rent', status: 'paid', method: 'Bank Transfer', reference: 'TXN-20240801-001' },
    { id: 'P5', date: new Date(2024, 6, 1), amount: 4500, type: 'Rent', status: 'paid', method: 'Bank Transfer', reference: 'TXN-20240701-001' },
    { id: 'P6', date: new Date(2024, 5, 1), amount: 4500, type: 'Rent', status: 'paid', method: 'Bank Transfer', reference: 'TXN-20240601-001' },
  ],

  // Work Orders History
  workOrders: [
    { id: 'WO1', title: 'AC not cooling properly', status: 'completed', priority: 'high', createdDate: new Date(2024, 8, 15), completedDate: new Date(2024, 8, 16) },
    { id: 'WO2', title: 'Kitchen sink leaking', status: 'completed', priority: 'medium', createdDate: new Date(2024, 6, 10), completedDate: new Date(2024, 6, 12) },
    { id: 'WO3', title: 'Bathroom light not working', status: 'completed', priority: 'low', createdDate: new Date(2024, 4, 5), completedDate: new Date(2024, 4, 6) },
  ],

  // Communication History
  communications: [
    { id: 'C1', date: new Date(2024, 10, 15), type: 'Email', subject: 'Lease Renewal Reminder', from: 'Property Manager', status: 'read' },
    { id: 'C2', date: new Date(2024, 10, 1), type: 'WhatsApp', subject: 'November rent payment confirmation', from: 'Property Manager', status: 'read' },
    { id: 'C3', date: new Date(2024, 9, 15), type: 'Email', subject: 'Maintenance schedule notification', from: 'Property Manager', status: 'read' },
    { id: 'C4', date: new Date(2024, 8, 16), type: 'Phone', subject: 'AC repair completion follow-up', from: 'Maintenance Team', status: 'completed' },
  ],

  // Notifications & Alerts
  notifications: [
    {
      id: 'N1',
      type: 'lease_expiry',
      title: 'Lease Expiring in 37 Days',
      description: 'Current lease ends on Dec 31, 2024. Renewal decision needed.',
      priority: 'high',
      dueDate: new Date(2024, 11, 31),
      actionRequired: true,
    },
    {
      id: 'N2',
      type: 'id_expiry',
      title: 'National ID Expiry Check',
      description: 'Please verify ID is still valid',
      priority: 'medium',
      dueDate: new Date(2029, 11, 31),
      actionRequired: false,
    },
  ],

  // Tenant Metrics
  metrics: {
    tenancyDuration: 23, // months
    onTimePayments: 23,
    latePayments: 0,
    workOrdersSubmitted: 3,
    complaintsSubmitted: 0,
    averagePaymentDay: 1, // day of month
    renewalHistory: 1,
    satisfactionRating: 4.8,
  },

  // Photos
  photos: {
    profile: 'https://ui-avatars.com/api/?name=Mohammed+Al-Dosari&size=200&background=171717&color=fff',
    idDocuments: [
      'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&h=300&fit=crop',
    ],
  },
}

export default function TenantDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [activeTab, setActiveTab] = React.useState<'canvas' | 'profile' | 'documents' | 'payments' | 'workorders' | 'communication'>('canvas')
  const tenant = mockTenant

  const endDate = tenant.currentLease.endDate instanceof Date ? tenant.currentLease.endDate : new Date(tenant.currentLease.endDate)
  const leaseExpiryDays = Math.ceil((endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
  const paymentSuccessRate = ((tenant.metrics.onTimePayments / (tenant.metrics.onTimePayments + tenant.metrics.latePayments)) * 100).toFixed(0)

  return (
    <DashboardLayout
      title={tenant.name}
      actions={
        <div className="flex gap-2">
          <Button variant="secondary">
            <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
            Send Email
          </Button>
          <Button variant="secondary">
            <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
            </svg>
            Call Tenant
          </Button>
          <Button variant="primary" onClick={() => router.push(`/tenants/${tenant.id}/edit`)}>
            <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
            </svg>
            Edit Tenant
          </Button>
        </div>
      }
    >
      {/* Urgent Notifications Banner */}
      {tenant.notifications.filter(n => n.priority === 'high' && n.actionRequired).length > 0 && (
        <Card className="mb-6 border-warning bg-warning/5">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <svg className="h-6 w-6 flex-shrink-0 text-warning" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
              <div className="flex-1">
                <div className="font-semibold text-black">
                  ⚠️ Action Required ({tenant.notifications.filter(n => n.priority === 'high' && n.actionRequired).length} item{tenant.notifications.filter(n => n.priority === 'high' && n.actionRequired).length > 1 ? 's' : ''})
                </div>
                <div className="mt-2 space-y-1 text-sm text-black/70">
                  {tenant.notifications.filter(n => n.priority === 'high' && n.actionRequired).map((notification) => (
                    <div key={notification.id}>
                      • <strong>{notification.title}</strong> - {notification.description}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tab Navigation */}
      <div className="mb-6 flex gap-2 border-b border-black/[0.08]">
        {[
          { id: 'canvas', label: '🎯 Canvas', icon: '📊' },
          { id: 'profile', label: '👤 Profile', icon: '👤' },
          { id: 'documents', label: '📄 Documents', icon: '📄' },
          { id: 'payments', label: '💰 Payments', icon: '💰' },
          { id: 'workorders', label: '🔧 Work Orders', icon: '🔧' },
          { id: 'communication', label: '💬 Communication', icon: '💬' },
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

      {/* Canvas Tab - Visual Overview */}
      {activeTab === 'canvas' && (
        <>
          {/* Key Metrics */}
          <div className="mb-6 grid gap-6 md:grid-cols-4">
            <Card>
              <CardContent className="p-6">
                <div className="text-sm text-black/50">Tenancy Duration</div>
                <div className="mt-2 text-3xl font-semibold text-black">{tenant.metrics.tenancyDuration} months</div>
                <div className="mt-2 text-sm text-success">Excellent tenant history</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="text-sm text-black/50">Payment Success Rate</div>
                <div className="mt-2 text-3xl font-semibold text-success">{paymentSuccessRate}%</div>
                <div className="mt-2 text-sm text-black/50">{tenant.metrics.onTimePayments} on-time payments</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="text-sm text-black/50">Monthly Rent</div>
                <div className="mt-2 text-3xl font-semibold text-black">
                  {formatCurrency(tenant.currentLease.monthlyRent)}
                </div>
                <div className="mt-2 text-sm text-black/50">Auto-renewal: {tenant.currentLease.autoRenewal ? 'Yes' : 'No'}</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="text-sm text-black/50">Lease Expires In</div>
                <div className={`mt-2 text-3xl font-semibold ${leaseExpiryDays < 60 ? 'text-warning' : 'text-black'}`}>
                  {leaseExpiryDays} days
                </div>
                <div className="mt-2 text-sm text-black/50">{formatDate(tenant.currentLease.endDate)}</div>
              </CardContent>
            </Card>
          </div>

          {/* Relationship Canvas */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>🎯 Tenant Relationship Canvas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-lg border border-black/[0.08] p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <div className="rounded-lg bg-primary/10 p-2">
                      <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-semibold text-black">Current Property</div>
                      <div className="text-sm text-black/50">Living arrangement</div>
                    </div>
                  </div>
                  <div className="mt-3 space-y-1 text-sm">
                    <div><strong>{tenant.currentLease.property}</strong></div>
                    <div className="text-black/60">{tenant.currentLease.unit}</div>
                    <div className="text-black/60">{tenant.occupancy.numberOfOccupants} occupants</div>
                    <div className="text-black/60">{tenant.occupancy.vehicles.length} vehicles registered</div>
                  </div>
                </div>

                <div className="rounded-lg border border-black/[0.08] p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <div className="rounded-lg bg-success/10 p-2">
                      <svg className="h-5 w-5 text-success" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-semibold text-black">Financial Record</div>
                      <div className="text-sm text-black/50">Payment history</div>
                    </div>
                  </div>
                  <div className="mt-3 space-y-1 text-sm">
                    <div><strong>{tenant.paymentHistory.length} payments</strong> made</div>
                    <div className="text-success">{tenant.metrics.onTimePayments} on-time</div>
                    <div className="text-danger">{tenant.metrics.latePayments} late</div>
                    <div className="text-black/60">Avg. payment day: {tenant.metrics.averagePaymentDay}</div>
                  </div>
                </div>

                <div className="rounded-lg border border-black/[0.08] p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <div className="rounded-lg bg-warning/10 p-2">
                      <svg className="h-5 w-5 text-warning" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-semibold text-black">Service Requests</div>
                      <div className="text-sm text-black/50">Work orders</div>
                    </div>
                  </div>
                  <div className="mt-3 space-y-1 text-sm">
                    <div><strong>{tenant.workOrders.length} work orders</strong> submitted</div>
                    <div className="text-success">{tenant.workOrders.filter(w => w.status === 'completed').length} completed</div>
                    <div className="text-black/60">{tenant.metrics.complaintsSubmitted} complaints</div>
                    <div className="text-black/60">Satisfaction: {tenant.metrics.satisfactionRating}/5.0</div>
                  </div>
                </div>

                <div className="rounded-lg border border-black/[0.08] p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <div className="rounded-lg bg-primary/10 p-2">
                      <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-semibold text-black">Documents</div>
                      <div className="text-sm text-black/50">Uploaded files</div>
                    </div>
                  </div>
                  <div className="mt-3 space-y-1 text-sm">
                    <div><strong>{tenant.documents.length} documents</strong> on file</div>
                    <div className="text-success">{tenant.documents.filter(d => d.status === 'verified').length} verified</div>
                    <div className="text-black/60">ID, employment, financials</div>
                    <div className="text-black/60">Move-in inspection complete</div>
                  </div>
                </div>

                <div className="rounded-lg border border-black/[0.08] p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <div className="rounded-lg bg-danger/10 p-2">
                      <svg className="h-5 w-5 text-danger" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-semibold text-black">Emergency Contacts</div>
                      <div className="text-sm text-black/50">24/7 contacts</div>
                    </div>
                  </div>
                  <div className="mt-3 space-y-1 text-sm">
                    <div><strong>{tenant.emergencyContacts.length} contacts</strong> registered</div>
                    <div className="text-black/60">{tenant.emergencyContacts.filter(c => c.priority === 1).length} priority contacts</div>
                    <div className="text-black/60">Family, employer, references</div>
                    <div className="text-black/60">All verified</div>
                  </div>
                </div>

                <div className="rounded-lg border border-black/[0.08] p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <div className="rounded-lg bg-success/10 p-2">
                      <svg className="h-5 w-5 text-success" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-semibold text-black">Communications</div>
                      <div className="text-sm text-black/50">Message history</div>
                    </div>
                  </div>
                  <div className="mt-3 space-y-1 text-sm">
                    <div><strong>{tenant.communications.length} messages</strong> exchanged</div>
                    <div className="text-black/60">Email, WhatsApp, phone</div>
                    <div className="text-black/60">Preferred: {tenant.personalInfo.communicationMethod}</div>
                    <div className="text-black/60">Response rate: Excellent</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>📅 Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 border-b border-black/[0.04] pb-3">
                    <div className="rounded-full bg-success/10 p-2">
                      <svg className="h-4 w-4 text-success" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-black">November rent payment received</div>
                      <div className="text-xs text-black/50">{formatDate(tenant.paymentHistory[0].date)}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 border-b border-black/[0.04] pb-3">
                    <div className="rounded-full bg-primary/10 p-2">
                      <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-black">Lease renewal reminder sent</div>
                      <div className="text-xs text-black/50">{formatDate(tenant.communications[0].date)}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-success/10 p-2">
                      <svg className="h-4 w-4 text-success" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-black">AC repair completed</div>
                      <div className="text-xs text-black/50">{formatDate(tenant.workOrders[0].completedDate!)}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>🚨 Emergency Contacts (Quick Access)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {tenant.emergencyContacts.map((contact) => (
                    <div
                      key={contact.id}
                      className={`flex items-center justify-between rounded-lg p-3 ${
                        contact.priority === 1 ? 'bg-danger/10' : 'bg-black/[0.02]'
                      }`}
                    >
                      <div>
                        <div className="font-medium text-black">{contact.name}</div>
                        <div className="text-sm text-black/50">{contact.relationship}</div>
                      </div>
                      <div className="text-right">
                        <a href={`tel:${contact.phone}`} className="text-sm font-medium text-primary hover:underline">
                          {contact.phone}
                        </a>
                        <div className="text-xs text-black/50">{contact.available}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Photo & Basic Info */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <img
                    src={tenant.photos.profile}
                    alt={tenant.name}
                    className="mx-auto h-32 w-32 rounded-full border-4 border-black/[0.04]"
                  />
                  <h2 className="mt-4 text-xl font-semibold text-black">{tenant.name}</h2>
                  <Badge variant="success" className="mt-2">
                    {tenant.status.charAt(0).toUpperCase() + tenant.status.slice(1)}
                  </Badge>
                </div>

                <div className="mt-6 space-y-3 border-t border-black/[0.08] pt-4">
                  <div className="flex items-center gap-2 text-sm">
                    <svg className="h-5 w-5 text-black/40" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                    <a href={`mailto:${tenant.email}`} className="text-primary hover:underline">
                      {tenant.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <svg className="h-5 w-5 text-black/40" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                    </svg>
                    <a href={`tel:${tenant.phone}`} className="text-primary hover:underline">
                      {tenant.phone}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <svg className="h-5 w-5 text-black/40" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
                    </svg>
                    <span className="text-black/60">{tenant.personalInfo.communicationMethod}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>📊 Tenant Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-black/50">Satisfaction Rating</span>
                    <span className="font-semibold text-black">{tenant.metrics.satisfactionRating}/5.0</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-black/50">Payment Success</span>
                    <span className="font-semibold text-success">{paymentSuccessRate}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-black/50">Renewals</span>
                    <span className="font-semibold text-black">{tenant.metrics.renewalHistory}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-black/50">Work Orders</span>
                    <span className="font-semibold text-black">{tenant.metrics.workOrdersSubmitted}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-black/50">Complaints</span>
                    <span className="font-semibold text-black">{tenant.metrics.complaintsSubmitted}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Middle & Right Columns - Detailed Information */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <div className="text-sm text-black/50">Date of Birth</div>
                    <div className="mt-1 font-medium text-black">{formatDate(tenant.personalInfo.dateOfBirth)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-black/50">Nationality</div>
                    <div className="mt-1 font-medium text-black">{tenant.personalInfo.nationality}</div>
                  </div>
                  <div>
                    <div className="text-sm text-black/50">ID Type</div>
                    <div className="mt-1 font-medium text-black">{tenant.personalInfo.idType}</div>
                  </div>
                  <div>
                    <div className="text-sm text-black/50">ID Number</div>
                    <div className="mt-1 font-medium text-black">{tenant.personalInfo.idNumber}</div>
                  </div>
                  <div>
                    <div className="text-sm text-black/50">ID Expiry</div>
                    <div className="mt-1 font-medium text-black">{formatDate(tenant.personalInfo.idExpiryDate)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-black/50">Marital Status</div>
                    <div className="mt-1 font-medium text-black">{tenant.personalInfo.maritalStatus}</div>
                  </div>
                  <div>
                    <div className="text-sm text-black/50">Dependents</div>
                    <div className="mt-1 font-medium text-black">{tenant.personalInfo.numberOfDependents}</div>
                  </div>
                  <div>
                    <div className="text-sm text-black/50">Preferred Language</div>
                    <div className="mt-1 font-medium text-black">{tenant.personalInfo.preferredLanguage}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Employment Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <div className="text-sm text-black/50">Employer</div>
                    <div className="mt-1 font-medium text-black">{tenant.employment.employerName}</div>
                  </div>
                  <div>
                    <div className="text-sm text-black/50">Job Title</div>
                    <div className="mt-1 font-medium text-black">{tenant.employment.jobTitle}</div>
                  </div>
                  <div>
                    <div className="text-sm text-black/50">Monthly Income</div>
                    <div className="mt-1 font-medium text-black">{formatCurrency(tenant.employment.monthlyIncome)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-black/50">Work Phone</div>
                    <div className="mt-1 font-medium text-black">{tenant.employment.workPhone}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Current Lease Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <div className="text-sm text-black/50">Property</div>
                    <div className="mt-1 font-medium text-primary hover:underline cursor-pointer">
                      {tenant.currentLease.property}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-black/50">Unit</div>
                    <div className="mt-1 font-medium text-black">{tenant.currentLease.unit}</div>
                  </div>
                  <div>
                    <div className="text-sm text-black/50">Lease Start</div>
                    <div className="mt-1 font-medium text-black">{formatDate(tenant.currentLease.startDate)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-black/50">Lease End</div>
                    <div className="mt-1 font-medium text-black">{formatDate(tenant.currentLease.endDate)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-black/50">Monthly Rent</div>
                    <div className="mt-1 font-medium text-black">{formatCurrency(tenant.currentLease.monthlyRent)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-black/50">Security Deposit</div>
                    <div className="mt-1 font-medium text-black">{formatCurrency(tenant.currentLease.securityDeposit)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-black/50">Payment Method</div>
                    <div className="mt-1 font-medium text-black">{tenant.currentLease.paymentMethod}</div>
                  </div>
                  <div>
                    <div className="text-sm text-black/50">Auto Renewal</div>
                    <div className="mt-1 font-medium text-black">{tenant.currentLease.autoRenewal ? 'Yes' : 'No'}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Occupancy Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <div className="text-sm text-black/50">Move-in Date</div>
                      <div className="mt-1 font-medium text-black">{formatDate(tenant.occupancy.moveInDate)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-black/50">Number of Occupants</div>
                      <div className="mt-1 font-medium text-black">{tenant.occupancy.numberOfOccupants}</div>
                    </div>
                  </div>

                  <div>
                    <div className="mb-2 text-sm font-semibold text-black/70">Registered Vehicles</div>
                    <div className="space-y-2">
                      {tenant.occupancy.vehicles.map((vehicle, index) => (
                        <div key={index} className="rounded-lg bg-black/[0.02] p-3">
                          <div className="font-medium text-black">
                            {vehicle.make} {vehicle.model}
                          </div>
                          <div className="mt-1 flex gap-4 text-sm text-black/60">
                            <span>Plate: {vehicle.plateNumber}</span>
                            <span>Color: {vehicle.color}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="mb-2 text-sm font-semibold text-black/70">Assigned Parking</div>
                    <div className="flex gap-2">
                      {tenant.occupancy.parkingSpaces.map((space) => (
                        <Badge key={space} variant="secondary">
                          {space}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>🚨 Emergency Contacts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {tenant.emergencyContacts.map((contact) => (
                    <div
                      key={contact.id}
                      className={`rounded-lg p-4 ${contact.priority === 1 ? 'bg-danger/10 border border-danger/20' : 'bg-black/[0.02]'}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <div className="font-semibold text-black">{contact.name}</div>
                            {contact.priority === 1 && <Badge variant="danger">Priority</Badge>}
                          </div>
                          <div className="mt-1 text-sm text-black/60">{contact.relationship}</div>
                        </div>
                        <div className="text-right">
                          <a href={`tel:${contact.phone}`} className="font-medium text-primary hover:underline">
                            {contact.phone}
                          </a>
                          {contact.email && (
                            <div className="mt-1 text-sm text-black/60">{contact.email}</div>
                          )}
                          <div className="mt-1 text-xs text-black/50">{contact.available}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Documents Tab */}
      {activeTab === 'documents' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>📄 Documents ({tenant.documents.length})</CardTitle>
              <Button variant="primary">
                <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Upload Document
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-black/[0.08]">
                  <tr>
                    <th className="pb-3 text-left text-sm font-semibold text-black">Document Type</th>
                    <th className="pb-3 text-left text-sm font-semibold text-black">File Name</th>
                    <th className="pb-3 text-left text-sm font-semibold text-black">Upload Date</th>
                    <th className="pb-3 text-left text-sm font-semibold text-black">Size</th>
                    <th className="pb-3 text-left text-sm font-semibold text-black">Status</th>
                    <th className="pb-3 text-right text-sm font-semibold text-black">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/[0.08]">
                  {tenant.documents.map((doc) => (
                    <tr key={doc.id} className="hover:bg-black/[0.02]">
                      <td className="py-4">
                        <Badge variant="secondary">{doc.type}</Badge>
                      </td>
                      <td className="py-4 text-sm font-medium text-black">{doc.name}</td>
                      <td className="py-4 text-sm text-black/60">{formatDate(doc.uploadDate)}</td>
                      <td className="py-4 text-sm text-black/60">{doc.size}</td>
                      <td className="py-4">
                        <Badge variant={doc.status === 'verified' ? 'success' : 'warning'}>
                          {doc.status}
                        </Badge>
                      </td>
                      <td className="py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button className="rounded-lg p-2 text-black/40 hover:bg-black/[0.04] hover:text-primary" title="View document">
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          </button>
                          <button className="rounded-lg p-2 text-black/40 hover:bg-black/[0.04] hover:text-primary" title="Download document">
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
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

      {/* Payments Tab */}
      {activeTab === 'payments' && (
        <Card>
          <CardHeader>
            <CardTitle>💰 Payment History ({tenant.paymentHistory.length} payments)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6 grid gap-6 md:grid-cols-3">
              <div className="rounded-lg bg-success/10 p-4">
                <div className="text-sm text-black/60">On-Time Payments</div>
                <div className="mt-2 text-2xl font-semibold text-success">{tenant.metrics.onTimePayments}</div>
                <div className="mt-1 text-sm text-black/60">{paymentSuccessRate}% success rate</div>
              </div>
              <div className="rounded-lg bg-danger/10 p-4">
                <div className="text-sm text-black/60">Late Payments</div>
                <div className="mt-2 text-2xl font-semibold text-danger">{tenant.metrics.latePayments}</div>
                <div className="mt-1 text-sm text-black/60">Excellent record</div>
              </div>
              <div className="rounded-lg bg-primary/10 p-4">
                <div className="text-sm text-black/60">Average Payment Day</div>
                <div className="mt-2 text-2xl font-semibold text-black">Day {tenant.metrics.averagePaymentDay}</div>
                <div className="mt-1 text-sm text-black/60">Always early!</div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-black/[0.08]">
                  <tr>
                    <th className="pb-3 text-left text-sm font-semibold text-black">Date</th>
                    <th className="pb-3 text-left text-sm font-semibold text-black">Type</th>
                    <th className="pb-3 text-right text-sm font-semibold text-black">Amount</th>
                    <th className="pb-3 text-left text-sm font-semibold text-black">Method</th>
                    <th className="pb-3 text-left text-sm font-semibold text-black">Reference</th>
                    <th className="pb-3 text-left text-sm font-semibold text-black">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/[0.08]">
                  {tenant.paymentHistory.map((payment) => (
                    <tr key={payment.id} className="hover:bg-black/[0.02]">
                      <td className="py-4 text-sm text-black">{formatDate(payment.date)}</td>
                      <td className="py-4">
                        <Badge variant="secondary">{payment.type}</Badge>
                      </td>
                      <td className="py-4 text-right text-sm font-semibold text-black">
                        {formatCurrency(payment.amount)}
                      </td>
                      <td className="py-4 text-sm text-black/60">{payment.method}</td>
                      <td className="py-4 text-sm font-mono text-black/60">{payment.reference}</td>
                      <td className="py-4">
                        <Badge variant={payment.status === 'paid' ? 'success' : 'warning'}>
                          {payment.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Work Orders Tab */}
      {activeTab === 'workorders' && (
        <Card>
          <CardHeader>
            <CardTitle>🔧 Work Orders History ({tenant.workOrders.length} total)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-black/[0.08]">
                  <tr>
                    <th className="pb-3 text-left text-sm font-semibold text-black">ID</th>
                    <th className="pb-3 text-left text-sm font-semibold text-black">Title</th>
                    <th className="pb-3 text-left text-sm font-semibold text-black">Priority</th>
                    <th className="pb-3 text-left text-sm font-semibold text-black">Created</th>
                    <th className="pb-3 text-left text-sm font-semibold text-black">Completed</th>
                    <th className="pb-3 text-left text-sm font-semibold text-black">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/[0.08]">
                  {tenant.workOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-black/[0.02]">
                      <td className="py-4 text-sm font-mono text-black">{order.id}</td>
                      <td className="py-4 text-sm font-medium text-black">{order.title}</td>
                      <td className="py-4">
                        <Badge
                          variant={
                            order.priority === 'high'
                              ? 'danger'
                              : order.priority === 'medium'
                              ? 'warning'
                              : 'secondary'
                          }
                        >
                          {order.priority}
                        </Badge>
                      </td>
                      <td className="py-4 text-sm text-black/60">{formatDate(order.createdDate)}</td>
                      <td className="py-4 text-sm text-black/60">
                        {order.completedDate ? formatDate(order.completedDate) : '-'}
                      </td>
                      <td className="py-4">
                        <Badge variant={order.status === 'completed' ? 'success' : 'warning'}>
                          {order.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Communication Tab */}
      {activeTab === 'communication' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>💬 Communication History ({tenant.communications.length} messages)</CardTitle>
              <div className="text-sm text-black/60">
                Preferred: <strong>{tenant.personalInfo.communicationMethod}</strong> | Language:{' '}
                <strong>{tenant.personalInfo.preferredLanguage}</strong>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-black/[0.08]">
                  <tr>
                    <th className="pb-3 text-left text-sm font-semibold text-black">Date</th>
                    <th className="pb-3 text-left text-sm font-semibold text-black">Type</th>
                    <th className="pb-3 text-left text-sm font-semibold text-black">Subject</th>
                    <th className="pb-3 text-left text-sm font-semibold text-black">From</th>
                    <th className="pb-3 text-left text-sm font-semibold text-black">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/[0.08]">
                  {tenant.communications.map((comm) => (
                    <tr key={comm.id} className="hover:bg-black/[0.02]">
                      <td className="py-4 text-sm text-black">{formatDate(comm.date)}</td>
                      <td className="py-4">
                        <Badge variant="secondary">{comm.type}</Badge>
                      </td>
                      <td className="py-4 text-sm font-medium text-black">{comm.subject}</td>
                      <td className="py-4 text-sm text-black/60">{comm.from}</td>
                      <td className="py-4">
                        <Badge variant={comm.status === 'read' || comm.status === 'completed' ? 'success' : 'warning'}>
                          {comm.status}
                        </Badge>
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
