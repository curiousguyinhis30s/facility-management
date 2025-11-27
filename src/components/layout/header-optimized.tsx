'use client'

import * as React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface HeaderProps {
  title: string
  actions?: React.ReactNode
}

export function HeaderOptimized({ title, actions }: HeaderProps) {
  const [showAccountMenu, setShowAccountMenu] = React.useState(false)
  const [showNotifications, setShowNotifications] = React.useState(false)
  const menuRef = React.useRef<HTMLDivElement>(null)

  // Close menus when clicking outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowAccountMenu(false)
        setShowNotifications(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-black/[0.08] bg-white px-4">
      {/* Title */}
      <div className="flex items-center">
        <h1 className="text-xl font-semibold text-black">{title}</h1>
      </div>

      {/* Right Section - Fixed width to prevent shifts */}
      <div className="flex items-center gap-2" ref={menuRef}>
        {/* Custom Actions */}
        {actions}

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications)
              setShowAccountMenu(false)
            }}
            className="relative rounded-lg p-2 text-black/40 hover:bg-black/[0.04] hover:text-black transition-colors"
            aria-label="Notifications"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
              />
            </svg>
            {/* Badge */}
            <span className="absolute right-1 top-1 flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-danger opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-danger"></span>
            </span>
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-lg border border-black/[0.08] bg-white shadow-lg">
              <div className="border-b border-black/[0.04] p-3">
                <h3 className="text-sm font-semibold text-black">Notifications</h3>
              </div>
              <div className="max-h-96 overflow-y-auto">
                <div className="divide-y divide-black/[0.04]">
                  <div className="p-3 hover:bg-black/[0.02] cursor-pointer">
                    <div className="flex items-start gap-2">
                      <div className="flex-shrink-0 rounded-full bg-warning/10 p-1">
                        <svg className="h-4 w-4 text-warning" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-black line-clamp-1">Lease expiring soon</p>
                        <p className="text-xs text-black/50 line-clamp-2">Unit 101 lease expires in 30 days</p>
                        <p className="mt-1 text-xs text-black/40">2 hours ago</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 hover:bg-black/[0.02] cursor-pointer">
                    <div className="flex items-start gap-2">
                      <div className="flex-shrink-0 rounded-full bg-danger/10 p-1">
                        <svg className="h-4 w-4 text-danger" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-black line-clamp-1">Overdue payment</p>
                        <p className="text-xs text-black/50 line-clamp-2">John Doe - Unit 102 - SAR 2,200</p>
                        <p className="mt-1 text-xs text-black/40">5 hours ago</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="border-t border-black/[0.04] p-2">
                <button className="w-full rounded p-2 text-center text-sm text-primary hover:bg-black/[0.02]">
                  View all notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Account Menu */}
        <div className="relative">
          <button
            onClick={() => {
              setShowAccountMenu(!showAccountMenu)
              setShowNotifications(false)
            }}
            className="flex items-center gap-2 rounded-lg p-1 hover:bg-black/[0.04] transition-colors"
            aria-label="Account menu"
          >
            <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-medium">
              SA
            </div>
            <svg
              className={`h-4 w-4 text-black/40 transition-transform ${showAccountMenu ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </button>

          {/* Account Dropdown */}
          {showAccountMenu && (
            <div className="absolute right-0 mt-2 w-56 rounded-lg border border-black/[0.08] bg-white shadow-lg">
              <div className="border-b border-black/[0.04] p-3">
                <p className="text-sm font-semibold text-black">Super Admin</p>
                <p className="text-xs text-black/50 truncate">admin@facilitypro.com</p>
              </div>
              <div className="p-1">
                <Link
                  href="/settings/profile"
                  className="flex items-center gap-2 rounded px-3 py-2 text-sm text-black/70 hover:bg-black/[0.04]"
                  onClick={() => setShowAccountMenu(false)}
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                  Profile
                </Link>
                <Link
                  href="/settings/account"
                  className="flex items-center gap-2 rounded px-3 py-2 text-sm text-black/70 hover:bg-black/[0.04]"
                  onClick={() => setShowAccountMenu(false)}
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Settings
                </Link>
                <Link
                  href="/settings/security"
                  className="flex items-center gap-2 rounded px-3 py-2 text-sm text-black/70 hover:bg-black/[0.04]"
                  onClick={() => setShowAccountMenu(false)}
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                  Security
                </Link>
              </div>
              <div className="border-t border-black/[0.04] p-1">
                <button
                  onClick={() => {
                    setShowAccountMenu(false)
                    // TODO: Implement logout
                    alert('Logout functionality to be implemented')
                  }}
                  className="flex w-full items-center gap-2 rounded px-3 py-2 text-sm text-danger hover:bg-danger/10"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                  </svg>
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
