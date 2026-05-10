'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Clock,
  Star,
  CheckCircle2,
  XCircle,
  AlertCircle,
  MessageSquare,
  ChevronRight,
  Eye,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface Order {
  id: string
  buyer: string
  buyerInitial: string
  seller: string
  sellerInitial: string
  gigTitle: string
  status: 'in_progress' | 'completed' | 'revision' | 'cancelled'
  amount: number
  deadline: string
  createdAt: string
  description: string
}

const orders: Order[] = [
  { id: 'ORD-001', buyer: 'Ahmed Hassan', buyerInitial: 'AH', seller: 'You', sellerInitial: 'Y', gigTitle: 'Professional Logo Design', status: 'in_progress', amount: 5000, deadline: 'Dec 15, 2024', createdAt: 'Dec 10, 2024', description: 'Design a modern logo for a tech startup including concepts and revisions.' },
  { id: 'ORD-002', buyer: 'Sara Khan', buyerInitial: 'SK', seller: 'You', sellerInitial: 'Y', gigTitle: 'WordPress Website Development', status: 'in_progress', amount: 25000, deadline: 'Dec 20, 2024', createdAt: 'Dec 8, 2024', description: 'Build a responsive e-commerce website with WooCommerce integration.' },
  { id: 'ORD-003', buyer: 'Usman Ali', buyerInitial: 'UA', seller: 'You', sellerInitial: 'Y', gigTitle: 'YouTube Video Editing', status: 'revision', amount: 3000, deadline: 'Dec 14, 2024', createdAt: 'Dec 6, 2024', description: 'Edit a 10-minute YouTube vlog with transitions, music, and color grading.' },
  { id: 'ORD-004', buyer: 'Fatima Noor', buyerInitial: 'FN', seller: 'You', sellerInitial: 'Y', gigTitle: 'SEO Blog Content Writing', status: 'in_progress', amount: 7500, deadline: 'Dec 18, 2024', createdAt: 'Dec 9, 2024', description: 'Write 5 SEO-optimized blog articles of 1000 words each on tech topics.' },
  { id: 'ORD-005', buyer: 'Hassan Mehmood', buyerInitial: 'HM', seller: 'You', sellerInitial: 'Y', gigTitle: 'Social Media Marketing', status: 'completed', amount: 12000, deadline: 'Dec 1, 2024', createdAt: 'Nov 25, 2024', description: 'Complete social media strategy and content calendar for 3 months.' },
  { id: 'ORD-006', buyer: 'Ayesha Tariq', buyerInitial: 'AT', seller: 'You', sellerInitial: 'Y', gigTitle: 'Flutter Mobile App', status: 'completed', amount: 35000, deadline: 'Nov 28, 2024', createdAt: 'Nov 15, 2024', description: 'Build a food delivery app with Flutter and Firebase backend.' },
  { id: 'ORD-007', buyer: 'Bilal Ahmed', buyerInitial: 'BA', seller: 'You', sellerInitial: 'Y', gigTitle: 'AI Chatbot Development', status: 'completed', amount: 45000, deadline: 'Nov 20, 2024', createdAt: 'Nov 10, 2024', description: 'Develop a custom AI chatbot using Python, OpenAI API, and Flask.' },
  { id: 'ORD-008', buyer: 'Sana Mir', buyerInitial: 'SM', seller: 'You', sellerInitial: 'Y', gigTitle: 'Data Entry & Excel', status: 'cancelled', amount: 2000, deadline: 'Dec 5, 2024', createdAt: 'Dec 2, 2024', description: 'Enter 500 product records into an Excel spreadsheet with formatting.' },
  { id: 'ORD-009', buyer: 'Imran Siddiqui', buyerInitial: 'IS', seller: 'You', sellerInitial: 'Y', gigTitle: 'Logo Design Package', status: 'completed', amount: 8000, deadline: 'Nov 15, 2024', createdAt: 'Nov 8, 2024', description: 'Design logo, business cards, and letterhead for a real estate company.' },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
}

const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode; progress: number }> = {
  in_progress: { label: 'In Progress', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300', icon: <Clock className="h-4 w-4" />, progress: 60 },
  completed: { label: 'Completed', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300', icon: <CheckCircle2 className="h-4 w-4" />, progress: 100 },
  revision: { label: 'Revision', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300', icon: <AlertCircle className="h-4 w-4" />, progress: 75 },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300', icon: <XCircle className="h-4 w-4" />, progress: 0 },
}

export default function OrdersPage() {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  const activeOrders = orders.filter(o => o.status === 'in_progress' || o.status === 'revision')
  const completedOrders = orders.filter(o => o.status === 'completed')
  const cancelledOrders = orders.filter(o => o.status === 'cancelled')

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl sm:text-3xl font-bold">Orders</h1>
        <p className="text-muted-foreground mt-1">Track and manage your orders</p>
      </motion.div>

      {/* Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Active', value: activeOrders.length, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-950/50' },
          { label: 'Completed', value: completedOrders.length, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/50' },
          { label: 'Revision', value: orders.filter(o => o.status === 'revision').length, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/50' },
          { label: 'Cancelled', value: cancelledOrders.length, color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-950/50' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 rounded-2xl p-4 shadow-lg">
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </motion.div>

      {/* Tabs */}
      <motion.div variants={itemVariants}>
        <Tabs defaultValue="active">
          <TabsList>
            <TabsTrigger value="active">Active ({activeOrders.length})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({completedOrders.length})</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled ({cancelledOrders.length})</TabsTrigger>
          </TabsList>

          {['active', 'completed', 'cancelled'].map((tab) => (
            <TabsContent key={tab} value={tab} className="mt-4 space-y-3">
              {(tab === 'active' ? activeOrders : tab === 'completed' ? completedOrders : cancelledOrders).map((order, index) => {
                const status = statusConfig[order.status]
                return (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 rounded-2xl shadow-lg p-5 hover:shadow-xl transition-shadow cursor-pointer"
                    onClick={() => setSelectedOrder(order)}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1 min-w-0">
                        <Avatar className="h-11 w-11 shrink-0">
                          <AvatarFallback className="bg-emerald-600 text-white font-semibold text-sm">
                            {order.buyerInitial}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-semibold text-sm">{order.gigTitle}</h3>
                            <Badge className={`${status.color} text-[10px]`}>
                              <span className="mr-1">{status.icon}</span>
                              {status.label}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-0.5">
                            Buyer: {order.buyer} · {order.id}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Deadline: {order.deadline}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 sm:flex-col sm:items-end">
                        <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                          PKR {order.amount.toLocaleString()}
                        </span>
                        <ChevronRight className="h-5 w-5 text-muted-foreground sm:hidden" />
                      </div>
                    </div>

                    {/* Progress bar for active orders */}
                    {(order.status === 'in_progress' || order.status === 'revision') && (
                      <div className="mt-4 pt-4 border-t border-white/10">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-muted-foreground">Progress</span>
                          <span className="text-xs font-medium">{status.progress}%</span>
                        </div>
                        <Progress value={status.progress} className="h-1.5" />
                      </div>
                    )}
                  </motion.div>
                )
              })}
              {(tab === 'active' ? activeOrders : tab === 'completed' ? completedOrders : cancelledOrders).length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No {tab} orders</p>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </motion.div>

      {/* Order Detail Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        {selectedOrder && (
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <div className="flex items-center gap-2">
                <DialogTitle>{selectedOrder.gigTitle}</DialogTitle>
                <Badge className={`${statusConfig[selectedOrder.status].color} text-[10px]`}>
                  {statusConfig[selectedOrder.status].label}
                </Badge>
              </div>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-emerald-600 text-white font-semibold text-sm">
                    {selectedOrder.buyerInitial}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-sm">Buyer: {selectedOrder.buyer}</p>
                  <p className="text-xs text-muted-foreground">{selectedOrder.id}</p>
                </div>
              </div>

              <Separator />

              <div>
                <p className="text-sm font-medium mb-1">Description</p>
                <p className="text-sm text-muted-foreground">{selectedOrder.description}</p>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Amount</p>
                  <p className="font-semibold text-emerald-600 dark:text-emerald-400">PKR {selectedOrder.amount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Deadline</p>
                  <p className="font-semibold text-sm">{selectedOrder.deadline}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Created</p>
                  <p className="font-semibold text-sm">{selectedOrder.createdAt}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Status</p>
                  <Badge className={`${statusConfig[selectedOrder.status].color}`}>{statusConfig[selectedOrder.status].label}</Badge>
                </div>
              </div>

              {(selectedOrder.status === 'in_progress' || selectedOrder.status === 'revision') && (
                <>
                  <Separator />
                  <div className="flex gap-2">
                    <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white">
                      <CheckCircle2 className="h-4 w-4 mr-2" />Mark Complete
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <MessageSquare className="h-4 w-4 mr-2" />Message Buyer
                    </Button>
                  </div>
                </>
              )}

              {selectedOrder.status === 'completed' && (
                <>
                  <Separator />
                  <div className="flex items-center gap-1 justify-center">
                    {[1, 2, 3, 4, 5].map(s => (
                      <Star key={s} className="h-5 w-5 fill-amber-400 text-amber-400" />
                    ))}
                    <span className="text-sm font-medium ml-2">5.0</span>
                  </div>
                </>
              )}
            </div>
          </DialogContent>
        )}
      </Dialog>
    </motion.div>
  )
}
