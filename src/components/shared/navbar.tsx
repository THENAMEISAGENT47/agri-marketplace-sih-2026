'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Button } from '../ui'
import { useAuth } from '@/hooks/useAuth'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { NotificationPanel, NotificationBadge } from '../notifications'

export const Navbar: React.FC = () => {
  const { user, signOut, loading } = useAuth()
  const { userId } = useCurrentUser()
  const [showNotifications, setShowNotifications] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  const handleLogout = async () => {
    try {
      await signOut()
      window.location.href = '/'
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const fetchUnreadCount = async () => {
    if (userId) {
      try {
        const response = await fetch(`/api/notifications?user_id=${userId}`)
        if (response.ok) {
          const data = await response.json()
          setUnreadCount(data.filter((n: any) => !n.is_read).length)
        }
      } catch (error) {
        console.error('Error fetching unread count:', error)
      }
    }
  }

  // Fetch unread count periodically
  React.useEffect(() => {
    if (userId) {
      fetchUnreadCount()
      const interval = setInterval(fetchUnreadCount, 30000) // Every 30 seconds
      return () => clearInterval(interval)
    }
  }, [userId])

  if (loading) {
    return (
      <nav className="bg-white border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                  </svg>
                </div>
                <span className="text-xl font-bold text-primary">AgriMarketplace</span>
              </Link>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 border-2 border-gray-300 border-t-primary rounded-full animate-spin"></div>
            </div>
          </div>
        </div>
      </nav>
    )
  }

  return (
    <nav className="bg-white border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                </svg>
              </div>
              <span className="text-xl font-bold text-primary">AgriMarketplace</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Link href="/marketplace" className="text-foreground hover:text-primary transition-colors">
              Marketplace
            </Link>
            {user && (
              <>
                {user.role === 'farmer' && (
                  <Link href="/farmer/dashboard" className="text-foreground hover:text-primary transition-colors">
                    Dashboard
                  </Link>
                )}
                {user.role === 'buyer' && (
                  <Link href="/buyer/dashboard" className="text-foreground hover:text-primary transition-colors">
                    Dashboard
                  </Link>
                )}
                {user.role === 'admin' && (
                  <Link href="/admin/dashboard" className="text-foreground hover:text-primary transition-colors">
                    Admin
                  </Link>
                )}
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {showMobileMenu ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          <div className="flex items-center space-x-3">
            {user ? (
              <>
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  <NotificationBadge count={unreadCount} className="absolute -top-1 -right-1" />
                </button>
                {showNotifications && (
                  <NotificationPanel
                    userId={userId}
                    onClose={() => {
                      setShowNotifications(false)
                      fetchUnreadCount()
                    }}
                  />
                )}
                <span className="text-sm text-gray-600 hidden sm:block">{user.email}</span>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button variant="primary" size="sm">
                    Register
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden border-t border-border bg-white px-4 py-4 space-y-3">
            <Link href="/marketplace" className="block text-foreground hover:text-primary transition-colors">
              Marketplace
            </Link>
            {user && (
              <>
                {user.role === 'farmer' && (
                  <Link href="/farmer/dashboard" className="block text-foreground hover:text-primary transition-colors">
                    Dashboard
                  </Link>
                )}
                {user.role === 'buyer' && (
                  <Link href="/buyer/dashboard" className="block text-foreground hover:text-primary transition-colors">
                    Dashboard
                  </Link>
                )}
                {user.role === 'admin' && (
                  <Link href="/admin/dashboard" className="block text-foreground hover:text-primary transition-colors">
                    Admin
                  </Link>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}