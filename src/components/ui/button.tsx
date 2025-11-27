import * as React from 'react'
import { cn } from '@/lib/utils'

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles = cn(
      'inline-flex items-center justify-center gap-2 rounded-lg font-medium',
      'transition-all duration-150 ease-out',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
      'disabled:pointer-events-none disabled:opacity-50',
      'active:scale-[0.98]'
    )

    const variants = {
      primary: cn(
        'bg-foreground text-background',
        'hover:bg-foreground/90',
        'focus-visible:ring-foreground'
      ),
      secondary: cn(
        'bg-foreground/[0.05] text-foreground',
        'hover:bg-foreground/[0.08]',
        'focus-visible:ring-foreground/20'
      ),
      success: cn(
        'bg-emerald-600 text-white',
        'hover:bg-emerald-700',
        'focus-visible:ring-emerald-600'
      ),
      warning: cn(
        'bg-amber-500 text-white',
        'hover:bg-amber-600',
        'focus-visible:ring-amber-500'
      ),
      danger: cn(
        'bg-red-600 text-white',
        'hover:bg-red-700',
        'focus-visible:ring-red-600'
      ),
      ghost: cn(
        'text-foreground',
        'hover:bg-foreground/[0.04]',
        'focus-visible:ring-foreground/20'
      ),
    }

    const sizes = {
      sm: 'h-8 px-3 text-sm',
      md: 'h-9 px-4 text-sm',
      lg: 'h-11 px-5 text-base',
    }

    return (
      <button
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <svg
            className="h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

export { Button }
