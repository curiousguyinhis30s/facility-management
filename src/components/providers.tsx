'use client'

import { ReactNode } from 'react'
import { ToastProvider } from '@/components/ui/toast/toast'
import { SubscriptionProvider } from '@/contexts/SubscriptionContext'
import { DataProvider } from '@/contexts/DataContext'
import { CurrencyProvider } from '@/contexts/CurrencyContext'
import { AuthProvider } from '@/contexts/AuthContext'
import { CommandPalette } from '@/components/ui/command-palette'

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ToastProvider>
      <AuthProvider>
        <CurrencyProvider>
          <SubscriptionProvider>
            <DataProvider>
              {children}
              <CommandPalette />
            </DataProvider>
          </SubscriptionProvider>
        </CurrencyProvider>
      </AuthProvider>
    </ToastProvider>
  )
}
