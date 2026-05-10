'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Search,
  Send,
  Paperclip,
  MoreVertical,
  Phone,
  Video,
  Image as ImageIcon,
  Smile,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface Message {
  id: number
  content: string
  time: string
  sent: boolean
  read: boolean
}

interface Conversation {
  id: number
  name: string
  initial: string
  lastMessage: string
  time: string
  unread: number
  online: boolean
  messages: Message[]
  gigTitle?: string
}

const conversations: Conversation[] = [
  {
    id: 1, name: 'Ahmed Hassan', initial: 'AH', lastMessage: 'I need the logo by tomorrow please', time: '2m ago',
    unread: 2, online: true, gigTitle: 'Professional Logo Design',
    messages: [
      { id: 1, content: 'Hi! I saw your logo design gig and I am interested.', time: '10:00 AM', sent: false, read: true },
      { id: 2, content: 'Hello Ahmed! Thank you for your interest. What kind of logo are you looking for?', time: '10:05 AM', sent: true, read: true },
      { id: 3, content: 'I need a logo for my tech startup. Something modern and minimal.', time: '10:08 AM', sent: false, read: true },
      { id: 4, content: 'That sounds great! I can work with that. Can you share some references?', time: '10:12 AM', sent: true, read: true },
      { id: 5, content: 'Sure, I will send some Pinterest links. Also, what is the turnaround time?', time: '10:15 AM', sent: false, read: true },
      { id: 6, content: 'Typically 3-5 business days for the first concepts. Rush delivery available in 24 hours.', time: '10:18 AM', sent: true, read: true },
      { id: 7, content: 'I need the logo by tomorrow please', time: '10:22 AM', sent: false, read: false },
      { id: 8, content: 'Is that possible?', time: '10:22 AM', sent: false, read: false },
    ],
  },
  {
    id: 2, name: 'Sara Khan', initial: 'SK', lastMessage: 'The website looks amazing! Thank you so much', time: '15m ago',
    unread: 0, online: true, gigTitle: 'WordPress Website',
    messages: [
      { id: 1, content: 'Hi, I wanted to check on the progress of my website.', time: '9:00 AM', sent: false, read: true },
      { id: 2, content: 'Hi Sara! The website is almost done. I am doing final testing now.', time: '9:15 AM', sent: true, read: true },
      { id: 3, content: 'That is great to hear! Can you share a preview link?', time: '9:20 AM', sent: false, read: true },
      { id: 4, content: 'Sure! Here is the staging link: staging.skillbazaar.pk/client-website', time: '9:30 AM', sent: true, read: true },
      { id: 5, content: 'The website looks amazing! Thank you so much', time: '9:45 AM', sent: false, read: true },
    ],
  },
  {
    id: 3, name: 'Usman Ali', initial: 'UA', lastMessage: 'Can we do a quick call about the revisions?', time: '1h ago',
    unread: 1, online: false, gigTitle: 'Video Editing',
    messages: [
      { id: 1, content: 'Hey, I reviewed the video edits. A few things need changing.', time: '8:30 AM', sent: false, read: true },
      { id: 2, content: 'Sure, what changes do you need?', time: '8:45 AM', sent: true, read: true },
      { id: 3, content: 'Can we do a quick call about the revisions?', time: '9:00 AM', sent: false, read: false },
    ],
  },
  {
    id: 4, name: 'Fatima Noor', initial: 'FN', lastMessage: 'The articles are perfect. Will order more soon!', time: '3h ago',
    unread: 0, online: true, gigTitle: 'Content Writing',
    messages: [
      { id: 1, content: 'Hi! I need 5 blog articles for my tech blog.', time: '7:00 AM', sent: false, read: true },
      { id: 2, content: 'I would be happy to help. What topics are you looking for?', time: '7:15 AM', sent: true, read: true },
      { id: 3, content: 'AI, blockchain, cloud computing, cybersecurity, and IoT.', time: '7:20 AM', sent: false, read: true },
      { id: 4, content: 'Great! I will deliver all 5 by Friday.', time: '7:25 AM', sent: true, read: true },
      { id: 5, content: 'The articles are perfect. Will order more soon!', time: '11:00 AM', sent: false, read: true },
    ],
  },
  {
    id: 5, name: 'Hassan Mehmood', initial: 'HM', lastMessage: 'Let us schedule the campaign launch for next week', time: '5h ago',
    unread: 0, online: false, gigTitle: 'Social Media Marketing',
    messages: [
      { id: 1, content: 'The social media strategy is ready for review.', time: '6:00 AM', sent: true, read: true },
      { id: 2, content: 'Looks solid! When can we start?', time: '6:30 AM', sent: false, read: true },
      { id: 3, content: 'Let us schedule the campaign launch for next week', time: '6:45 AM', sent: false, read: true },
    ],
  },
  {
    id: 6, name: 'Bilal Ahmed', initial: 'BA', lastMessage: 'The chatbot integration is working perfectly!', time: '1d ago',
    unread: 0, online: false, gigTitle: 'AI Chatbot',
    messages: [
      { id: 1, content: 'The chatbot integration is working perfectly!', time: 'Yesterday', sent: false, read: true },
    ],
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
}

export default function MessagesPage() {
  const [activeConversation, setActiveConversation] = useState<Conversation>(conversations[0])
  const [searchQuery, setSearchQuery] = useState('')
  const [newMessage, setNewMessage] = useState('')
  const [localConversations, setLocalConversations] = useState(conversations)

  const filteredConversations = localConversations.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSend = () => {
    if (!newMessage.trim()) return
    const msg: Message = {
      id: Date.now(),
      content: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sent: true,
      read: true,
    }
    setLocalConversations(prev =>
      prev.map(c =>
        c.id === activeConversation.id
          ? { ...c, messages: [...c.messages, msg], lastMessage: newMessage, time: 'Just now' }
          : c
      )
    )
    setActiveConversation(prev => ({
      ...prev,
      messages: [...prev.messages, msg],
      lastMessage: newMessage,
      time: 'Just now',
    }))
    setNewMessage('')
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4 -m-4 sm:-m-6 lg:-m-8">
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 lg:pt-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Messages</h1>
          <p className="text-muted-foreground mt-1">Chat with clients and collaborators</p>
        </div>
      </motion.div>

      {/* Chat Area */}
      <motion.div variants={itemVariants} className="h-[calc(100vh-12rem)] flex bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 rounded-2xl shadow-lg overflow-hidden">
        {/* Conversations List */}
        <div className={`${activeConversation ? 'hidden md:flex' : 'flex'} w-full md:w-80 lg:w-96 flex-col border-r border-white/10`}>
          <div className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <ScrollArea className="flex-1">
            {filteredConversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => setActiveConversation(conv)}
                className={`flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30 ${
                  activeConversation.id === conv.id ? 'bg-emerald-50/80 dark:bg-emerald-950/40' : ''
                }`}
              >
                <div className="relative shrink-0">
                  <Avatar className="h-11 w-11">
                    <AvatarFallback className="bg-emerald-600 text-white font-semibold text-sm">
                      {conv.initial}
                    </AvatarFallback>
                  </Avatar>
                  {conv.online && (
                    <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 border-2 border-white dark:border-gray-900" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-sm truncate">{conv.name}</h3>
                    <span className="text-xs text-muted-foreground shrink-0 ml-2">{conv.time}</span>
                  </div>
                  {conv.gigTitle && (
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 truncate">{conv.gigTitle}</p>
                  )}
                  <div className="flex items-center justify-between mt-0.5">
                    <p className="text-xs text-muted-foreground truncate pr-2">{conv.lastMessage}</p>
                    {conv.unread > 0 && (
                      <Badge className="bg-emerald-600 text-white text-[10px] px-1.5 py-0 shrink-0 h-5 min-w-5 flex items-center justify-center">
                        {conv.unread}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </ScrollArea>
        </div>

        {/* Message Thread */}
        {activeConversation && (
          <div className={`${activeConversation ? 'flex' : 'hidden md:flex'} flex-1 flex-col`}>
            {/* Chat Header */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-white/10">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden h-8 w-8"
                  onClick={() => setActiveConversation(null as unknown as Conversation)}
                >
                  ←
                </Button>
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-emerald-600 text-white font-semibold text-sm">
                    {activeConversation.initial}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-sm">{activeConversation.name}</h3>
                  <p className="text-xs text-emerald-500">{activeConversation.online ? 'Online' : 'Offline'}</p>
                </div>
                {activeConversation.gigTitle && (
                  <Badge variant="secondary" className="text-[10px] hidden sm:flex">{activeConversation.gigTitle}</Badge>
                )}
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Phone className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Video className="h-4 w-4" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>View Profile</DropdownMenuItem>
                    <DropdownMenuItem>Mute Conversation</DropdownMenuItem>
                    <DropdownMenuItem>Clear Chat</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600">Block User</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 px-4 sm:px-6 py-4">
              <div className="flex flex-col gap-3 max-w-3xl mx-auto">
                {activeConversation.messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.sent ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[75%] sm:max-w-[65%] rounded-2xl px-4 py-2.5 ${
                      msg.sent
                        ? 'bg-emerald-600 text-white rounded-br-md'
                        : 'bg-gray-100 dark:bg-gray-800 text-foreground rounded-bl-md'
                    }`}>
                      <p className="text-sm leading-relaxed">{msg.content}</p>
                      <p className={`text-[10px] mt-1 ${msg.sent ? 'text-emerald-200' : 'text-muted-foreground'}`}>
                        {msg.time}
                        {msg.sent && msg.read && ' · ✓✓'}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="px-4 sm:px-6 py-3 border-t border-white/10">
              <div className="flex items-center gap-2 max-w-3xl mx-auto">
                <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <div className="relative flex-1">
                  <Input
                    placeholder="Type a message..."
                    className="pr-10"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  />
                  <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7">
                    <Smile className="h-4 w-4" />
                  </Button>
                </div>
                <Button
                  className="bg-emerald-600 hover:bg-emerald-700 text-white shrink-0 h-9 w-9 p-0"
                  onClick={handleSend}
                  disabled={!newMessage.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}
