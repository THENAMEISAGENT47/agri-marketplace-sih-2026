export type OrderStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'processing' 
  | 'ready_for_pickup' 
  | 'shipped' 
  | 'delivered' 
  | 'cancelled' 
  | 'rejected'

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  farmer_id: string
  farmer_name: string
  product_name: string
  product_variety: string
  quantity: number
  unit: string
  price_per_unit: number
  subtotal: number
  created_at: string
}

export interface Order {
  id: string
  buyer_id: string
  buyer_name: string
  status: OrderStatus
  total_amount: number
  logistics_cost: number
  logistics_savings: number
  intermediary_savings: number
  delivery_address?: string
  delivery_lat?: number
  delivery_lng?: number
  estimated_delivery_date?: string
  notes?: string
  created_at: string
  updated_at: string
  items: OrderItem[]
}

export interface CreateOrderRequest {
  buyer_id: string
  items: Array<{
    product_id: string
    farmer_id: string
    quantity: number
    price_per_unit: number
  }>
  delivery_address?: string
  delivery_lat?: number
  delivery_lng?: number
  notes?: string
}

export interface UpdateOrderStatusRequest {
  order_id: string
  status: OrderStatus
  notes?: string
}

export const ORDER_STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending: ['confirmed', 'cancelled', 'rejected'],
  confirmed: ['processing', 'cancelled'],
  processing: ['ready_for_pickup', 'cancelled'],
  ready_for_pickup: ['shipped', 'cancelled'],
  shipped: ['delivered'],
  delivered: [],
  cancelled: [],
  rejected: []
}

export function canTransitionTo(currentStatus: OrderStatus, newStatus: OrderStatus): boolean {
  return ORDER_STATUS_TRANSITIONS[currentStatus].includes(newStatus)
}

export function isCancellable(status: OrderStatus): boolean {
  return ['pending', 'confirmed', 'processing'].includes(status)
}

export function formatOrderStatus(status: string): string {
  const map: Record<string, string> = {
    pending: 'Pending',
    confirmed: 'Confirmed',
    processing: 'Processing',
    ready_for_pickup: 'Ready for Pickup',
    shipped: 'Shipped',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
    rejected: 'Rejected',
  }
  return map[status] || status.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
}