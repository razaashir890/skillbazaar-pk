'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Zap, Menu, Building2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from '@/components/ui/sheet'

interface NavbarProps {
  onLoginClick: () => void
  onSignupClick: () => void
}

export function Navbar({ onLoginClick, onSignupClick }: NavbarProps) {
  const [open, setOpen] = useState(false)

  const navLinks = [
    { label: 'Browse', href: '#categories' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Categories', href: '#categories' },
    { label: 'Skill Academy', href: '#features' },
  ]

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-lg dark:bg-gray-950/80"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 text-white">
            <Zap className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
            SkillBazaar <span className="text-amber-500">PK</span>
          </span>
        </a>

        {/* Desktop Nav Links */}
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-3 md:flex">
          <Button variant="outline" size="sm" onClick={onLoginClick}>
            Login
          </Button>
          <Button size="sm" onClick={onSignupClick}>
            Join Free
          </Button>
        </div>

        {/* Mobile Menu */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80">
            <SheetTitle className="flex items-center gap-2 px-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white">
                <Zap className="h-4 w-4" />
              </div>
              <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                SkillBazaar <span className="text-amber-500">PK</span>
              </span>
            </SheetTitle>
            <div className="flex flex-col gap-2 px-4 pt-4">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                >
                  {link.label}
                </a>
              ))}
            </div>
            <div className="mt-4 flex flex-col gap-2 border-t px-4 pt-4">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setOpen(false)
                  onLoginClick()
                }}
              >
                Login
              </Button>
              <Button
                className="w-full"
                onClick={() => {
                  setOpen(false)
                  onSignupClick()
                }}
              >
                Join Free
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </motion.header>
  )
}
