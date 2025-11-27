/**
 * Testimonials Carousel
 * Animated customer testimonials with auto-rotate
 */

'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { fadeIn, slideInBottom } from '@/lib/animations/variants'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'

interface Testimonial {
  id: string
  name: string
  role: string
  company: string
  image: string
  content: string
  rating: number
}

const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Maria Rodriguez',
    role: 'Portfolio Manager',
    company: 'Sunset Properties',
    image: '👩‍💼',
    content:
      'Manara transformed our operations. We reduced operational costs by 35% and our tenant satisfaction scores are at an all-time high. The automation features alone have saved us countless hours.',
    rating: 5,
  },
  {
    id: '2',
    name: 'David Chen',
    role: 'Real Estate Investor',
    company: 'Chen Investment Group',
    image: '👨‍💼',
    content:
      'As someone managing 50+ units across multiple properties, Manara is a game-changer. The financial reporting is incredibly detailed, and tax time is now a breeze. Highly recommend!',
    rating: 5,
  },
  {
    id: '3',
    name: 'Sarah Johnson',
    role: 'Operations Director',
    company: 'Metro Facilities',
    image: '👩',
    content:
      'We switched from three different systems to Manara and never looked back. The mobile app is fantastic for our field teams, and the integration with QuickBooks saved our accounting department weeks of manual work.',
    rating: 5,
  },
  {
    id: '4',
    name: 'James Williams',
    role: 'Property Manager',
    company: 'Urban Living LLC',
    image: '👨',
    content:
      'The work order management system is phenomenal. Our maintenance team loves the mobile app, and we can track everything in real-time. Response times improved by 60% in the first month.',
    rating: 5,
  },
]

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const { ref, isInView } = useScrollAnimation()

  // Auto-rotate testimonials
  useEffect(() => {
    if (isPaused || !isInView) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isPaused, isInView])

  const currentTestimonial = testimonials[currentIndex]

  return (
    <section ref={ref} className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-black mb-4">
            Trusted by Property Managers
          </h2>
          <p className="text-xl text-black/60 max-w-3xl mx-auto">
            Join thousands of satisfied customers managing properties with Manara
          </p>
        </motion.div>

        {/* Testimonial Display */}
        <div
          className="relative max-w-4xl mx-auto"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTestimonial.id}
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="bg-gradient-to-br from-blue-50 to-purple-50 p-12 rounded-3xl shadow-xl"
            >
              {/* Quote Icon */}
              <motion.div
                className="text-6xl text-blue-600 mb-6 opacity-20"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.5 }}
              >
                "
              </motion.div>

              {/* Content */}
              <motion.p
                className="text-2xl text-black/80 mb-8 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {currentTestimonial.content}
              </motion.p>

              {/* Rating */}
              <motion.div
                className="flex gap-1 mb-6"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                {Array.from({ length: currentTestimonial.rating }).map((_, i) => (
                  <motion.span
                    key={i}
                    className="text-yellow-400 text-2xl"
                    initial={{ opacity: 0, rotate: -180 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                  >
                    ⭐
                  </motion.span>
                ))}
              </motion.div>

              {/* Author */}
              <motion.div
                className="flex items-center gap-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="text-5xl">{currentTestimonial.image}</div>
                <div>
                  <div className="font-bold text-black text-lg">
                    {currentTestimonial.name}
                  </div>
                  <div className="text-black/60">
                    {currentTestimonial.role} at {currentTestimonial.company}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className="group relative"
              >
                <div
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentIndex ? 'bg-blue-600 w-8' : 'bg-black/[0.12]'
                  }`}
                />
                {index === currentIndex && (
                  <motion.div
                    className="absolute inset-0 bg-blue-600 rounded-full"
                    initial={{ scale: 1 }}
                    animate={{ scale: 1.5, opacity: 0 }}
                    transition={{ duration: 0.6, repeat: Infinity }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={() =>
              setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
            }
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-16 w-12 h-12 bg-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center group"
          >
            <svg
              className="w-6 h-6 text-black/60 group-hover:-translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <button
            onClick={() => setCurrentIndex((prev) => (prev + 1) % testimonials.length)}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-16 w-12 h-12 bg-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center group"
          >
            <svg
              className="w-6 h-6 text-black/60 group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>

        {/* Company Logos */}
        <motion.div
          className="mt-20"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ delay: 0.6 }}
        >
          <p className="text-center text-black/50 mb-8">Trusted by industry leaders</p>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-50">
            {['REMAX', 'Coldwell Banker', 'Century 21', 'Keller Williams', 'Sotheby\'s'].map(
              (company, index) => (
                <motion.div
                  key={company}
                  className="text-2xl font-bold text-black/40"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 0.5, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  whileHover={{ scale: 1.1, opacity: 1 }}
                >
                  {company}
                </motion.div>
              )
            )}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
