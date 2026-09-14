import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'
import { CreateOrderRequest, Order } from '@/types/orders'
import { demoOrders, incrementDemoOrderCounter, getDemoFarmerName } from '@/lib/demo/orders'
import { checkAvailability, decrementInventory, incrementInventory } from '@/lib/demo/inventory'
import { addNotification } from '@/lib/demo/notifications'

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

      // Check inventory availability
      const isAvailable = checkAvailability(item.product_id, item.farmer_id, item.quantity)
      if (!isAvailable) {
        return NextResponse.json(
          { error: `Insufficient inventory for product ${item.product_id} from farmer ${item.farmer_id}` },
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

        orderItems.push({
          id: itemData.id,
          order_id: itemData.order_id,
          product_id: itemData.product_id,
          farmer_id: itemData.farmer_id,
          farmer_name: (itemData as any).farmers?.name || 'Unknown',
          product_name: (itemData as any).products?.name || 'Unknown',
          product_variety: (itemData as any).products?.variety || '',
          quantity: itemData.quantity,
          unit: itemData.unit,
          price_per_unit: itemData.price_per_unit,
          subtotal: itemData.subtotal,
          created_at: itemData.created_at,
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
    const orderId = `ORD-${Date.now()}`
    let totalAmount = 0
    const orderItems = []

    for (const item of body.items) {
      const subtotal = item.quantity * item.price_per_unit
      totalAmount += subtotal

      const itemId = `OI-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      orderItems.push({
        id: itemId,
        order_id: orderId,
        product_id: item.product_id,
        farmer_id: item.farmer_id,
        farmer_name: getDemoFarmerName(item.farmer_id),
        product_name: 'Tomatoes',
        product_variety: 'Roma',
        quantity: item.quantity,
        unit: 'kg',
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
  } catch (error: any) {
    console.error('Order creation error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create order' },
      { status: 500 }
    )
  }
}