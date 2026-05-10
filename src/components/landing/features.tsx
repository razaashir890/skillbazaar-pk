'use client'

import { motion } from 'framer-motion'
import {
  BrainCircuit,
  Smartphone,
  MapPin,
  Globe,
  GraduationCap,
  Users,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

const features = [
  {
    icon: BrainCircuit,
    title: 'AI Profile Builder',
    description:
      'AI se apna professional profile auto-generate karein',
    color: 'emerald',
  },
  {
    icon: Smartphone,
    title: 'Local Payments',
    description:
      'JazzCash, EasyPaisa, Bank Transfer — sab local payment methods supported',
    color: 'amber',
  },
  {
    icon: MapPin,
    title: 'Local Marketplace',
    description:
      'Pakistan ke har shehar se clients aur freelancers',
    color: 'emerald',
  },
  {
    icon: Globe,
    title: 'Global Reach',
    description:
      'Fiverr aur Upwork jaisi global reach, Pakistani andaaz mein',
    color: 'amber',
  },
  {
    icon: GraduationCap,
    title: 'Skill Academy',
    description:
      'Free courses aur certifications se apni skills enhance karein',
    color: 'emerald',
  },
  {
    icon: Users,
    title: 'Team Builder',
    description:
      'Multiple freelancers ko team banao, bade projects handle karein',
    color: 'amber',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
}

export function Features() {
  return (
    <section id="features" className="bg-muted/50 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Kya Khaas Hai?
          </h2>
          <p className="mt-3 text-lg text-muted-foreground">
            SkillBazaar PK ka har feature Pakistani freelancers ke liye designed hai
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature) => (
            <motion.div key={feature.title} variants={itemVariants}>
              <Card className="group h-full transition-shadow duration-300 hover:shadow-lg hover:shadow-emerald-500/5">
                <CardContent className="p-6">
                  <div
                    className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${
                      feature.color === 'emerald'
                        ? 'bg-emerald-100 dark:bg-emerald-950'
                        : 'bg-amber-100 dark:bg-amber-950'
                    }`}
                  >
                    <feature.icon
                      className={`h-6 w-6 ${
                        feature.color === 'emerald'
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-amber-600 dark:text-amber-400'
                      }`}
                    />
                  </div>
                  <h3 className="mb-2 font-semibold">{feature.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
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
