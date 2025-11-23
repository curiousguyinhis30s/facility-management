'use client'

import React from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatCurrency, formatDate } from '@/lib/utils'

// Mock property data
const mockProperty = {
  id: '1',
  name: 'Sunset Apartments',
  address: '123 Main St, Los Angeles, CA 90001',
  type: 'apartment' as const,
  totalUnits: 24,
  occupiedUnits: 22,
  monthlyRevenue: 48000,
  yearBuilt: 2018,
  squareFeet: 32000,
  description: 'Modern apartment complex featuring luxury amenities, state-of-the-art fitness center, and rooftop pool with city views.',
  imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
  units: [
    { id: '101', number: '101', bedrooms: 2, bathrooms: 2, sqft: 1200, rent: 2200, status: 'occupied' as const, tenant: 'John Doe' },
    { id: '102', number: '102', bedrooms: 1, bathrooms: 1, sqft: 800, rent: 1500, status: 'occupied' as const, tenant: 'Jane Smith' },
    { id: '103', number: '103', bedrooms: 3, bathrooms: 2, sqft: 1500, rent: 2800, status: 'vacant' as const },
    { id: '104', number: '104', bedrooms: 2, bathrooms: 2, sqft: 1200, rent: 2200, status: 'occupied' as const, tenant: 'Mike Johnson' },
    { id: '105', number: '105', bedrooms: 1, bathrooms: 1, sqft: 800, rent: 1500, status: 'maintenance' as const },
  ],
  recentActivity: [
    { id: 1, type: 'payment', description: 'Rent payment received from Unit 101', date: new Date(2025, 10, 15) },
    { id: 2, type: 'maintenance', description: 'HVAC repair completed in Unit 105', date: new Date(2025, 10, 14) },
    { id: 3, type: 'lease', description: 'Lease renewal signed for Unit 102', date: new Date(2025, 10, 10) },
  ],
}

export default function PropertyDetailPage() {
  const params = useParams()
  const property = mockProperty // In real app, fetch by params.id

  const occupancyRate = Math.round((property.occupiedUnits / property.totalUnits) * 100)
  const vacantUnits = property.totalUnits - property.occupiedUnits

  return (
    <DashboardLayout
      title={
        <div className="flex items-center gap-3">
          <Link href="/properties">
            <Button variant="ghost" size="sm">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
            </Button>
          </Link>
          <span>{property.name}</span>
        </div>
      }
      actions={
        <div className="flex gap-2">
          <Button variant="secondary">Edit Property</Button>
          <Button variant="primary">Add Unit</Button>
        </div>
      }
    >
      {/* Property Overview */}
      <div className="grid gap-6 lg:grid-cols-3 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-gray-500">Occupancy Rate</div>
            <div className="mt-2 text-3xl font-semibold text-gray-900">{occupancyRate}%</div>
            <div className="mt-2 text-sm text-success">{property.occupiedUnits} of {property.totalUnits} units</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-gray-500">Monthly Revenue</div>
            <div className="mt-2 text-3xl font-semibold text-gray-900">{formatCurrency(property.monthlyRevenue)}</div>
            <div className="mt-2 text-sm text-success">+12% from last month</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-gray-500">Vacant Units</div>
            <div className="mt-2 text-3xl font-semibold text-gray-900">{vacantUnits}</div>
            <div className="mt-2 text-sm text-gray-500">{((vacantUnits / property.totalUnits) * 100).toFixed(1)}% vacant</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Property Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Property Information</CardTitle>
            </CardHeader>
            <CardContent>
              {property.imageUrl && (
                <img
                  src={property.imageUrl}
                  alt={property.name}
                  className="w-full h-64 object-cover rounded-lg mb-4"
                />
              )}
              <p className="text-gray-600 mb-4">{property.description}</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-500">Address</div>
                  <div className="font-medium">{property.address}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Year Built</div>
                  <div className="font-medium">{property.yearBuilt}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Total Square Feet</div>
                  <div className="font-medium">{property.squareFeet.toLocaleString()} sq ft</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Property Type</div>
                  <div className="font-medium capitalize">{property.type}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Units List */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Units</CardTitle>
                <Button variant="primary" size="sm">Add Unit</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-gray-200">
                    <tr>
                      <th className="pb-3 text-left text-sm font-semibold text-gray-900">Unit</th>
                      <th className="pb-3 text-left text-sm font-semibold text-gray-900">Bed/Bath</th>
                      <th className="pb-3 text-left text-sm font-semibold text-gray-900">Sq Ft</th>
                      <th className="pb-3 text-left text-sm font-semibold text-gray-900">Rent</th>
                      <th className="pb-3 text-left text-sm font-semibold text-gray-900">Status</th>
                      <th className="pb-3 text-left text-sm font-semibold text-gray-900">Tenant</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {property.units.map((unit) => (
                      <tr key={unit.id} className="hover:bg-gray-50">
                        <td className="py-4 text-sm font-medium text-gray-900">{unit.number}</td>
                        <td className="py-4 text-sm text-gray-600">{unit.bedrooms}BR / {unit.bathrooms}BA</td>
                        <td className="py-4 text-sm text-gray-600">{unit.sqft}</td>
                        <td className="py-4 text-sm text-gray-900">{formatCurrency(unit.rent)}</td>
                        <td className="py-4">
                          <Badge
                            variant={
                              unit.status === 'occupied'
                                ? 'success'
                                : unit.status === 'vacant'
                                ? 'warning'
                                : 'secondary'
                            }
                          >
                            {unit.status}
                          </Badge>
                        </td>
                        <td className="py-4 text-sm text-gray-600">{unit.tenant || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {property.recentActivity.map((activity) => (
                  <div key={activity.id} className="border-l-2 border-primary pl-4">
                    <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                    <p className="text-xs text-gray-500 mt-1">{formatDate(activity.date)}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button variant="ghost" className="w-full justify-start">
                  <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                  </svg>
                  View Tenants
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
                  </svg>
                  Create Work Order
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                  </svg>
                  View Reports
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
