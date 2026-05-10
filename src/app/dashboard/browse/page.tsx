'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Search,
  Star,
  Clock,
  MapPin,
  Filter,
  SlidersHorizontal,
  Grid3X3,
  List,
  Heart,
  ChevronDown,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

const categories = [
  'Graphic Design',
  'Web Development',
  'Video Editing',
  'Content Writing',
  'Digital Marketing',
  'Mobile Apps',
  'AI/ML',
  'Data Entry',
  'Voice Over',
  'Music & Audio',
]

const gigs = [
  { id: 1, title: 'Professional Logo Design for Your Brand', seller: 'Ahmed Raza', city: 'Lahore', rating: 4.9, reviews: 128, price: 2500, delivery: 3, category: 'Graphic Design', featured: true },
  { id: 2, title: 'Full Responsive WordPress Website Development', seller: 'Sara Khan', city: 'Karachi', rating: 5.0, reviews: 256, price: 15000, delivery: 7, category: 'Web Development', featured: true },
  { id: 3, title: 'YouTube Video Editing & Thumbnail Design', seller: 'Usman Ali', city: 'Islamabad', rating: 4.8, reviews: 89, price: 3000, delivery: 2, category: 'Video Editing', featured: false },
  { id: 4, title: 'SEO Optimized Blog Content Writing', seller: 'Fatima Noor', city: 'Lahore', rating: 4.7, reviews: 67, price: 1500, delivery: 3, category: 'Content Writing', featured: true },
  { id: 5, title: 'Complete Social Media Marketing Strategy', seller: 'Hassan Mehmood', city: 'Karachi', rating: 4.9, reviews: 142, price: 8000, delivery: 5, category: 'Digital Marketing', featured: false },
  { id: 6, title: 'Flutter Mobile App Development', seller: 'Ayesha Tariq', city: 'Islamabad', rating: 4.8, reviews: 93, price: 25000, delivery: 14, category: 'Mobile Apps', featured: true },
  { id: 7, title: 'AI Chatbot Development with Python', seller: 'Bilal Ahmed', city: 'Lahore', rating: 5.0, reviews: 45, price: 30000, delivery: 10, category: 'AI/ML', featured: false },
  { id: 8, title: 'Data Entry & Excel Spreadsheet Expert', seller: 'Sana Mir', city: 'Rawalpindi', rating: 4.6, reviews: 210, price: 500, delivery: 1, category: 'Data Entry', featured: false },
  { id: 9, title: 'Professional Urdu Voice Over Recording', seller: 'Imran Siddiqui', city: 'Karachi', rating: 4.9, reviews: 78, price: 2000, delivery: 2, category: 'Voice Over', featured: false },
  { id: 10, title: 'Background Music & Jingle Production', seller: 'Zain ul Abideen', city: 'Lahore', rating: 4.7, reviews: 56, price: 5000, delivery: 5, category: 'Music & Audio', featured: false },
  { id: 11, title: 'E-commerce Store Setup on Shopify', seller: 'Maryam Shah', city: 'Faisalabad', rating: 4.8, reviews: 112, price: 12000, delivery: 7, category: 'Web Development', featured: true },
  { id: 12, title: 'Professional Banner & Flyer Design', seller: 'Tahir Hussain', city: 'Multan', rating: 4.5, reviews: 64, price: 1500, delivery: 2, category: 'Graphic Design', featured: false },
  { id: 13, title: 'React.js Frontend Development', seller: 'Hina Patel', city: 'Karachi', rating: 4.9, reviews: 178, price: 20000, delivery: 10, category: 'Web Development', featured: false },
  { id: 14, title: 'TikTok & Reels Video Editing', seller: 'Kamran Raza', city: 'Lahore', rating: 4.6, reviews: 95, price: 1000, delivery: 1, category: 'Video Editing', featured: false },
  { id: 15, title: 'Google Ads Campaign Management', seller: 'Nadia Ashraf', city: 'Islamabad', rating: 4.8, reviews: 83, price: 10000, delivery: 5, category: 'Digital Marketing', featured: false },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
}

export default function BrowseGigsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [sortBy, setSortBy] = useState('relevance')
  const [priceRange, setPriceRange] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [favorites, setFavorites] = useState<number[]>([])

  const filteredGigs = gigs
    .filter(gig => {
      const matchesSearch = gig.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        gig.seller.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === 'All' || gig.category === selectedCategory
      const matchesPrice = priceRange === 'all' ||
        (priceRange === 'under5k' && gig.price < 5000) ||
        (priceRange === '5k-15k' && gig.price >= 5000 && gig.price <= 15000) ||
        (priceRange === '15k-30k' && gig.price > 15000 && gig.price <= 30000) ||
        (priceRange === 'over30k' && gig.price > 30000)
      return matchesSearch && matchesCategory && matchesPrice
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating': return b.rating - a.rating
        case 'newest': return b.id - a.id
        case 'price-low': return a.price - b.price
        case 'price-high': return b.price - a.price
        default: return b.reviews - a.reviews
      }
    })

  const toggleFavorite = (id: number) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id])
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      {/* Hero Banner */}
      <motion.div variants={itemVariants} className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 p-8 sm:p-12 text-white">
        <div className="absolute inset-0 hero-grid-pattern opacity-30" />
        <div className="relative z-10">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Browse Gigs</h1>
          <p className="text-emerald-100 text-lg mb-6">Find the perfect freelancer for your project</p>
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search for any service..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 bg-white text-foreground border-0 shadow-lg text-base"
            />
          </div>
        </div>
      </motion.div>

      {/* Category Pills */}
      <motion.div variants={itemVariants} className="flex flex-wrap gap-2">
        <Badge
          variant={selectedCategory === 'All' ? 'default' : 'secondary'}
          className={`cursor-pointer px-4 py-2 text-sm ${selectedCategory === 'All' ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'hover:bg-emerald-50 dark:hover:bg-emerald-950/50'}`}
          onClick={() => setSelectedCategory('All')}
        >
          All Categories
        </Badge>
        {categories.map((cat) => (
          <Badge
            key={cat}
            variant={selectedCategory === cat ? 'default' : 'secondary'}
            className={`cursor-pointer px-4 py-2 text-sm ${selectedCategory === cat ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'hover:bg-emerald-50 dark:hover:bg-emerald-950/50'}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </Badge>
        ))}
      </motion.div>

      {/* Filters Bar */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">Relevance</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>

          <Select value={priceRange} onValueChange={setPriceRange}>
            <SelectTrigger className="w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Prices</SelectItem>
              <SelectItem value="under5k">Under PKR 5,000</SelectItem>
              <SelectItem value="5k-15k">PKR 5K - 15K</SelectItem>
              <SelectItem value="15k-30k">PKR 15K - 30K</SelectItem>
              <SelectItem value="over30k">Over PKR 30K</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">{filteredGigs.length} gigs found</span>
          <Separator orientation="vertical" className="h-4" />
          <div className="flex items-center bg-muted rounded-lg p-1">
            <Button
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
              size="icon"
              className="h-7 w-7"
              onClick={() => setViewMode('grid')}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              size="icon"
              className="h-7 w-7"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Featured Gigs */}
      {selectedCategory === 'All' && !searchQuery && (
        <motion.div variants={itemVariants}>
          <h2 className="text-lg font-semibold mb-3">Featured Gigs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredGigs.filter(g => g.featured).slice(0, 4).map((gig, index) => (
              <motion.div
                key={gig.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border border-emerald-200 dark:border-emerald-800/30 p-5 cursor-pointer hover:shadow-lg transition-all duration-300"
              >
                <Badge className="absolute top-3 right-3 bg-amber-500 text-white text-[10px]">Featured</Badge>
                <div className="flex items-start gap-4">
                  <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold text-lg shrink-0">
                    {gig.seller.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm line-clamp-2">{gig.title}</h3>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center gap-1 text-amber-500">
                        <Star className="h-3.5 w-3.5 fill-current" />
                        <span className="text-xs font-semibold">{gig.rating}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">({gig.reviews})</span>
                      <span className="text-xs text-muted-foreground">·</span>
                      <span className="text-xs text-muted-foreground">{gig.seller}</span>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">PKR {gig.price.toLocaleString()}</span>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" />
                        {gig.delivery} days
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Gig Cards */}
      <motion.div variants={itemVariants}>
        <h2 className="text-lg font-semibold mb-3">
          {selectedCategory === 'All' ? 'All Gigs' : selectedCategory}
        </h2>
        <div className={viewMode === 'grid'
          ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'
          : 'flex flex-col gap-3'
        }>
          {filteredGigs.map((gig, index) => (
            <motion.div
              key={gig.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 + index * 0.04 }}
              className={`group bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-[1.01] ${
                viewMode === 'list' ? 'flex items-center p-4' : 'overflow-hidden'
              }`}
            >
              {viewMode === 'grid' ? (
                <>
                  {/* Image placeholder */}
                  <div className="h-44 bg-gradient-to-br from-emerald-100 via-teal-50 to-emerald-50 dark:from-emerald-950/40 dark:via-teal-950/20 dark:to-emerald-950/40 flex items-center justify-center relative">
                    <div className="text-4xl font-bold text-emerald-300 dark:text-emerald-700">
                      {gig.category.split(' ').map(w => w[0]).join('')}
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleFavorite(gig.id) }}
                      className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm flex items-center justify-center hover:bg-white dark:hover:bg-gray-800 transition-colors"
                    >
                      <Heart className={`h-4 w-4 ${favorites.includes(gig.id) ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`} />
                    </button>
                    {gig.featured && (
                      <Badge className="absolute top-3 left-3 bg-amber-500 text-white text-[10px]">Featured</Badge>
                    )}
                  </div>

                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary" className="text-[10px] px-2 py-0">{gig.category}</Badge>
                    </div>
                    <h3 className="font-semibold text-sm line-clamp-2 mb-3 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {gig.title}
                    </h3>
                    <div className="flex items-center gap-2 mb-3">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="bg-emerald-600 text-white text-[10px]">
                          {gig.seller.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">{gig.seller}</span>
                      <div className="flex items-center gap-0.5">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        <span className="text-xs font-semibold">{gig.rating}</span>
                        <span className="text-xs text-muted-foreground">({gig.reviews})</span>
                      </div>
                    </div>
                    <Separator className="mb-3" />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {gig.city}
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {gig.delivery}d
                        </div>
                        <span className="text-base font-bold text-emerald-600 dark:text-emerald-400">
                          PKR {gig.price.toLocaleString()}
                        </span>
                      </div>
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
                      <Badge variant="secondary" className="text-[10px] px-2 py-0 shrink-0">{gig.category}</Badge>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{gig.seller}</span>
                      <span className="flex items-center gap-0.5">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        {gig.rating} ({gig.reviews})
                      </span>
                      <span className="flex items-center gap-0.5">
                        <MapPin className="h-3 w-3" />
                        {gig.city}
                      </span>
                      <span className="flex items-center gap-0.5">
                        <Clock className="h-3 w-3" />
                        {gig.delivery}d
                      </span>
                    </div>
                  </div>
                  <div className="text-right ml-4 shrink-0">
                    <span className="text-base font-bold text-emerald-600 dark:text-emerald-400">
                      PKR {gig.price.toLocaleString()}
                    </span>
                  </div>
                </>
              )}
            </motion.div>
          ))}
        </div>

        {filteredGigs.length === 0 && (
          <div className="text-center py-16">
            <Search className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-semibold text-muted-foreground">No gigs found</h3>
            <p className="text-sm text-muted-foreground mt-1">Try adjusting your search or filters</p>
          </div>
        )}
      </motion.div>

      {/* Pagination */}
      {filteredGigs.length > 0 && (
        <motion.div variants={itemVariants} className="flex items-center justify-center gap-2">
          <Button variant="outline" size="sm" disabled>Previous</Button>
          <Button variant="default" size="sm" className="bg-emerald-600 hover:bg-emerald-700">1</Button>
          <Button variant="outline" size="sm">2</Button>
          <Button variant="outline" size="sm">3</Button>
          <Button variant="outline" size="sm">Next</Button>
        </motion.div>
      )}
    </motion.div>
  )
}
