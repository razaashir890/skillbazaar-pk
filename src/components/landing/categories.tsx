'use client'

import { motion } from 'framer-motion'
import {
  Palette,
  Code,
  Film,
  FileText,
  TrendingUp,
  Smartphone,
  Database,
  Headphones,
  Languages,
  Music,
  Briefcase,
  Wand2,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

const categories = [
  { icon: Palette, name: 'Graphic Design' },
  { icon: Code, name: 'Web Development' },
  { icon: Film, name: 'Video Editing' },
  { icon: FileText, name: 'Content Writing' },
  { icon: TrendingUp, name: 'Digital Marketing' },
  { icon: Smartphone, name: 'Mobile Apps' },
  { icon: Database, name: 'Data Entry' },
  { icon: Headphones, name: 'Virtual Assistant' },
  { icon: Languages, name: 'Translation' },
  { icon: Music, name: 'Music & Audio' },
  { icon: Briefcase, name: 'Business Consulting' },
  { icon: Wand2, name: 'Animation' },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
}

export function Categories() {
  return (
    <section id="categories" className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Popular Categories
          </h2>
          <p className="mt-3 text-lg text-muted-foreground">
            Har skill ke liye opportunities — apna category choose karein
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
        >
          {categories.map((category) => (
            <motion.div key={category.name} variants={itemVariants}>
              <Card className="group cursor-pointer transition-all duration-300 hover:border-emerald-300 hover:shadow-md dark:hover:border-emerald-700">
                <CardContent className="flex flex-col items-center gap-3 p-5">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 transition-colors duration-300 group-hover:bg-emerald-600 dark:bg-emerald-950 dark:group-hover:bg-emerald-600">
                    <category.icon className="h-6 w-6 text-emerald-600 transition-colors duration-300 group-hover:text-white dark:text-emerald-400 dark:group-hover:text-white" />
                  </div>
                  <span className="text-center text-sm font-medium">{category.name}</span>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
