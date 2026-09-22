'use client'

import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { Card, CardContent, Button, Badge } from '../ui'
import { useLanguage } from '@/contexts/LanguageContext'

interface Notification {
  id: string
  type: string
  title: string
  message: string
  is_read: boolean
  created_at: string
}

interface NotificationPanelProps {
  userId: string
  onClose: () => void
}

export function NotificationPanel({ userId, onClose }: NotificationPanelProps) {
  const { t } = useLanguage()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let ignore = false
    const load = async () => {
      try {
        const response = await fetch(`/api/notifications?user_id=${userId}`)
        if (response.ok && !ignore) {
          const data = await response.json()
          setNotifications(data)
        }
      } catch (error) {
        console.error('Error fetching notifications:', error)
      } finally {
        if (!ignore) setLoading(false)
      }
    }
    load()
    return () => {
      ignore = true
    }
  }, [userId])

  const markAsRead = async (notificationId: string) => {
    try {
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          notification_id: notificationId,
          action: 'mark_read',
        }),
      })

      // Update local state
      setNotifications(notifications.map(n => 
        n.id === notificationId ? { ...n, is_read: true } : n
      ))
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  const unreadCount = notifications.filter(n => !n.is_read).length

  return (
    <div className="relative">
      <motion.div 
        initial={{ opacity: 0, scale: 0.96, y: -4 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: -4 }}
        transition={{ duration: 0.18, ease: 'easeOut' }}
        className="absolute right-0 top-0 w-80 bg-card-bg rounded-lg shadow-xl border border-border z-50 overflow-hidden"
      >
        <Card className="border-0 shadow-none">
          <div className="flex justify-between items-center p-4 border-b border-border">
            <h3 className="font-semibold text-foreground flex items-center gap-2 text-sm">
              {t('notifications.title')}
              {unreadCount > 0 && (
                <Badge variant="primary" size="sm">
                  {unreadCount}
                </Badge>
              )}
            </h3>
            <Button variant="ghost" size="xs" onClick={onClose} aria-label={t('common.close')}>
              ✕
            </Button>
          </div>
          <CardContent className="p-3">
            {loading ? (
              <p className="text-sm text-neutral-500 text-center py-4">{t('common.loading')}</p>
            ) : notifications.length === 0 ? (
              <p className="text-sm text-neutral-500 text-center py-4">{t('notifications.no_notifications')}</p>
            ) : (
              <div className="space-y-2.5 max-h-96 overflow-y-auto">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 rounded-lg border text-xs transition-colors ${
                      notification.is_read
                        ? 'bg-neutral-50 dark:bg-neutral-900/60 border-border'
                        : 'bg-primary/5 dark:bg-primary-950/40 border-primary/20 dark:border-primary-800/60'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-semibold text-foreground">{notification.title}</h4>
                      {!notification.is_read && (
                        <Badge variant="info" size="sm">{t('notifications.new')}</Badge>
                      )}
                    </div>
                    <p className="text-neutral-600 dark:text-neutral-300 mt-0.5 leading-relaxed">{notification.message}</p>
                    <p className="text-[10px] font-mono text-neutral-400 mt-2">
                      {new Date(notification.created_at).toLocaleString()}
                    </p>
                    {!notification.is_read && (
                      <Button
                        variant="outline"
                        size="xs"
                        className="mt-2 text-[11px]"
                        onClick={() => markAsRead(notification.id)}
                      >
                        {t('notifications.mark_read')}
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}