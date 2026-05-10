'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Navbar } from '@/components/landing/navbar'
import { Hero } from '@/components/landing/hero'
import { HowItWorks } from '@/components/landing/how-it-works'
import { Features } from '@/components/landing/features'
import { Stats } from '@/components/landing/stats'
import { Categories } from '@/components/landing/categories'
import { CTA } from '@/components/landing/cta'
import { Footer } from '@/components/landing/footer'
import { LoginModal } from '@/components/landing/login-modal'
import { SignupModal } from '@/components/landing/signup-modal'

export default function Home() {
  const [loginOpen, setLoginOpen] = useState(false)
  const [signupOpen, setSignupOpen] = useState(false)

  return (
    <>
      <Navbar
        onLoginClick={() => setLoginOpen(true)}
        onSignupClick={() => setSignupOpen(true)}
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Hero onSignupClick={() => setSignupOpen(true)} />
        <HowItWorks />
        <Features />
        <Stats />
        <Categories />
        <CTA onSignupClick={() => setSignupOpen(true)} />
        <Footer />
      </motion.div>

      <LoginModal
        open={loginOpen}
        onOpenChange={setLoginOpen}
        onSwitchToSignup={() => setSignupOpen(true)}
      />
      <SignupModal
        open={signupOpen}
        onOpenChange={setSignupOpen}
        onSwitchToLogin={() => setLoginOpen(true)}
      />
    </>
  )
}
