import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getUserName(user: { user_metadata?: { full_name?: string; name?: string; email?: string } } | null): string {
  if (!user) return 'User'
  const meta = user.user_metadata
  return meta?.full_name || meta?.name || meta?.email?.split('@')[0] || 'User'
}

export function getUserInitial(name: string): string {
  return name.charAt(0).toUpperCase()
}

export function formatPKR(amount: number): string {
  return `PKR ${amount.toLocaleString('en-PK')}`
}

export function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}
