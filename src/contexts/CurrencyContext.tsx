'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

// Supported currencies with their details
export const SUPPORTED_CURRENCIES = {
  SAR: { code: 'SAR', symbol: 'ر.س', name: 'Saudi Riyal', locale: 'en-SA' },
  USD: { code: 'USD', symbol: '$', name: 'US Dollar', locale: 'en-US' },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro', locale: 'en-EU' },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound', locale: 'en-GB' },
  AED: { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham', locale: 'en-AE' },
} as const

export type CurrencyCode = keyof typeof SUPPORTED_CURRENCIES

// Exchange rates relative to SAR (base currency)
// In production, these would come from an API
const EXCHANGE_RATES: Record<CurrencyCode, number> = {
  SAR: 1,
  USD: 0.2666,  // 1 SAR = 0.2666 USD
  EUR: 0.2444,  // 1 SAR = 0.2444 EUR
  GBP: 0.2111,  // 1 SAR = 0.2111 GBP
  AED: 0.9787,  // 1 SAR = 0.9787 AED
}

interface CurrencyContextType {
  currency: CurrencyCode
  setCurrency: (currency: CurrencyCode) => void
  formatAmount: (amountInSAR: number) => string
  convertAmount: (amountInSAR: number) => number
  currencySymbol: string
  currencyName: string
  availableCurrencies: typeof SUPPORTED_CURRENCIES
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined)

const STORAGE_KEY = 'facilitypro-currency'

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>('SAR')
  const [isHydrated, setIsHydrated] = useState(false)

  // Load saved currency preference on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved && saved in SUPPORTED_CURRENCIES) {
      setCurrencyState(saved as CurrencyCode)
    }
    setIsHydrated(true)
  }, [])

  // Save currency preference when changed
  const setCurrency = useCallback((newCurrency: CurrencyCode) => {
    setCurrencyState(newCurrency)
    localStorage.setItem(STORAGE_KEY, newCurrency)
  }, [])

  // Convert amount from SAR to selected currency
  const convertAmount = useCallback((amountInSAR: number): number => {
    return amountInSAR * EXCHANGE_RATES[currency]
  }, [currency])

  // Format amount in the selected currency
  const formatAmount = useCallback((amountInSAR: number): string => {
    const converted = convertAmount(amountInSAR)
    const currencyInfo = SUPPORTED_CURRENCIES[currency]

    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(converted)
  }, [currency, convertAmount])

  const value: CurrencyContextType = {
    currency,
    setCurrency,
    formatAmount,
    convertAmount,
    currencySymbol: SUPPORTED_CURRENCIES[currency].symbol,
    currencyName: SUPPORTED_CURRENCIES[currency].name,
    availableCurrencies: SUPPORTED_CURRENCIES,
  }

  // Prevent hydration mismatch by not rendering until client-side
  if (!isHydrated) {
    return null
  }

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  const context = useContext(CurrencyContext)
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider')
  }
  return context
}
