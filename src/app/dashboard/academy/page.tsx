'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  GraduationCap,
  Play,
  Clock,
  Star,
  Users,
  BookOpen,
  Award,
  TrendingUp,
  Search,
  Filter,
  CheckCircle2,
  Lock,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface Course {
  id: number
  title: string
  instructor: string
  instructorInitial: string
  category: string
  rating: number
  students: number
  price: number
  free: boolean
  duration: string
  lessons: number
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  enrolled: boolean
  progress?: number
  image?: string
  featured?: boolean
  description: string
}

const courses: Course[] = [
  { id: 1, title: 'Complete Freelancing Masterclass: Earn in PKR', instructor: 'Ali Raza', instructorInitial: 'AR', category: 'Business', rating: 4.9, students: 2340, price: 0, free: true, duration: '12 hours', lessons: 48, level: 'Beginner', enrolled: true, progress: 65, featured: true, description: 'Learn how to start and grow your freelance career on Pakistani platforms.' },
  { id: 2, title: 'UI/UX Design with Figma: Zero to Hero', instructor: 'Sara Imran', instructorInitial: 'SI', category: 'Design', rating: 4.8, students: 1850, price: 2500, free: false, duration: '16 hours', lessons: 62, level: 'Beginner', enrolled: true, progress: 30, featured: true, description: 'Master Figma and create stunning UI/UX designs from scratch.' },
  { id: 3, title: 'Full-Stack Web Development with Next.js', instructor: 'Hassan Javed', instructorInitial: 'HJ', category: 'Development', rating: 5.0, students: 3120, price: 5000, free: false, duration: '40 hours', lessons: 156, level: 'Intermediate', enrolled: false, featured: true, description: 'Build production-ready web apps with Next.js, TypeScript, and Prisma.' },
  { id: 4, title: 'Digital Marketing Strategy for Pakistan', instructor: 'Fatima Khan', instructorInitial: 'FK', category: 'Marketing', rating: 4.7, students: 1560, price: 1500, free: false, duration: '8 hours', lessons: 32, level: 'Beginner', enrolled: false, featured: false, description: 'Master digital marketing strategies tailored for the Pakistani market.' },
  { id: 5, title: 'Machine Learning with Python', instructor: 'Bilal Ahmed', instructorInitial: 'BA', category: 'AI/ML', rating: 4.9, students: 2100, price: 7500, free: false, duration: '30 hours', lessons: 120, level: 'Advanced', enrolled: true, progress: 12, featured: true, description: 'Build real-world ML models with scikit-learn, TensorFlow, and PyTorch.' },
  { id: 6, title: 'Graphic Design with Adobe Illustrator', instructor: 'Ayesha Malik', instructorInitial: 'AM', category: 'Design', rating: 4.6, students: 980, price: 0, free: true, duration: '10 hours', lessons: 40, level: 'Beginner', enrolled: false, featured: false, description: 'Create professional logos, banners, and illustrations with Illustrator.' },
  { id: 7, title: 'E-commerce Business: Start Your Online Store', instructor: 'Usman Siddiqui', instructorInitial: 'US', category: 'Business', rating: 4.8, students: 1200, price: 3000, free: false, duration: '14 hours', lessons: 56, level: 'Intermediate', enrolled: false, featured: false, description: 'Launch and scale your e-commerce business on Daraz, Shopify, and WooCommerce.' },
  { id: 8, title: 'React Native Mobile App Development', instructor: 'Kamran Sheikh', instructorInitial: 'KS', category: 'Development', rating: 4.7, students: 1450, price: 4000, free: false, duration: '24 hours', lessons: 96, level: 'Intermediate', enrolled: false, featured: false, description: 'Build cross-platform mobile apps with React Native and Expo.' },
  { id: 9, title: 'Content Writing & Copywriting Mastery', instructor: 'Nadia Hussain', instructorInitial: 'NH', category: 'Marketing', rating: 4.5, students: 890, price: 0, free: true, duration: '6 hours', lessons: 24, level: 'Beginner', enrolled: false, featured: false, description: 'Write compelling content that converts visitors into customers.' },
  { id: 10, title: 'ChatGPT & AI Tools for Productivity', instructor: 'Tariq Mehmood', instructorInitial: 'TM', category: 'AI/ML', rating: 4.8, students: 4200, price: 0, free: true, duration: '4 hours', lessons: 18, level: 'Beginner', enrolled: true, progress: 100, featured: false, description: 'Learn to leverage AI tools like ChatGPT to boost your productivity 10x.' },
  { id: 11, title: 'SEO Mastery: Rank #1 on Google', instructor: 'Imran Ashraf', instructorInitial: 'IA', category: 'Marketing', rating: 4.6, students: 1670, price: 2000, free: false, duration: '10 hours', lessons: 42, level: 'Intermediate', enrolled: false, featured: false, description: 'Master SEO techniques to rank your website at the top of Google search.' },
  { id: 12, title: 'Advanced Python for Data Science', instructor: 'Zainab Raza', instructorInitial: 'ZR', category: 'AI/ML', rating: 4.9, students: 1950, price: 6000, free: false, duration: '20 hours', lessons: 80, level: 'Advanced', enrolled: false, featured: false, description: 'Advanced Python concepts for data analysis, visualization, and machine learning.' },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
}

const categoryColors: Record<string, string> = {
  Business: 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300',
  Design: 'bg-pink-100 text-pink-700 dark:bg-pink-900/50 dark:text-pink-300',
  Development: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300',
  Marketing: 'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300',
  'AI/ML': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300',
}

const levelColors: Record<string, string> = {
  Beginner: 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300',
  Intermediate: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300',
  Advanced: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300',
}

export default function AcademyPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedLevel, setSelectedLevel] = useState('all')
  const [activeTab, setActiveTab] = useState('all')

  const enrolledCourses = courses.filter(c => c.enrolled)
  const completedCourses = enrolledCourses.filter(c => c.progress === 100)

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory
    const matchesLevel = selectedLevel === 'all' || course.level === selectedLevel
    return matchesSearch && matchesCategory && matchesLevel
  })

  const displayCourses = activeTab === 'learning'
    ? enrolledCourses
    : activeTab === 'featured'
    ? filteredCourses.filter(c => c.featured)
    : filteredCourses

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      {/* Hero Banner */}
      <motion.div variants={itemVariants} className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500 p-8 sm:p-12 text-white">
        <div className="absolute inset-0 hero-grid-pattern opacity-20" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <GraduationCap className="h-6 w-6" />
              <Badge className="bg-white/20 text-white hover:bg-white/30">Skill Academy</Badge>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">Level Up Your Skills</h1>
            <p className="text-emerald-100 text-lg max-w-lg">
              Access 100+ courses designed for Pakistani freelancers. Learn from industry experts and boost your earning potential.
            </p>
          </div>
          <div className="flex gap-4">
            <div className="text-center">
              <p className="text-3xl font-bold">{enrolledCourses.length}</p>
              <p className="text-sm text-emerald-100">Enrolled</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">{completedCourses.length}</p>
              <p className="text-sm text-emerald-100">Completed</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* My Learning Stats (if enrolled) */}
      {enrolledCourses.length > 0 && (
        <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">In Progress</p>
                <p className="text-xl font-bold">{enrolledCourses.filter(c => c.progress !== 100).length} courses</p>
              </div>
            </div>
          </div>
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center">
                <Award className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Certificates</p>
                <p className="text-xl font-bold">{completedCourses.length} earned</p>
              </div>
            </div>
          </div>
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Hours Learned</p>
                <p className="text-xl font-bold">42 hours</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Search & Filters */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="relative flex-1 max-w-sm w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search courses..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[160px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Categories</SelectItem>
              <SelectItem value="Business">Business</SelectItem>
              <SelectItem value="Design">Design</SelectItem>
              <SelectItem value="Development">Development</SelectItem>
              <SelectItem value="Marketing">Marketing</SelectItem>
              <SelectItem value="AI/ML">AI/ML</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedLevel} onValueChange={setSelectedLevel}>
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="Beginner">Beginner</SelectItem>
              <SelectItem value="Intermediate">Intermediate</SelectItem>
              <SelectItem value="Advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div variants={itemVariants}>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All Courses</TabsTrigger>
            <TabsTrigger value="featured">Featured</TabsTrigger>
            <TabsTrigger value="learning">My Learning ({enrolledCourses.length})</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {displayCourses.map((course, index) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.03 + index * 0.04 }}
                  className="group bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.01]"
                >
                  {/* Course Image */}
                  <div className="h-36 bg-gradient-to-br from-emerald-100 via-teal-50 to-emerald-50 dark:from-emerald-950/40 dark:via-teal-950/20 dark:to-emerald-950/40 flex items-center justify-center relative">
                    <div className="text-3xl font-bold text-emerald-300 dark:text-emerald-700">
                      {course.category.split('').slice(0, 2).join('')}
                    </div>
                    {course.featured && (
                      <Badge className="absolute top-3 left-3 bg-amber-500 text-white text-[10px]">Featured</Badge>
                    )}
                    {course.free && (
                      <Badge className="absolute top-3 right-3 bg-emerald-500 text-white text-[10px]">FREE</Badge>
                    )}
                    {!course.free && !course.enrolled && (
                      <Badge className="absolute top-3 right-3 bg-white dark:bg-gray-800 text-foreground text-[10px]">
                        PKR {course.price.toLocaleString()}
                      </Badge>
                    )}
                    {course.enrolled && course.progress === 100 && (
                      <Badge className="absolute top-3 right-3 bg-emerald-500 text-white text-[10px]">
                        <CheckCircle2 className="h-3 w-3 mr-1" />Completed
                      </Badge>
                    )}
                  </div>

                  <div className="p-4">
                    {/* Category & Level */}
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary" className={`text-[10px] ${categoryColors[course.category] || ''}`}>
                        {course.category}
                      </Badge>
                      <Badge variant="secondary" className={`text-[10px] ${levelColors[course.level] || ''}`}>
                        {course.level}
                      </Badge>
                    </div>

                    <h3 className="font-semibold text-sm line-clamp-2 mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {course.title}
                    </h3>

                    {/* Instructor */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="h-5 w-5 rounded-full bg-emerald-600 text-white text-[8px] font-bold flex items-center justify-center">
                        {course.instructorInitial}
                      </div>
                      <span className="text-xs text-muted-foreground">{course.instructor}</span>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                      <span className="flex items-center gap-0.5">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        <span className="font-medium text-foreground">{course.rating}</span>
                      </span>
                      <span className="flex items-center gap-0.5">
                        <Users className="h-3 w-3" />{course.students.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-0.5">
                        <Clock className="h-3 w-3" />{course.duration}
                      </span>
                      <span className="flex items-center gap-0.5">
                        <BookOpen className="h-3 w-3" />{course.lessons}
                      </span>
                    </div>

                    {/* Progress bar for enrolled */}
                    {course.enrolled && course.progress !== undefined && course.progress < 100 && (
                      <div className="mb-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-muted-foreground">Progress</span>
                          <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">{course.progress}%</span>
                        </div>
                        <Progress value={course.progress} className="h-1.5" />
                      </div>
                    )}

                    <Separator className="mb-3" />

                    {/* Action */}
                    <div className="flex items-center justify-between">
                      {course.enrolled ? (
                        course.progress === 100 ? (
                          <Button variant="outline" size="sm" className="text-xs w-full">
                            <Award className="h-3 w-3 mr-1" />View Certificate
                          </Button>
                        ) : (
                          <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white w-full">
                            <Play className="h-3 w-3 mr-1" />Continue Learning
                          </Button>
                        )
                      ) : (
                        <Button variant={course.free ? 'default' : 'outline'} size="sm" className={`w-full ${course.free ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : ''}`}>
                          {course.free ? (
                            <><BookOpen className="h-3 w-3 mr-1" />Enroll Free</>
                          ) : (
                            <>PKR {course.price.toLocaleString()}</>
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {displayCourses.length === 0 && (
              <div className="text-center py-16">
                <GraduationCap className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
                <h3 className="text-lg font-semibold text-muted-foreground">No courses found</h3>
                <p className="text-sm text-muted-foreground mt-1">Try adjusting your search or filters</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  )
}
