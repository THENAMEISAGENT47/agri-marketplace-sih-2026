import { Order } from '@/types/orders'

export const demoOrders: Order[] = [
  {
    id: 'ORD-001',
    buyer_id: 'buyer1',
    buyer_name: 'Amit Sharma',
    status: 'delivered',
    total_amount: 19100,
    logistics_cost: 0,
    logistics_savings: 0,
    intermediary_savings: 2865,
    delivery_address: 'Market Area, Thane',
    delivery_lat: 19.033,
    delivery_lng: 73.0297,
    estimated_delivery_date: '2026-09-14',
    created_at: '2026-09-13T10:00:00Z',
    updated_at: '2026-09-14T15:00:00Z',
    items: [
      {
        id: 'OI-001',
        order_id: 'ORD-001',
        product_id: 'prod1',
        farmer_id: 'farmer1',
        farmer_name: 'Ramesh Kumar',
        product_name: 'Tomatoes',
        product_variety: 'Roma',
        quantity: 500,
        unit: 'kg',
        price_per_unit: 25,
        subtotal: 12500,
        created_at: '2026-09-13T10:00:00Z',
      },
      {
        id: 'OI-002',
        order_id: 'ORD-001',
        product_id: 'prod2',
        farmer_id: 'farmer2',
        farmer_name: 'Suresh FPO',
        product_name: 'Tomatoes',
        product_variety: 'Hybrid',
        quantity: 300,
        unit: 'kg',
        price_per_unit: 22,
        subtotal: 6600,
        created_at: '2026-09-13T10:00:00Z',
      },
    ],
  },
]

export let demoOrderCounter = 2

export function incrementDemoOrderCounter(): number {
  return demoOrderCounter++
}

export function getDemoFarmerName(farmerId: string): string {
  const names: Record<string, string> = {
    'farmer1': 'Ramesh Kumar',
    'farmer2': 'Suresh FPO',
    'farmer3': 'Priya Singh',
  }
  return names[farmerId] || 'Unknown Farmer'
}