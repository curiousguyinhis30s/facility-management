'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'

export default function LandingPage() {
  const { isAuthenticated, user } = useAuth()
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrollY > 20 ? 'bg-white/80 backdrop-blur-xl border-b border-slate-100' : 'bg-transparent'
      }`}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-black flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
                </svg>
              </div>
              <span className="text-base font-semibold text-slate-900">FacilityPro</span>
            </div>

            <div className="hidden md:flex items-center gap-6">
              {['Features', 'Pricing'].map((item) => (
                <a key={item} href={`#${item.toLowerCase()}`} className="text-sm text-slate-500 hover:text-slate-900 transition-colors">
                  {item}
                </a>
              ))}
            </div>

            <div className="flex items-center gap-2">
              {isAuthenticated ? (
                <Link href="/portal">
                  <Button size="sm" className="bg-black hover:bg-black/90 text-white h-8 px-4 text-xs">
                    Dashboard
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="ghost" size="sm" className="text-slate-600 h-8 px-3 text-xs">Sign in</Button>
                  </Link>
                  <Link href="/login">
                    <Button size="sm" className="bg-black hover:bg-black/90 text-white h-8 px-4 text-xs">
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-28 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">
              Facility Management System
            </p>
            <h1 className="text-4xl sm:text-5xl font-semibold text-slate-900 tracking-tight leading-[1.15] mb-4">
              Property management,
              <br />
              <span className="text-slate-400">simplified.</span>
            </h1>
            <p className="text-base text-slate-500 mb-8 max-w-lg">
              Manage properties, tenants, and maintenance in one place. Built for facility managers in Saudi Arabia.
            </p>
            <div className="flex items-center gap-3">
              <Link href={isAuthenticated ? '/portal' : '/login'}>
                <Button className="bg-black hover:bg-black/90 text-white h-10 px-5 text-sm">
                  {isAuthenticated ? 'Open Dashboard' : 'Start Free'}
                  <svg className="w-4 h-4 ml-1.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Button>
              </Link>
              <Button variant="ghost" className="h-10 px-5 text-sm text-slate-600">
                Watch Demo
              </Button>
            </div>
          </div>

          {/* Dashboard Preview */}
          <div className="mt-12 relative">
            <div className="rounded-xl border border-slate-200 shadow-lg overflow-hidden bg-slate-50">
              <div className="h-8 bg-slate-100 border-b border-slate-200 flex items-center gap-1.5 px-3">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-300"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-slate-300"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-slate-300"></div>
              </div>
              <div className="p-6 bg-gradient-to-br from-slate-50 to-white">
                <div className="grid grid-cols-4 gap-3 mb-4">
                  {[
                    { label: 'Properties', value: '12' },
                    { label: 'Occupancy', value: '94%' },
                    { label: 'Revenue', value: 'SAR 182K' },
                    { label: 'Tenants', value: '156' },
                  ].map((stat, i) => (
                    <div key={i} className="bg-white rounded-lg border border-slate-100 p-3">
                      <div className="text-[10px] text-slate-400 uppercase tracking-wide">{stat.label}</div>
                      <div className="text-lg font-semibold text-slate-900 mt-0.5">{stat.value}</div>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2 bg-white rounded-lg border border-slate-100 p-3 h-28">
                    <div className="text-xs text-slate-500 mb-2">Revenue</div>
                    <div className="flex items-end gap-1 h-16">
                      {[35, 50, 40, 65, 45, 70, 55, 75, 50, 80, 60, 72].map((h, i) => (
                        <div key={i} className="flex-1 bg-slate-900 rounded-sm" style={{ height: `${h}%` }} />
                      ))}
                    </div>
                  </div>
                  <div className="bg-white rounded-lg border border-slate-100 p-3 h-28">
                    <div className="text-xs text-slate-500 mb-2">Activity</div>
                    <div className="space-y-1.5">
                      {['Payment received', 'New tenant', 'Work order'].map((item, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-[10px] text-slate-600">
                          <div className="w-1 h-1 rounded-full bg-slate-400"></div>
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 px-6 border-y border-slate-100 bg-slate-50/50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-4 gap-8">
            {[
              { value: '500+', label: 'Properties' },
              { value: '10K+', label: 'Tenants' },
              { value: '99.9%', label: 'Uptime' },
              { value: '4.9', label: 'Rating' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl font-semibold text-slate-900">{stat.value}</div>
                <div className="text-xs text-slate-500 mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-md mb-10">
            <h2 className="text-2xl font-semibold text-slate-900 mb-2">Everything you need</h2>
            <p className="text-sm text-slate-500">Powerful features for modern property management.</p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {[
              { title: 'Property Dashboard', desc: 'Real-time occupancy and revenue tracking', icon: 'M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21' },
              { title: 'Tenant Management', desc: 'Complete profiles with payment history', icon: 'M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z' },
              { title: 'Maintenance', desc: 'Work order routing with status updates', icon: 'M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z' },
              { title: 'Financial Reports', desc: 'Revenue analytics with SAR support', icon: 'M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z' },
              { title: 'Lease Tracking', desc: 'Automated renewals and expiration alerts', icon: 'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z' },
              { title: 'Payment Portal', desc: 'Online rent with automatic reminders', icon: 'M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z' },
            ].map((feature, i) => (
              <div key={i} className="group p-5 rounded-xl border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all bg-white">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center mb-3 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d={feature.icon} />
                  </svg>
                </div>
                <h3 className="text-sm font-medium text-slate-900 mb-1">{feature.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-16 px-6 bg-slate-50/50">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-md mb-10">
            <h2 className="text-2xl font-semibold text-slate-900 mb-2">Simple pricing</h2>
            <p className="text-sm text-slate-500">Start free, upgrade when you need.</p>
          </div>

          <div className="grid grid-cols-3 gap-4 max-w-4xl">
            {/* Starter */}
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="text-xs font-medium text-slate-400 uppercase tracking-wide">Starter</div>
              <div className="text-3xl font-semibold text-slate-900 mt-2">Free</div>
              <p className="text-xs text-slate-500 mt-1 mb-5">For getting started</p>
              <ul className="space-y-2.5 mb-6">
                {['Up to 5 properties', 'Basic reporting', 'Email support'].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs text-slate-600">
                    <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
              <Button variant="secondary" className="w-full h-9 text-xs">Get Started</Button>
            </div>

            {/* Pro */}
            <div className="bg-black rounded-xl p-5 text-white relative">
              <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 bg-white text-black text-[10px] font-medium rounded-full">
                Popular
              </div>
              <div className="text-xs font-medium text-white/50 uppercase tracking-wide">Professional</div>
              <div className="text-3xl font-semibold text-white mt-2">SAR 199<span className="text-base font-normal text-white/50">/mo</span></div>
              <p className="text-xs text-white/50 mt-1 mb-5">For growing teams</p>
              <ul className="space-y-2.5 mb-6">
                {['Unlimited properties', 'Advanced analytics', 'Priority support', 'API access'].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs text-white/70">
                    <svg className="w-3.5 h-3.5 text-white/50" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
              <Button className="w-full h-9 text-xs bg-white text-black hover:bg-white/90">Start Trial</Button>
            </div>

            {/* Enterprise */}
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="text-xs font-medium text-slate-400 uppercase tracking-wide">Enterprise</div>
              <div className="text-3xl font-semibold text-slate-900 mt-2">Custom</div>
              <p className="text-xs text-slate-500 mt-1 mb-5">For large organizations</p>
              <ul className="space-y-2.5 mb-6">
                {['Everything in Pro', 'Custom integrations', 'Dedicated support'].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs text-slate-600">
                    <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
              <Button variant="secondary" className="w-full h-9 text-xs">Contact Sales</Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-black rounded-2xl p-10 text-center">
            <h2 className="text-2xl font-semibold text-white mb-2">Ready to get started?</h2>
            <p className="text-sm text-white/50 mb-6">Join property managers across Saudi Arabia.</p>
            <Link href={isAuthenticated ? '/portal' : '/login'}>
              <Button className="bg-white text-black hover:bg-white/90 h-10 px-6 text-sm">
                {isAuthenticated ? 'Open Dashboard' : 'Start Free Trial'}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 border-t border-slate-100">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-black flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
              </svg>
            </div>
            <span className="text-sm font-medium text-slate-900">FacilityPro</span>
          </div>
          <div className="text-xs text-slate-400">© 2024 FacilityPro. All rights reserved.</div>
        </div>
      </footer>
    </div>
  )
}
