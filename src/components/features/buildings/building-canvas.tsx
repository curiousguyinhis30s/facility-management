'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, LineChart, Line, AreaChart, Area
} from 'recharts'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useData } from '@/contexts/DataContext'
import { formatCurrency, formatDate } from '@/lib/utils'
import type { BuildingCanvasData, Unit, Tenant, Lease, Facility, WorkOrder } from '@/types/entities'

interface BuildingCanvasProps {
  propertyId: string
}

// Color palette
const COLORS = {
  primary: '#2563EB',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  secondary: '#6B7280',
  purple: '#8B5CF6',
  pink: '#EC4899',
}

const PIE_COLORS = [COLORS.success, COLORS.danger, COLORS.warning, COLORS.secondary]

export function BuildingCanvas({ propertyId }: BuildingCanvasProps) {
  const { getBuildingCanvasData, getPropertyById } = useData()
  const [activeTab, setActiveTab] = useState<'overview' | 'units' | 'tenants' | 'leases' | 'facilities' | 'workorders'>('overview')
  const [selectedImage, setSelectedImage] = useState(0)

  const data = getBuildingCanvasData(propertyId)
  const property = getPropertyById(propertyId)

  if (!data || !property) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 text-black/40" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-black">Property not found</h3>
          <p className="mt-1 text-sm text-black/50">The property you're looking for doesn't exist.</p>
          <div className="mt-6">
            <Link href="/properties">
              <Button variant="primary">Back to Properties</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const { stats, units, tenants, leases, facilities, workOrders } = data

  // Memoized chart data for performance optimization
  const occupancyData = useMemo(() => [
    { name: 'Occupied', value: stats.occupiedUnits, color: COLORS.success },
    { name: 'Vacant', value: stats.vacantUnits, color: COLORS.danger },
  ], [stats.occupiedUnits, stats.vacantUnits])

  const leaseStatusData = useMemo(() => [
    { name: 'Active', value: leases.filter(l => l.status === 'active').length, color: COLORS.success },
    { name: 'Expiring', value: leases.filter(l => l.status === 'expiring').length, color: COLORS.warning },
    { name: 'Expired', value: leases.filter(l => l.status === 'expired').length, color: COLORS.danger },
  ], [leases])

  const facilityStatusData = useMemo(() => [
    { name: 'Operational', value: facilities.filter(f => f.status === 'operational').length },
    { name: 'Maintenance', value: facilities.filter(f => f.status === 'maintenance').length },
    { name: 'Offline', value: facilities.filter(f => f.status === 'offline').length },
  ], [facilities])

  const workOrderPriorityData = useMemo(() => [
    { name: 'Urgent', count: workOrders.filter(w => w.priority === 'urgent').length, fill: COLORS.danger },
    { name: 'High', count: workOrders.filter(w => w.priority === 'high').length, fill: COLORS.warning },
    { name: 'Medium', count: workOrders.filter(w => w.priority === 'medium').length, fill: COLORS.primary },
    { name: 'Low', count: workOrders.filter(w => w.priority === 'low').length, fill: COLORS.secondary },
  ], [workOrders])

  // Monthly revenue trend (mock data for demonstration)
  const revenueData = useMemo(() => [
    { month: 'Jul', revenue: stats.monthlyRevenue * 0.92 },
    { month: 'Aug', revenue: stats.monthlyRevenue * 0.95 },
    { month: 'Sep', revenue: stats.monthlyRevenue * 0.98 },
    { month: 'Oct', revenue: stats.monthlyRevenue * 0.96 },
    { month: 'Nov', revenue: stats.monthlyRevenue * 1.0 },
    { month: 'Dec', revenue: stats.monthlyRevenue * 1.02 },
  ], [stats.monthlyRevenue])

  const tabs = useMemo(() => [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'units', label: `Units (${units.length})`, icon: '🏢' },
    { id: 'tenants', label: `Tenants (${tenants.length})`, icon: '👥' },
    { id: 'leases', label: `Leases (${leases.length})`, icon: '📄' },
    { id: 'facilities', label: `Facilities (${facilities.length})`, icon: '🔧' },
    { id: 'workorders', label: `Work Orders (${workOrders.length})`, icon: '🛠️' },
  ] as const, [units.length, tenants.length, leases.length, facilities.length, workOrders.length])

  return (
    <div className="space-y-6">
      {/* Header with Building Image Gallery */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Image Gallery */}
        <div className="lg:col-span-1">
          <Card className="overflow-hidden">
            <div className="relative aspect-[4/3]">
              {property.images && property.images.length > 0 ? (
                <img
                  src={property.images[selectedImage]}
                  alt={property.name}
                  className="w-full h-full object-cover"
                />
              ) : property.imageUrl ? (
                <img
                  src={property.imageUrl}
                  alt={property.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-black/[0.04] flex items-center justify-center">
                  <svg className="h-20 w-20 text-black/[0.12]" fill="none" viewBox="0 0 24 24" strokeWidth="1" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                  </svg>
                </div>
              )}
              {/* Image type badge */}
              <div className="absolute top-3 left-3">
                <Badge variant="secondary" className="bg-black/60 text-white border-0">
                  {property.type.charAt(0).toUpperCase() + property.type.slice(1)}
                </Badge>
              </div>
            </div>
            {/* Thumbnail strip */}
            {property.images && property.images.length > 1 && (
              <div className="flex gap-2 p-3 overflow-x-auto">
                {property.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`flex-shrink-0 w-16 h-12 rounded-md overflow-hidden border-2 transition-all ${
                      selectedImage === idx ? 'border-primary ring-2 ring-primary/20' : 'border-transparent hover:border-black/[0.12]'
                    }`}
                  >
                    <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Building Info */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-black">{property.name}</h1>
                  <p className="text-black/50 mt-1">
                    {property.address}, {property.city}, {property.state} {property.zipCode}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="secondary" size="sm">Edit</Button>
                  <Button variant="primary" size="sm">Add Work Order</Button>
                </div>
              </div>

              {property.description && (
                <p className="text-black/60 mb-4">{property.description}</p>
              )}

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl p-4">
                  <div className="text-sm text-blue-600 font-medium">Occupancy</div>
                  <div className="text-2xl font-bold text-blue-700">{stats.occupancyRate}%</div>
                  <div className="text-xs text-blue-500">{stats.occupiedUnits}/{stats.totalUnits} units</div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl p-4">
                  <div className="text-sm text-green-600 font-medium">Revenue</div>
                  <div className="text-2xl font-bold text-green-700">{formatCurrency(stats.monthlyRevenue)}</div>
                  <div className="text-xs text-green-500">Monthly</div>
                </div>
                <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-xl p-4">
                  <div className="text-sm text-amber-600 font-medium">Outstanding</div>
                  <div className="text-2xl font-bold text-amber-700">{formatCurrency(stats.outstandingBalance)}</div>
                  <div className="text-xs text-amber-500">Balance due</div>
                </div>
                <div className="bg-gradient-to-br from-red-50 to-red-100/50 rounded-xl p-4">
                  <div className="text-sm text-red-600 font-medium">Open Issues</div>
                  <div className="text-2xl font-bold text-red-700">{stats.openWorkOrders}</div>
                  <div className="text-xs text-red-500">{stats.urgentWorkOrders} urgent</div>
                </div>
              </div>

              {/* Amenities */}
              {property.amenities && property.amenities.length > 0 && (
                <div>
                  <div className="text-sm font-medium text-black/70 mb-2">Amenities</div>
                  <div className="flex flex-wrap gap-2">
                    {property.amenities.map((amenity, idx) => (
                      <Badge key={idx} variant="secondary">{amenity}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Property Details */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-black/[0.04]">
                <div>
                  <div className="text-xs text-black/50">Year Built</div>
                  <div className="text-sm font-medium">{property.yearBuilt || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-xs text-black/50">Square Footage</div>
                  <div className="text-sm font-medium">{property.squareFootage?.toLocaleString() || 'N/A'} sq ft</div>
                </div>
                <div>
                  <div className="text-xs text-black/50">Parking Spaces</div>
                  <div className="text-sm font-medium">{property.parkingSpaces || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-xs text-black/50">Total Units</div>
                  <div className="text-sm font-medium">{stats.totalUnits}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-black/[0.08]">
        <nav className="flex gap-4 overflow-x-auto pb-px" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-black/50 hover:text-black/70 hover:border-black/[0.12]'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* Occupancy Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Unit Occupancy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={occupancyData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {occupancyData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => [`${value} units`, '']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Revenue Trend */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Revenue Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={COLORS.success} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={COLORS.success} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                    />
                    <Tooltip
                      formatter={(value: number) => [formatCurrency(value), 'Revenue']}
                      contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke={COLORS.success}
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorRevenue)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Work Order Priority */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Work Order Priority</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={workOrderPriorityData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis type="number" tick={{ fontSize: 12 }} />
                    <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} width={60} />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }} />
                    <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                      {workOrderPriorityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Lease Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Lease Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {leaseStatusData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-sm text-black/60">{item.name}</span>
                    </div>
                    <span className="text-sm font-semibold">{item.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Facility Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Facility Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={facilityStatusData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }} />
                    <Bar dataKey="value" fill={COLORS.primary} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Recent Work Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {workOrders.slice(0, 5).map((wo) => (
                  <div key={wo.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-black/[0.02]">
                    <div className={`w-2 h-2 mt-2 rounded-full ${
                      wo.priority === 'urgent' ? 'bg-red-500' :
                      wo.priority === 'high' ? 'bg-amber-500' :
                      wo.priority === 'medium' ? 'bg-blue-500' : 'bg-black/40'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-black truncate">{wo.title}</p>
                      <p className="text-xs text-black/50">{wo.category} - {wo.status.replace('_', ' ')}</p>
                    </div>
                    <Badge
                      variant={
                        wo.status === 'completed' ? 'success' :
                        wo.status === 'in_progress' ? 'default' :
                        wo.status === 'open' ? 'warning' : 'secondary'
                      }
                      className="text-xs"
                    >
                      {wo.status.replace('_', ' ')}
                    </Badge>
                  </div>
                ))}
                {workOrders.length === 0 && (
                  <p className="text-sm text-black/50 text-center py-4">No work orders</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'units' && <UnitsTab units={units} />}
      {activeTab === 'tenants' && <TenantsTab tenants={tenants} />}
      {activeTab === 'leases' && <LeasesTab leases={leases} tenants={tenants} />}
      {activeTab === 'facilities' && <FacilitiesTab facilities={facilities} />}
      {activeTab === 'workorders' && <WorkOrdersTab workOrders={workOrders} />}
    </div>
  )
}

// ============================================================================
// TAB COMPONENTS
// ============================================================================

function UnitsTab({ units }: { units: Unit[] }) {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-black/[0.02] border-b">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-black/60 uppercase">Unit</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-black/60 uppercase">Type</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-black/60 uppercase">Size</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-black/60 uppercase">Bed/Bath</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-black/60 uppercase">Rent</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-black/60 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.04]">
              {units.map((unit) => (
                <tr key={unit.id} className="hover:bg-black/[0.02]">
                  <td className="px-4 py-3 font-medium text-black">{unit.unitNumber}</td>
                  <td className="px-4 py-3 text-black/60 capitalize">{unit.type}</td>
                  <td className="px-4 py-3 text-black/60">{unit.squareFootage.toLocaleString()} sq ft</td>
                  <td className="px-4 py-3 text-black/60">{unit.bedrooms}BR / {unit.bathrooms}BA</td>
                  <td className="px-4 py-3 font-medium text-black">{formatCurrency(unit.monthlyRent)}</td>
                  <td className="px-4 py-3">
                    <Badge variant={unit.status === 'occupied' ? 'success' : unit.status === 'available' ? 'warning' : 'secondary'}>
                      {unit.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}

function TenantsTab({ tenants }: { tenants: Tenant[] }) {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-black/[0.02] border-b">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-black/60 uppercase">Tenant</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-black/60 uppercase">Contact</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-black/60 uppercase">Move-In</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-black/60 uppercase">Balance</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-black/60 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.04]">
              {tenants.map((tenant) => (
                <tr key={tenant.id} className="hover:bg-black/[0.02]">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {tenant.avatar && (
                        <img src={tenant.avatar} alt={tenant.name} className="w-8 h-8 rounded-full" />
                      )}
                      <span className="font-medium text-black">{tenant.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm text-black">{tenant.email}</div>
                    <div className="text-xs text-black/50">{tenant.phone}</div>
                  </td>
                  <td className="px-4 py-3 text-black/60">
                    {tenant.moveInDate ? formatDate(tenant.moveInDate) : 'N/A'}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`font-medium ${tenant.balance > 0 ? 'text-red-600' : tenant.balance < 0 ? 'text-green-600' : 'text-black/60'}`}>
                      {tenant.balance === 0 ? 'Paid' : formatCurrency(Math.abs(tenant.balance))}
                      {tenant.balance < 0 && ' credit'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={tenant.status === 'active' ? 'success' : tenant.status === 'pending' ? 'warning' : 'secondary'}>
                      {tenant.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}

function LeasesTab({ leases, tenants }: { leases: Lease[]; tenants: Tenant[] }) {
  const getTenantName = (tenantId: string) => {
    const tenant = tenants.find(t => t.id === tenantId)
    return tenant?.name || 'Unknown'
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-black/[0.02] border-b">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-black/60 uppercase">Tenant</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-black/60 uppercase">Term</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-black/60 uppercase">Rent</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-black/60 uppercase">Deposit</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-black/60 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-black/60 uppercase">Renewal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.04]">
              {leases.map((lease) => (
                <tr key={lease.id} className="hover:bg-black/[0.02]">
                  <td className="px-4 py-3 font-medium text-black">{getTenantName(lease.tenantId)}</td>
                  <td className="px-4 py-3 text-black/60">
                    <div className="text-sm">{formatDate(lease.startDate)}</div>
                    <div className="text-xs text-black/50">to {formatDate(lease.endDate)}</div>
                  </td>
                  <td className="px-4 py-3 font-medium text-black">{formatCurrency(lease.monthlyRent)}</td>
                  <td className="px-4 py-3 text-black/60">{formatCurrency(lease.securityDeposit)}</td>
                  <td className="px-4 py-3">
                    <Badge variant={
                      lease.status === 'active' ? 'success' :
                      lease.status === 'expiring' ? 'warning' :
                      lease.status === 'expired' ? 'danger' : 'secondary'
                    }>
                      {lease.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    {lease.renewalStatus !== 'none' && (
                      <Badge variant={
                        lease.renewalStatus === 'renewed' ? 'success' :
                        lease.renewalStatus === 'offered' ? 'warning' : 'secondary'
                      }>
                        {lease.renewalStatus}
                      </Badge>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}

function FacilitiesTab({ facilities }: { facilities: Facility[] }) {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-black/[0.02] border-b">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-black/60 uppercase">Facility</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-black/60 uppercase">Category</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-black/60 uppercase">Location</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-black/60 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-black/60 uppercase">Condition</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-black/60 uppercase">Next Maintenance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.04]">
              {facilities.map((facility) => (
                <tr key={facility.id} className="hover:bg-black/[0.02]">
                  <td className="px-4 py-3">
                    <div className="font-medium text-black">{facility.name}</div>
                    <div className="text-xs text-black/50">{facility.type}</div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="secondary" className="capitalize">{facility.category}</Badge>
                  </td>
                  <td className="px-4 py-3 text-black/60">{facility.location}</td>
                  <td className="px-4 py-3">
                    <Badge variant={
                      facility.status === 'operational' ? 'success' :
                      facility.status === 'maintenance' ? 'warning' : 'danger'
                    }>
                      {facility.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={
                      facility.condition === 'excellent' || facility.condition === 'good' ? 'success' :
                      facility.condition === 'fair' ? 'warning' : 'danger'
                    }>
                      {facility.condition}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-black/60">
                    {facility.nextMaintenanceDate ? formatDate(facility.nextMaintenanceDate) : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}

function WorkOrdersTab({ workOrders }: { workOrders: WorkOrder[] }) {
  return (
    <div className="space-y-4">
      {workOrders.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-black/50">No work orders for this property</p>
          </CardContent>
        </Card>
      ) : (
        workOrders.map((wo) => (
          <Card key={wo.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-black">{wo.title}</h3>
                    <Badge variant={
                      wo.status === 'completed' ? 'success' :
                      wo.status === 'in_progress' ? 'default' :
                      wo.status === 'open' ? 'warning' : 'secondary'
                    }>
                      {wo.status.replace('_', ' ')}
                    </Badge>
                    <span className={`text-xs font-medium uppercase ${
                      wo.priority === 'urgent' ? 'text-red-600' :
                      wo.priority === 'high' ? 'text-amber-600' :
                      wo.priority === 'medium' ? 'text-blue-600' : 'text-black/50'
                    }`}>
                      {wo.priority}
                    </span>
                  </div>
                  <p className="text-sm text-black/60 mb-2">{wo.description}</p>
                  <div className="flex flex-wrap gap-4 text-xs text-black/50">
                    <span>Category: {wo.category}</span>
                    <span>Assigned: {wo.assignedTo || 'Unassigned'}</span>
                    <span>Created: {formatDate(wo.createdAt)}</span>
                    {wo.completedAt && <span>Completed: {formatDate(wo.completedAt)}</span>}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}
