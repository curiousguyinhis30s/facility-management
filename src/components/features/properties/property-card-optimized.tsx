import * as React from 'react'
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/utils'

interface PropertyCardProps {
  id: string
  name: string
  address: string
  type: 'condo' | 'apartment' | 'warehouse' | 'shoplot' | 'house' | 'commercial'
  totalUnits: number
  occupiedUnits: number
  monthlyRevenue: number
  imageUrl?: string
  onEdit?: () => void
  onDelete?: () => void
  isSelected?: boolean
  onSelect?: (id: string) => void
}

const propertyTypeLabels: Record<string, string> = {
  condo: 'Condo',
  apartment: 'Apartment',
  warehouse: 'Warehouse',
  shoplot: 'Shoplot',
  house: 'House',
  commercial: 'Commercial',
}

const propertyTypeColors: Record<string, string> = {
  condo: 'bg-primary',
  apartment: 'bg-success',
  warehouse: 'bg-warning',
  shoplot: 'bg-danger',
  house: 'bg-black/60',
  commercial: 'bg-indigo-600',
}

export function PropertyCardOptimized({
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
  isSelected = false,
  onSelect,
}: PropertyCardProps) {
  const occupancyRate = Math.round((occupiedUnits / totalUnits) * 100)
  const vacantUnits = totalUnits - occupiedUnits

  return (
    <div className="relative group">
      {/* Selection Checkbox */}
      {onSelect && (
        <div className="absolute top-3 left-3 z-20">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => {
              e.stopPropagation()
              onSelect(id)
            }}
            onClick={(e) => e.stopPropagation()}
            className={`h-5 w-5 rounded border-2 border-white cursor-pointer transition-opacity ${
              isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
            }`}
            style={{
              accentColor: '#0070f3',
            }}
          />
        </div>
      )}
      <Link href={`/properties/${id}`}>
        <Card className="cursor-pointer transition-all hover:shadow-lg hover:border-primary h-full">
          {/* Optimized Image - Reduced height */}
          <div className="relative h-32 w-full overflow-hidden rounded-t-lg bg-black/[0.08]">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={name}
                className="h-full w-full object-cover transition-transform duration-150 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-gradient-to-br from-black/[0.04] to-black/[0.08]">
                <svg
                  className="h-12 w-12 text-black/30"
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

            {/* Compact Badges */}
            <div className="absolute top-2 left-2">
              <span
                className={`inline-block rounded px-2 py-0.5 text-xs font-medium text-white ${propertyTypeColors[type]}`}
              >
                {propertyTypeLabels[type]}
              </span>
            </div>

            <div className="absolute top-2 right-2">
              <Badge
                variant={
                  occupancyRate >= 90
                    ? 'success'
                    : occupancyRate >= 70
                    ? 'warning'
                    : 'danger'
                }
                className="text-xs px-2 py-0.5"
              >
                {occupancyRate}%
              </Badge>
            </div>
          </div>

          {/* Optimized Header - Reduced padding */}
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-base line-clamp-1" title={name}>{name}</CardTitle>
            <CardDescription className="flex items-start text-xs line-clamp-1" title={address}>
              <svg
                className="mr-1 mt-0.5 h-3 w-3 flex-shrink-0 text-black/40"
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
              <span className="truncate">{address}</span>
            </CardDescription>
          </CardHeader>

          {/* Optimized Content - Reduced padding and font sizes */}
          <CardContent className="p-4 pt-2">
            <div className="grid grid-cols-3 gap-2">
              {/* Total Units */}
              <div>
                <p className="text-xs text-black/50">Units</p>
                <p className="text-lg font-semibold text-black">{totalUnits}</p>
              </div>

              {/* Vacant Units */}
              <div>
                <p className="text-xs text-black/50">Vacant</p>
                <p
                  className={`text-lg font-semibold ${
                    vacantUnits === 0 ? 'text-success' : 'text-warning'
                  }`}
                >
                  {vacantUnits}
                </p>
              </div>

              {/* Monthly Revenue */}
              <div>
                <p className="text-xs text-black/50">Monthly</p>
                <p className="text-lg font-semibold text-black truncate" title={formatCurrency(monthlyRevenue)}>
                  {formatCurrency(monthlyRevenue).replace(/\s/g, '').slice(0, -3)}K
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>

      {/* Compact Action Buttons - Only show on hover */}
      {(onEdit || onDelete) && (
        <div className="absolute top-1 right-1 z-10 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
          {onEdit && (
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onEdit()
              }}
              className="rounded bg-white p-1.5 shadow-md hover:bg-black/[0.04] transition-colors duration-150"
              title="Edit property"
            >
              <svg
                className="h-4 w-4 text-primary"
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
              className="rounded bg-white p-1.5 shadow-md hover:bg-danger hover:text-white transition-colors duration-150"
              title="Delete property"
            >
              <svg
                className="h-4 w-4"
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
