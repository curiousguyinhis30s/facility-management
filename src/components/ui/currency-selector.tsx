'use client'

import React from 'react'
import { useCurrency, SUPPORTED_CURRENCIES, CurrencyCode } from '@/contexts/CurrencyContext'
import { cn } from '@/lib/utils'

interface CurrencySelectorProps {
  variant?: 'dropdown' | 'pills'
  className?: string
}

export function CurrencySelector({ variant = 'dropdown', className }: CurrencySelectorProps) {
  const { currency, setCurrency, availableCurrencies } = useCurrency()

  if (variant === 'pills') {
    return (
      <div className={cn('flex flex-wrap gap-2', className)}>
        {Object.entries(availableCurrencies).map(([code, info]) => (
          <button
            key={code}
            onClick={() => setCurrency(code as CurrencyCode)}
            className={cn(
              'px-3 py-1.5 rounded-full text-sm font-medium transition-all',
              currency === code
                ? 'bg-primary text-white'
                : 'bg-black/[0.04] text-black/70 hover:bg-black/[0.08]'
            )}
          >
            {info.symbol} {code}
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className={cn('relative', className)}>
      <select
        value={currency}
        onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
        className={cn(
          'appearance-none w-full px-4 py-2 pr-10 rounded-lg border border-black/[0.08]',
          'bg-white text-black text-sm font-medium',
          'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary',
          'cursor-pointer transition-colors'
        )}
      >
        {Object.entries(availableCurrencies).map(([code, info]) => (
          <option key={code} value={code}>
            {info.symbol} {info.name} ({code})
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <svg
          className="h-4 w-4 text-black/40"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>
  )
}

// Compact version for header/navbar
export function CurrencySelectorCompact({ className }: { className?: string }) {
  const { currency, setCurrency, availableCurrencies, currencySymbol } = useCurrency()

  return (
    <div className={cn('relative', className)}>
      <select
        value={currency}
        onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
        className={cn(
          'appearance-none pl-2 pr-6 py-1 rounded-md border border-black/[0.08]',
          'bg-white text-black/70 text-sm font-medium',
          'focus:outline-none focus:ring-1 focus:ring-primary/30',
          'cursor-pointer transition-colors hover:border-black/20'
        )}
      >
        {Object.entries(availableCurrencies).map(([code, info]) => (
          <option key={code} value={code}>
            {info.symbol} {code}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center pr-1.5 pointer-events-none">
        <svg
          className="h-3 w-3 text-black/40"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>
  )
}
