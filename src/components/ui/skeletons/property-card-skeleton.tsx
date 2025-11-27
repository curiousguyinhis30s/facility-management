import * as React from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface PropertyCardSkeletonProps {
  className?: string
  count?: number
}

/**
 * Skeleton loader for PropertyCardOptimized
 * Matches the exact layout and dimensions of the actual property card
 */
export function PropertyCardSkeleton({ className }: Omit<PropertyCardSkeletonProps, 'count'>) {
  return (
    <div className={cn('relative group', className)}>
      <Card className="h-full">
        {/* Image Skeleton - matches h-32 from PropertyCardOptimized */}
        <div className="relative h-32 w-full overflow-hidden rounded-t-lg bg-black/[0.04]">
          <Skeleton className="h-full w-full rounded-t-lg rounded-b-none" />

          {/* Type Badge Skeleton - top-left */}
          <div className="absolute top-2 left-2">
            <Skeleton className="h-5 w-20 rounded" />
          </div>

          {/* Occupancy Badge Skeleton - top-right */}
          <div className="absolute top-2 right-2">
            <Skeleton className="h-5 w-12 rounded" />
          </div>
        </div>

        {/* Header Skeleton - matches p-4 pb-2 padding */}
        <CardHeader className="p-4 pb-2">
          {/* Title */}
          <Skeleton className="h-5 w-4/5 mb-2" />
          {/* Address with icon */}
          <div className="flex items-start">
            <Skeleton className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0" />
            <Skeleton className="h-3 w-full" />
          </div>
        </CardHeader>

        {/* Content Skeleton - matches p-4 pt-2 padding and grid layout */}
        <CardContent className="p-4 pt-2">
          <div className="grid grid-cols-3 gap-2">
            {/* Units Column */}
            <div>
              <Skeleton className="h-3 w-10 mb-1" />
              <Skeleton className="h-6 w-8" />
            </div>

            {/* Vacant Column */}
            <div>
              <Skeleton className="h-3 w-12 mb-1" />
              <Skeleton className="h-6 w-6" />
            </div>

            {/* Monthly Revenue Column */}
            <div>
              <Skeleton className="h-3 w-14 mb-1" />
              <Skeleton className="h-6 w-12" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

/**
 * Grid of property card skeletons
 */
export function PropertyCardSkeletonGrid({ count = 6, className }: PropertyCardSkeletonProps) {
  return (
    <div className={cn('grid gap-4 sm:grid-cols-2 lg:grid-cols-3', className)}>
      {Array.from({ length: count }).map((_, index) => (
        <PropertyCardSkeleton key={index} />
      ))}
    </div>
  )
}

/**
 * Single property card skeleton with wrapper for list view
 */
export function PropertyCardSkeletonItem() {
  return (
    <div className="animate-pulse">
      <PropertyCardSkeleton />
    </div>
  )
}
