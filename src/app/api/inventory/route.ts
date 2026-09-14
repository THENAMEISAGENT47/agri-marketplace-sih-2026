import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'
import { ProductInventory, demoInventory, getFarmerInventory, getProductInventory } from '@/lib/demo/inventory'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const farmerId = searchParams.get('farmer_id')
    const productId = searchParams.get('product_id')

    // Try to use real database first with timeout
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 3000) // 3 second timeout

      let query = supabase
        .from('products')
        .select('*')

      if (farmerId) {
        query = query.eq('farmer_id', farmerId)
      }

      if (productId) {
        query = query.eq('id', productId)
      }

      const { data: products, error } = await query

      clearTimeout(timeoutId)

      if (error) throw error

      return NextResponse.json(products)
    } catch (dbError) {
      console.log('Database error, using demo data:', dbError)
      // Fall back to demo data
    }

    // Demo fallback
    if (farmerId) {
      return NextResponse.json(getFarmerInventory(farmerId))
    }

    if (productId) {
      return NextResponse.json(getProductInventory(productId))
    }

    return NextResponse.json(demoInventory)
  } catch (error: any) {
    console.error('Inventory fetch error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch inventory' },
      { status: 500 }
    )
  }
}