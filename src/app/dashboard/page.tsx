'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Wallet,
  Briefcase,
  MessageSquare,
  Star,
  TrendingUp,
  TrendingDown,
  Clock,
  Plus,
  Eye,
  BookOpen,
  ArrowUpRight,
  ChevronRight,
} from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { getUserName, getUserInitial, getGreeting } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'

const statCards = [
  {
    label: 'Total Earnings',
    value: 'PKR 45,000',
    trend: '+12% from last month',
    trendUp: true,
    icon: Wallet,
    color: 'emerald',
    href: '/dashboard/wallet',
  },
  {
    label: 'Active Gigs',
    value: '8',
    trend: '+2 new this week',
    trendUp: true,
    icon: Briefcase,
    color: 'emerald',
    href: '/dashboard/gigs',
  },
  {
    label: 'New Messages',
    value: '12',
    trend: '-3 from yesterday',
    trendUp: false,
    icon: MessageSquare,
    color: 'amber',
    href: '/dashboard/messages',
  },
  {
    label: 'Average Rating',
    value: '4.9',
    trend: '+0.2 from last month',
    trendUp: true,
    icon: Star,
    color: 'emerald',
    href: '/dashboard/profile',
  },
]

const quickActions = [
  { label: 'Create Gig', icon: Plus, href: '/dashboard/gigs?action=create', description: 'Post a new service' },
  { label: 'Browse Gigs', icon: Eye, href: '/dashboard/browse', description: 'Find services' },
  { label: 'Find Work', icon: Briefcase, href: '/dashboard/browse', description: 'Browse projects' },
  { label: 'Skill Academy', icon: BookOpen, href: '/dashboard/academy', description: 'Learn and grow' },
]

const recentActivities = [
  { id: 1, user: 'AH', description: 'Ahmed Hassan placed a new order for "WordPress Website"', time: '2 minutes ago', color: 'bg-emerald-600' },
  { id: 2, user: 'SK', description: 'Sara Khan sent you a message about the logo project', time: '15 minutes ago', color: 'bg-amber-500' },
  { id: 3, user: 'MR', description: 'Payment of PKR 5,000 received for "Logo Design"', time: '1 hour ago', color: 'bg-emerald-600' },
  { id: 4, user: 'UA', description: 'Usman Ali left a 5-star review on your gig', time: '3 hours ago', color: 'bg-amber-500' },
  { id: 5, user: 'FK', description: 'Fatima Khan requested a revision on "Banner Design"', time: '5 hours ago', color: 'bg-orange-500' },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
}

export default function DashboardPage() {
  const { user } = useAuth()
  const userName = getUserName(user)
  const userInitial = getUserInitial(userName)
  const greeting = getGreeting()

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Welcome Section */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            {greeting}, {userName}!
          </h1>
          <p className="text-muted-foreground mt-1">
            Here is what is happening with your freelance business today.
          </p>
        </div>
        <Link href="/dashboard/gigs?action=create">
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/25 transition-all duration-300 hover:shadow-emerald-600/40 shrink-0">
            <Plus className="h-4 w-4 mr-2" />
            Create New Gig
          </Button>
        </Link>
      </motion.div>

      {/* Stat Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map((card, index) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.08 }}
          >
            <Link href={card.href} className="block">
              <div className="group bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 rounded-2xl p-6 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">{card.label}</p>
                    <p className="text-3xl font-bold mt-1 tracking-tight">{card.value}</p>
                    <div className={`flex items-center gap-1 mt-2 ${card.trendUp ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                      {card.trendUp ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                      <span className="text-sm font-medium">{card.trend}</span>
                    </div>
                  </div>
                  <div className={`h-12 w-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ${card.color === 'emerald' ? 'bg-emerald-100 dark:bg-emerald-900/50' : 'bg-amber-100 dark:bg-amber-900/50'}`}>
                    <card.icon className={`h-6 w-6 ${card.color === 'emerald' ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`} />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants}>
        <h2 className="text-lg font-semibold mb-3">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.06 }}
            >
              <Link href={action.href} className="block">
                <div className="group flex flex-col items-center gap-2 rounded-2xl border border-white/20 dark:border-gray-700/30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-5 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.03]">
                  <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-600/20 group-hover:shadow-emerald-600/40 transition-all duration-300 group-hover:scale-110">
                    <action.icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold">{action.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{action.description}</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Two column layout: Recent Activity + Profile Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <motion.div
          variants={itemVariants}
          className="lg:col-span-2 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 rounded-2xl shadow-lg"
        >
          <div className="flex items-center justify-between p-6 pb-4">
            <h2 className="text-lg font-semibold">Recent Activity</h2>
            <Link href="/dashboard/orders" className="flex items-center gap-1 text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium transition-colors">
              View all
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="px-6 pb-4"><Separator /></div>
          <div className="px-6 pb-6">
            <div className="flex flex-col gap-0">
              {recentActivities.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.06 }}
                  className="group flex items-start gap-4 py-4 cursor-pointer"
                >
                  <Avatar className="h-10 w-10 shrink-0 mt-0.5">
                    <AvatarFallback className={`${activity.color} text-white font-semibold text-xs`}>
                      {activity.user}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm leading-relaxed">{activity.description}</p>
                    <div className="flex items-center gap-1 mt-1.5 text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" />
                      <span className="text-xs">{activity.time}</span>
                    </div>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-1" />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Profile Summary */}
        <motion.div
          variants={itemVariants}
          className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 rounded-2xl shadow-lg p-6"
        >
          <h2 className="text-lg font-semibold mb-4">Profile Summary</h2>

          <div className="flex flex-col items-center mb-5">
            <Avatar className="h-16 w-16 mb-3">
              <AvatarFallback className="bg-emerald-600 text-white font-bold text-xl">
                {userInitial}
              </AvatarFallback>
            </Avatar>
            <h3 className="font-semibold text-base">{userName}</h3>
            <p className="text-sm text-muted-foreground mt-0.5">
              {user?.user_metadata?.role
                ? String(user.user_metadata.role).charAt(0).toUpperCase() + String(user.user_metadata.role).slice(1).toLowerCase()
                : 'Freelancer'}
            </p>
            <Badge variant="secondary" className="mt-2 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
              Pro Member
            </Badge>
          </div>

          <Separator className="mb-5" />

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Profile Completeness</span>
                <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">65%</span>
              </div>
              <Progress value={65} className="h-2" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Link href="/dashboard/orders" className="block">
                <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/50 p-3 text-center hover:bg-emerald-100 dark:hover:bg-emerald-900/70 transition-colors">
                  <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">24</p>
                  <p className="text-xs text-muted-foreground">Completed</p>
                </div>
              </Link>
              <Link href="/dashboard/profile" className="block">
                <div className="rounded-xl bg-amber-50 dark:bg-amber-950/50 p-3 text-center hover:bg-amber-100 dark:hover:bg-amber-900/70 transition-colors">
                  <p className="text-xl font-bold text-amber-600 dark:text-amber-400">4.9</p>
                  <p className="text-xs text-muted-foreground">Avg Rating</p>
                </div>
              </Link>
            </div>

            <div className="space-y-2.5 pt-1">
              <p className="text-sm font-medium">Complete your profile</p>
              <Link href="/dashboard/profile" className="block">
                <div className="flex items-center gap-2 w-full rounded-xl border border-dashed border-gray-300 dark:border-gray-600 p-3 text-sm text-muted-foreground hover:border-emerald-400 hover:text-emerald-600 dark:hover:border-emerald-500 dark:hover:text-emerald-400 transition-colors">
                  <div className="h-2 w-2 rounded-full bg-amber-500" />
                  Add a profile picture
                </div>
              </Link>
              <Link href="/dashboard/profile" className="block">
                <div className="flex items-center gap-2 w-full rounded-xl border border-dashed border-gray-300 dark:border-gray-600 p-3 text-sm text-muted-foreground hover:border-emerald-400 hover:text-emerald-600 dark:hover:border-emerald-500 dark:hover:text-emerald-400 transition-colors">
                  <div className="h-2 w-2 rounded-full bg-amber-500" />
                  Write a bio
                </div>
              </Link>
              <Link href="/dashboard/profile" className="block">
                <div className="flex items-center gap-2 w-full rounded-xl border border-dashed border-gray-300 dark:border-gray-600 p-3 text-sm text-muted-foreground hover:border-emerald-400 hover:text-emerald-600 dark:hover:border-emerald-500 dark:hover:text-emerald-400 transition-colors">
                  <div className="h-2 w-2 rounded-full bg-amber-500" />
                  Add your skills
                </div>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Earnings Overview Chart */}
      <motion.div
        variants={itemVariants}
        className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 rounded-2xl shadow-lg p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Earnings Overview</h2>
          <Badge variant="secondary" className="text-xs">Last 30 days</Badge>
        </div>
        <div className="flex items-end gap-2 h-40">
          {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 100].map((height, i) => (
            <motion.div
              key={i}
              className="flex-1 rounded-t-lg bg-gradient-to-t from-emerald-600 to-emerald-400 dark:from-emerald-500 dark:to-emerald-300 min-w-0"
              initial={{ height: 0 }}
              animate={{ height: `${height}%` }}
              transition={{ delay: 0.5 + i * 0.04, duration: 0.5, ease: 'easeOut' }}
            />
          ))}
        </div>
        <div className="flex justify-between mt-3 text-xs text-muted-foreground">
          <span>Jan</span>
          <span>Mar</span>
          <span>Jun</span>
          <span>Sep</span>
          <span>Dec</span>
        </div>
      </motion.div>
    </motion.div>
  )
}
