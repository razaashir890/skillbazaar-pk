'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  MapPin,
  Calendar,
  Star,
  Edit3,
  Plus,
  X,
  Check,
  Award,
  BookOpen,
  Briefcase,
  Image as ImageIcon,
  Trash2,
  ExternalLink,
} from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '@/contexts/auth-context'
import { getUserName, getUserInitial } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
}

const completenessItems = [
  { label: 'Profile picture', done: false },
  { label: 'Bio/description', done: true },
  { label: 'Skills added', done: true },
  { label: 'Portfolio items', done: true },
  { label: 'Education', done: true },
  { label: 'Certifications', done: false },
  { label: 'Verified email', done: true },
  { label: 'Connected phone', done: false },
]

export default function ProfilePage() {
  const { user } = useAuth()
  const userName = getUserName(user)
  const userInitial = getUserInitial(userName)

  const [editing, setEditing] = useState<string | null>(null)
  const [profileData, setProfileData] = useState({
    name: userName,
    title: 'Full-Stack Developer & UI Designer',
    description: 'Passionate freelancer with 5+ years of experience in web development, UI/UX design, and digital solutions. Based in Lahore, Pakistan.',
    category: 'Web Development',
    city: 'Lahore',
    hourlyRate: '35',
  })

  const [skills, setSkills] = useState(['React.js', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Node.js', 'UI/UX Design', 'Figma', 'Python'])
  const [newSkill, setNewSkill] = useState('')

  const [portfolioItems] = useState([
    { id: 1, title: 'E-commerce Platform', description: 'Full-stack e-commerce platform built with Next.js and Stripe', category: 'Web Development', image: '' },
    { id: 2, title: 'Mobile Banking App', description: 'Cross-platform banking app built with Flutter', category: 'Mobile Apps', image: '' },
    { id: 3, title: 'SaaS Dashboard', description: 'Analytics dashboard for a SaaS startup', category: 'UI/UX Design', image: '' },
  ])

  const [education] = useState([
    { degree: 'BS Computer Science', institution: 'LUMS, Lahore', year: '2018 - 2022' },
  ])

  const [certifications] = useState([
    { name: 'AWS Certified Developer', issuer: 'Amazon Web Services', year: '2023' },
    { name: 'Meta Frontend Developer', issuer: 'Meta', year: '2023' },
  ])

  const doneItems = completenessItems.filter(i => i.done).length
  const completenessPercent = Math.round((doneItems / completenessItems.length) * 100)

  const handleSave = (section: string) => {
    setEditing(null)
    toast.success(`${section} updated successfully!`)
  }

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()])
      setNewSkill('')
      toast.success('Skill added!')
    }
  }

  const removeSkill = (skill: string) => {
    setSkills(skills.filter(s => s !== skill))
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      {/* Profile Header */}
      <motion.div variants={itemVariants} className="relative overflow-hidden rounded-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 shadow-lg">
        <div className="h-32 sm:h-40 bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 relative">
          <div className="absolute inset-0 hero-grid-pattern opacity-20" />
        </div>
        <div className="px-6 pb-6 -mt-16 relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4">
            <div className="relative">
              <Avatar className="h-28 w-28 sm:h-32 sm:w-32 border-4 border-white dark:border-gray-900 shadow-xl">
                <AvatarFallback className="bg-emerald-600 text-white font-bold text-3xl">
                  {userInitial}
                </AvatarFallback>
              </Avatar>
              <button className="absolute bottom-1 right-1 h-8 w-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg hover:bg-emerald-700 transition-colors">
                <ImageIcon className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold">{profileData.name}</h1>
              <p className="text-muted-foreground">{profileData.title}</p>
              <div className="flex flex-wrap items-center gap-3 mt-2">
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" />{profileData.city}, Pakistan
                </span>
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />Member since Nov 2022
                </span>
                <span className="flex items-center gap-1 text-sm text-amber-500">
                  <Star className="h-3.5 w-3.5 fill-current" />4.9 (128 reviews)
                </span>
                <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">Top Rated</Badge>
              </div>
            </div>
            <Button variant="outline" onClick={() => setEditing('basic')}>
              <Edit3 className="h-4 w-4 mr-2" />Edit Profile
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Profile Completeness */}
      <motion.div variants={itemVariants} className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Profile Completeness</h2>
          <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{completenessPercent}%</span>
        </div>
        <Progress value={completenessPercent} className="h-2 mb-4" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {completenessItems.map((item) => (
            <div key={item.label} className={`flex items-center gap-2 rounded-lg p-2 text-xs ${item.done ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300' : 'bg-gray-50 dark:bg-gray-800/50 text-muted-foreground'}`}>
              {item.done ? <Check className="h-3 w-3 shrink-0" /> : <X className="h-3 w-3 shrink-0" />}
              <span className="truncate">{item.label}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Basic Info */}
      <motion.div variants={itemVariants} className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-lg font-semibold">Basic Information</h2>
          </div>
          {editing === 'basic' ? (
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={() => setEditing(null)}>Cancel</Button>
              <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => handleSave('Basic Information')}>
                <Check className="h-4 w-4 mr-1" />Save
              </Button>
            </div>
          ) : (
            <Button variant="ghost" size="sm" onClick={() => setEditing('basic')}>
              <Edit3 className="h-4 w-4 mr-1" />Edit
            </Button>
          )}
        </div>

        {editing === 'basic' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input value={profileData.name} onChange={(e) => setProfileData({ ...profileData, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Professional Title</Label>
              <Input value={profileData.title} onChange={(e) => setProfileData({ ...profileData, title: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={profileData.category} onValueChange={(v) => setProfileData({ ...profileData, category: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {['Graphic Design', 'Web Development', 'Video Editing', 'Content Writing', 'Digital Marketing', 'Mobile Apps', 'AI/ML'].map(c => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>City</Label>
              <Input value={profileData.city} onChange={(e) => setProfileData({ ...profileData, city: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Hourly Rate (PKR)</Label>
              <Input type="number" value={profileData.hourlyRate} onChange={(e) => setProfileData({ ...profileData, hourlyRate: e.target.value })} />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Description</Label>
              <Textarea rows={3} value={profileData.description} onChange={(e) => setProfileData({ ...profileData, description: e.target.value })} />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div><span className="text-muted-foreground">Name:</span> <span className="ml-2 font-medium">{profileData.name}</span></div>
            <div><span className="text-muted-foreground">Title:</span> <span className="ml-2 font-medium">{profileData.title}</span></div>
            <div><span className="text-muted-foreground">Category:</span> <span className="ml-2 font-medium">{profileData.category}</span></div>
            <div><span className="text-muted-foreground">Location:</span> <span className="ml-2 font-medium">{profileData.city}, Pakistan</span></div>
            <div><span className="text-muted-foreground">Hourly Rate:</span> <span className="ml-2 font-medium">PKR {profileData.hourlyRate}/hr</span></div>
            <div><span className="text-muted-foreground">Languages:</span> <span className="ml-2 font-medium">English, Urdu</span></div>
            <div className="sm:col-span-2">
              <span className="text-muted-foreground">Description:</span>
              <p className="mt-1 text-muted-foreground">{profileData.description}</p>
            </div>
          </div>
        )}
      </motion.div>

      {/* Skills */}
      <motion.div variants={itemVariants} className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 rounded-2xl shadow-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Award className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          <h2 className="text-lg font-semibold">Skills</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <Badge key={skill} variant="secondary" className="px-3 py-1.5 text-sm gap-1">
              {skill}
              <button onClick={() => removeSkill(skill)} className="ml-1 hover:text-red-500 transition-colors">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          <div className="flex items-center gap-1">
            <Input
              placeholder="Add skill..."
              className="h-8 w-28 text-sm"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addSkill()}
            />
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={addSkill}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Portfolio */}
      <motion.div variants={itemVariants} className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ExternalLink className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-lg font-semibold">Portfolio</h2>
          </div>
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-1" />Add Project
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {portfolioItems.map((item) => (
            <div key={item.id} className="group rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
              <div className="h-32 bg-gradient-to-br from-emerald-100 via-teal-50 to-emerald-50 dark:from-emerald-950/40 dark:via-teal-950/20 dark:to-emerald-950/40 flex items-center justify-center">
                <span className="text-2xl font-bold text-emerald-300 dark:text-emerald-700">
                  {item.title.split(' ').map(w => w[0]).join('')}
                </span>
              </div>
              <div className="p-3">
                <h3 className="font-semibold text-sm">{item.title}</h3>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{item.description}</p>
                <Badge variant="secondary" className="mt-2 text-[10px]">{item.category}</Badge>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Education */}
      <motion.div variants={itemVariants} className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 rounded-2xl shadow-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          <h2 className="text-lg font-semibold">Education</h2>
        </div>
        {education.map((edu, i) => (
          <div key={i} className="flex items-start gap-4 py-3">
            <div className="h-10 w-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center shrink-0">
              <BookOpen className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">{edu.degree}</h3>
              <p className="text-sm text-muted-foreground">{edu.institution}</p>
              <p className="text-xs text-muted-foreground">{edu.year}</p>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Certifications */}
      <motion.div variants={itemVariants} className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 rounded-2xl shadow-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Award className="h-5 w-5 text-amber-500" />
          <h2 className="text-lg font-semibold">Certifications</h2>
        </div>
        {certifications.map((cert, i) => (
          <div key={i} className="flex items-start gap-4 py-3">
            <div className="h-10 w-10 rounded-lg bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center shrink-0">
              <Award className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">{cert.name}</h3>
              <p className="text-sm text-muted-foreground">{cert.issuer} · {cert.year}</p>
            </div>
          </div>
        ))}
      </motion.div>
    </motion.div>
  )
}
