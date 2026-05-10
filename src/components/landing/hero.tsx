'use client'

import { motion } from 'framer-motion'
import {
  Star,
  Rocket,
  Building2,
  Wallet,
  CheckCircle2,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
} from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'

interface HeroProps {
  onSignupClick: () => void
}

export function Hero({ onSignupClick }: HeroProps) {
  return (
    <section className="relative overflow-hidden hero-grid-pattern">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/60 via-transparent to-amber-50/40 dark:from-emerald-950/40 dark:via-transparent dark:to-amber-950/20" />

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left Column */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="flex flex-col gap-6"
          >
            <Badge
              variant="secondary"
              className="w-fit gap-1.5 border-emerald-200 bg-emerald-100 px-3 py-1.5 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
            >
              <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
              Pakistan ka #1 Freelance Platform
            </Badge>

            <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Pakistan ka Apna{' '}
              <span className="text-emerald-600 dark:text-emerald-400">
                Freelance
              </span>{' '}
              Marketplace
            </h1>

            <p className="text-xl text-muted-foreground">
              Har hunar, har jagah becho — apne andaaz mein
            </p>

            <p className="max-w-lg text-sm leading-relaxed text-muted-foreground">
              Pakistani talent ko local businesses se connect karein. JazzCash,
              EasyPaisa, aur bank transfer ke saath payments receive karein.
              Fiverr aur Upwork jaisi global reach, Pakistani andaaz mein.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <Button size="lg" className="gap-2" onClick={onSignupClick}>
                <Rocket className="h-4 w-4" />
                Freelancer Bano
              </Button>
              <Button size="lg" variant="outline" className="gap-2">
                <Building2 className="h-4 w-4" />
                Client Bano
              </Button>
            </div>

            {/* Stats Bar */}
            <div className="flex flex-wrap items-center gap-4 pt-4 text-sm">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span className="font-semibold">50,000+</span>
                <span className="text-muted-foreground">Freelancers</span>
              </div>
              <Separator orientation="vertical" className="h-4" />
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span className="font-semibold">10,000+</span>
                <span className="text-muted-foreground">Businesses</span>
              </div>
              <Separator orientation="vertical" className="h-4" />
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span className="font-semibold">PKR 1B+</span>
                <span className="text-muted-foreground">Earnings</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Floating Cards (Desktop only) */}
          <div className="relative hidden lg:block">
            {/* Main Freelancer Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.3, ease: 'easeOut' }}
              className="relative"
            >
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Card className="w-full max-w-sm border-0 shadow-2xl">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-16 w-16 border-2 border-emerald-200">
                        <AvatarFallback className="bg-emerald-100 text-lg font-bold text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
                          AK
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold">Ahmed Khan</h3>
                        <p className="text-sm text-muted-foreground">
                          WordPress Developer, Lahore
                        </p>
                        <div className="mt-2 flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className="h-4 w-4 fill-amber-500 text-amber-500"
                            />
                          ))}
                          <span className="ml-1 text-sm font-medium text-amber-600">
                            4.9
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center gap-2">
                      <Badge className="border-emerald-200 bg-emerald-100 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        ★ Top Rated
                      </Badge>
                      <Badge variant="secondary">WordPress</Badge>
                      <Badge variant="secondary">PHP</Badge>
                    </div>
                    <div className="mt-4 rounded-lg bg-emerald-50 p-3 dark:bg-emerald-950">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-muted-foreground">Starting from</p>
                          <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                            PKR 5,000
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">Completed</p>
                          <p className="text-lg font-bold">147 orders</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>

            {/* Floating Notification Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: [0, -8, 0] }}
              transition={{
                opacity: { duration: 0.5, delay: 0.8 },
                y: { duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1.2 },
              }}
              className="absolute -bottom-6 -left-8"
            >
              <Card className="border-0 shadow-xl">
                <CardContent className="flex items-center gap-3 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                    <Wallet className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-green-700 dark:text-green-400">
                      Payment Received!
                    </p>
                    <p className="text-xs text-muted-foreground">PKR 25,000</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Second Floating Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: [0, 8, 0] }}
              transition={{
                opacity: { duration: 0.5, delay: 1.1 },
                x: { duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1.5 },
              }}
              className="absolute -right-4 top-16"
            >
              <Card className="border-0 shadow-lg">
                <CardContent className="p-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900">
                      <Rocket className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold">New Order!</p>
                      <p className="text-[10px] text-muted-foreground">E-commerce Website</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
