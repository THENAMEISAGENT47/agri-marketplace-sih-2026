import { NextRequest, NextResponse } from 'next/server'
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client'
import { 
  demoInventory, 
  getFarmerInventory, 
  getProductInventory,
  addInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
  ProductInventory
} from '@/lib/demo/inventory'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const farmerId = searchParams.get('farmer_id')
    const productId = searchParams.get('product_id')

    // Try to use real database only if configured with valid non-placeholder keys
    if (isSupabaseConfigured()) {
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 1200)

        let query = supabase
          .from('products')
          .select('*')
          .abortSignal(controller.signal)

        if (farmerId) {
          query = query.eq('farmer_id', farmerId)
        }

        if (productId) {
          query = query.eq('id', productId)
        }

        const { data: products, error } = await query

        clearTimeout(timeoutId)

        if (!error && products && products.length > 0) {
          return NextResponse.json(products)
        }
      } catch (dbError) {
        console.log('Database query failed or timed out, using demo data fallback:', dbError)
      }
    }

    // Demo fallback
    if (farmerId) {
      return NextResponse.json(getFarmerInventory(farmerId))
    }

    if (productId) {
      return NextResponse.json(getProductInventory(productId))
    }

    return NextResponse.json(demoInventory)
  } catch (error: unknown) {
    console.error('Inventory fetch error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch inventory' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, product_id, farmer_id, item, is_available } = body

    if (!action) {
      return NextResponse.json(
        { error: 'action is required (add, update_availability, update, delete)' },
        { status: 400 }
      )
    }

    if (action === 'add') {
      const lot = item || body
      if (!lot.product_name && !lot.name) {
        return NextResponse.json(
          { error: 'product_name is required' },
          { status: 400 }
        )
      }

      const newItem: ProductInventory = {
        product_id: lot.product_id || lot.id || `prod-custom-${Date.now().toString().slice(-6)}`,
        farmer_id: lot.farmer_id || farmer_id || 'farmer1',
        product_name: lot.product_name || lot.name,
        product_variety: lot.product_variety || lot.variety || 'Standard',
        available_quantity: Number(lot.available_quantity != null ? lot.available_quantity : (lot.quantity != null ? lot.quantity : 0)),
        unit: lot.unit || 'kg',
        price_per_unit: Number(lot.price_per_unit || 0),
        category: lot.category || 'Vegetables',
        harvest_date: lot.harvest_date || new Date().toISOString().split('T')[0],
        availability_date: lot.availability_date || new Date().toISOString().split('T')[0],
        is_available: lot.is_available !== undefined ? Boolean(lot.is_available) : true,
        quality_grade: lot.quality_grade || 'A',
      }

      const saved = addInventoryItem(newItem)
      return NextResponse.json({ success: true, item: saved })
    }

    if (action === 'update_availability') {
      const pid = product_id || body.id
      const fid = farmer_id || body.farmer_id
      if (!pid) {
        return NextResponse.json(
          { error: 'product_id is required' },
          { status: 400 }
        )
      }

      const updated = updateInventoryItem(pid, fid, {
        is_available: Boolean(is_available)
      })

      if (!updated) {
        return NextResponse.json(
          { error: 'Item not found' },
          { status: 404 }
        )
      }

      return NextResponse.json({ success: true, item: updated })
    }

    if (action === 'update') {
      const pid = product_id || (item && (item.product_id || item.id))
      const fid = farmer_id || (item && item.farmer_id)
      if (!pid) {
        return NextResponse.json(
          { error: 'product_id is required' },
          { status: 400 }
        )
      }

      const updates = item || body
      const updated = updateInventoryItem(pid, fid, updates)
      if (!updated) {
        return NextResponse.json(
          { error: 'Item not found' },
          { status: 404 }
        )
      }

      return NextResponse.json({ success: true, item: updated })
    }

    if (action === 'delete') {
      const pid = product_id || body.id
      const fid = farmer_id || body.farmer_id
      if (!pid) {
        return NextResponse.json(
          { error: 'product_id is required' },
          { status: 400 }
        )
      }

      const success = deleteInventoryItem(pid, fid)
      return NextResponse.json({ success, product_id: pid })
    }

    return NextResponse.json(
      { error: `Unsupported action: ${action}` },
      { status: 400 }
    )
  } catch (error: unknown) {
    console.error('Inventory mutation error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update inventory' },
      { status: 500 }
    )
  }
}