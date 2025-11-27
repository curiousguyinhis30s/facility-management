'use client'

import React from 'react'
import { useParams, useRouter } from 'next/navigation'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatCurrency, formatDate } from '@/lib/utils'

// Enhanced mock maintenance schedule data
const mockMaintenanceSchedule = {
  id: 'MS-2024-0089',
  title: 'HVAC System Quarterly Maintenance',
  type: 'Preventive Maintenance' as const,
  category: 'HVAC',

  // Property Information
  property: {
    id: 'P1',
    name: 'Sunset Apartments',
    address: '123 King Fahd Road, Riyadh',
  },

  // Equipment Details
  equipment: {
    id: 'EQ-HVAC-001',
    name: 'Central HVAC System - Main Building',
    type: 'Cooling & Heating System',
    manufacturer: 'Carrier',
    model: 'AquaEdge 19DV',
    serialNumber: 'CAR-19DV-2020-5432',
    location: 'Rooftop - Building A',
    installationDate: new Date(2020, 5, 15),
    warrantyExpiry: new Date(2025, 5, 14),

    // Lifecycle Information
    lifecycle: {
      age: 4.5, // years
      expectedLifespan: 15, // years
      remainingLifespan: 10.5, // years
      depreciationRate: 30, // percentage
      replacementCost: 450000,
      replacementReserveFund: 135000, // 30% saved
      nextPlannedReplacement: new Date(2035, 5, 1),
    },

    // Performance Metrics
    performance: {
      efficiency: 92, // percentage
      uptimePercentage: 98.5,
      energyConsumption: 'Within optimal range',
      lastPerformanceTest: new Date(2024, 7, 15),
      performanceRating: 'Excellent',
    },

    // Technical Specifications
    specifications: {
      capacity: '500 tons',
      powerConsumption: '350 kW',
      refrigerantType: 'R-410A',
      coolantCapacity: '150 liters',
      operatingTemperature: '-10°C to 50°C',
      noiseLevel: '65 dB',
    },
  },

  // Maintenance Checklist
  checklist: [
    { id: 'C1', task: 'Inspect and clean air filters', completed: true, completedBy: 'Khalid Al-Mutairi', completedDate: new Date(2024, 8, 1, 9, 30) },
    { id: 'C2', task: 'Check refrigerant levels and pressure', completed: true, completedBy: 'Khalid Al-Mutairi', completedDate: new Date(2024, 8, 1, 10, 0) },
    { id: 'C3', task: 'Lubricate all moving parts', completed: true, completedBy: 'Khalid Al-Mutairi', completedDate: new Date(2024, 8, 1, 10, 30) },
    { id: 'C4', task: 'Inspect electrical connections', completed: true, completedBy: 'Khalid Al-Mutairi', completedDate: new Date(2024, 8, 1, 11, 0) },
    { id: 'C5', task: 'Test thermostat calibration', completed: true, completedBy: 'Khalid Al-Mutairi', completedDate: new Date(2024, 8, 1, 11, 30) },
    { id: 'C6', task: 'Clean condenser and evaporator coils', completed: true, completedBy: 'Khalid Al-Mutairi', completedDate: new Date(2024, 8, 1, 12, 0) },
    { id: 'C7', task: 'Check and tighten all belts', completed: true, completedBy: 'Khalid Al-Mutairi', completedDate: new Date(2024, 8, 1, 13, 0) },
    { id: 'C8', task: 'Verify safety controls operation', completed: true, completedBy: 'Khalid Al-Mutairi', completedDate: new Date(2024, 8, 1, 13, 30) },
    { id: 'C9', task: 'Test emergency shutdown procedures', completed: true, completedBy: 'Khalid Al-Mutairi', completedDate: new Date(2024, 8, 1, 14, 0) },
    { id: 'C10', task: 'Document all findings and recommendations', completed: true, completedBy: 'Khalid Al-Mutairi', completedDate: new Date(2024, 8, 1, 14, 30) },
  ],

  // Schedule Information
  schedule: {
    frequency: 'Quarterly',
    lastServiceDate: new Date(2024, 8, 1),
    nextServiceDate: new Date(2024, 11, 1),
    daysUntilNext: 37,
    serviceWindow: '8 AM - 3 PM',
    estimatedDuration: '6-8 hours',
    requiresShutdown: true,
    shutdownNoticeRequired: 7, // days
  },

  // Service Provider
  serviceProvider: {
    id: 'V1',
    name: 'Cool Breeze HVAC Services',
    type: 'vendor' as const,
    phone: '+966 11 234 5678',
    email: 'service@coolbreezehvac.sa',
    contractNumber: 'CNT-2024-0012',
    contractStart: new Date(2024, 0, 1),
    contractEnd: new Date(2024, 11, 31),

    // SLA Terms
    sla: {
      responseTime: '4 hours',
      resolutionTime: '24 hours',
      coverageHours: '24/7',
      emergencyContact: '+966 50 123 4567',
      penaltyForBreach: '5% of monthly fee',
    },

    // Performance
    performance: {
      jobsCompleted: 23,
      averageResponseTime: '2.5 hours',
      qualityRating: 4.8,
      onTimeCompletionRate: 96,
      customerSatisfaction: 4.9,
    },
  },

  // Cost Information
  costs: {
    plannedCost: 3500,
    actualCost: 3200,
    variance: -300,
    variancePercentage: -8.6,
    breakdown: {
      labor: 2000,
      parts: 800,
      materials: 400,
    },
    annualBudget: 14000,
    yearToDateSpent: 9600,
    remainingBudget: 4400,
  },

  // Service History
  serviceHistory: [
    {
      id: 'SH1',
      date: new Date(2024, 8, 1),
      type: 'Quarterly Maintenance',
      cost: 3200,
      findings: 'All systems operating normally. Minor filter replacement needed.',
      performedBy: 'Cool Breeze HVAC Services',
      rating: 5,
    },
    {
      id: 'SH2',
      date: new Date(2024, 5, 1),
      type: 'Quarterly Maintenance',
      cost: 3100,
      findings: 'Replaced capacitor. Recharged refrigerant. System performance excellent.',
      performedBy: 'Cool Breeze HVAC Services',
      rating: 5,
    },
    {
      id: 'SH3',
      date: new Date(2024, 2, 1),
      type: 'Quarterly Maintenance',
      cost: 2900,
      findings: 'Routine service. All components in good condition.',
      performedBy: 'Cool Breeze HVAC Services',
      rating: 4.5,
    },
  ],

  // Parts Replaced History
  partsHistory: [
    {
      id: 'PH1',
      date: new Date(2024, 5, 1),
      partName: 'Compressor Capacitor - 35/5 MFD',
      partNumber: 'CAP-35/5-410A',
      quantity: 1,
      cost: 750,
      warranty: '6 months',
      supplier: 'HVAC Parts Saudi',
    },
    {
      id: 'PH2',
      date: new Date(2024, 8, 1),
      partName: 'Air Filter Set (12 units)',
      partNumber: 'FILT-20x25-HEPA',
      quantity: 12,
      cost: 600,
      warranty: 'N/A',
      supplier: 'HVAC Parts Saudi',
    },
  ],

  // Compliance & Certifications
  compliance: {
    fireSafety: {
      certified: true,
      certificateNumber: 'FS-2024-0234',
      issuedDate: new Date(2024, 0, 15),
      expiryDate: new Date(2025, 0, 14),
      issuingAuthority: 'Saudi Civil Defense',
      nextInspection: new Date(2025, 0, 1),
    },
    environmental: {
      certified: true,
      rating: 'Energy Star Certified',
      co2Emissions: 'Within acceptable limits',
      refrigerantLeakTest: 'Passed',
      lastTestDate: new Date(2024, 8, 1),
    },
    regulatory: {
      compliant: true,
      standardsMetSaudi: ['SASO 2663', 'SASO 2872'],
      lastInspectionDate: new Date(2024, 7, 1),
      nextInspectionDate: new Date(2025, 7, 1),
      inspectorName: 'Saudi Building Code Authority',
    },
  },

  // Documents
  documents: [
    { id: 'D1', type: 'Service Report', name: 'Q3_2024_Maintenance_Report.pdf', date: new Date(2024, 8, 1), size: '2.1 MB' },
    { id: 'D2', type: 'Safety Certificate', name: 'Fire_Safety_Certificate_2024.pdf', date: new Date(2024, 0, 15), size: '850 KB' },
    { id: 'D3', type: 'Equipment Manual', name: 'Carrier_19DV_Manual.pdf', date: new Date(2020, 5, 15), size: '12.4 MB' },
    { id: 'D4', type: 'Warranty Certificate', name: 'Equipment_Warranty.pdf', date: new Date(2020, 5, 15), size: '450 KB' },
    { id: 'D5', type: 'Service Contract', name: 'HVAC_Service_Contract_2024.pdf', date: new Date(2024, 0, 1), size: '1.8 MB' },
  ],

  // Status
  status: 'completed' as const,
  completionPercentage: 100,
}

export default function MaintenanceDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [activeTab, setActiveTab] = React.useState<'overview' | 'equipment' | 'checklist' | 'history' | 'compliance' | 'costs'>('overview')
  const maintenance = mockMaintenanceSchedule

  const checklistCompletionRate = ((maintenance.checklist.filter(c => c.completed).length / maintenance.checklist.length) * 100).toFixed(0)
  const lifecycleProgress = ((maintenance.equipment.lifecycle.age / maintenance.equipment.lifecycle.expectedLifespan) * 100).toFixed(0)

  return (
    <DashboardLayout
      title={maintenance.title}
      actions={
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => router.push(`/properties/${maintenance.property.id}`)}>
            <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
            </svg>
            View Property
          </Button>
          <Button variant="primary">
            <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z" />
            </svg>
            Download Report
          </Button>
        </div>
      }
    >
      {/* Status Header */}
      <Card className="mb-6 border-success bg-success/5">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Badge variant="success" className="text-base">
                {maintenance.status.toUpperCase()}
              </Badge>
              <div className="h-8 w-px bg-black/[0.12]" />
              <div>
                <div className="text-sm text-black/60">Service ID</div>
                <div className="font-semibold text-black">{maintenance.id}</div>
              </div>
              <div className="h-8 w-px bg-black/[0.12]" />
              <div>
                <div className="text-sm text-black/60">Type</div>
                <Badge variant="secondary">{maintenance.type}</Badge>
              </div>
              <div className="h-8 w-px bg-black/[0.12]" />
              <div>
                <div className="text-sm text-black/60">Category</div>
                <div className="font-semibold text-black">{maintenance.category}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-black/60">Next Service</div>
              <div className="mt-1 text-xl font-bold text-warning">
                {maintenance.schedule.daysUntilNext} days
              </div>
              <div className="text-sm text-black/60">{formatDate(maintenance.schedule.nextServiceDate)}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tab Navigation */}
      <div className="mb-6 flex gap-2 border-b border-black/[0.08]">
        {[
          { id: 'overview', label: '📋 Overview' },
          { id: 'equipment', label: '⚙️ Equipment Details' },
          { id: 'checklist', label: '✅ Maintenance Checklist' },
          { id: 'history', label: '📜 Service History' },
          { id: 'compliance', label: '🛡️ Compliance & Certs' },
          { id: 'costs', label: '💰 Cost Analysis' },
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
          {/* Key Metrics */}
          <div className="grid gap-6 md:grid-cols-4">
            <Card>
              <CardContent className="p-6">
                <div className="text-sm text-black/50">Equipment Age</div>
                <div className="mt-2 text-3xl font-semibold text-black">{maintenance.equipment.lifecycle.age} yrs</div>
                <div className="mt-2 text-sm text-black/50">
                  {maintenance.equipment.lifecycle.expectedLifespan} yrs lifespan
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="text-sm text-black/50">Performance</div>
                <div className="mt-2 text-3xl font-semibold text-success">
                  {maintenance.equipment.performance.efficiency}%
                </div>
                <div className="mt-2 text-sm text-black/50">{maintenance.equipment.performance.performanceRating}</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="text-sm text-black/50">Uptime</div>
                <div className="mt-2 text-3xl font-semibold text-success">
                  {maintenance.equipment.performance.uptimePercentage}%
                </div>
                <div className="mt-2 text-sm text-black/50">Reliability excellent</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="text-sm text-black/50">Service Frequency</div>
                <div className="mt-2 text-2xl font-semibold text-black">{maintenance.schedule.frequency}</div>
                <div className="mt-2 text-sm text-black/50">Regular schedule</div>
              </CardContent>
            </Card>
          </div>

          {/* Property & Equipment Info */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Property Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="font-semibold text-black">{maintenance.property.name}</div>
                    <div className="text-sm text-black/60">{maintenance.property.address}</div>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => router.push(`/properties/${maintenance.property.id}`)}
                  >
                    View Property Details
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Equipment Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-black/60">Name:</span>
                    <span className="font-medium text-black">{maintenance.equipment.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-black/60">Type:</span>
                    <span className="font-medium text-black">{maintenance.equipment.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-black/60">Manufacturer:</span>
                    <span className="font-medium text-black">{maintenance.equipment.manufacturer}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-black/60">Model:</span>
                    <span className="font-medium text-black">{maintenance.equipment.model}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-black/60">Serial:</span>
                    <span className="font-mono text-sm text-black">{maintenance.equipment.serialNumber}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Service Provider */}
          <Card>
            <CardHeader>
              <CardTitle>Service Provider Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <div className="font-semibold text-black">{maintenance.serviceProvider.name}</div>
                    <Badge variant="secondary" className="mt-1">
                      {maintenance.serviceProvider.type}
                    </Badge>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <svg className="h-4 w-4 text-black/40" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                      </svg>
                      <a href={`tel:${maintenance.serviceProvider.phone}`} className="text-primary hover:underline">
                        {maintenance.serviceProvider.phone}
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="h-4 w-4 text-black/40" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                      </svg>
                      <a href={`mailto:${maintenance.serviceProvider.email}`} className="text-primary hover:underline">
                        {maintenance.serviceProvider.email}
                      </a>
                    </div>
                  </div>
                  <div className="text-sm">
                    <span className="text-black/60">Contract: </span>
                    <span className="font-mono font-medium text-black">{maintenance.serviceProvider.contractNumber}</span>
                  </div>
                </div>

                <div className="rounded-lg bg-black/[0.02] p-4">
                  <div className="mb-3 text-sm font-semibold text-black/70">Performance Metrics</div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-black/60">Jobs Completed:</span>
                      <span className="font-medium text-black">{maintenance.serviceProvider.performance.jobsCompleted}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-black/60">Quality Rating:</span>
                      <span className="font-medium text-success">{maintenance.serviceProvider.performance.qualityRating}/5.0</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-black/60">On-Time Rate:</span>
                      <span className="font-medium text-success">{maintenance.serviceProvider.performance.onTimeCompletionRate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-black/60">Avg Response:</span>
                      <span className="font-medium text-success">{maintenance.serviceProvider.performance.averageResponseTime}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Schedule Information */}
          <Card>
            <CardHeader>
              <CardTitle>Maintenance Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <div className="text-sm text-black/60">Last Service</div>
                  <div className="mt-1 font-semibold text-black">{formatDate(maintenance.schedule.lastServiceDate)}</div>
                </div>
                <div>
                  <div className="text-sm text-black/60">Next Service</div>
                  <div className="mt-1 font-semibold text-warning">{formatDate(maintenance.schedule.nextServiceDate)}</div>
                </div>
                <div>
                  <div className="text-sm text-black/60">Days Until Next</div>
                  <div className="mt-1 text-2xl font-bold text-warning">{maintenance.schedule.daysUntilNext}</div>
                </div>
              </div>
              <div className="mt-4 grid gap-4 rounded-lg bg-black/[0.02] p-4 md:grid-cols-2">
                <div className="text-sm">
                  <span className="text-black/60">Service Window: </span>
                  <span className="font-medium text-black">{maintenance.schedule.serviceWindow}</span>
                </div>
                <div className="text-sm">
                  <span className="text-black/60">Duration: </span>
                  <span className="font-medium text-black">{maintenance.schedule.estimatedDuration}</span>
                </div>
                <div className="text-sm">
                  <span className="text-black/60">Requires Shutdown: </span>
                  <Badge variant={maintenance.schedule.requiresShutdown ? 'danger' : 'success'}>
                    {maintenance.schedule.requiresShutdown ? 'Yes' : 'No'}
                  </Badge>
                </div>
                {maintenance.schedule.requiresShutdown && (
                  <div className="text-sm">
                    <span className="text-black/60">Notice Required: </span>
                    <span className="font-medium text-black">{maintenance.schedule.shutdownNoticeRequired} days</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Equipment Details Tab */}
      {activeTab === 'equipment' && (
        <div className="grid gap-6">
          {/* Lifecycle Progress */}
          <Card>
            <CardHeader>
              <CardTitle>Equipment Lifecycle</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="text-black/60">Lifecycle Progress</span>
                    <span className="font-semibold text-black">{lifecycleProgress}% of expected lifespan</span>
                  </div>
                  <div className="h-4 overflow-hidden rounded-full bg-black/[0.08]">
                    <div
                      className="h-full rounded-full bg-success transition-all"
                      style={{ width: `${lifecycleProgress}%` }}
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-4">
                  <div>
                    <div className="text-sm text-black/60">Installation Date</div>
                    <div className="mt-1 font-medium text-black">{formatDate(maintenance.equipment.installationDate)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-black/60">Current Age</div>
                    <div className="mt-1 text-2xl font-semibold text-black">{maintenance.equipment.lifecycle.age} yrs</div>
                  </div>
                  <div>
                    <div className="text-sm text-black/60">Expected Lifespan</div>
                    <div className="mt-1 text-2xl font-semibold text-black">{maintenance.equipment.lifecycle.expectedLifespan} yrs</div>
                  </div>
                  <div>
                    <div className="text-sm text-black/60">Remaining Life</div>
                    <div className="mt-1 text-2xl font-semibold text-success">{maintenance.equipment.lifecycle.remainingLifespan} yrs</div>
                  </div>
                </div>

                <div className="grid gap-4 rounded-lg bg-primary/5 p-4 md:grid-cols-3">
                  <div>
                    <div className="text-sm text-black/60">Replacement Cost</div>
                    <div className="mt-1 text-xl font-semibold text-black">
                      {formatCurrency(maintenance.equipment.lifecycle.replacementCost)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-black/60">Reserve Fund</div>
                    <div className="mt-1 text-xl font-semibold text-success">
                      {formatCurrency(maintenance.equipment.lifecycle.replacementReserveFund)}
                    </div>
                    <div className="text-xs text-black/60">
                      {maintenance.equipment.lifecycle.depreciationRate}% saved
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-black/60">Planned Replacement</div>
                    <div className="mt-1 font-medium text-black">
                      {formatDate(maintenance.equipment.lifecycle.nextPlannedReplacement)}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Technical Specifications */}
          <Card>
            <CardHeader>
              <CardTitle>Technical Specifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {Object.entries(maintenance.equipment.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between rounded-lg bg-black/[0.02] p-3">
                    <span className="capitalize text-black/60">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                    <span className="font-medium text-black">{value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-lg bg-success/10 p-4">
                  <div className="text-sm text-black/60">Efficiency Rating</div>
                  <div className="mt-2 text-4xl font-bold text-success">{maintenance.equipment.performance.efficiency}%</div>
                  <div className="mt-1 text-sm text-black/60">Operating at optimal efficiency</div>
                </div>
                <div className="rounded-lg bg-success/10 p-4">
                  <div className="text-sm text-black/60">Uptime Percentage</div>
                  <div className="mt-2 text-4xl font-bold text-success">{maintenance.equipment.performance.uptimePercentage}%</div>
                  <div className="mt-1 text-sm text-black/60">Excellent reliability</div>
                </div>
                <div className="rounded-lg bg-black/[0.02] p-4">
                  <div className="text-sm text-black/60">Energy Consumption</div>
                  <div className="mt-2 font-semibold text-black">{maintenance.equipment.performance.energyConsumption}</div>
                </div>
                <div className="rounded-lg bg-black/[0.02] p-4">
                  <div className="text-sm text-black/60">Performance Rating</div>
                  <div className="mt-2 font-semibold text-success">{maintenance.equipment.performance.performanceRating}</div>
                  <div className="mt-1 text-xs text-black/60">
                    Last tested: {formatDate(maintenance.equipment.performance.lastPerformanceTest)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Warranty Information */}
          <Card>
            <CardHeader>
              <CardTitle>Warranty Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between rounded-lg bg-warning/10 p-4">
                <div>
                  <div className="text-sm text-black/60">Warranty Expiry Date</div>
                  <div className="mt-1 text-2xl font-semibold text-warning">
                    {formatDate(maintenance.equipment.warrantyExpiry)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-black/60">Days Remaining</div>
                  <div className="mt-1 text-2xl font-semibold text-warning">
                    {Math.ceil(((maintenance.equipment.warrantyExpiry instanceof Date ? maintenance.equipment.warrantyExpiry : new Date(maintenance.equipment.warrantyExpiry)).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Checklist Tab */}
      {activeTab === 'checklist' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Maintenance Checklist</CardTitle>
              <div className="text-right">
                <div className="text-sm text-black/60">Completion Rate</div>
                <div className="text-2xl font-bold text-success">{checklistCompletionRate}%</div>
                <div className="text-sm text-black/60">
                  {maintenance.checklist.filter(c => c.completed).length}/{maintenance.checklist.length} tasks
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {maintenance.checklist.map((item) => (
                <div
                  key={item.id}
                  className={`flex items-start gap-4 rounded-lg p-4 ${
                    item.completed ? 'bg-success/10' : 'bg-black/[0.02]'
                  }`}
                >
                  <div className="flex-shrink-0">
                    {item.completed ? (
                      <svg className="h-6 w-6 text-success" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    ) : (
                      <svg className="h-6 w-6 text-black/40" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className={`font-medium ${item.completed ? 'text-black' : 'text-black/60'}`}>
                      {item.task}
                    </div>
                    {item.completed && (
                      <div className="mt-1 text-sm text-black/60">
                        Completed by {item.completedBy} on {formatDate(item.completedDate!)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Service History Tab */}
      {activeTab === 'history' && (
        <div className="grid gap-6">
          {/* Service History */}
          <Card>
            <CardHeader>
              <CardTitle>Service History ({maintenance.serviceHistory.length} services)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {maintenance.serviceHistory.map((service) => (
                  <div key={service.id} className="rounded-lg border border-black/[0.08] p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">{service.type}</Badge>
                          <span className="text-sm text-black/50">{formatDate(service.date)}</span>
                        </div>
                        <div className="mt-2 text-sm text-black">{service.findings}</div>
                        <div className="mt-2 text-sm text-black/60">Performed by: {service.performedBy}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-black">{formatCurrency(service.cost)}</div>
                        <div className="mt-1 flex items-center gap-1 text-sm">
                          <span className="text-warning">★</span>
                          <span className="font-medium text-black">{service.rating}/5.0</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Parts Replaced History */}
          <Card>
            <CardHeader>
              <CardTitle>Parts Replacement History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-black/[0.08]">
                    <tr>
                      <th className="pb-3 text-left text-sm font-semibold text-black">Date</th>
                      <th className="pb-3 text-left text-sm font-semibold text-black">Part Name</th>
                      <th className="pb-3 text-left text-sm font-semibold text-black">Part Number</th>
                      <th className="pb-3 text-right text-sm font-semibold text-black">Qty</th>
                      <th className="pb-3 text-right text-sm font-semibold text-black">Cost</th>
                      <th className="pb-3 text-left text-sm font-semibold text-black">Warranty</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/[0.08]">
                    {maintenance.partsHistory.map((part) => (
                      <tr key={part.id} className="hover:bg-black/[0.02]">
                        <td className="py-4 text-sm text-black">{formatDate(part.date)}</td>
                        <td className="py-4 text-sm font-medium text-black">{part.partName}</td>
                        <td className="py-4 font-mono text-sm text-black/60">{part.partNumber}</td>
                        <td className="py-4 text-right text-sm text-black">{part.quantity}</td>
                        <td className="py-4 text-right text-sm font-semibold text-black">
                          {formatCurrency(part.cost)}
                        </td>
                        <td className="py-4 text-sm text-black/60">{part.warranty}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Compliance Tab */}
      {activeTab === 'compliance' && (
        <div className="grid gap-6">
          {/* Fire Safety */}
          <Card>
            <CardHeader>
              <CardTitle>🔥 Fire Safety Certification</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="success">CERTIFIED</Badge>
                    <span className="text-sm text-black/60">Valid until {formatDate(maintenance.compliance.fireSafety.expiryDate)}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-black/60">Certificate Number: </span>
                    <span className="font-mono font-medium text-black">
                      {maintenance.compliance.fireSafety.certificateNumber}
                    </span>
                  </div>
                  <div className="text-sm">
                    <span className="text-black/60">Issuing Authority: </span>
                    <span className="font-medium text-black">{maintenance.compliance.fireSafety.issuingAuthority}</span>
                  </div>
                </div>
                <div className="rounded-lg bg-success/10 p-4">
                  <div className="text-sm text-black/60">Next Inspection</div>
                  <div className="mt-1 text-xl font-semibold text-black">
                    {formatDate(maintenance.compliance.fireSafety.nextInspection)}
                  </div>
                  <div className="mt-1 text-sm text-black/60">
                    {Math.ceil(((maintenance.compliance.fireSafety.nextInspection instanceof Date ? maintenance.compliance.fireSafety.nextInspection : new Date(maintenance.compliance.fireSafety.nextInspection)).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days remaining
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Environmental Compliance */}
          <Card>
            <CardHeader>
              <CardTitle>🌍 Environmental Compliance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge variant="success">CERTIFIED</Badge>
                  <span className="font-semibold text-black">{maintenance.compliance.environmental.rating}</span>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-lg bg-black/[0.02] p-3">
                    <div className="text-sm text-black/60">CO₂ Emissions</div>
                    <div className="mt-1 font-medium text-black">{maintenance.compliance.environmental.co2Emissions}</div>
                  </div>
                  <div className="rounded-lg bg-black/[0.02] p-3">
                    <div className="text-sm text-black/60">Refrigerant Leak Test</div>
                    <div className="mt-1 font-medium text-success">{maintenance.compliance.environmental.refrigerantLeakTest}</div>
                    <div className="text-xs text-black/60">
                      Tested: {formatDate(maintenance.compliance.environmental.lastTestDate)}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Regulatory Compliance */}
          <Card>
            <CardHeader>
              <CardTitle>📋 Regulatory Compliance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge variant="success">COMPLIANT</Badge>
                  <span className="text-sm text-black/60">All standards met</span>
                </div>
                <div>
                  <div className="mb-2 text-sm font-semibold text-black/70">Standards Met (Saudi Arabia)</div>
                  <div className="flex flex-wrap gap-2">
                    {maintenance.compliance.regulatory.standardsMetSaudi.map((standard) => (
                      <Badge key={standard} variant="secondary">
                        {standard}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-lg bg-black/[0.02] p-3">
                    <div className="text-sm text-black/60">Last Inspection</div>
                    <div className="mt-1 font-medium text-black">
                      {formatDate(maintenance.compliance.regulatory.lastInspectionDate)}
                    </div>
                    <div className="text-xs text-black/60">By: {maintenance.compliance.regulatory.inspectorName}</div>
                  </div>
                  <div className="rounded-lg bg-black/[0.02] p-3">
                    <div className="text-sm text-black/60">Next Inspection</div>
                    <div className="mt-1 font-medium text-black">
                      {formatDate(maintenance.compliance.regulatory.nextInspectionDate)}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Documents */}
          <Card>
            <CardHeader>
              <CardTitle>📄 Compliance Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-black/[0.08]">
                    <tr>
                      <th className="pb-3 text-left text-sm font-semibold text-black">Type</th>
                      <th className="pb-3 text-left text-sm font-semibold text-black">File Name</th>
                      <th className="pb-3 text-left text-sm font-semibold text-black">Date</th>
                      <th className="pb-3 text-left text-sm font-semibold text-black">Size</th>
                      <th className="pb-3 text-right text-sm font-semibold text-black">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/[0.08]">
                    {maintenance.documents.map((doc) => (
                      <tr key={doc.id} className="hover:bg-black/[0.02]">
                        <td className="py-4">
                          <Badge variant="secondary">{doc.type}</Badge>
                        </td>
                        <td className="py-4 text-sm font-medium text-black">{doc.name}</td>
                        <td className="py-4 text-sm text-black/60">{formatDate(doc.date)}</td>
                        <td className="py-4 text-sm text-black/60">{doc.size}</td>
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
        </div>
      )}

      {/* Cost Analysis Tab */}
      {activeTab === 'costs' && (
        <div className="grid gap-6">
          {/* Cost Comparison */}
          <Card>
            <CardHeader>
              <CardTitle>💰 Cost Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="text-sm font-semibold text-black/70">Planned Cost</div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-black/60">Estimated Total</span>
                      <span className="font-medium text-black">{formatCurrency(maintenance.costs.plannedCost)}</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="text-sm font-semibold text-black/70">Actual Cost</div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-black/60">Total Spent</span>
                      <span className="font-semibold text-success">{formatCurrency(maintenance.costs.actualCost)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-lg bg-success/10 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold text-black/70">Cost Variance</div>
                    <div className="mt-1 text-sm text-black/60">Under budget - efficient service</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-success">
                      {formatCurrency(Math.abs(maintenance.costs.variance))} saved
                    </div>
                    <div className="text-sm text-success">
                      {Math.abs(maintenance.costs.variancePercentage).toFixed(1)}% under budget
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cost Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Cost Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(maintenance.costs.breakdown).map(([category, amount]) => (
                  <div key={category} className="flex justify-between rounded-lg bg-black/[0.02] p-4">
                    <span className="capitalize text-black/70">{category}</span>
                    <span className="font-semibold text-black">{formatCurrency(amount as number)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Annual Budget Tracking */}
          <Card>
            <CardHeader>
              <CardTitle>Annual Budget Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="text-black/60">Budget Utilization</span>
                    <span className="font-semibold text-black">
                      {((maintenance.costs.yearToDateSpent / maintenance.costs.annualBudget) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="h-4 overflow-hidden rounded-full bg-black/[0.08]">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{
                        width: `${(maintenance.costs.yearToDateSpent / maintenance.costs.annualBudget) * 100}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-lg bg-black/[0.02] p-4">
                    <div className="text-sm text-black/60">Annual Budget</div>
                    <div className="mt-1 text-xl font-semibold text-black">
                      {formatCurrency(maintenance.costs.annualBudget)}
                    </div>
                  </div>
                  <div className="rounded-lg bg-primary/10 p-4">
                    <div className="text-sm text-black/60">Year-to-Date Spent</div>
                    <div className="mt-1 text-xl font-semibold text-black">
                      {formatCurrency(maintenance.costs.yearToDateSpent)}
                    </div>
                  </div>
                  <div className="rounded-lg bg-success/10 p-4">
                    <div className="text-sm text-black/60">Remaining Budget</div>
                    <div className="mt-1 text-xl font-semibold text-success">
                      {formatCurrency(maintenance.costs.remainingBudget)}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </DashboardLayout>
  )
}
