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
  onEdit?: () => void
  onDelete?: () => void
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
  onEdit,
  onDelete,
}: PropertyCardProps) {
  const occupancyRate = Math.round((occupiedUnits / totalUnits) * 100)
  const vacantUnits = totalUnits - occupiedUnits

  return (
    <div className="relative">
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

    {/* Action Buttons */}
    {(onEdit || onDelete) && (
      <div className="absolute top-2 right-2 z-10 flex gap-2">
        {onEdit && (
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onEdit()
            }}
            className="rounded-lg bg-white p-2 shadow-md hover:bg-gray-100 transition-colors"
            title="Edit property"
          >
            <svg
              className="h-5 w-5 text-primary"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
              />
            </svg>
          </button>
        )}
        {onDelete && (
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onDelete()
            }}
            className="rounded-lg bg-white p-2 shadow-md hover:bg-danger hover:text-white transition-colors"
            title="Delete property"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
              />
            </svg>
          </button>
        )}
      </div>
    )}
  </div>
  )
}
