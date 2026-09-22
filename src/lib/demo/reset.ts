import { demoInventory } from './inventory'
import { demoOrders } from './orders'
import { demoNotifications } from './notifications'
import { demoAdminStats, demoUsers, demoFarmers } from './admin'

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
      category: 'Vegetables',
    },
    {
      product_id: 'prod2',
      farmer_id: 'farmer2',
      product_name: 'Tomatoes',
      product_variety: 'Hybrid',
      available_quantity: 300,
      unit: 'kg',
      price_per_unit: 22,
      category: 'Vegetables',
    },
    {
      product_id: 'prod3',
      farmer_id: 'farmer3',
      product_name: 'Tomatoes',
      product_variety: 'Cherry',
      available_quantity: 200,
      unit: 'kg',
      price_per_unit: 35,
      category: 'Vegetables',
    },
    {
      product_id: 'prod4',
      farmer_id: 'farmer1',
      product_name: 'Onions',
      product_variety: 'Red',
      available_quantity: 400,
      unit: 'kg',
      price_per_unit: 18,
      category: 'Vegetables',
    },
    {
      product_id: 'prod5',
      farmer_id: 'farmer2',
      product_name: 'Potatoes',
      product_variety: 'Jyoti',
      available_quantity: 600,
      unit: 'kg',
      price_per_unit: 15,
      category: 'Tubers',
    },
    {
      product_id: 'prod6',
      farmer_id: 'farmer3',
      product_name: 'Rice',
      product_variety: 'Basmati',
      available_quantity: 1200,
      unit: 'kg',
      price_per_unit: 55,
      category: 'Grains / Cereals',
    },
    {
      product_id: 'prod7',
      farmer_id: 'farmer1',
      product_name: 'Wheat',
      product_variety: 'Lokwan',
      available_quantity: 2000,
      unit: 'kg',
      price_per_unit: 28,
      category: 'Grains / Cereals',
    },
    {
      product_id: 'prod8',
      farmer_id: 'farmer2',
      product_name: 'Maize',
      product_variety: 'Hybrid',
      available_quantity: 1500,
      unit: 'kg',
      price_per_unit: 20,
      category: 'Grains / Cereals',
    },
    {
      product_id: 'prod9',
      farmer_id: 'farmer3',
      product_name: 'Groundnut',
      product_variety: 'Bold',
      available_quantity: 800,
      unit: 'kg',
      price_per_unit: 65,
      category: 'Pulses & Oilseeds',
    },
    {
      product_id: 'prod10',
      farmer_id: 'farmer1',
      product_name: 'Soybean',
      product_variety: 'JS 335',
      available_quantity: 1000,
      unit: 'kg',
      price_per_unit: 45,
      category: 'Pulses & Oilseeds',
    },
    {
      product_id: 'prod11',
      farmer_id: 'farmer3',
      product_name: 'Carrots',
      product_variety: 'Orange Kuroda',
      available_quantity: 500,
      unit: 'kg',
      price_per_unit: 24,
      category: 'Vegetables',
    },
    {
      product_id: 'prod12',
      farmer_id: 'farmer2',
      product_name: 'Cabbage',
      product_variety: 'Golden Acre',
      available_quantity: 700,
      unit: 'kg',
      price_per_unit: 14,
      category: 'Vegetables',
    },
    {
      product_id: 'prod13',
      farmer_id: 'farmer1',
      product_name: 'Cauliflower',
      product_variety: 'Snowball',
      available_quantity: 600,
      unit: 'kg',
      price_per_unit: 26,
      category: 'Vegetables',
    },
    {
      product_id: 'prod14',
      farmer_id: 'farmer2',
      product_name: 'Brinjal',
      product_variety: 'Manjari Gota',
      available_quantity: 450,
      unit: 'kg',
      price_per_unit: 22,
      category: 'Vegetables',
    },
    {
      product_id: 'prod15',
      farmer_id: 'farmer3',
      product_name: 'Cucumbers',
      product_variety: 'Malini',
      available_quantity: 400,
      unit: 'kg',
      price_per_unit: 18,
      category: 'Vegetables',
    },
    {
      product_id: 'prod16',
      farmer_id: 'farmer1',
      product_name: 'Jowar',
      product_variety: 'Maldandi',
      available_quantity: 1200,
      unit: 'kg',
      price_per_unit: 32,
      category: 'Grains / Cereals',
    },
    {
      product_id: 'prod17',
      farmer_id: 'farmer2',
      product_name: 'Bajra',
      product_variety: 'Pioneer Hybrid',
      available_quantity: 1000,
      unit: 'kg',
      price_per_unit: 25,
      category: 'Grains / Cereals',
    },
    {
      product_id: 'prod18',
      farmer_id: 'farmer3',
      product_name: 'Barley',
      product_variety: 'RD 2035',
      available_quantity: 800,
      unit: 'kg',
      price_per_unit: 30,
      category: 'Grains / Cereals',
    },
    {
      product_id: 'prod19',
      farmer_id: 'farmer1',
      product_name: 'Green Chillies',
      product_variety: 'G4 Hot',
      available_quantity: 350,
      unit: 'kg',
      price_per_unit: 40,
      category: 'Spices',
    },
    {
      product_id: 'prod20',
      farmer_id: 'farmer1',
      product_name: 'Potatoes',
      product_variety: 'Kufri Pukhraj',
      available_quantity: 500,
      unit: 'kg',
      price_per_unit: 16,
      category: 'Tubers',
    },
    {
      product_id: 'prod21',
      farmer_id: 'farmer2',
      product_name: 'Ragi',
      product_variety: 'GPU-28',
      available_quantity: 1000,
      unit: 'kg',
      price_per_unit: 37,
      category: 'Grains / Cereals',
    },
    {
      product_id: 'prod22',
      farmer_id: 'farmer3',
      product_name: 'Foxtail Millet',
      product_variety: 'SiA 3088',
      available_quantity: 800,
      unit: 'kg',
      price_per_unit: 37,
      category: 'Grains / Cereals',
    },
    {
      product_id: 'prod23',
      farmer_id: 'farmer1',
      product_name: 'Kodo Millet',
      product_variety: 'TNAU 86',
      available_quantity: 1200,
      unit: 'kg',
      price_per_unit: 26,
      category: 'Grains / Cereals',
    },
    {
      product_id: 'prod24',
      farmer_id: 'farmer2',
      product_name: 'Little Millet',
      product_variety: 'CO 4 / Kutki',
      available_quantity: 900,
      unit: 'kg',
      price_per_unit: 26,
      category: 'Grains / Cereals',
    }
  )

  // Reset orders to initial state with canonical demo order ORD-001
  demoOrders.length = 0
  demoOrders.push({
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
  })

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
    totalProducts: 24,
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