'use client'

import React from 'react'
import { useParams, useRouter } from 'next/navigation'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatCurrency, formatDate } from '@/lib/utils'

// Enhanced mock lease data
const mockLease = {
  id: 'L001',
  tenant: {
    id: 'T1',
    name: 'Mohammed Al-Dosari',
    email: 'mohammed.dosari@email.sa',
    phone: '+966 55 987 6543',
  },
  property: {
    id: 'P1',
    name: 'Sunset Apartments',
    address: '123 King Fahd Road, Riyadh',
  },
  unit: {
    id: 'U405',
    number: '405',
    type: '2BR',
    size: 120,
  },

  // Lease Terms
  terms: {
    type: 'Fixed Term - Annual',
    startDate: new Date(2023, 0, 1),
    endDate: new Date(2024, 11, 31),
    duration: 24, // months
    noticePeriod: 60, // days
    earlyTerminationPenalty: 9000, // 2 months rent
    sublettingAllowed: false,
    rentEscalation: {
      enabled: true,
      percentage: 5,
      frequency: 'annual',
    },
  },

  // Financial Details
  financial: {
    baseRent: 4500,
    serviceCharges: 0,
    parkingFee: 0,
    totalMonthlyPayment: 4500,
    securityDeposit: {
      amount: 9000,
      months: 2,
      heldInAccount: 'Property Trust Account - Riyad Bank',
      interestAccrued: 0,
      deductions: [],
      returnStatus: 'held',
    },
    utilitiesIncluded: {
      water: false,
      electricity: false,
      gas: false,
      internet: false,
    },
    latePayment: {
      gracePeriod: 5, // days
      feeType: 'percentage',
      feeAmount: 5, // 5% of monthly rent
    },
  },

  // Payment Schedule
  paymentSchedule: [
    { month: 'January 2024', dueDate: new Date(2024, 0, 1), amount: 4500, status: 'paid', paidDate: new Date(2024, 0, 1) },
    { month: 'February 2024', dueDate: new Date(2024, 1, 1), amount: 4500, status: 'paid', paidDate: new Date(2024, 1, 1) },
    { month: 'March 2024', dueDate: new Date(2024, 2, 1), amount: 4500, status: 'paid', paidDate: new Date(2024, 2, 1) },
    { month: 'April 2024', dueDate: new Date(2024, 3, 1), amount: 4500, status: 'paid', paidDate: new Date(2024, 3, 1) },
    { month: 'May 2024', dueDate: new Date(2024, 4, 1), amount: 4500, status: 'paid', paidDate: new Date(2024, 4, 1) },
    { month: 'June 2024', dueDate: new Date(2024, 5, 1), amount: 4500, status: 'paid', paidDate: new Date(2024, 5, 1) },
    { month: 'July 2024', dueDate: new Date(2024, 6, 1), amount: 4500, status: 'paid', paidDate: new Date(2024, 6, 1) },
    { month: 'August 2024', dueDate: new Date(2024, 7, 1), amount: 4500, status: 'paid', paidDate: new Date(2024, 7, 1) },
    { month: 'September 2024', dueDate: new Date(2024, 8, 1), amount: 4500, status: 'paid', paidDate: new Date(2024, 8, 1) },
    { month: 'October 2024', dueDate: new Date(2024, 9, 1), amount: 4500, status: 'paid', paidDate: new Date(2024, 9, 1) },
    { month: 'November 2024', dueDate: new Date(2024, 10, 1), amount: 4500, status: 'paid', paidDate: new Date(2024, 10, 1) },
    { month: 'December 2024', dueDate: new Date(2024, 11, 1), amount: 4500, status: 'pending', paidDate: null },
  ],

  // Renewal Information
  renewal: {
    eligible: true,
    offerSentDate: new Date(2024, 9, 1), // Oct 1, 2024
    responseDeadline: new Date(2024, 10, 15), // Nov 15, 2024
    status: 'pending_response',
    proposedTerms: {
      startDate: new Date(2025, 0, 1),
      endDate: new Date(2025, 11, 31),
      newRent: 4725, // 5% increase
      renewalFee: 500,
    },
    history: [
      {
        year: 2023,
        previousRent: 4286,
        newRent: 4500,
        increase: 5,
        decision: 'renewed',
        decisionDate: new Date(2022, 10, 10),
      },
    ],
  },

  // Documents
  documents: [
    { id: 'D1', type: 'Signed Lease Agreement', name: 'Lease_L001_2024_Signed.pdf', uploadDate: new Date(2023, 11, 28), size: '3.4 MB', status: 'verified' },
    { id: 'D2', type: 'Move-in Inspection', name: 'Move_In_Inspection_U405.pdf', uploadDate: new Date(2023, 11, 31), size: '5.2 MB', status: 'verified' },
    { id: 'D3', type: 'Security Deposit Receipt', name: 'Deposit_Receipt_9000_SAR.pdf', uploadDate: new Date(2023, 11, 28), size: '450 KB', status: 'verified' },
    { id: 'D4', type: 'Renewal Offer 2025', name: 'Renewal_Offer_2025.pdf', uploadDate: new Date(2024, 9, 1), size: '1.2 MB', status: 'pending' },
    { id: 'D5', type: 'Tenant ID Copy', name: 'Tenant_National_ID.pdf', uploadDate: new Date(2023, 11, 28), size: '1.1 MB', status: 'verified' },
  ],

  // Notifications & Alerts
  notifications: [
    {
      id: 'N1',
      type: 'renewal_reminder',
      title: 'Renewal Response Deadline Approaching',
      description: 'Tenant must respond to renewal offer by Nov 15, 2024',
      priority: 'high',
      dueDate: new Date(2024, 10, 15),
      actionRequired: true,
    },
    {
      id: 'N2',
      type: 'lease_expiry',
      title: 'Lease Expiring in 37 Days',
      description: 'Current lease ends on Dec 31, 2024',
      priority: 'high',
      dueDate: new Date(2024, 11, 31),
      actionRequired: true,
    },
  ],

  // Timeline Events
  timeline: [
    { date: new Date(2024, 9, 1), event: 'Renewal offer sent to tenant', type: 'renewal', icon: '📧' },
    { date: new Date(2024, 8, 16), event: 'AC repair work order completed', type: 'maintenance', icon: '🔧' },
    { date: new Date(2024, 6, 1), event: 'Mid-lease inspection conducted - All good', type: 'inspection', icon: '✅' },
    { date: new Date(2024, 0, 1), event: 'Lease renewed for 2024', type: 'renewal', icon: '🔄' },
    { date: new Date(2023, 11, 31), event: 'Move-in completed', type: 'move_in', icon: '🏠' },
    { date: new Date(2023, 11, 28), event: 'Lease agreement signed', type: 'signing', icon: '📝' },
  ],

  // Lease Status
  status: 'active' as const,
  daysUntilExpiry: 37,
  autoRenewal: false,
}

export default function LeaseDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [activeTab, setActiveTab] = React.useState<'overview' | 'financial' | 'schedule' | 'renewal' | 'documents' | 'timeline'>('overview')
  const lease = mockLease

  const totalPaid = lease.paymentSchedule.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0)
  const totalDue = lease.paymentSchedule.reduce((sum, p) => sum + p.amount, 0)
  const paymentCompletionRate = ((totalPaid / totalDue) * 100).toFixed(0)

  return (
    <DashboardLayout
      title={`Lease ${lease.id}`}
      actions={
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => router.push(`/tenants/${lease.tenant.id}`)}>
            <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
            View Tenant
          </Button>
          <Button variant="secondary" onClick={() => router.push(`/properties/${lease.property.id}`)}>
            <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
            </svg>
            View Property
          </Button>
          <Button variant="primary">
            <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
            </svg>
            Edit Lease
          </Button>
        </div>
      }
    >
      {/* Urgent Notifications Banner */}
      {lease.notifications.filter(n => n.priority === 'high' && n.actionRequired).length > 0 && (
        <Card className="mb-6 border-warning bg-warning/5">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <svg className="h-6 w-6 flex-shrink-0 text-warning" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
              <div className="flex-1">
                <div className="font-semibold text-black">
                  ⚠️ Urgent Action Required ({lease.notifications.filter(n => n.priority === 'high' && n.actionRequired).length} item{lease.notifications.filter(n => n.priority === 'high' && n.actionRequired).length > 1 ? 's' : ''})
                </div>
                <div className="mt-2 space-y-1 text-sm text-black/70">
                  {lease.notifications.filter(n => n.priority === 'high' && n.actionRequired).map((notification) => (
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
          { id: 'overview', label: '📋 Overview' },
          { id: 'financial', label: '💰 Financial' },
          { id: 'schedule', label: '📅 Payment Schedule' },
          { id: 'renewal', label: '🔄 Renewal' },
          { id: 'documents', label: '📄 Documents' },
          { id: 'timeline', label: '⏱️ Timeline' },
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
        <>
          {/* Key Metrics */}
          <div className="mb-6 grid gap-6 md:grid-cols-4">
            <Card>
              <CardContent className="p-6">
                <div className="text-sm text-black/50">Lease Status</div>
                <div className="mt-2">
                  <Badge variant="success" className="text-lg">
                    {lease.status.toUpperCase()}
                  </Badge>
                </div>
                <div className="mt-2 text-sm text-black/50">Expires in {lease.daysUntilExpiry} days</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="text-sm text-black/50">Monthly Rent</div>
                <div className="mt-2 text-3xl font-semibold text-black">
                  {formatCurrency(lease.financial.totalMonthlyPayment)}
                </div>
                <div className="mt-2 text-sm text-black/50">Base + charges</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="text-sm text-black/50">Security Deposit</div>
                <div className="mt-2 text-3xl font-semibold text-black">
                  {formatCurrency(lease.financial.securityDeposit.amount)}
                </div>
                <div className="mt-2 text-sm text-black/50">{lease.financial.securityDeposit.months} months rent</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="text-sm text-black/50">Payment Rate</div>
                <div className="mt-2 text-3xl font-semibold text-success">{paymentCompletionRate}%</div>
                <div className="mt-2 text-sm text-black/50">
                  {lease.paymentSchedule.filter(p => p.status === 'paid').length}/{lease.paymentSchedule.length} paid
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Info Cards */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Tenant & Property Info */}
            <Card>
              <CardHeader>
                <CardTitle>Lease Parties</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="mb-2 text-sm font-semibold text-black/70">Tenant</div>
                  <div className="rounded-lg bg-black/[0.02] p-4">
                    <div className="font-semibold text-black">{lease.tenant.name}</div>
                    <div className="mt-1 text-sm text-black/60">{lease.tenant.email}</div>
                    <div className="mt-1 text-sm text-black/60">{lease.tenant.phone}</div>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="mt-3"
                      onClick={() => router.push(`/tenants/${lease.tenant.id}`)}
                    >
                      View Tenant Profile
                    </Button>
                  </div>
                </div>

                <div>
                  <div className="mb-2 text-sm font-semibold text-black/70">Property & Unit</div>
                  <div className="rounded-lg bg-black/[0.02] p-4">
                    <div className="font-semibold text-black">{lease.property.name}</div>
                    <div className="mt-1 text-sm text-black/60">{lease.property.address}</div>
                    <div className="mt-2 flex gap-2">
                      <Badge variant="secondary">Unit {lease.unit.number}</Badge>
                      <Badge variant="secondary">{lease.unit.type}</Badge>
                      <Badge variant="secondary">{lease.unit.size} m²</Badge>
                    </div>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="mt-3"
                      onClick={() => router.push(`/properties/${lease.property.id}`)}
                    >
                      View Property Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Lease Terms */}
            <Card>
              <CardHeader>
                <CardTitle>Lease Terms</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-black/50">Lease Type</div>
                      <div className="mt-1 font-medium text-black">{lease.terms.type}</div>
                    </div>
                    <div>
                      <div className="text-sm text-black/50">Duration</div>
                      <div className="mt-1 font-medium text-black">{lease.terms.duration} months</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-black/50">Start Date</div>
                      <div className="mt-1 font-medium text-black">{formatDate(lease.terms.startDate)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-black/50">End Date</div>
                      <div className="mt-1 font-medium text-warning">{formatDate(lease.terms.endDate)}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-black/50">Notice Period</div>
                      <div className="mt-1 font-medium text-black">{lease.terms.noticePeriod} days</div>
                    </div>
                    <div>
                      <div className="text-sm text-black/50">Subletting</div>
                      <div className="mt-1 font-medium text-black">
                        {lease.terms.sublettingAllowed ? 'Allowed' : 'Not Allowed'}
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-black/50">Early Termination Penalty</div>
                    <div className="mt-1 font-medium text-danger">
                      {formatCurrency(lease.terms.earlyTerminationPenalty)}
                    </div>
                  </div>

                  {lease.terms.rentEscalation.enabled && (
                    <div className="rounded-lg bg-primary/5 p-3">
                      <div className="text-sm font-semibold text-black">Rent Escalation Clause</div>
                      <div className="mt-1 text-sm text-black/60">
                        {lease.terms.rentEscalation.percentage}% increase {lease.terms.rentEscalation.frequency}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {/* Financial Tab */}
      {activeTab === 'financial' && (
        <div className="grid gap-6">
          {/* Monthly Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Payment Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-black/[0.08] pb-3">
                  <div>
                    <div className="font-medium text-black">Base Rent</div>
                    <div className="text-sm text-black/50">Monthly rent amount</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-black">{formatCurrency(lease.financial.baseRent)}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between border-b border-black/[0.08] pb-3">
                  <div>
                    <div className="font-medium text-black">Service Charges</div>
                    <div className="text-sm text-black/50">Common area maintenance</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-black">{formatCurrency(lease.financial.serviceCharges)}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between border-b border-black/[0.08] pb-3">
                  <div>
                    <div className="font-medium text-black">Parking Fee</div>
                    <div className="text-sm text-black/50">2 covered spaces</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-black">{formatCurrency(lease.financial.parkingFee)}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-lg bg-primary/10 p-4">
                  <div>
                    <div className="font-semibold text-black">Total Monthly Payment</div>
                    <div className="text-sm text-black/60">Due on 1st of each month</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-black">
                      {formatCurrency(lease.financial.totalMonthlyPayment)}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security Deposit */}
          <Card>
            <CardHeader>
              <CardTitle>Security Deposit</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-black/50">Deposit Amount</div>
                    <div className="mt-1 text-2xl font-semibold text-black">
                      {formatCurrency(lease.financial.securityDeposit.amount)}
                    </div>
                    <div className="mt-1 text-sm text-black/60">
                      Equivalent to {lease.financial.securityDeposit.months} months rent
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-black/50">Held In</div>
                    <div className="mt-1 font-medium text-black">{lease.financial.securityDeposit.heldInAccount}</div>
                  </div>

                  <div>
                    <div className="text-sm text-black/50">Interest Accrued</div>
                    <div className="mt-1 font-medium text-black">
                      {formatCurrency(lease.financial.securityDeposit.interestAccrued)}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-black/50">Return Status</div>
                    <div className="mt-1">
                      <Badge variant={lease.financial.securityDeposit.returnStatus === 'held' ? 'secondary' : 'success'}>
                        {lease.financial.securityDeposit.returnStatus.toUpperCase()}
                      </Badge>
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-black/50">Deductions</div>
                    <div className="mt-1 font-medium text-black">
                      {lease.financial.securityDeposit.deductions.length === 0
                        ? 'None'
                        : `${lease.financial.securityDeposit.deductions.length} deductions`}
                    </div>
                  </div>

                  <div className="rounded-lg bg-success/10 p-3">
                    <div className="text-sm font-semibold text-success">Clean Record</div>
                    <div className="mt-1 text-sm text-black/60">No deductions from security deposit</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Utilities & Late Fees */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Utilities Included</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(lease.financial.utilitiesIncluded).map(([utility, included]) => (
                    <div key={utility} className="flex items-center justify-between">
                      <span className="text-sm capitalize text-black">{utility}</span>
                      {included ? (
                        <Badge variant="success">Included</Badge>
                      ) : (
                        <Badge variant="secondary">Not Included</Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Late Payment Terms</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-black/50">Grace Period</div>
                    <div className="mt-1 font-medium text-black">{lease.financial.latePayment.gracePeriod} days</div>
                  </div>
                  <div>
                    <div className="text-sm text-black/50">Late Fee</div>
                    <div className="mt-1 font-medium text-danger">
                      {lease.financial.latePayment.feeAmount}% of monthly rent
                      <span className="ml-2 text-sm text-black/60">
                        ({formatCurrency((lease.financial.totalMonthlyPayment * lease.financial.latePayment.feeAmount) / 100)})
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Payment Schedule Tab */}
      {activeTab === 'schedule' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Payment Schedule 2024</CardTitle>
              <div className="text-sm text-black/60">
                Paid: <strong className="text-success">{lease.paymentSchedule.filter(p => p.status === 'paid').length}</strong> |
                Pending: <strong className="text-warning">{lease.paymentSchedule.filter(p => p.status === 'pending').length}</strong>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-black/[0.08]">
                  <tr>
                    <th className="pb-3 text-left text-sm font-semibold text-black">Month</th>
                    <th className="pb-3 text-left text-sm font-semibold text-black">Due Date</th>
                    <th className="pb-3 text-right text-sm font-semibold text-black">Amount</th>
                    <th className="pb-3 text-left text-sm font-semibold text-black">Paid Date</th>
                    <th className="pb-3 text-left text-sm font-semibold text-black">Status</th>
                    <th className="pb-3 text-right text-sm font-semibold text-black">Days Early/Late</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/[0.08]">
                  {lease.paymentSchedule.map((payment, index) => {
                    const dueDate = payment.dueDate instanceof Date ? payment.dueDate : new Date(payment.dueDate)
                    const paidDate = payment.paidDate instanceof Date ? payment.paidDate : payment.paidDate ? new Date(payment.paidDate) : null
                    const daysEarly = paidDate
                      ? Math.ceil((dueDate.getTime() - paidDate.getTime()) / (1000 * 60 * 60 * 24))
                      : 0

                    return (
                      <tr key={index} className="hover:bg-black/[0.02]">
                        <td className="py-4 text-sm font-medium text-black">{payment.month}</td>
                        <td className="py-4 text-sm text-black/60">{formatDate(payment.dueDate)}</td>
                        <td className="py-4 text-right text-sm font-semibold text-black">
                          {formatCurrency(payment.amount)}
                        </td>
                        <td className="py-4 text-sm text-black/60">
                          {payment.paidDate ? formatDate(payment.paidDate) : '-'}
                        </td>
                        <td className="py-4">
                          <Badge variant={payment.status === 'paid' ? 'success' : 'warning'}>
                            {payment.status}
                          </Badge>
                        </td>
                        <td className="py-4 text-right">
                          {payment.status === 'paid' ? (
                            daysEarly >= 0 ? (
                              <span className="text-sm text-success">
                                {daysEarly === 0 ? 'On time' : `${daysEarly} day${daysEarly > 1 ? 's' : ''} early`}
                              </span>
                            ) : (
                              <span className="text-sm text-danger">{Math.abs(daysEarly)} days late</span>
                            )
                          ) : (
                            <span className="text-sm text-black/40">-</span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
                <tfoot className="border-t-2 border-black/[0.12]">
                  <tr>
                    <td colSpan={2} className="py-4 text-sm font-semibold text-black">
                      Total for 2024
                    </td>
                    <td className="py-4 text-right text-lg font-bold text-black">{formatCurrency(totalDue)}</td>
                    <td colSpan={3} className="py-4 text-right text-sm text-black/60">
                      Paid: {formatCurrency(totalPaid)} | Remaining: {formatCurrency(totalDue - totalPaid)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Renewal Tab */}
      {activeTab === 'renewal' && (
        <div className="grid gap-6">
          {/* Current Renewal Status */}
          <Card className="border-warning bg-warning/5">
            <CardHeader>
              <CardTitle>🔄 Active Renewal Process</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-black/60">Renewal Offer Status</div>
                    <div className="mt-1">
                      <Badge variant="warning" className="text-base">
                        PENDING TENANT RESPONSE
                      </Badge>
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-black/60">Offer Sent Date</div>
                    <div className="mt-1 font-medium text-black">{formatDate(lease.renewal.offerSentDate)}</div>
                  </div>

                  <div>
                    <div className="text-sm text-black/60">Response Deadline</div>
                    <div className="mt-1 font-medium text-warning">{formatDate(lease.renewal.responseDeadline)}</div>
                  </div>

                  <div className="rounded-lg bg-danger/10 p-3">
                    <div className="text-sm font-semibold text-danger">Action Required</div>
                    <div className="mt-1 text-sm text-black/70">
                      Tenant must respond by {formatDate(lease.renewal.responseDeadline)} (
                      {Math.ceil(((lease.renewal.responseDeadline instanceof Date ? lease.renewal.responseDeadline : new Date(lease.renewal.responseDeadline)).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days
                      remaining)
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-lg border border-black/[0.08] bg-white p-4">
                    <div className="mb-3 text-sm font-semibold text-black">Proposed Terms (2025)</div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-black/60">New Start Date</span>
                        <span className="text-sm font-medium text-black">
                          {formatDate(lease.renewal.proposedTerms.startDate)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-black/60">New End Date</span>
                        <span className="text-sm font-medium text-black">
                          {formatDate(lease.renewal.proposedTerms.endDate)}
                        </span>
                      </div>
                      <div className="flex justify-between border-t border-black/[0.08] pt-2">
                        <span className="text-sm text-black/60">Current Rent</span>
                        <span className="text-sm font-medium text-black">
                          {formatCurrency(lease.financial.totalMonthlyPayment)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-black/60">New Rent (5% increase)</span>
                        <span className="text-sm font-medium text-warning">
                          {formatCurrency(lease.renewal.proposedTerms.newRent)}
                        </span>
                      </div>
                      <div className="flex justify-between border-t border-black/[0.08] pt-2">
                        <span className="text-sm text-black/60">Renewal Fee</span>
                        <span className="text-sm font-medium text-black">
                          {formatCurrency(lease.renewal.proposedTerms.renewalFee)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="primary" className="flex-1">
                      Record Response
                    </Button>
                    <Button variant="secondary">Send Reminder</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Renewal History */}
          <Card>
            <CardHeader>
              <CardTitle>Renewal History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-black/[0.08]">
                    <tr>
                      <th className="pb-3 text-left text-sm font-semibold text-black">Year</th>
                      <th className="pb-3 text-right text-sm font-semibold text-black">Previous Rent</th>
                      <th className="pb-3 text-right text-sm font-semibold text-black">New Rent</th>
                      <th className="pb-3 text-right text-sm font-semibold text-black">Increase</th>
                      <th className="pb-3 text-left text-sm font-semibold text-black">Decision</th>
                      <th className="pb-3 text-left text-sm font-semibold text-black">Decision Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/[0.08]">
                    {lease.renewal.history.map((renewal, index) => (
                      <tr key={index} className="hover:bg-black/[0.02]">
                        <td className="py-4 text-sm font-medium text-black">{renewal.year}</td>
                        <td className="py-4 text-right text-sm text-black/60">{formatCurrency(renewal.previousRent)}</td>
                        <td className="py-4 text-right text-sm font-semibold text-black">
                          {formatCurrency(renewal.newRent)}
                        </td>
                        <td className="py-4 text-right text-sm text-warning">+{renewal.increase}%</td>
                        <td className="py-4">
                          <Badge variant="success">{renewal.decision}</Badge>
                        </td>
                        <td className="py-4 text-sm text-black/60">{formatDate(renewal.decisionDate)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Documents Tab */}
      {activeTab === 'documents' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>📄 Lease Documents ({lease.documents.length})</CardTitle>
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
                  {lease.documents.map((doc) => (
                    <tr key={doc.id} className="hover:bg-black/[0.02]">
                      <td className="py-4">
                        <Badge variant="secondary">{doc.type}</Badge>
                      </td>
                      <td className="py-4 text-sm font-medium text-black">{doc.name}</td>
                      <td className="py-4 text-sm text-black/60">{formatDate(doc.uploadDate)}</td>
                      <td className="py-4 text-sm text-black/60">{doc.size}</td>
                      <td className="py-4">
                        <Badge variant={doc.status === 'verified' ? 'success' : 'warning'}>{doc.status}</Badge>
                      </td>
                      <td className="py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button className="rounded-lg p-2 text-black/40 hover:bg-black/[0.04] hover:text-primary" title="View">
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          </button>
                          <button className="rounded-lg p-2 text-black/40 hover:bg-black/[0.04] hover:text-primary" title="Download">
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

      {/* Timeline Tab */}
      {activeTab === 'timeline' && (
        <Card>
          <CardHeader>
            <CardTitle>⏱️ Lease Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {lease.timeline.map((event, index) => (
                <div key={index} className="flex items-start gap-4 border-l-2 border-black/[0.08] pl-4 pb-4 last:border-0">
                  <div className="flex-shrink-0 text-2xl">{event.icon}</div>
                  <div className="flex-1">
                    <div className="font-medium text-black">{event.event}</div>
                    <div className="mt-1 text-sm text-black/50">{formatDate(event.date)}</div>
                    <Badge variant="secondary" className="mt-2">
                      {event.type}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </DashboardLayout>
  )
}
