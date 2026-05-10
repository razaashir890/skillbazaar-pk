'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus,
  MoreVertical,
  Star,
  Eye,
  Pause,
  Play,
  Trash2,
  Edit3,
  Grid3X3,
  List,
  Search,
} from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const categories = [
  'Graphic Design', 'Web Development', 'Video Editing', 'Content Writing',
  'Digital Marketing', 'Mobile Apps', 'AI/ML', 'Data Entry', 'Voice Over', 'Music & Audio',
]

interface Gig {
  id: number
  title: string
  category: string
  price: number
  orders: number
  rating: number
  status: 'active' | 'paused' | 'draft'
  views: number
}

const initialGigs: Gig[] = [
  { id: 1, title: 'Professional Logo Design', category: 'Graphic Design', price: 2500, orders: 48, rating: 4.9, status: 'active', views: 1250 },
  { id: 2, title: 'WordPress Website Development', category: 'Web Development', price: 15000, orders: 32, rating: 5.0, status: 'active', views: 980 },
  { id: 3, title: 'YouTube Video Editing', category: 'Video Editing', price: 3000, orders: 27, rating: 4.8, status: 'active', views: 750 },
  { id: 4, title: 'SEO Blog Content Writing', category: 'Content Writing', price: 1500, orders: 65, rating: 4.7, status: 'active', views: 2100 },
  { id: 5, title: 'Social Media Marketing', category: 'Digital Marketing', price: 8000, orders: 19, rating: 4.9, status: 'active', views: 620 },
  { id: 6, title: 'Flutter Mobile App', category: 'Mobile Apps', price: 25000, orders: 12, rating: 4.8, status: 'paused', views: 430 },
  { id: 7, title: 'AI Chatbot Development', category: 'AI/ML', price: 30000, orders: 8, rating: 5.0, status: 'active', views: 380 },
  { id: 8, title: 'Banner & Flyer Design', category: 'Graphic Design', price: 1500, orders: 41, rating: 4.6, status: 'paused', views: 890 },
  { id: 9, title: 'React.js Frontend Dev', category: 'Web Development', price: 20000, orders: 15, rating: 4.9, status: 'draft', views: 0 },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
}

export default function MyGigsPage() {
  const searchParams = useSearchParams()
  const [gigs, setGigs] = useState<Gig[]>(initialGigs)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [createOpen, setCreateOpen] = useState(searchParams.get('action') === 'create')
  const [newGig, setNewGig] = useState({
    title: '', category: '', description: '', basicPrice: '', standardPrice: '', premiumPrice: '', delivery: '3', tags: '',
  })

  const activeGigs = gigs.filter(g => g.status === 'active')
  const pausedGigs = gigs.filter(g => g.status === 'paused')
  const draftGigs = gigs.filter(g => g.status === 'draft')

  const toggleStatus = (id: number) => {
    setGigs(prev => prev.map(g =>
      g.id === id ? { ...g, status: g.status === 'active' ? 'paused' as const : g.status === 'paused' ? 'active' as const : g.status } : g
    ))
    toast.success('Gig status updated')
  }

  const deleteGig = (id: number) => {
    setGigs(prev => prev.filter(g => g.id !== id))
    toast.success('Gig deleted')
  }

  const handleCreateGig = () => {
    if (!newGig.title || !newGig.category) {
      toast.error('Please fill in the required fields')
      return
    }
    const gig: Gig = {
      id: Date.now(),
      title: newGig.title,
      category: newGig.category,
      price: parseInt(newGig.basicPrice) || 1000,
      orders: 0,
      rating: 0,
      status: 'draft',
      views: 0,
    }
    setGigs(prev => [...prev, gig])
    setCreateOpen(false)
    setNewGig({ title: '', category: '', description: '', basicPrice: '', standardPrice: '', premiumPrice: '', delivery: '3', tags: '' })
    toast.success('Gig created successfully!')
  }

  const filteredGigs = (list: Gig[]) => {
    if (!searchQuery) return list
    return list.filter(g => g.title.toLowerCase().includes(searchQuery.toLowerCase()) || g.category.toLowerCase().includes(searchQuery.toLowerCase()))
  }

  const statusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300'
      case 'paused': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300'
      case 'draft': return 'bg-gray-100 text-gray-700 dark:bg-gray-800/50 dark:text-gray-400'
      default: return ''
    }
  }

  const renderGigCard = (gig: Gig) => (
    <motion.div
      key={gig.id}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className={`group bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 ${
        viewMode === 'list' ? 'flex items-center p-4' : 'overflow-hidden'
      }`}
    >
      {viewMode === 'grid' ? (
        <>
          <div className="h-36 bg-gradient-to-br from-emerald-100 via-teal-50 to-emerald-50 dark:from-emerald-950/40 dark:via-teal-950/20 dark:to-emerald-950/40 flex items-center justify-center relative">
            <div className="text-3xl font-bold text-emerald-300 dark:text-emerald-700">
              {gig.category.split(' ').map(w => w[0]).join('')}
            </div>
            <div className="absolute top-3 left-3">
              <Badge className={`${statusColor(gig.status)} text-[10px]`}>
                {gig.status.charAt(0).toUpperCase() + gig.status.slice(1)}
              </Badge>
            </div>
            <div className="absolute top-3 right-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem><Edit3 className="h-4 w-4 mr-2" />Edit</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => toggleStatus(gig.id)}>
                    {gig.status === 'active' ? <><Pause className="h-4 w-4 mr-2" />Pause</> : <><Play className="h-4 w-4 mr-2" />Activate</>}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600" onClick={() => deleteGig(gig.id)}>
                    <Trash2 className="h-4 w-4 mr-2" />Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <div className="p-4">
            <Badge variant="secondary" className="text-[10px] px-2 py-0 mb-2">{gig.category}</Badge>
            <h3 className="font-semibold text-sm line-clamp-1 mb-2">{gig.title}</h3>
            <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
              <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{gig.views}</span>
              <span className="flex items-center gap-1"><Star className="h-3 w-3 fill-amber-400 text-amber-400" />{gig.rating || 'N/A'}</span>
              <span>{gig.orders} orders</span>
            </div>
            <Separator className="mb-3" />
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">PKR {gig.price.toLocaleString()}</span>
              <Button variant="outline" size="sm" className="text-xs">
                <Edit3 className="h-3 w-3 mr-1" />Edit
              </Button>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/50 dark:to-teal-900/50 flex items-center justify-center text-sm font-bold text-emerald-600 dark:text-emerald-400 shrink-0">
            {gig.category.split(' ').map(w => w[0]).join('')}
          </div>
          <div className="flex-1 min-w-0 ml-4">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-sm truncate">{gig.title}</h3>
              <Badge className={`${statusColor(gig.status)} text-[10px]`}>{gig.status}</Badge>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span>{gig.category}</span>
              <span className="flex items-center gap-0.5"><Star className="h-3 w-3 fill-amber-400 text-amber-400" />{gig.rating || 'N/A'}</span>
              <span>{gig.orders} orders</span>
              <span className="flex items-center gap-0.5"><Eye className="h-3 w-3" />{gig.views}</span>
            </div>
          </div>
          <div className="text-right ml-4 shrink-0 flex items-center gap-3">
            <span className="text-base font-bold text-emerald-600 dark:text-emerald-400">PKR {gig.price.toLocaleString()}</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem><Edit3 className="h-4 w-4 mr-2" />Edit</DropdownMenuItem>
                <DropdownMenuItem onClick={() => toggleStatus(gig.id)}>
                  {gig.status === 'active' ? <><Pause className="h-4 w-4 mr-2" />Pause</> : <><Play className="h-4 w-4 mr-2" />Activate</>}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600" onClick={() => deleteGig(gig.id)}>
                  <Trash2 className="h-4 w-4 mr-2" />Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </>
      )}
    </motion.div>
  )

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">My Gigs</h1>
          <p className="text-muted-foreground mt-1">Manage your services and create new ones</p>
        </div>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/25">
              <Plus className="h-4 w-4 mr-2" />
              Create New Gig
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Gig</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Gig Title *</Label>
                <Input placeholder="e.g., Professional Logo Design" value={newGig.title} onChange={(e) => setNewGig({ ...newGig, title: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Category *</Label>
                <Select value={newGig.category} onValueChange={(v) => setNewGig({ ...newGig, category: v })}>
                  <SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger>
                  <SelectContent>{categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea placeholder="Describe your service in detail..." rows={4} value={newGig.description} onChange={(e) => setNewGig({ ...newGig, description: e.target.value })} />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-2">
                  <Label>Basic Price</Label>
                  <Input type="number" placeholder="PKR" value={newGig.basicPrice} onChange={(e) => setNewGig({ ...newGig, basicPrice: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Standard</Label>
                  <Input type="number" placeholder="PKR" value={newGig.standardPrice} onChange={(e) => setNewGig({ ...newGig, standardPrice: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Premium</Label>
                  <Input type="number" placeholder="PKR" value={newGig.premiumPrice} onChange={(e) => setNewGig({ ...newGig, premiumPrice: e.target.value })} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Delivery Time</Label>
                <Select value={newGig.delivery} onValueChange={(v) => setNewGig({ ...newGig, delivery: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 day</SelectItem>
                    <SelectItem value="2">2 days</SelectItem>
                    <SelectItem value="3">3 days</SelectItem>
                    <SelectItem value="5">5 days</SelectItem>
                    <SelectItem value="7">7 days</SelectItem>
                    <SelectItem value="14">14 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Tags (comma separated)</Label>
                <Input placeholder="logo, brand, design..." value={newGig.tags} onChange={(e) => setNewGig({ ...newGig, tags: e.target.value })} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={handleCreateGig}>Create Gig</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Search + View Toggle */}
      <motion.div variants={itemVariants} className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search gigs..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
        </div>
        <div className="flex items-center bg-muted rounded-lg p-1">
          <Button variant={viewMode === 'grid' ? 'secondary' : 'ghost'} size="icon" className="h-8 w-8" onClick={() => setViewMode('grid')}>
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button variant={viewMode === 'list' ? 'secondary' : 'ghost'} size="icon" className="h-8 w-8" onClick={() => setViewMode('list')}>
            <List className="h-4 w-4" />
          </Button>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div variants={itemVariants}>
        <Tabs defaultValue="active">
          <TabsList>
            <TabsTrigger value="active">Active ({activeGigs.length})</TabsTrigger>
            <TabsTrigger value="paused">Paused ({pausedGigs.length})</TabsTrigger>
            <TabsTrigger value="draft">Draft ({draftGigs.length})</TabsTrigger>
            <TabsTrigger value="all">All ({gigs.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="mt-4">
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4' : 'flex flex-col gap-3'}>
              {filteredGigs(activeGigs).map(renderGigCard)}
            </div>
            {filteredGigs(activeGigs).length === 0 && <EmptyState message="No active gigs" />}
          </TabsContent>
          <TabsContent value="paused" className="mt-4">
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4' : 'flex flex-col gap-3'}>
              {filteredGigs(pausedGigs).map(renderGigCard)}
            </div>
            {filteredGigs(pausedGigs).length === 0 && <EmptyState message="No paused gigs" />}
          </TabsContent>
          <TabsContent value="draft" className="mt-4">
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4' : 'flex flex-col gap-3'}>
              {filteredGigs(draftGigs).map(renderGigCard)}
            </div>
            {filteredGigs(draftGigs).length === 0 && <EmptyState message="No draft gigs" />}
          </TabsContent>
          <TabsContent value="all" className="mt-4">
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4' : 'flex flex-col gap-3'}>
              {filteredGigs(gigs).map(renderGigCard)}
            </div>
            {filteredGigs(gigs).length === 0 && <EmptyState message="No gigs found" />}
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  )
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="text-center py-16">
      <p className="text-muted-foreground">{message}</p>
    </div>
  )
}
