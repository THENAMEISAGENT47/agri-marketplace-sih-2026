import { findMatchingSuppliers, MatchingCriteria, MatchingResult } from './scoring'
import { supabase } from '@/lib/supabase/client'

export class MatchingEngine {
  /**
   * Find matching suppliers for buyer requirements
   */
  static async findSuppliers(criteria: MatchingCriteria): Promise<MatchingResult> {
    try {
      // Fetch available products with farmer information
      const { data: products, error } = await supabase
        .from('products')
        .select(`
          *,
          farmers!inner (
            id,
            user_id,
            name,
            location_lat,
            location_lng,
            rating,
            total_orders
          )
        `)
        .eq('is_available', true)
        .eq('name', criteria.product_name) // Case-sensitive match for now
        .gte('quantity', criteria.required_quantity * 0.5) // At least 50% of required quantity
        .order('price_per_unit', { ascending: true })

      if (error) throw error

      // Transform data for matching engine
      const suppliers = products.map(product => ({
        farmer_id: product.farmers.id,
        farmer_name: product.farmers.name,
        location_lat: product.farmers.location_lat,
        location_lng: product.farmers.location_lng,
        farmer_rating: product.farmers.rating,
        product_id: product.id,
        product_name: product.name,
        variety: product.variety,
        available_quantity: product.quantity,
        unit: product.unit,
        price_per_unit: product.price_per_unit,
        quality_grade: product.quality_grade,
        harvest_date: product.harvest_date,
        availability_date: product.availability_date,
        is_available: product.is_available,
      }))

      // Use the scoring system to find matches
      return findMatchingSuppliers(suppliers, criteria)
    } catch (error) {
      console.error('Error in matching engine:', error)
      throw error
    }
  }

  /**
   * Get available product categories for search
   */
  static async getAvailableProducts(): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('name')
        .eq('is_available', true)
        .order('name')

      if (error) throw error

      // Get unique product names
      const uniqueProducts = Array.from(new Set(data.map(p => p.name)))
      return uniqueProducts
    } catch (error) {
      console.error('Error fetching available products:', error)
      throw error
    }
  }

  /**
   * Get product varieties for a specific product
   */
  static async getProductVarieties(productName: string): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('variety')
        .eq('name', productName)
        .eq('is_available', true)
        .not('variety', 'is', null)

      if (error) throw error

      const uniqueVarieties = Array.from(new Set(data.map(p => p.variety)))
      return uniqueVarieties
    } catch (error) {
      console.error('Error fetching product varieties:', error)
      throw error
    }
  }

  /**
   * Get price range for a product
   */
  static async getProductPriceRange(productName: string): Promise<{ min: number; max: number; avg: number }> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('price_per_unit')
        .eq('name', productName)
        .eq('is_available', true)

      if (error) throw error

      if (data.length === 0) {
        return { min: 0, max: 0, avg: 0 }
      }

      const prices = data.map(p => p.price_per_unit)
      return {
        min: Math.min(...prices),
        max: Math.max(...prices),
        avg: prices.reduce((sum, price) => sum + price, 0) / prices.length,
      }
    } catch (error) {
      console.error('Error fetching price range:', error)
      throw error
    }
  }
}

// Demo data for testing without database
export const demoSuppliers = [
  {
    farmer_id: 'farmer1',
    farmer_name: 'Ramesh Kumar',
    location_lat: 19.0760,
    location_lng: 72.8777,
    farmer_rating: 4.5,
    product_id: 'prod1',
    product_name: 'Tomatoes',
    variety: 'Roma',
    available_quantity: 500,
    unit: 'kg',
    price_per_unit: 25,
    quality_grade: 'A',
    harvest_date: '2026-09-10',
    availability_date: '2026-09-13',
    is_available: true,
  },
  {
    farmer_id: 'farmer2',
    farmer_name: 'Suresh FPO',
    location_lat: 19.0860,
    location_lng: 72.8877,
    farmer_rating: 4.8,
    product_id: 'prod2',
    product_name: 'Tomatoes',
    variety: 'Hybrid',
    available_quantity: 300,
    unit: 'kg',
    price_per_unit: 22,
    quality_grade: 'A',
    harvest_date: '2026-09-11',
    availability_date: '2026-09-13',
    is_available: true,
  },
  {
    farmer_id: 'farmer3',
    farmer_name: 'Priya Singh',
    location_lat: 19.0960,
    location_lng: 72.8977,
    farmer_rating: 4.2,
    product_id: 'prod3',
    product_name: 'Tomatoes',
    variety: 'Cherry',
    available_quantity: 200,
    unit: 'kg',
    price_per_unit: 35,
    quality_grade: 'A',
    harvest_date: '2026-09-12',
    availability_date: '2026-09-14',
    is_available: true,
  },
  {
    farmer_id: 'farmer1',
    farmer_name: 'Ramesh Kumar',
    location_lat: 19.0760,
    location_lng: 72.8777,
    farmer_rating: 4.5,
    product_id: 'prod4',
    product_name: 'Onions',
    variety: 'Red',
    available_quantity: 400,
    unit: 'kg',
    price_per_unit: 18,
    quality_grade: 'A',
    harvest_date: '2026-09-08',
    availability_date: '2026-09-13',
    is_available: true,
  },
  {
    farmer_id: 'farmer2',
    farmer_name: 'Suresh FPO',
    location_lat: 19.0860,
    location_lng: 72.8877,
    farmer_rating: 4.8,
    product_id: 'prod5',
    product_name: 'Potatoes',
    variety: 'Jyoti',
    available_quantity: 600,
    unit: 'kg',
    price_per_unit: 15,
    quality_grade: 'A',
    harvest_date: '2026-09-09',
    availability_date: '2026-09-13',
    is_available: true,
  },
]

/**
 * Demo matching function for testing without database
 */
export function demoFindSuppliers(criteria: MatchingCriteria): MatchingResult {
  const suppliers = demoSuppliers.filter(supplier => {
    const nameMatch = supplier.product_name.toLowerCase() === criteria.product_name.toLowerCase()
    const available = supplier.is_available
    const quantityMatch = supplier.available_quantity > 0
    
    let distanceMatch = true
    if (criteria.max_distance) {
      const distance = calculateDistance(
        criteria.buyer_location.lat,
        criteria.buyer_location.lng,
        supplier.location_lat,
        supplier.location_lng
      )
      distanceMatch = distance <= criteria.max_distance
    }

    let priceMatch = true
    if (criteria.max_price) {
      priceMatch = supplier.price_per_unit <= criteria.max_price
    }

    return nameMatch && available && quantityMatch && distanceMatch && priceMatch
  })

  return findMatchingSuppliers(suppliers, criteria)
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}