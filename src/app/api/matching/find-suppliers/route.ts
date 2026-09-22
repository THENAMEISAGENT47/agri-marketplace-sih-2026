import { NextRequest, NextResponse } from 'next/server'
import { MatchingEngine, demoFindSuppliers } from '@/services/matching'
import { MatchingCriteria } from '@/services/matching/scoring'

export async function POST(request: NextRequest) {
  try {
    const criteria: MatchingCriteria = await request.json()

    // Validate required fields
    if (!criteria.product_name || !criteria.required_quantity || !criteria.buyer_location) {
      return NextResponse.json(
        { error: 'Missing required fields: product_name, required_quantity, buyer_location' },
        { status: 400 }
      )
    }

    // Validate location
    if (!criteria.buyer_location.lat || !criteria.buyer_location.lng) {
      return NextResponse.json(
        { error: 'Invalid buyer_location: lat and lng are required' },
        { status: 400 }
      )
    }

    // Validate quantity
    if (criteria.required_quantity <= 0) {
      return NextResponse.json(
        { error: 'required_quantity must be greater than 0' },
        { status: 400 }
      )
    }

    // Try to use real database first, fall back to demo data
    let result
    try {
      result = await MatchingEngine.findSuppliers(criteria)
    } catch (dbError) {
      console.log('Database error, using demo data:', dbError)
      // Fall back to demo data for SIH demonstration
      result = demoFindSuppliers(criteria)
    }

    return NextResponse.json(result)
  } catch (error: unknown) {
    console.error('Matching error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to find matching suppliers' },
      { status: 500 }
    )
  }
}