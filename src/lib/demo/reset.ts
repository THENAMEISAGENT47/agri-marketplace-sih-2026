import { demoInventory } from './inventory'
import { demoOrders } from './orders'
import { demoNotifications } from './notifications'
import { demoAdminStats, demoUsers, demoFarmers, orderStatusDistribution, recentActivity } from './admin'

/**
 * Reset all demo data to initial state
 * This is critical for SIH demonstrations to ensure consistent demo experience
 */
export function resetAllDemoData() {
  // Reset inventory to initial state
  demoInventory.length = 0
  demoInventory.push(
    {
      product_id: 'prod1',
      farmer_id: 'farmer1',
      product_name: 'Tomatoes',
      product_variety: 'Roma',
      available_quantity: 500,
      unit: 'kg',
      price_per_unit: 25,
    },
    {
      product_id: 'prod2',
      farmer_id: 'farmer2',
      product_name: 'Tomatoes',
      product_variety: 'Hybrid',
      available_quantity: 300,
      unit: 'kg',
      price_per_unit: 22,
    },
    {
      product_id: 'prod3',
      farmer_id: 'farmer3',
      product_name: 'Tomatoes',
      product_variety: 'Cherry',
      available_quantity: 200,
      unit: 'kg',
      price_per_unit: 35,
    },
    {
      product_id: 'prod4',
      farmer_id: 'farmer1',
      product_name: 'Onions',
      product_variety: 'Red',
      available_quantity: 400,
      unit: 'kg',
      price_per_unit: 18,
    },
    {
      product_id: 'prod5',
      farmer_id: 'farmer2',
      product_name: 'Potatoes',
      product_variety: 'Jyoti',
      available_quantity: 600,
      unit: 'kg',
      price_per_unit: 15,
    },
    {
      product_id: 'prod6',
      farmer_id: 'farmer3',
      product_name: 'Carrots',
      product_variety: 'Local',
      available_quantity: 250,
      unit: 'kg',
      price_per_unit: 30,
    }
  )

  // Reset orders to initial state
  demoOrders.length = 0
  // Keep the initial demo order if needed, or clear completely
  // For now, we'll clear to start fresh for each demo

  // Reset notifications to initial state
  demoNotifications.length = 0
  demoNotifications.push(
    {
      id: 'notif-1',
      user_id: 'farmer1',
      type: 'order',
      title: 'New Order Received',
      message: 'You have a new order ORD-005 for 500kg Tomatoes',
      is_read: false,
      related_order_id: 'ORD-005',
      created_at: '2026-09-14T10:30:00Z',
    },
    {
      id: 'notif-2',
      user_id: 'buyer1',
      type: 'status',
      title: 'Order Status Updated',
      message: 'Your order ORD-004 has been delivered',
      is_read: false,
      related_order_id: 'ORD-004',
      created_at: '2026-09-14T09:15:00Z',
    },
    {
      id: 'notif-3',
      user_id: 'farmer2',
      type: 'order',
      title: 'New Order Received',
      message: 'You have a new order ORD-003 for 300kg Tomatoes',
      is_read: true,
      related_order_id: 'ORD-003',
      created_at: '2026-09-12T16:45:00Z',
    }
  )

  // Reset admin stats to initial state
  Object.assign(demoAdminStats, {
    totalFarmers: 3,
    totalBuyers: 2,
    totalProducts: 6,
    totalOrders: 5,
    totalTransactionValue: 56850,
    activeOrders: 2,
    pendingOrders: 1,
    completedOrders: 2,
    totalFarmerEarnings: 85000,
    totalBuyerSavings: 14250,
    totalLogisticsSavings: 4000,
    intermediariesAvoided: 8,
  })

  // Reset users to initial state
  demoUsers.length = 0
  demoUsers.push(
    {
      id: 'user1',
      email: 'farmer1@demo.com',
      role: 'farmer',
      is_verified: true,
      created_at: '2026-09-01T10:00:00Z',
    },
    {
      id: 'user2',
      email: 'farmer2@demo.com',
      role: 'farmer',
      is_verified: true,
      created_at: '2026-09-02T10:00:00Z',
    },
    {
      id: 'user3',
      email: 'farmer3@demo.com',
      role: 'farmer',
      is_verified: false,
      created_at: '2026-09-03T10:00:00Z',
    },
    {
      id: 'user4',
      email: 'buyer1@demo.com',
      role: 'buyer',
      is_verified: true,
      created_at: '2026-09-01T12:00:00Z',
    },
    {
      id: 'user5',
      email: 'buyer2@demo.com',
      role: 'buyer',
      is_verified: true,
      created_at: '2026-09-02T12:00:00Z',
    },
    {
      id: 'user6',
      email: 'admin@demo.com',
      role: 'admin',
      is_verified: true,
      created_at: '2026-08-31T08:00:00Z',
    }
  )

  // Reset farmers to initial state
  demoFarmers.length = 0
  demoFarmers.push(
    {
      id: 'farmer1',
      user_id: 'user1',
      name: 'Ramesh Kumar',
      type: 'individual',
      verification_status: 'verified',
      total_earnings: 35000,
      rating: 4.5,
      total_orders: 20,
      created_at: '2026-09-01T10:00:00Z',
    },
    {
      id: 'farmer2',
      user_id: 'user2',
      name: 'Suresh FPO',
      type: 'fpo',
      verification_status: 'verified',
      total_earnings: 40000,
      rating: 4.8,
      total_orders: 25,
      created_at: '2026-09-02T10:00:00Z',
    },
    {
      id: 'farmer3',
      user_id: 'user3',
      name: 'Priya Singh',
      type: 'individual',
      verification_status: 'pending',
      total_earnings: 10000,
      rating: 4.2,
      total_orders: 10,
      created_at: '2026-09-03T10:00:00Z',
    }
  )

  return {
    success: true,
    message: 'All demo data has been reset to initial state',
    timestamp: new Date().toISOString(),
  }
}

/**
 * Get current demo state for monitoring
 */
export function getDemoState() {
  return {
    inventory: demoInventory.length,
    orders: demoOrders.length,
    notifications: demoNotifications.length,
    users: demoUsers.length,
    farmers: demoFarmers.length,
    timestamp: new Date().toISOString(),
  }
}