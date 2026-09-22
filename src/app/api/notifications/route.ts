import { NextRequest, NextResponse } from 'next/server'
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client'
import { addNotification, getUserNotifications, markAsRead } from '@/lib/demo/notifications'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('user_id')

    if (!userId) {
      return NextResponse.json(
        { error: 'user_id is required' },
        { status: 400 }
      )
    }

    // Try to use real database only if configured
    if (isSupabaseConfigured()) {
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 1200)

        const { data: notifications, error } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .abortSignal(controller.signal)

        clearTimeout(timeoutId)

        if (!error && notifications) {
          return NextResponse.json(notifications)
        }
      } catch (dbError) {
        console.log('Database error, using demo data:', dbError)
      }
    }

    // Demo fallback
    const userNotifications = getUserNotifications(userId)
    return NextResponse.json(userNotifications)
  } catch (error: unknown) {
    console.error('Notifications fetch error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch notifications' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { user_id, type, title, message, related_order_id } = body

    if (!user_id || !type || !title || !message) {
      return NextResponse.json(
        { error: 'user_id, type, title, and message are required' },
        { status: 400 }
      )
    }

    // Try to use real database first with timeout
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 3000) // 3 second timeout

      const { data: notification, error } = await supabase
        .from('notifications')
        .insert({
          user_id,
          type,
          title,
          message,
          related_order_id,
          is_read: false,
        })
        .select()
        .single()

      clearTimeout(timeoutId)

      if (error) throw error

      return NextResponse.json(notification)
    } catch (dbError) {
      console.log('Database error, using demo data:', dbError)
      // Fall back to demo data
    }

    // Demo fallback
    const notification = addNotification({
      user_id,
      type,
      title,
      message,
      related_order_id,
      is_read: false,
    })

    return NextResponse.json(notification)
  } catch (error: unknown) {
    console.error('Notification creation error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create notification' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { notification_id, action } = body

    if (!notification_id || !action) {
      return NextResponse.json(
        { error: 'notification_id and action are required' },
        { status: 400 }
      )
    }

    if (action === 'mark_read') {
      // Try to use real database first with timeout
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 3000) // 3 second timeout

        const { error } = await supabase
          .from('notifications')
          .update({ is_read: true })
          .eq('id', notification_id)

        clearTimeout(timeoutId)

        if (error) throw error
      } catch (dbError) {
        console.log('Database error, using demo data:', dbError)
        // Fall back to demo data
      }

      // Demo fallback
      markAsRead(notification_id)
    }

    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    console.error('Notification update error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update notification' },
      { status: 500 }
    )
  }
}