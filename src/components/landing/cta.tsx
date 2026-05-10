'use client'

import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface CtaProps {
  onSignupClick: () => void
}

export function CTA({ onSignupClick }: CtaProps) {
  return (
    <section className="relative overflow-hidden bg-muted/50 py-16 sm:py-24">
      {/* Decorative background */}
      <div className="absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-100/50 blur-3xl dark:bg-emerald-950/30" />
        <div className="absolute bottom-0 left-1/4 h-[400px] w-[400px] rounded-full bg-amber-100/40 blur-3xl dark:bg-amber-950/20" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to Get Started?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Join Pakistan's largest freelance marketplace today. Create a free
            account and showcase your skills to the world.
          </p>
          <div className="mt-8">
            <Button size="lg" className="gap-2 px-8" onClick={onSignupClick}>
              Create Free Account
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
