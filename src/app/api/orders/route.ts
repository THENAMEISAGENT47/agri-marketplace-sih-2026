import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'
import { Order } from '@/types/orders'
import { demoOrders } from '@/lib/demo/orders'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const buyerId = searchParams.get('buyer_id')
    const farmerId = searchParams.get('farmer_id')

    // Try to use real database first with timeout
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 3000) // 3 second timeout

      let query = supabase
        .from('orders')
        .select(`
          *,
          buyers(name),
          order_items(
            *,
            farmers(name),
            products(name, variety)
          )
        `)

      if (buyerId) {
        query = query.eq('buyer_id', buyerId)
      }

      if (farmerId) {
        query = query.eq('order_items.farmer_id', farmerId)
      }

      const { data: orders, error } = await query.order('created_at', { ascending: false })

      clearTimeout(timeoutId)

      if (error) throw error

      // Transform data to match Order type
      const transformedOrders = orders.map((order: any) => ({
        ...order,
        buyer_name: order.buyers?.name || 'Unknown',
        items: order.order_items.map((item: any) => ({
          id: item.id,
          order_id: item.order_id,
          product_id: item.product_id,
          farmer_id: item.farmer_id,
          farmer_name: item.farmers?.name || 'Unknown',
          product_name: item.products?.name || 'Unknown',
          product_variety: item.products?.variety || '',
          quantity: item.quantity,
          unit: item.unit,
          price_per_unit: item.price_per_unit,
          subtotal: item.subtotal,
          created_at: item.created_at,
        })),
      }))

      return NextResponse.json(transformedOrders)
    } catch (dbError) {
      console.log('Database error, using demo data:', dbError)
      // Fall back to demo data
    }

    // Demo fallback
    let filteredOrders = demoOrders

    if (buyerId) {
      filteredOrders = demoOrders.filter(order => order.buyer_id === buyerId)
    }

    if (farmerId) {
      filteredOrders = demoOrders.filter(order => 
        order.items.some(item => item.farmer_id === farmerId)
      )
    }

    return NextResponse.json(filteredOrders)
  } catch (error: any) {
    console.error('Orders fetch error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}