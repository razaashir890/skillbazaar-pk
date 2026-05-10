'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Settings as SettingsIcon,
  Bell,
  Shield,
  Palette,
  Link2,
  Mail,
  Phone,
  Globe,
  Moon,
  Sun,
  Monitor,
  Eye,
  EyeOff,
  Smartphone,
  User,
} from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useTheme } from 'next-themes'
import { useAuth } from '@/contexts/auth-context'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
}

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const { user } = useAuth()

  // Notification settings
  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    newMessages: true,
    promotionEmails: false,
    reviewNotifications: true,
    weeklyDigest: true,
    priceDropAlerts: true,
    communityUpdates: false,
    securityAlerts: true,
  })

  // Security settings
  const [twoFactor, setTwoFactor] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' })

  // Account settings
  const [accountData, setAccountData] = useState({
    email: user?.email || '',
    phone: '+92 300 1234567',
    language: 'en',
    timezone: 'Asia/Karachi',
  })

  const handleSaveNotifications = () => {
    toast.success('Notification preferences saved!')
  }

  const handleChangePassword = () => {
    if (passwords.new !== passwords.confirm) {
      toast.error('Passwords do not match')
      return
    }
    if (passwords.new.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }
    toast.success('Password changed successfully!')
    setPasswords({ current: '', new: '', confirm: '' })
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl sm:text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account preferences</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Settings Nav */}
        <motion.div variants={itemVariants} className="lg:col-span-1">
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 rounded-2xl shadow-lg p-4 sticky top-24">
            <nav className="flex flex-row lg:flex-col gap-1 overflow-x-auto lg:overflow-x-visible">
              {[
                { id: 'account', icon: User, label: 'Account' },
                { id: 'notifications', icon: Bell, label: 'Notifications' },
                { id: 'security', icon: Shield, label: 'Security' },
                { id: 'appearance', icon: Palette, label: 'Appearance' },
                { id: 'connected', icon: Link2, label: 'Connected Accounts' },
              ].map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-950/50 dark:hover:text-emerald-400 transition-colors whitespace-nowrap"
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  {item.label}
                </a>
              ))}
            </nav>
          </div>
        </motion.div>

        {/* Settings Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Account Settings */}
          <motion.div id="account" variants={itemVariants} className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <User className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              <h2 className="text-lg font-semibold">Account Settings</h2>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input value={accountData.email} className="pl-10" onChange={(e) => setAccountData({ ...accountData, email: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input value={accountData.phone} className="pl-10" onChange={(e) => setAccountData({ ...accountData, phone: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Language</Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Select value={accountData.language} onValueChange={(v) => setAccountData({ ...accountData, language: v })}>
                      <SelectTrigger className="pl-10"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="ur">اردو (Urdu)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Timezone</Label>
                  <Select value={accountData.timezone} onValueChange={(v) => setAccountData({ ...accountData, timezone: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asia/Karachi">Pakistan (UTC+5)</SelectItem>
                      <SelectItem value="Asia/Riyadh">Saudi Arabia (UTC+3)</SelectItem>
                      <SelectItem value="UTC">UTC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => toast.success('Account settings saved!')}>
                Save Changes
              </Button>
            </div>
          </motion.div>

          {/* Notification Settings */}
          <motion.div id="notifications" variants={itemVariants} className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Bell className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              <h2 className="text-lg font-semibold">Notification Preferences</h2>
            </div>
            <div className="space-y-4">
              {[
                { key: 'orderUpdates', label: 'Order Updates', desc: 'Get notified about order status changes' },
                { key: 'newMessages', label: 'New Messages', desc: 'Receive notifications for new messages' },
                { key: 'reviewNotifications', label: 'Review Notifications', desc: 'Get notified when you receive a review' },
                { key: 'weeklyDigest', label: 'Weekly Digest', desc: 'Receive a weekly summary email' },
                { key: 'priceDropAlerts', label: 'Price Drop Alerts', desc: 'Get notified about price changes' },
                { key: 'promotionEmails', label: 'Promotional Emails', desc: 'Receive offers and promotions' },
                { key: 'communityUpdates', label: 'Community Updates', desc: 'Get notified about community events' },
                { key: 'securityAlerts', label: 'Security Alerts', desc: 'Important security notifications' },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                  <Switch
                    checked={notifications[item.key as keyof typeof notifications]}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, [item.key]: checked })
                    }
                  />
                </div>
              ))}
              <Separator />
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={handleSaveNotifications}>
                Save Preferences
              </Button>
            </div>
          </motion.div>

          {/* Security Settings */}
          <motion.div id="security" variants={itemVariants} className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              <h2 className="text-lg font-semibold">Security</h2>
            </div>
            <div className="space-y-6">
              {/* Two Factor Auth */}
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-medium">Two-Factor Authentication</p>
                  <p className="text-xs text-muted-foreground">Add an extra layer of security to your account</p>
                </div>
                <Switch checked={twoFactor} onCheckedChange={(checked) => {
                  setTwoFactor(checked)
                  toast.success(checked ? '2FA enabled!' : '2FA disabled!')
                }} />
              </div>

              <Separator />

              {/* Change Password */}
              <div>
                <h3 className="text-sm font-semibold mb-3">Change Password</h3>
                <div className="space-y-3 max-w-md">
                  <div className="space-y-2">
                    <Label>Current Password</Label>
                    <div className="relative">
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter current password"
                        value={passwords.current}
                        onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                      />
                      <button onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>New Password</Label>
                    <Input
                      type="password"
                      placeholder="Enter new password"
                      value={passwords.new}
                      onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Confirm New Password</Label>
                    <Input
                      type="password"
                      placeholder="Confirm new password"
                      value={passwords.confirm}
                      onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                    />
                  </div>
                  <Button variant="outline" onClick={handleChangePassword}>Change Password</Button>
                </div>
              </div>

              <Separator />

              {/* Active Sessions */}
              <div>
                <h3 className="text-sm font-semibold mb-3">Active Sessions</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/30">
                    <div className="flex items-center gap-3">
                      <Smartphone className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                      <div>
                        <p className="text-sm font-medium">Chrome on Windows</p>
                        <p className="text-xs text-muted-foreground">Lahore, Pakistan · Active now</p>
                      </div>
                    </div>
                    <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300 text-[10px]">Current</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                    <div className="flex items-center gap-3">
                      <Smartphone className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Safari on iPhone</p>
                        <p className="text-xs text-muted-foreground">Lahore, Pakistan · 2 hours ago</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-red-500 text-xs" onClick={() => toast.success('Session revoked')}>Revoke</Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Appearance */}
          <motion.div id="appearance" variants={itemVariants} className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Palette className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              <h2 className="text-lg font-semibold">Appearance</h2>
            </div>
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Theme</Label>
                <p className="text-xs text-muted-foreground mb-3">Choose your preferred theme</p>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'light', icon: Sun, label: 'Light' },
                    { value: 'dark', icon: Moon, label: 'Dark' },
                    { value: 'system', icon: Monitor, label: 'System' },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setTheme(option.value)}
                      className={`flex flex-col items-center gap-2 rounded-xl p-4 border-2 transition-all ${
                        theme === option.value
                          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30'
                          : 'border-gray-200 dark:border-gray-700 hover:border-emerald-300 dark:hover:border-emerald-700'
                      }`}
                    >
                      <option.icon className={`h-6 w-6 ${theme === option.value ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground'}`} />
                      <span className={`text-sm font-medium ${theme === option.value ? 'text-emerald-700 dark:text-emerald-300' : 'text-muted-foreground'}`}>
                        {option.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Connected Accounts */}
          <motion.div id="connected" variants={itemVariants} className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Link2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              <h2 className="text-lg font-semibold">Connected Accounts</h2>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                    <span className="text-lg font-bold text-red-600">G</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Google</p>
                    <p className="text-xs text-muted-foreground">Connected as {user?.email || 'user@gmail.com'}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="text-red-500" onClick={() => toast.info('Google account disconnected')}>
                  Disconnect
                </Button>
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <span className="text-lg font-bold text-blue-600">f</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Facebook</p>
                    <p className="text-xs text-muted-foreground">Connected</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="text-red-500" onClick={() => toast.info('Facebook account disconnected')}>
                  Disconnect
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
