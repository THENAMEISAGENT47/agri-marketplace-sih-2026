import { NextRequest, NextResponse } from 'next/server'
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client'
import { Order, OrderItem } from '@/types/orders'
import { demoOrders } from '@/lib/demo/orders'

interface DbOrderItem {
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

interface DbOrder {
  id: string
  buyer_id: string
  status: Order['status']
  total_amount: number
  logistics_cost: number
  logistics_savings: number
  intermediary_savings: number
  delivery_address?: string
  delivery_lat?: number
  delivery_lng?: number
  created_at: string
  updated_at: string
  buyers?: { name?: string } | null
  order_items: DbOrderItem[]
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const buyerId = searchParams.get('buyer_id')
    const farmerId = searchParams.get('farmer_id')

    // Try to use real database only if configured
    if (isSupabaseConfigured()) {
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 1200)

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
          .abortSignal(controller.signal)

        if (buyerId) {
          query = query.eq('buyer_id', buyerId)
        }

        if (farmerId) {
          query = query.eq('order_items.farmer_id', farmerId)
        }

        const { data: orders, error } = await query.order('created_at', { ascending: false })

        clearTimeout(timeoutId)

        if (!error && orders && orders.length > 0) {
          const transformedOrders: Order[] = (orders as unknown as DbOrder[]).map((order) => ({
            ...order,
            buyer_name: order.buyers?.name || 'Unknown',
            items: order.order_items.map((item) => ({
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
        }
      } catch (dbError) {
        console.log('Database error, using demo data:', dbError)
      }
    }

    // Demo fallback
    let filteredOrders = demoOrders

    if (buyerId) {
      filteredOrders = demoOrders.filter(order => order.buyer_id === buyerId)
    }

    if (farmerId) {
      filteredOrders = demoOrders.filter(order => 
        order.items.some((item: OrderItem) => item.farmer_id === farmerId)
      )
    }

    return NextResponse.json(filteredOrders)
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch orders'
    console.error('Orders fetch error:', message)
    return NextResponse.json(
      { error: message },
      { status: 500 }
    )
  }
}