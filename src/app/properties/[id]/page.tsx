'use client'

import React from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatCurrency, formatDate } from '@/lib/utils'
import { BuildingCanvas } from '@/components/features/buildings/building-canvas'
import { useData } from '@/contexts/DataContext'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

// Enhanced property data with all missing fields (legacy - kept for backwards compatibility)
const mockProperty = {
  id: '1',
  name: 'Sunset Apartments',
  address: '123 King Fahd Road, Al-Malqa District, Riyadh 13521',
  type: 'apartment' as const,

  // Basic Stats
  totalUnits: 68,
  occupiedUnits: 64,
  monthlyRevenue: 148000,
  yearBuilt: 2018,
  lastRenovation: new Date(2023, 5, 1),
  squareFeet: 82000,

  // Financial
  purchasePrice: 15000000,
  currentMarketValue: 18500000,
  monthlyExpenses: 65000,
  propertyTax: 45000,
  insuranceCost: 18000,
  hoaFees: 0,

  // Location
  gpsCoordinates: { lat: 24.7738, lng: 46.6753 },
  neighborhood: 'Al-Malqa - Premium District',
  nearbyLandmarks: ['King Saud University (2km)', 'Granada Mall (1.5km)', 'King Fahad Medical City (3km)'],
  distanceToMetro: '500m to Al-Malqa Station',
  neighborhoodRating: 4.5,

  // Physical Attributes
  numberOfFloors: 12,
  parkingSpaces: { covered: 85, uncovered: 20, total: 105 },
  constructionType: 'Reinforced Concrete',
  elevators: { passenger: 3, service: 1 },
  hvacSystem: 'Central AC with VRF Technology',
  waterSupply: 'Municipal + Backup Tanks (50,000L)',
  electricalCapacity: '2500 kVA',
  generator: 'Cummins 500 kVA Backup',

  // Amenities
  amenities: [
    { name: 'Rooftop Pool', details: '25m x 10m, Heated, Infinity Edge' },
    { name: 'Gym & Fitness Center', details: '200 sqm, Premium Equipment' },
    { name: '24/7 Security', details: 'CCTV (64 cameras), 4 Guards, Access Control' },
    { name: 'Lobby & Reception', details: 'Marble floors, Concierge service' },
    { name: 'Playground', details: 'Children play area, Rubber flooring' },
    { name: 'Landscaped Gardens', details: '1500 sqm, Irrigation system' },
    { name: 'Basement Parking', details: '2 levels, EV charging stations' },
  ],

  // Compliance & Certificates
  compliance: {
    fireSafety: { certified: true, expiryDate: new Date(2025, 11, 31), certificateNo: 'FS-2024-1234' },
    buildingCode: { compliant: true, lastInspection: new Date(2024, 10, 15) },
    environmental: { certified: true, rating: 'Green Building - Silver' },
    accessibility: { wheelchairRamps: true, elevatorBraille: true, accessible: 'Full ADA Compliant' },
  },

  // Photos
  photos: {
    exterior: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
      'https://images.unsplash.com/photo-1460317442991-0ec209397118?w=800',
    ],
    interior: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
    ],
    amenities: [
      'https://images.unsplash.com/photo-1576610616656-d3aa5d1f4534?w=800',
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800',
    ],
    aerial: ['https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800'],
  },

  // Documents
  documents: [
    { type: 'Title Deed', name: 'Property_Title_Deed.pdf', uploadDate: new Date(2024, 0, 15), size: '2.4 MB' },
    { type: 'Insurance', name: 'Property_Insurance_2024.pdf', uploadDate: new Date(2024, 0, 1), size: '1.1 MB' },
    { type: 'Fire Safety', name: 'Fire_Safety_Certificate.pdf', uploadDate: new Date(2024, 10, 15), size: '850 KB' },
    { type: 'Building Permit', name: 'Building_Permit_Original.pdf', uploadDate: new Date(2018, 2, 10), size: '3.2 MB' },
    { type: 'Floor Plans', name: 'Architectural_Plans.pdf', uploadDate: new Date(2024, 5, 20), size: '5.8 MB' },
  ],

  // Emergency Contacts
  emergencyContacts: [
    { role: 'Property Manager', name: 'Ahmed Al-Farsi', phone: '+966 50 123 4567', available: '24/7', priority: 1 },
    { role: 'Maintenance Supervisor', name: 'Fatima Al-Rashid', phone: '+966 55 234 5678', available: 'Business Hours', priority: 2 },
    { role: 'Security Chief', name: 'Mohammed Al-Otaibi', phone: '+966 50 345 6789', available: '24/7', priority: 1 },
    { role: 'Fire Department', name: 'Riyadh Civil Defense', phone: '998', available: '24/7', priority: 1 },
    { role: 'Police', name: 'Emergency Services', phone: '999', available: '24/7', priority: 1 },
    { role: 'Ambulance', name: 'Red Crescent', phone: '997', available: '24/7', priority: 1 },
  ],

  // Staff & Vendors
  assignedStaff: [
    { id: '1', name: 'Ahmed Al-Farsi', role: 'Property Manager', phone: '+966 50 123 4567' },
    { id: '2', name: 'Fatima Al-Rashid', role: 'Maintenance Supervisor', phone: '+966 55 234 5678' },
    { id: '3', name: 'Security Team', role: '4 Guards', phone: '+966 50 345 6789' },
  ],

  vendors: [
    { id: 'V1', name: 'Saudi HVAC Specialists', service: 'HVAC Maintenance', monthlyRate: 5000, contact: '+966 11 234 5678' },
    { id: 'V2', name: 'Green Landscape Co.', service: 'Landscaping', monthlyRate: 3500, contact: '+966 12 345 6789' },
    { id: 'V3', name: 'Elite Cleaning Services', service: 'Common Area Cleaning', monthlyRate: 4200, contact: '+966 13 456 7890' },
  ],

  // Unit breakdown
  units: [
    { id: '101', number: '101', floor: 1, type: '2BR', bedrooms: 2, bathrooms: 2, sqft: 1200, rent: 2200, status: 'occupied' as const, tenant: 'Mohammed bin Abdullah', leaseEnd: new Date(2025, 11, 31) },
    { id: '102', number: '102', floor: 1, type: '1BR', bedrooms: 1, bathrooms: 1, sqft: 850, rent: 1600, status: 'occupied' as const, tenant: 'Sarah Al-Mutairi', leaseEnd: new Date(2025, 5, 30) },
    { id: '103', number: '103', floor: 1, type: '3BR', bedrooms: 3, bathrooms: 2, sqft: 1500, rent: 2800, status: 'vacant' as const },
    { id: '104', number: '104', floor: 1, type: '2BR', bedrooms: 2, bathrooms: 2, sqft: 1200, rent: 2200, status: 'occupied' as const, tenant: 'Khalid Al-Zahrani', leaseEnd: new Date(2025, 8, 15) },
    { id: '105', number: '105', floor: 1, type: '1BR', bedrooms: 1, bathrooms: 1, sqft: 850, rent: 1600, status: 'notice_given' as const, tenant: 'Fatima Al-Rashid', leaseEnd: new Date(2025, 0, 31), moveOutDate: new Date(2025, 0, 31) },
  ],

  // Recent activity
  recentActivity: [
    { id: 1, type: 'payment', description: 'Rent payment received from Unit 101 - Mohammed bin Abdullah', date: new Date(2025, 10, 1), amount: 2200 },
    { id: 2, type: 'maintenance', description: 'HVAC filter replacement completed - All units on Floor 2', date: new Date(2025, 10, 20) },
    { id: 3, type: 'lease', description: 'Lease renewal signed for Unit 102 - Sarah Al-Mutairi', date: new Date(2025, 10, 15) },
    { id: 4, type: 'work_order', description: 'Plumbing repair completed in Unit 304', date: new Date(2025, 10, 18) },
    { id: 5, type: 'notice', description: 'Move-out notice received from Unit 105 - Fatima Al-Rashid', date: new Date(2024, 11, 1) },
  ],

  // Notifications & Alerts
  notifications: [
    { id: 'N1', type: 'urgent', title: 'Fire Safety Certificate Expiring Soon', message: 'Certificate expires in 37 days. Renewal required.', priority: 'high', dueDate: new Date(2025, 11, 31) },
    { id: 'N2', type: 'reminder', title: '4 Lease Renewals Due This Quarter', message: 'Units 102, 208, 315, 412 - Send renewal offers', priority: 'medium', dueDate: new Date(2025, 2, 1) },
    { id: 'N3', type: 'maintenance', title: 'Elevator Annual Inspection Due', message: 'Schedule inspection for all 3 elevators', priority: 'high', dueDate: new Date(2025, 0, 15) },
  ],
}

export default function PropertyDetailPage() {
  const params = useParams()
  const [activeTab, setActiveTab] = React.useState<'overview' | 'units' | 'photos' | 'documents' | 'team' | 'canvas'>('canvas')
  const [photoCategory, setPhotoCategory] = React.useState<'exterior' | 'interior' | 'amenities' | 'aerial'>('exterior')

  const property = mockProperty
  const occupancyRate = Math.round((property.occupiedUnits / property.totalUnits) * 100)
  const vacantUnits = property.totalUnits - property.occupiedUnits
  const roi = (((property.monthlyRevenue * 12) - (property.monthlyExpenses * 12)) / property.purchasePrice * 100).toFixed(2)

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
          <div>
            <div className="text-xl font-semibold">{property.name}</div>
            <div className="text-sm text-black/50">{property.address}</div>
          </div>
        </div>
      }
      actions={
        <div className="flex gap-2">
          <Button variant="secondary">
            <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Export Report
          </Button>
          <Button variant="primary">Edit Property</Button>
        </div>
      }
    >
      {/* Urgent Notifications Banner */}
      {property.notifications.filter(n => n.priority === 'high').length > 0 && (
        <Card className="mb-6 border-warning bg-warning/5">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <svg className="h-6 w-6 text-warning flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
              <div className="flex-1">
                <div className="font-semibold text-black mb-2">⚠️ Urgent Attention Required ({property.notifications.filter(n => n.priority === 'high').length} items)</div>
                {property.notifications.filter(n => n.priority === 'high').map(notification => (
                  <div key={notification.id} className="text-sm text-black/70 mb-1">
                    • {notification.title} - Due {formatDate(notification.dueDate, { month: 'short', day: 'numeric' })}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tab Navigation */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as typeof activeTab)}>
        <TabsList>
          <TabsTrigger value="canvas">🎯 Property Canvas</TabsTrigger>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="units">Units ({property.totalUnits})</TabsTrigger>
          <TabsTrigger value="photos">Photos ({Object.values(property.photos).flat().length})</TabsTrigger>
          <TabsTrigger value="documents">Documents ({property.documents.length})</TabsTrigger>
          <TabsTrigger value="team">Team & Contacts</TabsTrigger>
        </TabsList>

        {/* PROPERTY CANVAS VIEW - Using new BuildingCanvas component with DataContext */}
        <TabsContent value="canvas">
          <BuildingCanvas propertyId={params.id as string} />
        </TabsContent>

        {/* OVERVIEW TAB */}
        <TabsContent value="overview">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Property Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <div className="text-sm font-medium text-black/50">Location</div>
                    <div className="mt-1 text-black">{property.address}</div>
                    <div className="mt-1 text-sm text-black/70">{property.neighborhood}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-black/50">Construction</div>
                    <div className="mt-1 text-black">Built in {property.yearBuilt}</div>
                    <div className="mt-1 text-sm text-black/70">Last renovated: {formatDate(property.lastRenovation, { month: 'short', year: 'numeric' })}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-black/50">Total Area</div>
                    <div className="mt-1 text-black">{property.squareFeet.toLocaleString()} sq ft</div>
                    <div className="mt-1 text-sm text-black/70">{property.numberOfFloors} floors, {property.elevators.passenger} elevators</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-black/50">Parking</div>
                    <div className="mt-1 text-black">{property.parkingSpaces.total} spaces</div>
                    <div className="mt-1 text-sm text-black/70">{property.parkingSpaces.covered} covered, {property.parkingSpaces.uncovered} open</div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-black/[0.08]">
                  <div className="text-sm font-medium text-black mb-3">Amenities</div>
                  <div className="grid grid-cols-2 gap-3">
                    {property.amenities.map((amenity, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <svg className="h-5 w-5 text-success flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                          <div className="text-sm font-medium text-black">{amenity.name}</div>
                          <div className="text-xs text-black/50">{amenity.details}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Financial Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="text-sm text-black/50">Purchase Price</div>
                    <div className="mt-1 text-lg font-semibold text-black">{formatCurrency(property.purchasePrice)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-black/50">Current Value</div>
                    <div className="mt-1 text-lg font-semibold text-success">{formatCurrency(property.currentMarketValue)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-black/50">Appreciation</div>
                    <div className="mt-1 text-lg font-semibold text-success">
                      +{(((property.currentMarketValue - property.purchasePrice) / property.purchasePrice) * 100).toFixed(1)}%
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-black/50">Monthly Revenue</div>
                    <div className="mt-1 text-lg font-semibold text-black">{formatCurrency(property.monthlyRevenue)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-black/50">Monthly Expenses</div>
                    <div className="mt-1 text-lg font-semibold text-danger">{formatCurrency(property.monthlyExpenses)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-black/50">Net Income</div>
                    <div className="mt-1 text-lg font-semibold text-success">{formatCurrency(property.monthlyRevenue - property.monthlyExpenses)}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>🚨 Emergency Contacts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {property.emergencyContacts.map((contact, index) => (
                    <div key={index} className={`p-3 rounded-lg ${contact.priority === 1 ? 'bg-danger/10' : 'bg-black/[0.02]'}`}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="font-medium text-sm text-black">{contact.role}</div>
                          <div className="text-sm text-black/70 mt-1">{contact.name}</div>
                          <a href={`tel:${contact.phone}`} className="text-sm text-primary font-medium mt-1 block">
                            {contact.phone}
                          </a>
                          <div className="text-xs text-black/50 mt-1">{contact.available}</div>
                        </div>
                        {contact.priority === 1 && (
                          <Badge variant="danger">Priority</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Assigned Team</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {property.assignedStaff.map((staff) => (
                    <div key={staff.id} className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-black/[0.08] flex items-center justify-center text-sm font-medium">
                        {staff.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-black">{staff.name}</div>
                        <div className="text-xs text-black/50">{staff.role}</div>
                      </div>
                      <a href={`tel:${staff.phone}`} className="text-primary">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                        </svg>
                      </a>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        </TabsContent>

        {/* UNITS TAB */}
        <TabsContent value="units">
        <Card>
          <CardContent className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-black/[0.08]">
                  <tr>
                    <th className="pb-3 text-left text-sm font-semibold text-black">Unit</th>
                    <th className="pb-3 text-left text-sm font-semibold text-black">Type</th>
                    <th className="pb-3 text-left text-sm font-semibold text-black">Sq Ft</th>
                    <th className="pb-3 text-left text-sm font-semibold text-black">Rent</th>
                    <th className="pb-3 text-left text-sm font-semibold text-black">Status</th>
                    <th className="pb-3 text-left text-sm font-semibold text-black">Tenant</th>
                    <th className="pb-3 text-left text-sm font-semibold text-black">Lease End</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/[0.08]">
                  {property.units.map((unit) => (
                    <tr key={unit.id} className="hover:bg-black/[0.02]">
                      <td className="py-4 text-sm font-medium text-black">{unit.number}</td>
                      <td className="py-4 text-sm text-black/70">{unit.bedrooms}BR / {unit.bathrooms}BA</td>
                      <td className="py-4 text-sm text-black/70">{unit.sqft}</td>
                      <td className="py-4 text-sm text-black">{formatCurrency(unit.rent)}</td>
                      <td className="py-4">
                        <Badge
                          variant={
                            unit.status === 'occupied'
                              ? 'success'
                              : unit.status === 'vacant'
                              ? 'danger'
                              : 'warning'
                          }
                        >
                          {unit.status.replace('_', ' ')}
                        </Badge>
                      </td>
                      <td className="py-4 text-sm text-black/70">{unit.tenant || '-'}</td>
                      <td className="py-4 text-sm text-black/70">
                        {unit.leaseEnd ? formatDate(unit.leaseEnd, { month: 'short', day: 'numeric', year: 'numeric' }) : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
        </TabsContent>

        {/* PHOTOS TAB */}
        <TabsContent value="photos">
        <div>
          <div className="mb-6 flex gap-2">
            {(['exterior', 'interior', 'amenities', 'aerial'] as const).map((category) => (
              <Button
                key={category}
                variant={photoCategory === category ? 'primary' : 'secondary'}
                onClick={() => setPhotoCategory(category)}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)} ({property.photos[category].length})
              </Button>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {property.photos[photoCategory].map((photo, index) => (
              <div key={index} className="relative aspect-video rounded-lg overflow-hidden group cursor-pointer">
                <img
                  src={photo}
                  alt={`${photoCategory} ${index + 1}`}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                  <svg className="h-12 w-12 text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" />
                  </svg>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <Button variant="primary">
              <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Upload Photos
            </Button>
          </div>
        </div>
        </TabsContent>

        {/* DOCUMENTS TAB */}
        <TabsContent value="documents">
        <Card>
          <CardContent className="p-6">
            <div className="space-y-3">
              {property.documents.map((doc, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-lg border border-black/[0.08] hover:border-primary hover:bg-black/[0.02] transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-lg bg-danger/10 flex items-center justify-center">
                      <svg className="h-6 w-6 text-danger" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium text-black">{doc.name}</div>
                      <div className="text-sm text-black/50">
                        {doc.type} • {doc.size} • Uploaded {formatDate(doc.uploadDate, { month: 'short', year: 'numeric' })}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 rounded-lg hover:bg-black/[0.04]">
                      <svg className="h-5 w-5 text-black/70" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </button>
                    <button className="p-2 rounded-lg hover:bg-black/[0.04]">
                      <svg className="h-5 w-5 text-black/70" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <Button variant="primary">
                <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Upload Document
              </Button>
            </div>
          </CardContent>
        </Card>
        </TabsContent>

        {/* TEAM TAB */}
        <TabsContent value="team">
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Assigned Staff ({property.assignedStaff.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {property.assignedStaff.map((staff) => (
                  <div key={staff.id} className="flex items-center gap-4 p-4 rounded-lg border border-black/[0.08]">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-lg font-semibold text-primary">
                      {staff.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-black">{staff.name}</div>
                      <div className="text-sm text-black/50">{staff.role}</div>
                      <a href={`tel:${staff.phone}`} className="text-sm text-primary">{staff.phone}</a>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Active Vendors ({property.vendors.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {property.vendors.map((vendor) => (
                  <div key={vendor.id} className="p-4 rounded-lg border border-black/[0.08]">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-medium text-black">{vendor.name}</div>
                        <div className="text-sm text-black/50">{vendor.service}</div>
                        <a href={`tel:${vendor.contact}`} className="text-sm text-primary">{vendor.contact}</a>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-black">{formatCurrency(vendor.monthlyRate)}</div>
                        <div className="text-xs text-black/50">per month</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  )
}
