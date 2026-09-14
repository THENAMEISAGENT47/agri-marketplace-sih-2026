import { addNotification } from './notifications'
import { demoOrders, incrementDemoOrderCounter } from './orders'
import { decrementInventory, demoInventory } from './inventory'

/**
 * Setup the complete 800kg tomato SIH demo scenario
 * This creates the optimal multi-supplier order for the demo presentation
 */
export function setupSIHDemo() {
  // Reset inventory to ensure clean state
  const prod1 = demoInventory.find(p => p.product_id === 'prod1' && p.farmer_id === 'farmer1')
  const prod2 = demoInventory.find(p => p.product_id === 'prod2' && p.farmer_id === 'farmer2')
  
  if (prod1) prod1.available_quantity = 500
  if (prod2) prod2.available_quantity = 300

  // Create the optimal 800kg tomato order
  const orderId = `ORD-SIHDemo-${Date.now()}`
  const itemId1 = `OI-${Date.now()}-1`
  const itemId2 = `OI-${Date.now()}-2`

  const demoOrder = {
    id: orderId,
    buyer_id: 'buyer1',
    buyer_name: 'Amit Sharma',
    status: 'pending' as const,
    total_amount: 19100, // 500kg × ₹25 + 300kg × ₹22 = ₹12,500 + ₹6,600 = ₹19,100
    logistics_cost: 0,
    logistics_savings: 0,
    intermediary_savings: 2865, // 15% of ₹19,100
    delivery_address: 'Market Area, Thane',
    delivery_lat: 19.033,
    delivery_lng: 73.0297,
    estimated_delivery_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    notes: 'SIH Demo: 800kg Tomatoes Multi-Supplier Order',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    items: [
      {
        id: itemId1,
        order_id: orderId,
        product_id: 'prod1',
        farmer_id: 'farmer1',
        farmer_name: 'Ramesh Kumar',
        product_name: 'Tomatoes',
        product_variety: 'Roma',
        quantity: 500,
        unit: 'kg',
        price_per_unit: 25,
        subtotal: 12500,
        created_at: new Date().toISOString(),
      },
      {
        id: itemId2,
        order_id: orderId,
        product_id: 'prod2',
        farmer_id: 'farmer2',
        farmer_name: 'Suresh FPO',
        product_name: 'Tomatoes',
        product_variety: 'Hybrid',
        quantity: 300,
        unit: 'kg',
        price_per_unit: 22,
        subtotal: 6600,
        created_at: new Date().toISOString(),
      },
    ],
  }

  // Add the order to demo orders
  demoOrders.push(demoOrder)

  // Decrement inventory for the demo order
  decrementInventory('prod1', 'farmer1', 500)
  decrementInventory('prod2', 'farmer2', 300)

  // Add notifications for the demo order
  addNotification({
    user_id: 'farmer1',
    type: 'order',
    title: '🍅 SIH Demo Order Received',
    message: 'SIH Demo: 500kg Tomatoes order for ₹12,500',
    related_order_id: orderId,
    is_read: false,
  })

  addNotification({
    user_id: 'farmer2',
    type: 'order',
    title: '🍅 SIH Demo Order Received',
    message: 'SIH Demo: 300kg Tomatoes order for ₹6,600',
    related_order_id: orderId,
    is_read: false,
  })

  addNotification({
    user_id: 'buyer1',
    type: 'status',
    title: '🍅 SIH Demo Order Placed',
    message: `SIH Demo: 800kg Tomatoes order placed successfully! Total: ₹19,100`,
    related_order_id: orderId,
    is_read: false,
  })

  return {
    success: true,
    message: 'SIH Demo scenario setup complete',
    order: demoOrder,
    demoScenario: {
      product: 'Tomatoes',
      totalQuantity: 800,
      suppliers: [
        {
          name: 'Ramesh Kumar',
          quantity: 500,
          pricePerUnit: 25,
          subtotal: 12500,
        },
        {
          name: 'Suresh FPO',
          quantity: 300,
          pricePerUnit: 22,
          subtotal: 6600,
        },
      ],
      totalAmount: 19100,
      intermediarySavings: 2865,
    },
  }
}