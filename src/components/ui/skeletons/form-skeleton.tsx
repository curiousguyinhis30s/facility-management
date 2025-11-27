import * as React from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface FormSkeletonProps {
  fields?: number
  hasTitle?: boolean
  hasSubmitButton?: boolean
  className?: string
}

/**
 * Skeleton loader for form components
 * Useful for loading property forms, tenant forms, etc.
 */
export function FormSkeleton({
  fields = 5,
  hasTitle = true,
  hasSubmitButton = true,
  className,
}: FormSkeletonProps) {
  return (
    <Card className={className}>
      {hasTitle && (
        <CardHeader>
          <Skeleton className="h-6 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
      )}

      <CardContent className={hasTitle ? '' : 'pt-6'}>
        <div className="space-y-4">
          {Array.from({ length: fields }).map((_, index) => (
            <div key={index} className="space-y-2">
              {/* Label */}
              <Skeleton className="h-4 w-24" />
              {/* Input field */}
              <Skeleton className="h-10 w-full rounded" />
            </div>
          ))}

          {hasSubmitButton && (
            <div className="flex gap-2 pt-4">
              <Skeleton className="h-10 w-24 rounded" />
              <Skeleton className="h-10 w-24 rounded" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * Inline form field skeleton
 */
export function FormFieldSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('space-y-2', className)}>
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-10 w-full rounded" />
    </div>
  )
}

/**
 * Form skeleton with two columns
 */
export function TwoColumnFormSkeleton({
  fields = 6,
  className,
}: Omit<FormSkeletonProps, 'hasTitle' | 'hasSubmitButton'>) {
  const fieldsPerColumn = Math.ceil(fields / 2)

  return (
    <Card className={className}>
      <CardHeader>
        <Skeleton className="h-6 w-48 mb-2" />
        <Skeleton className="h-4 w-64" />
      </CardHeader>

      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: fields }).map((_, index) => (
            <div key={index} className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full rounded" />
            </div>
          ))}
        </div>

        <div className="flex gap-2 pt-6">
          <Skeleton className="h-10 w-24 rounded" />
          <Skeleton className="h-10 w-24 rounded" />
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * Search form skeleton
 */
export function SearchFormSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('flex gap-2', className)}>
      <Skeleton className="h-10 flex-1 rounded" />
      <Skeleton className="h-10 w-24 rounded" />
    </div>
  )
}
