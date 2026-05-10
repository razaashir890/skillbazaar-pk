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
      'Auto-generate your professional profile using AI in seconds',
    color: 'emerald',
  },
  {
    icon: Smartphone,
    title: 'Local Payments',
    description:
      'JazzCash, EasyPaisa, Bank Transfer — all local payment methods supported',
    color: 'amber',
  },
  {
    icon: MapPin,
    title: 'Local Marketplace',
    description:
      'Clients and freelancers from every city in Pakistan',
    color: 'emerald',
  },
  {
    icon: Globe,
    title: 'Global Reach',
    description:
      'Global reach like Fiverr and Upwork, with a Pakistani touch',
    color: 'amber',
  },
  {
    icon: GraduationCap,
    title: 'Skill Academy',
    description:
      'Enhance your skills with free courses and certifications',
    color: 'emerald',
  },
  {
    icon: Users,
    title: 'Team Builder',
    description:
      'Form teams with multiple freelancers to handle bigger projects',
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
            What Makes Us Special
          </h2>
          <p className="mt-3 text-lg text-muted-foreground">
            Every feature on SkillBazaar PK is designed for Pakistani freelancers
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
