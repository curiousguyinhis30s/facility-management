'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface HeaderProps {
  title: string | React.ReactNode
  actions?: React.ReactNode
}

export function Header({ title, actions }: HeaderProps) {
  const [showNotifications, setShowNotifications] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setShowNotifications(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between bg-white/80 backdrop-blur-md border-b border-black/[0.06] px-6">
      <h1 className="text-[15px] font-semibold text-black">{title}</h1>

      <div className="flex items-center gap-1.5">
        {/* Search */}
        <button className={cn(
          'hidden sm:flex items-center gap-2 h-8 px-3 rounded-md',
          'text-[13px] text-black/40',
          'border border-black/[0.08] bg-white',
          'hover:border-black/15 hover:text-black/60',
          'transition-colors duration-100'
        )}>
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <span>Search</span>
          <kbd className="ml-3 text-[10px] text-black/30 bg-black/[0.04] rounded px-1 py-0.5">⌘K</kbd>
        </button>

        {/* Notifications */}
        <div className="relative" ref={ref}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className={cn(
              'relative flex h-8 w-8 items-center justify-center rounded-md',
              'text-black/40 hover:text-black/60 hover:bg-black/[0.04]',
              'transition-colors duration-100'
            )}
          >
            <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
            </svg>
            <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-red-500" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-1.5 w-72 rounded-lg border border-black/[0.08] bg-white shadow-lg animate-in">
              <div className="flex items-center justify-between px-3 py-2.5 border-b border-black/[0.06]">
                <span className="text-[13px] font-medium text-black">Notifications</span>
                <button className="text-[11px] text-black/40 hover:text-black/60 transition-colors">
                  Mark all read
                </button>
              </div>
              <div className="max-h-72 overflow-y-auto">
                {[
                  { title: 'Lease expiring', desc: 'Unit 101 expires in 30 days', time: '2h' },
                  { title: 'Payment received', desc: 'SAR 2,200 from John Doe', time: '5h' },
                  { title: 'Maintenance', desc: 'HVAC repair - Unit 305', time: '1d' },
                ].map((item, i) => (
                  <div key={i} className="px-3 py-2.5 hover:bg-black/[0.02] cursor-pointer transition-colors border-b border-black/[0.04] last:border-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-[13px] font-medium text-black">{item.title}</p>
                        <p className="text-[12px] text-black/50 mt-0.5">{item.desc}</p>
                      </div>
                      <span className="text-[11px] text-black/30 shrink-0">{item.time}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-3 py-2 border-t border-black/[0.06]">
                <button className="w-full text-[12px] text-center text-black/40 hover:text-black/60 transition-colors">
                  View all
                </button>
              </div>
            </div>
          )}
        </div>

        {actions}
      </div>
    </header>
  )
}
