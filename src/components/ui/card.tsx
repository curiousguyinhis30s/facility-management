import * as React from 'react'
import { cn } from '@/lib/utils'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outline' | 'ghost'
  interactive?: boolean
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', interactive = false, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'rounded-xl bg-white',
        'transition-all duration-200 ease-out',
        // Variant styles
        variant === 'default' && [
          'border border-black/[0.06]',
          'shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]',
        ],
        variant === 'elevated' && [
          'border border-black/[0.04]',
          'shadow-[0_2px_8px_-2px_rgba(0,0,0,0.08),0_4px_16px_-4px_rgba(0,0,0,0.04)]',
        ],
        variant === 'outline' && [
          'border border-black/[0.08]',
          'bg-transparent',
        ],
        variant === 'ghost' && [
          'border border-transparent',
          'bg-black/[0.02]',
        ],
        // Interactive hover states
        interactive && [
          'cursor-pointer',
          'hover:-translate-y-0.5',
          'hover:shadow-[0_4px_12px_-4px_rgba(0,0,0,0.12),0_8px_24px_-8px_rgba(0,0,0,0.08)]',
          'hover:border-black/[0.08]',
          'active:translate-y-0',
          'active:shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]',
        ],
        className
      )}
      {...props}
    />
  )
)
Card.displayName = 'Card'

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 p-5 pb-3', className)}
    {...props}
  />
))
CardHeader.displayName = 'CardHeader'

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      'text-base font-semibold leading-tight tracking-tight text-foreground',
      className
    )}
    {...props}
  />
))
CardTitle.displayName = 'CardTitle'

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-[13px] text-muted-foreground leading-relaxed', className)}
    {...props}
  />
))
CardDescription.displayName = 'CardDescription'

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-5 pt-0', className)} {...props} />
))
CardContent.displayName = 'CardContent'

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex items-center gap-2 p-5 pt-3',
      'border-t border-black/[0.04]',
      className
    )}
    {...props}
  />
))
CardFooter.displayName = 'CardFooter'

// Stat Card variant for dashboard metrics
interface StatCardProps {
  title: string
  value: string | number
  description?: string
  icon?: React.ReactNode
  trend?: {
    value: number
    label: string
    isPositive?: boolean
  }
  className?: string
}

const StatCard = React.forwardRef<HTMLDivElement, StatCardProps>(
  ({ title, value, description, icon, trend, className }, ref) => (
    <Card ref={ref} className={cn('overflow-hidden', className)}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <p className="text-[13px] font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold tracking-tight">{value}</p>
            {description && (
              <p className="text-[12px] text-muted-foreground">{description}</p>
            )}
            {trend && (
              <div className="flex items-center gap-1.5">
                <span
                  className={cn(
                    'inline-flex items-center text-[12px] font-medium',
                    trend.isPositive ? 'text-green-600' : 'text-red-600'
                  )}
                >
                  <svg
                    className={cn('mr-0.5 h-3 w-3', !trend.isPositive && 'rotate-180')}
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2.5"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                  </svg>
                  {Math.abs(trend.value)}%
                </span>
                <span className="text-[12px] text-muted-foreground">{trend.label}</span>
              </div>
            )}
          </div>
          {icon && (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
)
StatCard.displayName = 'StatCard'

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent, StatCard }
export type { CardProps, StatCardProps }
