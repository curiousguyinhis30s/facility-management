/**
 * Manara Landing Page - Complete Example
 * Demonstrates all animated components
 */

'use client'

import {
  HeroSection,
  FeaturesSection,
  StatsSection,
  InteractiveDemoSection,
  TestimonialsSection,
  FloatingCTA,
  ParallaxSection,
  PricingSection,
} from '@/components/landing'

export default function LandingPage() {
  return (
    <main className="relative">
      {/* Hero Section - Above the fold */}
      <HeroSection />

      {/* Features Overview */}
      <FeaturesSection />

      {/* Interactive Demo */}
      <InteractiveDemoSection />

      {/* Stats & Social Proof */}
      <StatsSection />

      {/* Parallax Section - Visual Break */}
      <ParallaxSection />

      {/* Pricing */}
      <PricingSection />

      {/* Testimonials */}
      <TestimonialsSection />

      {/* Floating CTA - Persistent */}
      <FloatingCTA />

      {/* Footer CTA Section */}
      <CTASection />
    </main>
  )
}

/**
 * Final CTA Section
 */
function CTASection() {
  return (
    <section className="py-24 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl sm:text-5xl font-bold mb-6">
          Ready to Transform Your Property Management?
        </h2>
        <p className="text-xl mb-12 opacity-90">
          Join thousands of property managers who have modernized their operations with Manara
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="px-8 py-4 bg-white text-blue-600 rounded-lg font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all">
            Start Free Trial
          </button>
          <button className="px-8 py-4 bg-transparent text-white border-2 border-white rounded-lg font-bold text-lg hover:bg-white/10 transition-all">
            Schedule Demo
          </button>
        </div>

        <p className="mt-8 text-sm opacity-75">
          No credit card required • Free 14-day trial • Cancel anytime
        </p>
      </div>
    </section>
  )
}
