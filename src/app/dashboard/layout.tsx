import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard - SkillBazaar PK',
  description: 'Manage your freelance business on SkillBazaar PK',
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
