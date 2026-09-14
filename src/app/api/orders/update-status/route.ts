import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'
import { UpdateOrderStatusRequest, OrderStatus, canTransitionTo } from '@/types/orders'
import { demoOrders } from '@/lib/demo/orders'
import { incrementInventory } from '@/lib/demo/inventory'
import { addNotification } from '@/lib/demo/notifications'

export async function POST(request: NextRequest) {
  try {
    const body: UpdateOrderStatusRequest = await request.json()

    // Validate required fields
    if (!body.order_id || !body.status) {
      return NextResponse.json(
        { error: 'order_id and status are required' },
        { status: 400 }
      )
    }

    // Validate status transition
    const currentOrder = demoOrders.find(o => o.id === body.order_id)
    if (currentOrder && !canTransitionTo(currentOrder.status, body.status)) {
      return NextResponse.json(
        { error: `Cannot transition from ${currentOrder.status} to ${body.status}` },
        { status: 400 }
      )
    }

    // Try to use real database first
    try {
      const { data: order, error: fetchError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', body.order_id)
        .single()

      if (fetchError) throw fetchError

      // Validate status transition
      if (!canTransitionTo(order.status as OrderStatus, body.status)) {
        return NextResponse.json(
          { error: `Cannot transition from ${order.status} to ${body.status}` },
          { status: 400 }
        )
      }

      const { data: updatedOrder, error: updateError } = await supabase
        .from('orders')
        .update({ 
          status: body.status,
          notes: body.notes,
          updated_at: new Date().toISOString(),
        })
        .eq('id', body.order_id)
        .select()
        .single()

      if (updateError) throw updateError

      // Restore inventory if order is cancelled
      if (body.status === 'cancelled' && order.status !== 'cancelled') {
        // Fetch order items
        const { data: orderItems } = await supabase
          .from('order_items')
          .select('*')
          .eq('order_id', body.order_id)

        if (orderItems) {
          for (const item of orderItems) {
            const { data: product } = await supabase
              .from('products')
              .select('quantity')
              .eq('id', item.product_id)
              .eq('farmer_id', item.farmer_id)
              .single()

            if (product) {
              const newQuantity = (product.quantity || 0) + item.quantity
              await supabase
                .from('products')
                .update({ 
                  quantity: newQuantity,
                  is_available: true
                })
                .eq('id', item.product_id)
                .eq('farmer_id', item.farmer_id)
            }
          }
        }

        // Notify buyer about cancellation
        await supabase
          .from('notifications')
          .insert({
            user_id: order.buyer_id,
            type: 'cancellation',
            title: 'Order Cancelled',
            message: `Your order ${body.order_id} has been cancelled`,
            related_order_id: body.order_id,
            is_read: false,
          })
      } else {
        // Notify buyer about status change
        await supabase
          .from('notifications')
          .insert({
            user_id: order.buyer_id,
            type: 'status',
            title: 'Order Status Updated',
            message: `Your order ${body.order_id} status is now ${body.status.replace('_', ' ')}`,
            related_order_id: body.order_id,
            is_read: false,
          })
      }

      return NextResponse.json(updatedOrder)
    } catch (dbError) {
      console.log('Database error, using demo data:', dbError)
      // Fall back to demo data
    }

    // Demo fallback
    const orderIndex = demoOrders.findIndex(o => o.id === body.order_id)
    if (orderIndex === -1) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    const previousStatus = demoOrders[orderIndex].status
    demoOrders[orderIndex].status = body.status
    demoOrders[orderIndex].updated_at = new Date().toISOString()
    if (body.notes) {
      demoOrders[orderIndex].notes = body.notes
    }

    // Restore inventory if order is cancelled
    if (body.status === 'cancelled' && previousStatus !== 'cancelled') {
      for (const item of demoOrders[orderIndex].items) {
        incrementInventory(item.product_id, item.farmer_id, item.quantity)
      }

      // Notify buyer about cancellation
      addNotification({
        user_id: demoOrders[orderIndex].buyer_id,
        type: 'cancellation',
        title: 'Order Cancelled',
        message: `Your order ${body.order_id} has been cancelled`,
        related_order_id: body.order_id,
        is_read: false,
      })
    } else {
      // Notify buyer about status change
      addNotification({
        user_id: demoOrders[orderIndex].buyer_id,
        type: 'status',
        title: 'Order Status Updated',
        message: `Your order ${body.order_id} status is now ${body.status.replace('_', ' ')}`,
        related_order_id: body.order_id,
        is_read: false,
      })
    }

    return NextResponse.json(demoOrders[orderIndex])
  } catch (error: any) {
    console.error('Order status update error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update order status' },
      { status: 500 }
    )
  }
}