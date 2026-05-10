'use client'

import { motion } from 'framer-motion'
import { Sparkles, Rocket, Wallet } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const steps = [
  {
    number: '01',
    icon: Sparkles,
    title: 'Profile Banao',
    description:
      'Apni skills aur portfolio ke saath professional profile banao',
  },
  {
    number: '02',
    icon: Rocket,
    title: 'Gig Lagao',
    description:
      'Apni services ko gigs ki shakal mein list karein aur clients attract karein',
  },
  {
    number: '03',
    icon: Wallet,
    title: 'Paise Kamao',
    description:
      'Orders complete karein, payments JazzCash/EasyPaisa mein receive karein',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
}

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Kaise Kaam Karta Hai?
          </h2>
          <p className="mt-3 text-lg text-muted-foreground">
            Sirf 3 simple steps mein shuru karein
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="mt-12 grid gap-6 md:grid-cols-3"
        >
          {steps.map((step) => (
            <motion.div key={step.number} variants={itemVariants}>
              <Card className="group h-full transition-shadow duration-300 hover:shadow-lg hover:shadow-emerald-500/5">
                <CardContent className="p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <Badge
                      variant="outline"
                      className="text-xs font-mono text-muted-foreground"
                    >
                      {step.number}
                    </Badge>
                  </div>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-950">
                    <step.icon className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">{step.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
