'use client'

import React from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatCurrency, formatDate } from '@/lib/utils'

// This would come from API/database in real implementation
const facilityData = {
  id: '1',
  name: 'Swimming Pool - Building A',
  category: 'amenity',
  type: 'Swimming Pool',
  property: 'Sunset Apartments',
  location: 'Ground Floor, Building A',
  status: 'operational',
  condition: 'excellent',
  responsiblePerson: 'Ahmed Al-Rashid',
  responsibleContact: '+966 50 123 4567',
  maintenanceSchedule: 'Monthly',
  installationDate: new Date(2020, 5, 15),
  warrantyExpiry: new Date(2030, 5, 15),
  lastMaintenance: new Date(2025, 0, 15),
  nextMaintenance: new Date(2025, 1, 15),
  maintenanceCost: 1500,
  annualBudget: 18000,
  yearToDateSpend: 4500,

  // Specifications
  specifications: {
    dimensions: '25m x 12m',
    depth: '1.2m - 3m',
    capacity: '500,000 liters',
    filtrationSystem: 'Sand Filter + UV Sterilization',
    heatingSystem: 'Solar + Electric Backup',
    chemicalSystem: 'Automated Chlorine Dosing',
    safetyFeatures: 'Lifeguard Station, Emergency Shower, First Aid Kit',
  },

  // Maintenance History
  maintenanceHistory: [
    {
      id: '1',
      date: new Date(2025, 0, 15),
      type: 'Routine Maintenance',
      description: 'Monthly cleaning, chemical balance check, equipment inspection',
      cost: 1500,
      technician: 'Ahmed Al-Rashid',
      status: 'completed',
      findings: 'Pool in excellent condition. Filter replaced. Chemical levels optimal.',
    },
    {
      id: '2',
      date: new Date(2024, 11, 15),
      type: 'Routine Maintenance',
      description: 'Monthly cleaning, pump inspection, tile cleaning',
      cost: 1500,
      technician: 'Ahmed Al-Rashid',
      status: 'completed',
      findings: 'Minor crack in tile #45B repaired. Pump operating normally.',
    },
    {
      id: '3',
      date: new Date(2024, 10, 15),
      type: 'Emergency Repair',
      description: 'Filtration pump malfunction',
      cost: 3200,
      technician: 'Mohammed bin Salman',
      status: 'completed',
      findings: 'Pump motor replaced. System tested and operational.',
    },
  ],

  // Service Schedule
  serviceSchedule: [
    { task: 'Daily Water Testing', frequency: 'Daily', lastDone: 'Today', responsible: 'Pool Staff' },
    { task: 'Weekly Backwash', frequency: 'Weekly', lastDone: '2 days ago', responsible: 'Ahmed Al-Rashid' },
    { task: 'Monthly Deep Clean', frequency: 'Monthly', lastDone: '10 days ago', responsible: 'Ahmed Al-Rashid' },
    { task: 'Quarterly Equipment Inspection', frequency: 'Quarterly', lastDone: '45 days ago', responsible: 'Certified Technician' },
    { task: 'Annual Safety Audit', frequency: 'Annually', lastDone: '120 days ago', responsible: 'Safety Inspector' },
  ],

  // Safety Compliance
  safetyCompliance: [
    { item: 'Pool Safety Certificate', status: 'Valid', expiry: new Date(2025, 5, 30), authority: 'Municipal Authority' },
    { item: 'Water Quality Test', status: 'Passed', expiry: new Date(2025, 2, 15), authority: 'Health Department' },
    { item: 'Lifeguard Certification', status: 'Valid', expiry: new Date(2025, 11, 31), authority: 'Red Crescent' },
    { item: 'Chemical Storage License', status: 'Valid', expiry: new Date(2025, 8, 20), authority: 'Civil Defense' },
  ],

  // Usage Statistics
  usageStats: {
    averageDailyUsers: 45,
    peakHours: '4 PM - 8 PM',
    utilizationRate: '68%',
    operatingHours: '6 AM - 10 PM',
  },

  // Equipment Inventory
  equipment: [
    { name: 'Sand Filter System', model: 'Pentair FNS Plus', serialNumber: 'FNS-2020-45', condition: 'Good', lastService: new Date(2025, 0, 15) },
    { name: 'Variable Speed Pump', model: 'Hayward MaxFlo', serialNumber: 'MXF-2020-88', condition: 'Excellent', lastService: new Date(2024, 11, 15) },
    { name: 'UV Sterilizer', model: 'AquaUV Advantage', serialNumber: 'AUV-2020-33', condition: 'Good', lastService: new Date(2025, 0, 15) },
    { name: 'Chemical Dosing System', model: 'Prominent Dulcodos', serialNumber: 'DUL-2020-67', condition: 'Excellent', lastService: new Date(2025, 0, 15) },
    { name: 'Solar Heating Panels', model: 'Heliocol HC-50', serialNumber: 'HEL-2020-91', condition: 'Good', lastService: new Date(2024, 10, 20) },
  ],

  // Chemical Inventory
  chemicalInventory: [
    { name: 'Chlorine Tablets', currentStock: 120, unit: 'kg', reorderLevel: 50, supplier: 'Pool Chemicals Co.' },
    { name: 'pH Increaser', currentStock: 45, unit: 'kg', reorderLevel: 20, supplier: 'Pool Chemicals Co.' },
    { name: 'pH Decreaser', currentStock: 38, unit: 'kg', reorderLevel: 20, supplier: 'Pool Chemicals Co.' },
    { name: 'Algaecide', currentStock: 25, unit: 'liters', reorderLevel: 10, supplier: 'AquaChem Ltd.' },
    { name: 'Clarifier', currentStock: 15, unit: 'liters', reorderLevel: 5, supplier: 'AquaChem Ltd.' },
  ],
}

export default function FacilityDetailPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = React.useState('overview')

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'maintenance', label: 'Maintenance' },
    { id: 'schedule', label: 'Service Schedule' },
    { id: 'compliance', label: 'Safety & Compliance' },
    { id: 'equipment', label: 'Equipment' },
    { id: 'chemicals', label: 'Inventory' },
  ]

  return (
    <DashboardLayout
      title={facilityData.name}
      actions={
        <div className="flex gap-2">
          <Button variant="secondary">
            <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
            </svg>
            Edit
          </Button>
          <Button variant="primary">
            <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
            </svg>
            Schedule Maintenance
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Status Banner */}
        <Card className="border-success bg-success/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-success/20 p-2">
                  <svg className="h-6 w-6 text-success" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-black">Facility Operational</h4>
                  <p className="text-sm text-black/60">All systems running normally. Excellent condition.</p>
                </div>
              </div>
              <Badge variant="success" className="text-sm px-3 py-1">Excellent</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Key Metrics */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-black/50">Next Maintenance</div>
              <div className="mt-2 text-2xl font-semibold text-black">
                {formatDate(facilityData.nextMaintenance, { month: 'short', day: 'numeric' })}
              </div>
              <div className="mt-1 text-sm text-black/60">in 31 days</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-black/50">Monthly Cost</div>
              <div className="mt-2 text-2xl font-semibold text-black">
                {formatCurrency(facilityData.maintenanceCost)}
              </div>
              <div className="mt-1 text-sm text-black/60">Regular maintenance</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-black/50">YTD Spending</div>
              <div className="mt-2 text-2xl font-semibold text-black">
                {formatCurrency(facilityData.yearToDateSpend)}
              </div>
              <div className="mt-1 text-sm text-success">
                {Math.round((facilityData.yearToDateSpend / facilityData.annualBudget) * 100)}% of budget
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-black/50">Utilization Rate</div>
              <div className="mt-2 text-2xl font-semibold text-black">
                {facilityData.usageStats.utilizationRate}
              </div>
              <div className="mt-1 text-sm text-black/60">{facilityData.usageStats.averageDailyUsers} avg daily users</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="border-b border-black/[0.08]">
          <nav className="-mb-px flex gap-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`border-b-2 px-1 py-3 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary text-black'
                    : 'border-transparent text-black/50 hover:border-black/[0.12] hover:text-black/70'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid gap-4 lg:grid-cols-2">
            {/* Basic Info */}
            <Card>
              <CardHeader className="border-b border-black/[0.04]">
                <CardTitle className="text-lg font-semibold">Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-black/60">Category:</span>
                    <span className="font-medium text-black">Amenity - {facilityData.type}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-black/60">Property:</span>
                    <span className="font-medium text-black">{facilityData.property}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-black/60">Location:</span>
                    <span className="font-medium text-black line-clamp-1" title={facilityData.location}>{facilityData.location}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-black/60">Status:</span>
                    <Badge variant="success">{facilityData.status}</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-black/60">Condition:</span>
                    <Badge variant="success">{facilityData.condition}</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-black/60">Installation Date:</span>
                    <span className="font-medium text-black">
                      {formatDate(facilityData.installationDate, { month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-black/60">Warranty Until:</span>
                    <span className="font-medium text-black">
                      {formatDate(facilityData.warrantyExpiry, { month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Responsible Person */}
            <Card>
              <CardHeader className="border-b border-black/[0.04]">
                <CardTitle className="text-lg font-semibold">Responsible Person</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <div className="h-12 w-12 rounded-full bg-primary text-white flex items-center justify-center text-lg font-medium">
                      AA
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-black">{facilityData.responsiblePerson}</h4>
                    <p className="text-sm text-black/60">Facility Manager</p>
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center gap-2 text-sm text-black/60">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                        </svg>
                        {facilityData.responsibleContact}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="secondary" className="flex-1 text-sm py-2">
                          <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                          </svg>
                          Call
                        </Button>
                        <Button variant="secondary" className="flex-1 text-sm py-2">
                          <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                          </svg>
                          Email
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Specifications */}
            <Card className="lg:col-span-2">
              <CardHeader className="border-b border-black/[0.04]">
                <CardTitle className="text-lg font-semibold">Technical Specifications</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-black/60">Dimensions:</span>
                    <span className="font-medium text-black">{facilityData.specifications.dimensions}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-black/60">Depth Range:</span>
                    <span className="font-medium text-black">{facilityData.specifications.depth}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-black/60">Capacity:</span>
                    <span className="font-medium text-black">{facilityData.specifications.capacity}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-black/60">Filtration:</span>
                    <span className="font-medium text-black line-clamp-1" title={facilityData.specifications.filtrationSystem}>{facilityData.specifications.filtrationSystem}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-black/60">Heating:</span>
                    <span className="font-medium text-black">{facilityData.specifications.heatingSystem}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-black/60">Chemical System:</span>
                    <span className="font-medium text-black">{facilityData.specifications.chemicalSystem}</span>
                  </div>
                  <div className="flex justify-between text-sm sm:col-span-2">
                    <span className="text-black/60">Safety Features:</span>
                    <span className="font-medium text-black line-clamp-1 text-right" title={facilityData.specifications.safetyFeatures}>{facilityData.specifications.safetyFeatures}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'maintenance' && (
          <Card>
            <CardHeader className="border-b border-black/[0.04]">
              <CardTitle className="text-lg font-semibold">Maintenance History</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-black/[0.04]">
                {facilityData.maintenanceHistory.map((record) => (
                  <div key={record.id} className="p-4 hover:bg-black/[0.02]">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-black">{record.type}</h4>
                          <Badge variant={record.status === 'completed' ? 'success' : 'warning'}>
                            {record.status}
                          </Badge>
                        </div>
                        <p className="mt-1 text-sm text-black/60">{record.description}</p>
                        <p className="mt-2 text-sm text-black">{record.findings}</p>
                        <div className="mt-2 flex items-center gap-4 text-xs text-black/50">
                          <span>📅 {formatDate(record.date, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                          <span>👤 {record.technician}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-black">{formatCurrency(record.cost)}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'schedule' && (
          <Card>
            <CardHeader className="border-b border-black/[0.04]">
              <CardTitle className="text-lg font-semibold">Service Schedule</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-black/[0.08] bg-black/[0.02]">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-black/70">Task</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-black/70">Frequency</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-black/70">Last Done</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-black/70">Responsible</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/[0.04]">
                    {facilityData.serviceSchedule.map((task, index) => (
                      <tr key={index} className="hover:bg-black/[0.02]">
                        <td className="px-4 py-3 text-sm font-medium text-black">{task.task}</td>
                        <td className="px-4 py-3 text-sm text-black/60">{task.frequency}</td>
                        <td className="px-4 py-3 text-sm text-black/60">{task.lastDone}</td>
                        <td className="px-4 py-3 text-sm text-black/60">{task.responsible}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'compliance' && (
          <Card>
            <CardHeader className="border-b border-black/[0.04]">
              <CardTitle className="text-lg font-semibold">Safety & Compliance</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-black/[0.08] bg-black/[0.02]">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-black/70">Item</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-black/70">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-black/70">Expiry Date</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-black/70">Authority</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/[0.04]">
                    {facilityData.safetyCompliance.map((item, index) => (
                      <tr key={index} className="hover:bg-black/[0.02]">
                        <td className="px-4 py-3 text-sm font-medium text-black">{item.item}</td>
                        <td className="px-4 py-3">
                          <Badge variant={item.status === 'Valid' || item.status === 'Passed' ? 'success' : 'danger'}>
                            {item.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-sm text-black/60">
                          {formatDate(item.expiry, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                        <td className="px-4 py-3 text-sm text-black/60">{item.authority}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'equipment' && (
          <Card>
            <CardHeader className="border-b border-black/[0.04]">
              <CardTitle className="text-lg font-semibold">Equipment Inventory</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-black/[0.08] bg-black/[0.02]">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-black/70">Equipment</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-black/70">Model</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-black/70">Serial Number</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-black/70">Condition</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-black/70">Last Service</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/[0.04]">
                    {facilityData.equipment.map((item, index) => (
                      <tr key={index} className="hover:bg-black/[0.02]">
                        <td className="px-4 py-3 text-sm font-medium text-black">{item.name}</td>
                        <td className="px-4 py-3 text-sm text-black/60">{item.model}</td>
                        <td className="px-4 py-3 text-sm text-black/60">{item.serialNumber}</td>
                        <td className="px-4 py-3">
                          <Badge variant={item.condition === 'Excellent' ? 'success' : 'warning'}>
                            {item.condition}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-sm text-black/60">
                          {formatDate(item.lastService, { month: 'short', day: 'numeric' })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'chemicals' && (
          <Card>
            <CardHeader className="border-b border-black/[0.04]">
              <CardTitle className="text-lg font-semibold">Chemical Inventory</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-black/[0.08] bg-black/[0.02]">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-black/70">Chemical</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-black/70">Current Stock</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-black/70">Reorder Level</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-black/70">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-black/70">Supplier</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/[0.04]">
                    {facilityData.chemicalInventory.map((item, index) => (
                      <tr key={index} className="hover:bg-black/[0.02]">
                        <td className="px-4 py-3 text-sm font-medium text-black">{item.name}</td>
                        <td className="px-4 py-3 text-sm text-black/60">
                          {item.currentStock} {item.unit}
                        </td>
                        <td className="px-4 py-3 text-sm text-black/60">
                          {item.reorderLevel} {item.unit}
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant={item.currentStock > item.reorderLevel ? 'success' : 'warning'}>
                            {item.currentStock > item.reorderLevel ? 'Adequate' : 'Low Stock'}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-sm text-black/60">{item.supplier}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
