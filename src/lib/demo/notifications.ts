export interface Notification {
  id: string
  user_id: string
  type: 'order' | 'status' | 'cancellation' | 'verification'
  title: string
  message: string
  is_read: boolean
  related_order_id?: string
  created_at: string
}

export let demoNotifications: Notification[] = [
  {
    id: 'notif-1',
    user_id: 'farmer1',
    type: 'order',
    title: 'New Order Received',
    message: 'You have a new order ORD-005 for 500kg Tomatoes',
    is_read: false,
    related_order_id: 'ORD-005',
    created_at: '2026-09-14T10:30:00Z',
  },
  {
    id: 'notif-2',
    user_id: 'buyer1',
    type: 'status',
    title: 'Order Status Updated',
    message: 'Your order ORD-004 has been delivered',
    is_read: false,
    related_order_id: 'ORD-004',
    created_at: '2026-09-14T09:15:00Z',
  },
  {
    id: 'notif-3',
    user_id: 'farmer2',
    type: 'order',
    title: 'New Order Received',
    message: 'You have a new order ORD-003 for 300kg Tomatoes',
    is_read: true,
    related_order_id: 'ORD-003',
    created_at: '2026-09-12T16:45:00Z',
  },
]

export function addNotification(notification: Omit<Notification, 'id' | 'created_at'>) {
  const newNotification: Notification = {
    ...notification,
    id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    created_at: new Date().toISOString(),
  }
  demoNotifications.unshift(newNotification)
  return newNotification
}

export function markAsRead(notificationId: string) {
  const notification = demoNotifications.find(n => n.id === notificationId)
  if (notification) {
    notification.is_read = true
  }
}

export function getUnreadCount(userId: string): number {
  return demoNotifications.filter(n => n.user_id === userId && !n.is_read).length
}

export function getUserNotifications(userId: string): Notification[] {
  return demoNotifications.filter(n => n.user_id === userId)
}