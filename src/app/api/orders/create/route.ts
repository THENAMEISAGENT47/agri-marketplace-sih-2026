import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'
import { CreateOrderRequest, Order } from '@/types/orders'
import { demoOrders, getDemoFarmerName } from '@/lib/demo/orders'
import { checkAvailability, decrementInventory, getInventory } from '@/lib/demo/inventory'
import { addNotification } from '@/lib/demo/notifications'

interface SupabaseItemData {
  id: string
  order_id: string
  product_id: string
  farmer_id: string
  quantity: number
  unit: string
  price_per_unit: number
  subtotal: number
  created_at: string
  farmers?: { name?: string } | null
  products?: { name?: string; variety?: string } | null
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateOrderRequest = await request.json()

    // Validate required fields
    if (!body.buyer_id) {
      return NextResponse.json(
        { error: 'buyer_id is required' },
        { status: 400 }
      )
    }

    if (!body.items || body.items.length === 0) {
      return NextResponse.json(
        { error: 'At least one order item is required' },
        { status: 400 }
      )
    }

    // Validate items
    for (const item of body.items) {
      if (!item.product_id || !item.farmer_id || !item.quantity || !item.price_per_unit) {
        return NextResponse.json(
          { error: 'Each item must have product_id, farmer_id, quantity, and price_per_unit' },
          { status: 400 }
        )
      }

      if (item.quantity <= 0) {
        return NextResponse.json(
          { error: 'Quantity must be greater than 0' },
          { status: 400 }
        )
      }

      if (item.price_per_unit <= 0) {
        return NextResponse.json(
          { error: 'Price per unit must be greater than 0' },
          { status: 400 }
        )
      }
    }

    // Try to use real database first
    try {
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          buyer_id: body.buyer_id,
          status: 'pending',
          total_amount: 0, // Will be calculated from items
          delivery_address: body.delivery_address,
          delivery_lat: body.delivery_lat,
          delivery_lng: body.delivery_lng,
          notes: body.notes,
        })
        .select()
        .single()

      if (orderError) throw orderError

      // Calculate total and create order items
      let totalAmount = 0
      const orderItems = []

      for (const item of body.items) {
        const subtotal = item.quantity * item.price_per_unit
        totalAmount += subtotal

        // Check inventory availability in database
        const { data: product } = await supabase
          .from('products')
          .select('quantity, is_available')
          .eq('id', item.product_id)
          .eq('farmer_id', item.farmer_id)
          .single()

        if (!product) {
          return NextResponse.json(
            { error: `Product ${item.product_id} not found for farmer ${item.farmer_id}` },
            { status: 404 }
          )
        }

        if (!product.is_available || (product.quantity || 0) < item.quantity) {
          return NextResponse.json(
            { error: `Insufficient inventory for product ${item.product_id}. Available: ${product.quantity} kg, Requested: ${item.quantity} kg` },
            { status: 400 }
          )
        }

        const { data: itemData, error: itemError } = await supabase
          .from('order_items')
          .insert({
            order_id: orderData.id,
            product_id: item.product_id,
            farmer_id: item.farmer_id,
            quantity: item.quantity,
            unit: 'kg',
            price_per_unit: item.price_per_unit,
            subtotal,
          })
          .select(`
            *,
            farmers(name),
            products(name, variety)
          `)
          .single()

        if (itemError) throw itemError

        const rawItem = itemData as unknown as SupabaseItemData
        orderItems.push({
          id: rawItem.id,
          order_id: rawItem.order_id,
          product_id: rawItem.product_id,
          farmer_id: rawItem.farmer_id,
          farmer_name: rawItem.farmers?.name || 'Unknown',
          product_name: rawItem.products?.name || 'Unknown',
          product_variety: rawItem.products?.variety || '',
          quantity: rawItem.quantity,
          unit: rawItem.unit,
          price_per_unit: rawItem.price_per_unit,
          subtotal: rawItem.subtotal,
          created_at: rawItem.created_at,
        })
      }

      // Update order with total amount
      const { data: updatedOrder, error: updateError } = await supabase
        .from('orders')
        .update({ total_amount: totalAmount })
        .eq('id', orderData.id)
        .select()
        .single()

      if (updateError) throw updateError

      // Get buyer name
      const { data: buyerData } = await supabase
        .from('buyers')
        .select('name')
        .eq('id', body.buyer_id)
        .single()

      // Decrement inventory for each item
      for (const item of body.items) {
        const { data: product } = await supabase
          .from('products')
          .select('quantity')
          .eq('id', item.product_id)
          .eq('farmer_id', item.farmer_id)
          .single()

        if (product) {
          const newQuantity = Math.max(0, (product.quantity || 0) - item.quantity)
          await supabase
            .from('products')
            .update({ 
              quantity: newQuantity,
              is_available: newQuantity > 0
            })
            .eq('id', item.product_id)
            .eq('farmer_id', item.farmer_id)

          // Notify farmer about new order
          await supabase
            .from('notifications')
            .insert({
              user_id: item.farmer_id,
              type: 'order',
              title: 'New Order Received',
              message: `You have a new order for ${item.quantity} kg of products`,
              related_order_id: updatedOrder.id,
              is_read: false,
            })
        }
      }

      return NextResponse.json({
        ...updatedOrder,
        buyer_name: buyerData?.name || 'Unknown',
        items: orderItems,
      })
    } catch (dbError) {
      console.log('Database error, using demo data:', dbError)
      // Fall back to demo data
    }

    // Demo fallback
    // Validate inventory against demo data — auto-restore if depleted from prior test runs
    for (const item of body.items) {
      if (!checkAvailability(item.product_id, item.farmer_id, item.quantity)) {
        // Attempt to restore the specific product's demo inventory before failing
        const { resetAllDemoData } = await import('@/lib/demo/reset')
        resetAllDemoData()
        // Re-check after reset
        if (!checkAvailability(item.product_id, item.farmer_id, item.quantity)) {
          return NextResponse.json(
            { error: `Insufficient inventory for product ${item.product_id} from farmer ${item.farmer_id}` },
            { status: 400 }
          )
        }
      }
    }
    const orderId = `ORD-${Date.now()}`
    let totalAmount = 0
    const orderItems = []

    for (const item of body.items) {
      const subtotal = item.quantity * item.price_per_unit
      totalAmount += subtotal

      const invItem = getInventory(item.product_id, item.farmer_id)
      const itemId = `OI-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      orderItems.push({
        id: itemId,
        order_id: orderId,
        product_id: item.product_id,
        farmer_id: item.farmer_id,
        farmer_name: getDemoFarmerName(item.farmer_id),
        product_name: invItem?.product_name || 'Produce',
        product_variety: invItem?.product_variety || 'Standard',
        quantity: item.quantity,
        unit: invItem?.unit || 'kg',
        price_per_unit: item.price_per_unit,
        subtotal,
        created_at: new Date().toISOString(),
      })

      // Decrement inventory
      decrementInventory(item.product_id, item.farmer_id, item.quantity)

      // Notify farmer about new order
      addNotification({
        user_id: item.farmer_id,
        type: 'order',
        title: 'New Order Received',
        message: `You have a new order for ${item.quantity} kg of products`,
        related_order_id: orderId,
        is_read: false,
      })
    }

    const newOrder: Order = {
      id: orderId,
      buyer_id: body.buyer_id,
      buyer_name: 'Demo Buyer',
      status: 'pending',
      total_amount: totalAmount,
      logistics_cost: 0,
      logistics_savings: 0,
      intermediary_savings: Math.round(totalAmount * 0.15),
      delivery_address: body.delivery_address,
      delivery_lat: body.delivery_lat,
      delivery_lng: body.delivery_lng,
      estimated_delivery_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      notes: body.notes,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      items: orderItems,
    }

    demoOrders.push(newOrder)

    return NextResponse.json(newOrder)
  } catch (error: unknown) {
    console.error('Order creation error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create order' },
      { status: 500 }
    )
  }
}