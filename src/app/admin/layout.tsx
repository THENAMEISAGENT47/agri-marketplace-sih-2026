'use client'

import { Navbar } from '@/components/shared/navbar'
import { DemoModeIndicator } from '@/components/shared/demo-mode-indicator'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <DemoModeIndicator />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}