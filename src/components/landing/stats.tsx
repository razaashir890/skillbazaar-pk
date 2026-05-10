'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

const stats = [
  {
    value: '2M+',
    label: 'Pakistani Freelancers Worldwide',
  },
  {
    value: '4th',
    label: 'Global Freelance Ranking',
  },
  {
    value: 'PKR 1B+',
    label: 'Pakistan Freelance Market',
  },
  {
    value: '5-8%',
    label: 'Platform Fee vs 20% International Platforms',
  },
]

function AnimatedStat({ value, label }: { value: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="text-center"
    >
      <motion.p
        className="text-4xl font-bold tracking-tight sm:text-5xl"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
        transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
      >
        {value}
      </motion.p>
      <p className="mt-2 text-sm font-medium text-emerald-100 sm:text-base">
        {label}
      </p>
    </motion.div>
  )
}

export function Stats() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-emerald-600 to-emerald-800 py-16 sm:py-20">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute left-1/4 top-0 h-64 w-64 rounded-full bg-white blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-64 w-64 rounded-full bg-amber-400 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          {stats.map((stat) => (
            <AnimatedStat key={stat.value} value={stat.value} label={stat.label} />
          ))}
        </div>
      </div>
    </section>
  )
}
