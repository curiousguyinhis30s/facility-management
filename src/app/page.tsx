'use client'

import React, { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'

// Animated counter hook
function useCountUp(end: number, duration: number = 2000, start: boolean = false) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!start) return
    let startTime: number
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      setCount(Math.floor(progress * end))
      if (progress < 1) requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
  }, [end, duration, start])

  return count
}

// Intersection observer hook
function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [threshold])

  return { ref, inView }
}

export default function LandingPage() {
  const { isAuthenticated } = useAuth()
  const [scrollY, setScrollY] = useState(0)
  const [mounted, setMounted] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const statsRef = useInView(0.3)

  const properties = useCountUp(500, 2000, statsRef.inView)
  const tenants = useCountUp(10000, 2000, statsRef.inView)
  const uptime = useCountUp(99, 2000, statsRef.inView)

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on route change or resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setMobileMenuOpen(false)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Subtle gradient background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-64 md:w-96 h-64 md:h-96 bg-slate-100/50 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 md:w-96 h-64 md:h-96 bg-slate-50/80 rounded-full blur-3xl" />
      </div>

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrollY > 20 ? 'bg-white/70 backdrop-blur-2xl shadow-sm shadow-slate-100' : 'bg-transparent'
      }`}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <Link href="/" className="flex items-center gap-2 sm:gap-2.5 group">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-slate-900 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
                </svg>
              </div>
              <span className="text-sm sm:text-[15px] font-semibold text-slate-900 tracking-tight">FacilityPro</span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              {['Features', 'About'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-[13px] text-slate-500 hover:text-slate-900 transition-colors duration-200 relative group"
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-slate-900 transition-all duration-300 group-hover:w-full" />
                </a>
              ))}
            </div>

            {/* Desktop Buttons */}
            <div className="hidden sm:flex items-center gap-2 sm:gap-3">
              {isAuthenticated ? (
                <Link href="/portal">
                  <Button className="bg-slate-900 hover:bg-slate-800 text-white h-8 sm:h-9 px-4 sm:px-5 text-xs sm:text-[13px] rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-slate-200">
                    Dashboard
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="ghost" className="text-slate-600 h-8 sm:h-9 px-3 sm:px-4 text-xs sm:text-[13px] hover:text-slate-900 hover:bg-slate-100 rounded-full transition-all duration-200">
                      Sign in
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button className="bg-slate-900 hover:bg-slate-800 text-white h-8 sm:h-9 px-4 sm:px-5 text-xs sm:text-[13px] rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-slate-200 group">
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="sm:hidden p-2 -mr-2 text-slate-600 hover:text-slate-900"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="sm:hidden pb-4 border-t border-slate-100 mt-2 pt-4 bg-white/95 backdrop-blur-xl rounded-b-2xl">
              <div className="flex flex-col gap-2">
                {['Features', 'About'].map((item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors"
                  >
                    {item}
                  </a>
                ))}
                <div className="flex flex-col gap-2 mt-2 pt-2 border-t border-slate-100">
                  {isAuthenticated ? (
                    <Link href="/portal" onClick={() => setMobileMenuOpen(false)}>
                      <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white h-10 text-sm rounded-full">
                        Dashboard
                      </Button>
                    </Link>
                  ) : (
                    <>
                      <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                        <Button variant="ghost" className="w-full text-slate-600 h-10 text-sm hover:bg-slate-100 rounded-full">
                          Sign in
                        </Button>
                      </Link>
                      <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                        <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white h-10 text-sm rounded-full">
                          Get Started
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-24 sm:pt-32 pb-12 sm:pb-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className={`max-w-2xl transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 mb-4 sm:mb-6 transition-all duration-500 hover:bg-slate-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] sm:text-[11px] font-medium text-slate-600 tracking-wide">Built for Saudi Arabia</span>
            </div>

            <h1 className="text-3xl sm:text-[42px] md:text-[56px] font-semibold text-slate-900 tracking-tight leading-[1.1] mb-4 sm:mb-5">
              Property management,
              <br />
              <span className="bg-gradient-to-r from-slate-400 to-slate-500 bg-clip-text text-transparent">simplified.</span>
            </h1>

            <p className="text-sm sm:text-[17px] text-slate-500 mb-6 sm:mb-10 max-w-md leading-relaxed">
              The modern platform for facility managers. Track properties, tenants, and maintenance—all in one place.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              <Link href={isAuthenticated ? '/portal' : '/login'} className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white h-11 sm:h-12 px-6 sm:px-7 text-sm sm:text-[14px] rounded-full transition-all duration-300 hover:shadow-xl hover:shadow-slate-200 group">
                  {isAuthenticated ? 'Open Dashboard' : 'Start Free'}
                  <svg className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Button>
              </Link>
              <button
                onClick={() => {
                  const demoSection = document.getElementById('demo-preview')
                  if (demoSection) {
                    demoSection.scrollIntoView({ behavior: 'smooth', block: 'center' })
                  }
                }}
                className="flex items-center justify-center sm:justify-start gap-2 text-sm sm:text-[14px] text-slate-600 hover:text-slate-900 transition-colors duration-200 group py-2"
              >
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-100 flex items-center justify-center transition-all duration-300 group-hover:bg-slate-200 group-hover:scale-105">
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <span>Watch demo</span>
              </button>
            </div>
          </div>

          {/* Dashboard Preview - Hidden on mobile, simplified on tablet */}
          <div id="demo-preview" className={`mt-10 sm:mt-16 relative transition-all duration-1000 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'} hidden sm:block`}>
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-10 pointer-events-none" />

            <div className="rounded-xl sm:rounded-2xl border border-slate-200/80 shadow-xl sm:shadow-2xl shadow-slate-200/50 overflow-hidden bg-white">
              {/* Browser Chrome */}
              <div className="h-8 sm:h-10 bg-slate-50 border-b border-slate-100 flex items-center gap-2 px-3 sm:px-4">
                <div className="flex items-center gap-1 sm:gap-1.5">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-slate-200" />
                  <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-slate-200" />
                  <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-slate-200" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="px-3 sm:px-4 py-0.5 sm:py-1 rounded-md bg-white border border-slate-200 text-[9px] sm:text-[11px] text-slate-400">
                    facilitypro.app/dashboard
                  </div>
                </div>
              </div>

              {/* Dashboard Content */}
              <div className="p-4 sm:p-6 bg-gradient-to-br from-slate-50/50 to-white">
                {/* Stats Row */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 mb-4 sm:mb-5">
                  {[
                    { label: 'Properties', value: '12', trend: '+2' },
                    { label: 'Occupancy', value: '94%', trend: '+3%' },
                    { label: 'Revenue', value: 'SAR 182K', trend: '+12%' },
                    { label: 'Tenants', value: '156', trend: '+8' },
                  ].map((stat, i) => (
                    <div
                      key={i}
                      className="bg-white rounded-lg sm:rounded-xl border border-slate-100 p-3 sm:p-4 transition-all duration-300 hover:shadow-md hover:shadow-slate-100"
                    >
                      <div className="flex items-center justify-between mb-1 sm:mb-2">
                        <span className="text-[8px] sm:text-[10px] font-medium text-slate-400 uppercase tracking-wider">{stat.label}</span>
                        <span className="text-[8px] sm:text-[10px] font-medium text-emerald-500 bg-emerald-50 px-1 sm:px-1.5 py-0.5 rounded">{stat.trend}</span>
                      </div>
                      <div className="text-base sm:text-xl font-semibold text-slate-900">{stat.value}</div>
                    </div>
                  ))}
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
                  {/* Revenue Chart */}
                  <div className="lg:col-span-2 bg-white rounded-lg sm:rounded-xl border border-slate-100 p-3 sm:p-4">
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                      <span className="text-[10px] sm:text-xs font-medium text-slate-900">Revenue Overview</span>
                      <div className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-slate-900" />
                        <span className="text-[8px] sm:text-[10px] text-slate-400">This Year</span>
                      </div>
                    </div>
                    <div className="flex items-end gap-1 sm:gap-1.5 h-16 sm:h-24">
                      {[35, 50, 40, 65, 45, 70, 55, 75, 50, 80, 60, 85].map((h, i) => (
                        <div
                          key={i}
                          className="flex-1 bg-slate-900 rounded-sm"
                          style={{ height: `${h}%` }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Activity Feed */}
                  <div className="bg-white rounded-lg sm:rounded-xl border border-slate-100 p-3 sm:p-4 hidden lg:block">
                    <span className="text-[10px] sm:text-xs font-medium text-slate-900 block mb-2 sm:mb-3">Recent Activity</span>
                    <div className="space-y-2 sm:space-y-3">
                      {[
                        { text: 'Payment received', time: '2m ago' },
                        { text: 'New tenant added', time: '1h ago' },
                        { text: 'Work order done', time: '3h ago' },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          <div className="flex-1 min-w-0">
                            <div className="text-[9px] sm:text-[11px] text-slate-700 truncate">{item.text}</div>
                            <div className="text-[8px] sm:text-[10px] text-slate-400">{item.time}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Dashboard Preview - Simplified */}
          <div className={`mt-8 sm:hidden transition-all duration-1000 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Properties', value: '12', icon: '🏢' },
                { label: 'Occupancy', value: '94%', icon: '📊' },
                { label: 'Revenue', value: 'SAR 182K', icon: '💰' },
                { label: 'Tenants', value: '156', icon: '👥' },
              ].map((stat, i) => (
                <div key={i} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                  <div className="text-lg mb-1">{stat.icon}</div>
                  <div className="text-lg font-semibold text-slate-900">{stat.value}</div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-wide">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section ref={statsRef.ref} className="py-10 sm:py-16 px-4 sm:px-6 border-y border-slate-100 bg-slate-50/30">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-3 gap-4 sm:gap-12">
            {[
              { value: properties, suffix: '+', label: 'Properties' },
              { value: tenants, suffix: '+', label: 'Tenants' },
              { value: uptime, suffix: '.9%', label: 'Uptime' },
            ].map((stat, i) => (
              <div key={i} className="text-center group">
                <div className="text-2xl sm:text-4xl font-semibold text-slate-900 tracking-tight transition-transform duration-300 group-hover:scale-105">
                  {stat.value}{stat.suffix}
                </div>
                <div className="text-[10px] sm:text-sm text-slate-500 mt-0.5 sm:mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <span className="text-[10px] sm:text-[11px] font-medium text-slate-400 uppercase tracking-widest">Features</span>
            <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 mt-2 sm:mt-3 mb-3 sm:mb-4">Everything you need</h2>
            <p className="text-sm sm:text-base text-slate-500 max-w-md mx-auto">Powerful tools built for modern property management.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[
              {
                title: 'Property Dashboard',
                desc: 'Real-time overview of all your properties with occupancy and revenue metrics.',
                icon: 'M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21'
              },
              {
                title: 'Tenant Management',
                desc: 'Complete tenant profiles with lease history and payment tracking.',
                icon: 'M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z'
              },
              {
                title: 'Maintenance Tracking',
                desc: 'Work orders with automatic routing and status updates.',
                icon: 'M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z'
              },
              {
                title: 'Financial Reports',
                desc: 'Comprehensive analytics with SAR support.',
                icon: 'M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z'
              },
              {
                title: 'Lease Automation',
                desc: 'Smart renewal reminders and expiration alerts.',
                icon: 'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z'
              },
              {
                title: 'Payment Portal',
                desc: 'Online rent collection with automatic reminders.',
                icon: 'M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z'
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="group p-5 sm:p-6 rounded-xl sm:rounded-2xl border border-slate-100 bg-white transition-all duration-500 hover:shadow-xl hover:shadow-slate-100 hover:-translate-y-1 hover:border-slate-200 active:scale-[0.98]"
              >
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-slate-100 flex items-center justify-center mb-3 sm:mb-4 transition-all duration-300 group-hover:bg-slate-900 group-hover:scale-110">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600 transition-colors duration-300 group-hover:text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d={feature.icon} />
                  </svg>
                </div>
                <h3 className="text-sm sm:text-[15px] font-semibold text-slate-900 mb-1.5 sm:mb-2">{feature.title}</h3>
                <p className="text-xs sm:text-[13px] text-slate-500 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About / Why Section */}
      <section id="about" className="py-16 sm:py-24 px-4 sm:px-6 bg-slate-50/50">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-16 items-center">
            <div>
              <span className="text-[10px] sm:text-[11px] font-medium text-slate-400 uppercase tracking-widest">Why FacilityPro</span>
              <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 mt-2 sm:mt-3 mb-4 sm:mb-5">Built for the Saudi market</h2>
              <p className="text-sm sm:text-base text-slate-500 leading-relaxed mb-6 sm:mb-8">
                We understand the unique needs of property managers in Saudi Arabia. From SAR currency support to local compliance, FacilityPro is designed for the region.
              </p>

              <div className="space-y-3 sm:space-y-4">
                {[
                  { title: 'SAR Currency Support', desc: 'Native Saudi Riyal formatting' },
                  { title: 'Arabic Interface', desc: 'Full RTL support' },
                  { title: 'Local Compliance', desc: 'Saudi rental regulation templates' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 group">
                    <div className="w-5 h-5 rounded-full bg-slate-900 flex items-center justify-center flex-shrink-0 mt-0.5 transition-transform duration-300 group-hover:scale-110">
                      <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm sm:text-[14px] font-medium text-slate-900">{item.title}</div>
                      <div className="text-xs sm:text-[13px] text-slate-500">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-100 rounded-2xl sm:rounded-3xl transform rotate-3 transition-transform duration-500 hover:rotate-6" />
              <div className="relative bg-white rounded-xl sm:rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-lg">
                <div className="text-center">
                  <div className="text-4xl sm:text-5xl font-bold text-slate-900 mb-2">4.9</div>
                  <div className="flex justify-center gap-0.5 sm:gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    ))}
                  </div>
                  <div className="text-xs sm:text-sm text-slate-500">From 200+ reviews</div>
                </div>

                <div className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-slate-100">
                  <div className="text-xs sm:text-[13px] text-slate-600 italic text-center">
                    &ldquo;FacilityPro transformed how we manage our properties.&rdquo;
                  </div>
                  <div className="flex items-center justify-center gap-2 sm:gap-3 mt-3 sm:mt-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-200" />
                    <div>
                      <div className="text-xs sm:text-[13px] font-medium text-slate-900">Ahmed Al-Rashid</div>
                      <div className="text-[10px] sm:text-[11px] text-slate-500">Property Manager</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-slate-900 p-8 sm:p-12 text-center">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-32 sm:w-64 h-32 sm:h-64 bg-slate-800 rounded-full blur-3xl opacity-50" />
            <div className="absolute bottom-0 right-0 w-32 sm:w-64 h-32 sm:h-64 bg-slate-800 rounded-full blur-3xl opacity-50" />

            <div className="relative">
              <h2 className="text-xl sm:text-3xl font-semibold text-white mb-2 sm:mb-3">Ready to get started?</h2>
              <p className="text-sm sm:text-base text-slate-400 mb-6 sm:mb-8 max-w-md mx-auto">
                Join property managers across Saudi Arabia who trust FacilityPro.
              </p>
              <Link href={isAuthenticated ? '/portal' : '/login'}>
                <Button className="bg-white text-slate-900 hover:bg-slate-100 h-11 sm:h-12 px-6 sm:px-8 text-sm sm:text-[14px] rounded-full transition-all duration-300 hover:shadow-xl group">
                  {isAuthenticated ? 'Open Dashboard' : 'Start Free Trial'}
                  <svg className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Button>
              </Link>
              <p className="text-[10px] sm:text-[12px] text-slate-500 mt-3 sm:mt-4">No credit card required</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 sm:py-12 px-4 sm:px-6 border-t border-slate-100">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 sm:gap-2.5">
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-md sm:rounded-lg bg-slate-900 flex items-center justify-center">
                <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
                </svg>
              </div>
              <span className="text-xs sm:text-[14px] font-medium text-slate-900">FacilityPro</span>
            </div>

            <div className="text-[10px] sm:text-[12px] text-slate-400">
              © {new Date().getFullYear()} FacilityPro. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
