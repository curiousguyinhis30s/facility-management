import * as React from 'react'
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/utils'

interface PropertyCardProps {
  id: string
  name: string
  address: string
  type: 'condo' | 'apartment' | 'warehouse' | 'shoplot' | 'house'
  totalUnits: number
  occupiedUnits: number
  monthlyRevenue: number
  imageUrl?: string
}

const propertyTypeLabels = {
  condo: 'Condominium',
  apartment: 'Apartment',
  warehouse: 'Warehouse',
  shoplot: 'Shoplot',
  house: 'House',
}

const propertyTypeColors = {
  condo: 'bg-primary',
  apartment: 'bg-success',
  warehouse: 'bg-warning',
  shoplot: 'bg-danger',
  house: 'bg-gray-600',
}

export function PropertyCard({
  id,
  name,
  address,
  type,
  totalUnits,
  occupiedUnits,
  monthlyRevenue,
  imageUrl,
}: PropertyCardProps) {
  const occupancyRate = Math.round((occupiedUnits / totalUnits) * 100)
  const vacantUnits = totalUnits - occupiedUnits

  return (
    <Link href={`/properties/${id}`}>
      <Card className="group cursor-pointer transition-all hover:shadow-lg hover:border-primary">
        {/* Property Image */}
        <div className="relative h-48 w-full overflow-hidden rounded-t-lg bg-gray-200">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={name}
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
              <svg
                className="h-20 w-20 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z"
                />
              </svg>
            </div>
          )}

          {/* Property Type Badge */}
          <div className="absolute top-3 left-3">
            <span
              className={`inline-block rounded-full px-3 py-1 text-xs font-semibold text-white ${propertyTypeColors[type]}`}
            >
              {propertyTypeLabels[type]}
            </span>
          </div>

          {/* Occupancy Badge */}
          <div className="absolute top-3 right-3">
            <Badge
              variant={
                occupancyRate >= 90
                  ? 'success'
                  : occupancyRate >= 70
                  ? 'warning'
                  : 'danger'
              }
            >
              {occupancyRate}% Occupied
            </Badge>
          </div>
        </div>

        <CardHeader>
          <CardTitle className="text-lg">{name}</CardTitle>
          <CardDescription className="flex items-start">
            <svg
              className="mr-1 mt-0.5 h-4 w-4 flex-shrink-0 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
              />
            </svg>
            {address}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {/* Total Units */}
            <div>
              <p className="text-sm text-gray-500">Total Units</p>
              <p className="text-2xl font-semibold text-gray-900">{totalUnits}</p>
            </div>

            {/* Vacant Units */}
            <div>
              <p className="text-sm text-gray-500">Vacant</p>
              <p
                className={`text-2xl font-semibold ${
                  vacantUnits === 0 ? 'text-success' : 'text-warning'
                }`}
              >
                {vacantUnits}
              </p>
            </div>

            {/* Monthly Revenue */}
            <div>
              <p className="text-sm text-gray-500">Revenue/Mo</p>
              <p className="text-2xl font-semibold text-gray-900">
                {formatCurrency(monthlyRevenue)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
