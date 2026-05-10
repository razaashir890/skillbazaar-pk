'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Wallet as WalletIcon,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  CreditCard,
  Building2,
  Phone,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
} from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface Transaction {
  id: string
  date: string
  description: string
  type: 'income' | 'withdrawal' | 'fee' | 'bonus'
  amount: number
  status: 'completed' | 'pending' | 'processing'
}

const transactions: Transaction[] = [
  { id: 'TXN-001', date: 'Dec 10, 2024', description: 'Payment for Logo Design', type: 'income', amount: 5000, status: 'completed' },
  { id: 'TXN-002', date: 'Dec 9, 2024', description: 'Withdrawal to JazzCash', type: 'withdrawal', amount: -10000, status: 'completed' },
  { id: 'TXN-003', date: 'Dec 8, 2024', description: 'Payment for WordPress Website', type: 'income', amount: 25000, status: 'completed' },
  { id: 'TXN-004', date: 'Dec 8, 2024', description: 'Platform fee (10%)', type: 'fee', amount: -2500, status: 'completed' },
  { id: 'TXN-005', date: 'Dec 7, 2024', description: 'Payment for Video Editing', type: 'income', amount: 3000, status: 'completed' },
  { id: 'TXN-006', date: 'Dec 6, 2024', description: 'Withdrawal to EasyPaisa', type: 'withdrawal', amount: -8000, status: 'processing' },
  { id: 'TXN-007', date: 'Dec 5, 2024', description: 'Payment for Content Writing', type: 'income', amount: 7500, status: 'pending' },
  { id: 'TXN-008', date: 'Dec 4, 2024', description: 'Payment for Social Media Marketing', type: 'income', amount: 12000, status: 'completed' },
  { id: 'TXN-009', date: 'Dec 3, 2024', description: 'Performance bonus', type: 'bonus', amount: 2000, status: 'completed' },
  { id: 'TXN-010', date: 'Dec 2, 2024', description: 'Payment for Flutter App', type: 'income', amount: 35000, status: 'completed' },
  { id: 'TXN-011', date: 'Dec 1, 2024', description: 'Withdrawal to Bank Account', type: 'withdrawal', amount: -20000, status: 'completed' },
  { id: 'TXN-012', date: 'Nov 30, 2024', description: 'Platform fee (10%)', type: 'fee', amount: -3500, status: 'completed' },
]

const earningsByMonth = [
  { month: 'Jul', amount: 12000 },
  { month: 'Aug', amount: 18500 },
  { month: 'Sep', amount: 22000 },
  { month: 'Oct', amount: 31000 },
  { month: 'Nov', amount: 38000 },
  { month: 'Dec', amount: 45000 },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
}

export default function WalletPage() {
  const [withdrawOpen, setWithdrawOpen] = useState(false)
  const [withdrawMethod, setWithdrawMethod] = useState('')
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [accountDetail, setAccountDetail] = useState('')

  const totalEarnings = 45500
  const pendingClearance = 7500
  const availableBalance = totalEarnings - pendingClearance
  const totalWithdrawn = 38000

  const handleWithdraw = () => {
    const amount = parseInt(withdrawAmount)
    if (!amount || amount < 500) {
      toast.error('Minimum withdrawal amount is PKR 500')
      return
    }
    if (amount > availableBalance) {
      toast.error('Insufficient balance')
      return
    }
    if (!withdrawMethod || !accountDetail) {
      toast.error('Please fill in all required fields')
      return
    }
    toast.success(`Withdrawal of PKR ${amount.toLocaleString()} initiated!`)
    setWithdrawOpen(false)
    setWithdrawAmount('')
    setAccountDetail('')
  }

  const typeIcon = (type: string) => {
    switch (type) {
      case 'income': return <ArrowDownRight className="h-4 w-4 text-emerald-600" />
      case 'withdrawal': return <ArrowUpRight className="h-4 w-4 text-red-500" />
      case 'fee': return <AlertCircle className="h-4 w-4 text-amber-500" />
      case 'bonus': return <TrendingUp className="h-4 w-4 text-emerald-600" />
      default: return null
    }
  }

  const statusBadge = (status: string) => {
    switch (status) {
      case 'completed': return <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300 text-[10px]"><CheckCircle2 className="h-3 w-3 mr-1" />Completed</Badge>
      case 'pending': return <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300 text-[10px]"><Clock className="h-3 w-3 mr-1" />Pending</Badge>
      case 'processing': return <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 text-[10px]"><Clock className="h-3 w-3 mr-1" />Processing</Badge>
      default: return null
    }
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Wallet</h1>
          <p className="text-muted-foreground mt-1">Manage your earnings and withdrawals</p>
        </div>
        <Dialog open={withdrawOpen} onOpenChange={setWithdrawOpen}>
          <DialogTrigger asChild>
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/25">
              <Download className="h-4 w-4 mr-2" />
              Withdraw Funds
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Withdraw Funds</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <p className="text-sm text-muted-foreground">Available Balance</p>
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">PKR {availableBalance.toLocaleString()}</p>
              </div>
              <Separator />
              <div className="space-y-2">
                <Label>Withdrawal Method *</Label>
                <Select value={withdrawMethod} onValueChange={setWithdrawMethod}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="jazzcash">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />JazzCash
                      </div>
                    </SelectItem>
                    <SelectItem value="easypaisa">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />EasyPaisa
                      </div>
                    </SelectItem>
                    <SelectItem value="bank">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4" />Bank Transfer
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Amount (PKR) *</Label>
                <Input
                  type="number"
                  placeholder="Enter amount (min. PKR 500)"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                />
                <div className="flex gap-2">
                  {[1000, 5000, 10000, 20000].map(amt => (
                    <Button key={amt} variant="outline" size="sm" className="text-xs" onClick={() => setWithdrawAmount(String(amt))}>
                      {amt >= 1000 ? `${amt / 1000}K` : amt}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Account Detail *</Label>
                <Input
                  placeholder={withdrawMethod === 'bank' ? 'Account number / IBAN' : 'Mobile number'}
                  value={accountDetail}
                  onChange={(e) => setAccountDetail(e.target.value)}
                />
              </div>
              <div className="rounded-lg bg-amber-50 dark:bg-amber-950/30 p-3 text-xs text-amber-700 dark:text-amber-400">
                Processing time: JazzCash/EasyPaisa within 24 hours, Bank Transfer 2-3 business days.
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setWithdrawOpen(false)}>Cancel</Button>
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={handleWithdraw}>
                <Download className="h-4 w-4 mr-2" />Withdraw
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Balance Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 text-white rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-emerald-100">Total Earnings</p>
            <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center">
              <WalletIcon className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-bold">PKR {totalEarnings.toLocaleString()}</p>
          <div className="flex items-center gap-1 mt-2 text-emerald-200">
            <TrendingUp className="h-4 w-4" />
            <span className="text-sm">+12% from last month</span>
          </div>
        </div>
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-muted-foreground">Available Balance</p>
            <div className="h-10 w-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
              <CreditCard className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
          <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">PKR {availableBalance.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground mt-2">Ready for withdrawal</p>
        </div>
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-muted-foreground">Pending Clearance</p>
            <div className="h-10 w-10 rounded-xl bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center">
              <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
          <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">PKR {pendingClearance.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground mt-2">Clears in 14 days</p>
        </div>
      </motion.div>

      {/* Earnings Chart */}
      <motion.div variants={itemVariants} className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Earnings Breakdown</h2>
          <Badge variant="secondary">Last 6 months</Badge>
        </div>
        <div className="space-y-3">
          {earningsByMonth.map((item, index) => {
            const maxAmount = Math.max(...earningsByMonth.map(e => e.amount))
            const percentage = (item.amount / maxAmount) * 100
            return (
              <div key={item.month} className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground w-8">{item.month}</span>
                <div className="flex-1 h-8 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg flex items-center px-3"
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ delay: 0.3 + index * 0.1, duration: 0.5, ease: 'easeOut' }}
                  >
                    <span className="text-xs font-medium text-white whitespace-nowrap">
                      PKR {item.amount.toLocaleString()}
                    </span>
                  </motion.div>
                </div>
              </div>
            )
          })}
        </div>
      </motion.div>

      {/* Transaction History */}
      <motion.div variants={itemVariants} className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 rounded-2xl shadow-lg">
        <div className="flex items-center justify-between p-6 pb-4">
          <h2 className="text-lg font-semibold">Transaction History</h2>
          <Badge variant="secondary">{transactions.length} transactions</Badge>
        </div>
        <div className="px-6 pb-2"><Separator /></div>

        {/* Desktop Table */}
        <div className="hidden md:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((txn) => (
                <TableRow key={txn.id} className="cursor-pointer hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {typeIcon(txn.type)}
                      <span className="text-sm capitalize">{txn.type}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{txn.description}</span>
                      <span className="text-xs text-muted-foreground">{txn.id}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{txn.date}</TableCell>
                  <TableCell>{statusBadge(txn.status)}</TableCell>
                  <TableCell className={`text-right font-semibold ${txn.amount > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'}`}>
                    {txn.amount > 0 ? '+' : ''}PKR {Math.abs(txn.amount).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden px-4 pb-4 space-y-3">
          {transactions.map((txn) => (
            <div key={txn.id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50/50 dark:bg-gray-800/50">
              <div className="h-10 w-10 rounded-xl bg-white dark:bg-gray-800 flex items-center justify-center shrink-0">
                {typeIcon(txn.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{txn.description}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-muted-foreground">{txn.date}</span>
                  {statusBadge(txn.status)}
                </div>
              </div>
              <span className={`text-sm font-bold shrink-0 ${txn.amount > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'}`}>
                {txn.amount > 0 ? '+' : ''}{Math.abs(txn.amount).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}
