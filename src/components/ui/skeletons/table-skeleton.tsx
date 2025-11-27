import * as React from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'

interface TableSkeletonProps {
  rows?: number
  columns?: number
  hasCheckbox?: boolean
  hasActions?: boolean
  className?: string
}

/**
 * Skeleton loader for data tables
 * Matches the table component structure with customizable rows and columns
 */
export function TableSkeleton({
  rows = 5,
  columns = 5,
  hasCheckbox = false,
  hasActions = false,
  className,
}: TableSkeletonProps) {
  const totalColumns = columns + (hasCheckbox ? 1 : 0) + (hasActions ? 1 : 0)

  return (
    <div className={cn('rounded-lg border border-black/[0.08] bg-white', className)}>
      <Table>
        <TableHeader>
          <TableRow>
            {/* Checkbox column header */}
            {hasCheckbox && (
              <TableHead className="w-12">
                <Skeleton className="h-4 w-4" />
              </TableHead>
            )}

            {/* Regular column headers */}
            {Array.from({ length: columns }).map((_, index) => (
              <TableHead key={`header-${index}`}>
                <Skeleton className="h-4 w-24" />
              </TableHead>
            ))}

            {/* Actions column header */}
            {hasActions && (
              <TableHead className="w-24 text-right">
                <Skeleton className="h-4 w-16 ml-auto" />
              </TableHead>
            )}
          </TableRow>
        </TableHeader>

        <TableBody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <TableRow key={`row-${rowIndex}`}>
              {/* Checkbox cell */}
              {hasCheckbox && (
                <TableCell>
                  <Skeleton className="h-4 w-4" />
                </TableCell>
              )}

              {/* Regular cells */}
              {Array.from({ length: columns }).map((_, colIndex) => (
                <TableCell key={`cell-${rowIndex}-${colIndex}`}>
                  <Skeleton
                    className={cn(
                      'h-4',
                      // Vary widths for more realistic look
                      colIndex === 0 ? 'w-32' : colIndex === 1 ? 'w-24' : 'w-20'
                    )}
                  />
                </TableCell>
              ))}

              {/* Actions cell */}
              {hasActions && (
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Skeleton className="h-8 w-8 rounded" />
                    <Skeleton className="h-8 w-8 rounded" />
                  </div>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

/**
 * Compact table skeleton with fewer visual elements
 */
export function CompactTableSkeleton({
  rows = 5,
  columns = 4,
  className,
}: Omit<TableSkeletonProps, 'hasCheckbox' | 'hasActions'>) {
  return (
    <div className={cn('rounded-lg border border-black/[0.08] bg-white', className)}>
      <Table>
        <TableHeader>
          <TableRow>
            {Array.from({ length: columns }).map((_, index) => (
              <TableHead key={`header-${index}`}>
                <Skeleton className="h-3 w-20" />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <TableRow key={`row-${rowIndex}`}>
              {Array.from({ length: columns }).map((_, colIndex) => (
                <TableCell key={`cell-${rowIndex}-${colIndex}`}>
                  <Skeleton className="h-3 w-16" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

/**
 * Table skeleton with expandable rows
 */
export function ExpandableTableSkeleton({
  rows = 5,
  columns = 5,
  className,
}: Omit<TableSkeletonProps, 'hasCheckbox' | 'hasActions'>) {
  return (
    <div className={cn('rounded-lg border border-black/[0.08] bg-white', className)}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Skeleton className="h-4 w-4" />
            </TableHead>
            {Array.from({ length: columns }).map((_, index) => (
              <TableHead key={`header-${index}`}>
                <Skeleton className="h-4 w-24" />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <TableRow key={`row-${rowIndex}`}>
              <TableCell>
                <Skeleton className="h-4 w-4" />
              </TableCell>
              {Array.from({ length: columns }).map((_, colIndex) => (
                <TableCell key={`cell-${rowIndex}-${colIndex}`}>
                  <Skeleton className="h-4 w-20" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

/**
 * Minimal table skeleton - just rows without header
 */
export function MinimalTableSkeleton({
  rows = 3,
  columns = 3,
  className,
}: Omit<TableSkeletonProps, 'hasCheckbox' | 'hasActions'>) {
  return (
    <div className={cn('space-y-3', className)}>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={`row-${rowIndex}`} className="flex items-center gap-4">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton
              key={`cell-${rowIndex}-${colIndex}`}
              className={cn(
                'h-4',
                colIndex === 0 ? 'w-32 flex-1' : 'w-20'
              )}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

/**
 * Table skeleton with avatar column (for user lists, tenant lists, etc.)
 */
export function TableWithAvatarSkeleton({
  rows = 5,
  columns = 4,
  className,
}: Omit<TableSkeletonProps, 'hasCheckbox' | 'hasActions'>) {
  return (
    <div className={cn('rounded-lg border border-black/[0.08] bg-white', className)}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Skeleton className="h-4 w-24" />
            </TableHead>
            {Array.from({ length: columns - 1 }).map((_, index) => (
              <TableHead key={`header-${index}`}>
                <Skeleton className="h-4 w-24" />
              </TableHead>
            ))}
            <TableHead className="w-24">
              <Skeleton className="h-4 w-16 ml-auto" />
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <TableRow key={`row-${rowIndex}`}>
              {/* Name column with avatar */}
              <TableCell>
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              </TableCell>

              {/* Regular cells */}
              {Array.from({ length: columns - 1 }).map((_, colIndex) => (
                <TableCell key={`cell-${rowIndex}-${colIndex}`}>
                  <Skeleton className="h-4 w-20" />
                </TableCell>
              ))}

              {/* Actions cell */}
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Skeleton className="h-8 w-8 rounded" />
                  <Skeleton className="h-8 w-8 rounded" />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
