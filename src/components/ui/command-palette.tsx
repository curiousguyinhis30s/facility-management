'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Command } from 'cmdk'
import { cn } from '@/lib/utils'

interface CommandItem {
  id: string
  label: string
  description?: string
  shortcut?: string
  icon?: React.ReactNode
  onSelect: () => void
  category: 'navigation' | 'actions' | 'search'
}

export function CommandPalette() {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState('')
  const router = useRouter()

  // Toggle command palette with Cmd+K or Ctrl+K
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  // Close on escape
  React.useEffect(() => {
    if (!open) {
      setSearch('')
    }
  }, [open])

  const commands: CommandItem[] = React.useMemo(() => [
    // Navigation commands
    {
      id: 'nav-dashboard',
      label: 'Dashboard',
      description: 'View your dashboard overview',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>
      ),
      onSelect: () => router.push('/'),
      category: 'navigation',
    },
    {
      id: 'nav-properties',
      label: 'Properties',
      description: 'Manage your properties',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
        </svg>
      ),
      onSelect: () => router.push('/properties'),
      category: 'navigation',
    },
    {
      id: 'nav-tenants',
      label: 'Tenants',
      description: 'View and manage tenants',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
        </svg>
      ),
      onSelect: () => router.push('/tenants'),
      category: 'navigation',
    },
    {
      id: 'nav-leases',
      label: 'Leases',
      description: 'Manage lease agreements',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
      ),
      onSelect: () => router.push('/leases'),
      category: 'navigation',
    },
    {
      id: 'nav-work-orders',
      label: 'Work Orders',
      description: 'Track maintenance requests',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
        </svg>
      ),
      onSelect: () => router.push('/work-orders'),
      category: 'navigation',
    },
    {
      id: 'nav-maintenance',
      label: 'Maintenance',
      description: 'Schedule and track maintenance',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
        </svg>
      ),
      onSelect: () => router.push('/maintenance'),
      category: 'navigation',
    },
    {
      id: 'nav-facilities',
      label: 'Facilities',
      description: 'Manage facility resources',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1m1.5.5l-1.5-.5M6.75 7.364V3h-3v18m3-13.636l10.5-3.819" />
        </svg>
      ),
      onSelect: () => router.push('/facilities'),
      category: 'navigation',
    },
    {
      id: 'nav-payments',
      label: 'Payments',
      description: 'Track payments and invoices',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
        </svg>
      ),
      onSelect: () => router.push('/payments'),
      category: 'navigation',
    },
    {
      id: 'nav-workforce',
      label: 'Workforce',
      description: 'Manage staff and teams',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
        </svg>
      ),
      onSelect: () => router.push('/workforce'),
      category: 'navigation',
    },
    {
      id: 'nav-reports',
      label: 'Reports',
      description: 'View detailed reports',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
        </svg>
      ),
      onSelect: () => router.push('/reports'),
      category: 'navigation',
    },
    {
      id: 'nav-analytics',
      label: 'Analytics',
      description: 'View analytics and insights',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
        </svg>
      ),
      onSelect: () => router.push('/analytics'),
      category: 'navigation',
    },
    {
      id: 'nav-settings',
      label: 'Settings',
      description: 'Configure application settings',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      onSelect: () => router.push('/settings'),
      category: 'navigation',
    },
    // Action commands
    {
      id: 'action-add-property',
      label: 'Add Property',
      description: 'Create a new property',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
      ),
      onSelect: () => {
        router.push('/properties')
        // Note: You would trigger the add property modal here
      },
      category: 'actions',
    },
    {
      id: 'action-add-tenant',
      label: 'Add Tenant',
      description: 'Register a new tenant',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
        </svg>
      ),
      onSelect: () => {
        router.push('/tenants')
        // Note: You would trigger the add tenant modal here
      },
      category: 'actions',
    },
    {
      id: 'action-create-work-order',
      label: 'Create Work Order',
      description: 'Create a new maintenance request',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
      ),
      onSelect: () => {
        router.push('/work-orders')
        // Note: You would trigger the create work order modal here
      },
      category: 'actions',
    },
    {
      id: 'action-generate-lease',
      label: 'Generate Lease',
      description: 'Create a new lease agreement',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
      ),
      onSelect: () => {
        router.push('/leases')
        // Note: You would trigger the generate lease modal here
      },
      category: 'actions',
    },
  ], [router])

  const handleSelect = React.useCallback((command: CommandItem) => {
    setOpen(false)
    command.onSelect()
  }, [])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />

      {/* Command Palette */}
      <Command
        className="relative w-full max-w-2xl rounded-lg border border-black/[0.08] bg-white shadow-2xl"
        shouldFilter={true}
      >
        <div className="flex items-center border-b border-black/[0.08] px-4">
          <svg
            className="mr-3 h-5 w-5 text-black/40"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
          <Command.Input
            value={search}
            onValueChange={setSearch}
            placeholder="Search commands..."
            className="h-14 w-full border-0 bg-transparent text-base text-black placeholder:text-black/40 focus:outline-none"
          />
          <kbd className="ml-auto hidden rounded border border-black/[0.08] bg-black/[0.02] px-2 py-1 text-xs font-medium text-black/50 sm:inline-block">
            ESC
          </kbd>
        </div>

        <Command.List className="max-h-[400px] overflow-y-auto p-2">
          <Command.Empty className="py-8 text-center text-sm text-black/50">
            No results found.
          </Command.Empty>

          {/* Navigation Section */}
          <Command.Group heading="Navigation" className="mb-2">
            {commands
              .filter((cmd) => cmd.category === 'navigation')
              .map((command) => (
                <Command.Item
                  key={command.id}
                  value={`${command.label} ${command.description}`}
                  onSelect={() => handleSelect(command)}
                  className={cn(
                    'flex cursor-pointer items-center gap-3 rounded-md px-3 py-2.5',
                    'text-sm text-black/70 transition-colors duration-100',
                    'hover:bg-black/[0.04]',
                    'data-[selected=true]:bg-black/[0.04]'
                  )}
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-black/[0.02] text-black/50">
                    {command.icon}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-black">{command.label}</div>
                    {command.description && (
                      <div className="text-xs text-black/50">{command.description}</div>
                    )}
                  </div>
                  {command.shortcut && (
                    <kbd className="rounded border border-black/[0.08] bg-black/[0.02] px-2 py-1 text-xs text-black/50">
                      {command.shortcut}
                    </kbd>
                  )}
                </Command.Item>
              ))}
          </Command.Group>

          {/* Actions Section */}
          <Command.Group heading="Actions" className="mb-2">
            {commands
              .filter((cmd) => cmd.category === 'actions')
              .map((command) => (
                <Command.Item
                  key={command.id}
                  value={`${command.label} ${command.description}`}
                  onSelect={() => handleSelect(command)}
                  className={cn(
                    'flex cursor-pointer items-center gap-3 rounded-md px-3 py-2.5',
                    'text-sm text-black/70 transition-colors duration-100',
                    'hover:bg-black/[0.04]',
                    'data-[selected=true]:bg-black/[0.04]'
                  )}
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
                    {command.icon}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-black">{command.label}</div>
                    {command.description && (
                      <div className="text-xs text-black/50">{command.description}</div>
                    )}
                  </div>
                </Command.Item>
              ))}
          </Command.Group>
        </Command.List>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-black/[0.08] px-4 py-2.5 text-xs text-black/50">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <kbd className="rounded border border-black/[0.08] bg-black/[0.02] px-1.5 py-0.5">↑</kbd>
              <kbd className="rounded border border-black/[0.08] bg-black/[0.02] px-1.5 py-0.5">↓</kbd>
              <span className="ml-1">to navigate</span>
            </div>
            <div className="flex items-center gap-1">
              <kbd className="rounded border border-black/[0.08] bg-black/[0.02] px-1.5 py-0.5">↵</kbd>
              <span className="ml-1">to select</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <kbd className="rounded border border-black/[0.08] bg-black/[0.02] px-1.5 py-0.5">ESC</kbd>
            <span className="ml-1">to close</span>
          </div>
        </div>
      </Command>
    </div>
  )
}
