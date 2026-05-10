'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Zap, Menu, LogOut, LayoutDashboard, User, Settings } from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from '@/components/ui/sheet'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface NavbarProps {
  onLoginClick: () => void
  onSignupClick: () => void
}

function getUserName(user: { user_metadata?: { full_name?: string; name?: string; email?: string } } | null): string {
  if (!user) return 'User'
  const meta = user.user_metadata
  return meta?.full_name || meta?.name || meta?.email?.split('@')[0] || 'User'
}

function getUserInitial(name: string): string {
  return name.charAt(0).toUpperCase()
}

export function Navbar({ onLoginClick, onSignupClick }: NavbarProps) {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const userName = getUserName(user)
  const userInitial = getUserInitial(userName)

  const navLinks = [
    { label: 'Browse', href: '#categories' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Categories', href: '#categories' },
    { label: 'Skill Academy', href: '#features' },
  ]

  const handleSignOut = async () => {
    await signOut()
    toast.success('You have been logged out')
    router.push('/')
  }

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
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative flex items-center gap-2 rounded-full pl-2 pr-3"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-emerald-600 text-white font-semibold text-xs">
                      {userInitial}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium max-w-[120px] truncate">
                    {userName}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col gap-1">
                    <span className="font-semibold">{userName}</span>
                    <span className="text-xs text-muted-foreground font-normal">
                      {user.email}
                    </span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => router.push('/dashboard')}
                >
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => router.push('/dashboard')}
                >
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => router.push('/dashboard')}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="text-red-600 dark:text-red-400"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="outline" size="sm" onClick={onLoginClick}>
                Login
              </Button>
              <Button size="sm" onClick={onSignupClick}>
                Join Free
              </Button>
            </>
          )}
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
              {user ? (
                <>
                  <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3 mb-2">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-emerald-600 text-white font-semibold text-xs">
                        {userInitial}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate">{userName}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                  </div>
                  <Button
                    className="w-full"
                    onClick={() => {
                      setOpen(false)
                      router.push('/dashboard')
                    }}
                  >
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                    onClick={() => {
                      setOpen(false)
                      handleSignOut()
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
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
                </>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </motion.header>
  )
}
