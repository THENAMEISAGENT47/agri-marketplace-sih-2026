export interface AdminStats {
  totalFarmers: number
  totalBuyers: number
  totalProducts: number
  totalOrders: number
  totalTransactionValue: number
  activeOrders: number
  pendingOrders: number
  completedOrders: number
  totalFarmerEarnings: number
  totalBuyerSavings: number
  totalLogisticsSavings: number
  intermediariesAvoided: number
}

export interface User {
  id: string
  email: string
  role: 'farmer' | 'buyer' | 'admin'
  is_verified: boolean
  created_at: string
}

export interface Farmer {
  id: string
  user_id: string
  name: string
  type: 'individual' | 'fpo'
  verification_status: 'pending' | 'verified' | 'rejected'
  total_earnings: number
  rating: number
  total_orders: number
  created_at: string
}

export const demoAdminStats: AdminStats = {
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
}

export const demoUsers: User[] = [
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
  },
]

export const demoFarmers: Farmer[] = [
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
  },
]

export const orderStatusDistribution = [
  { status: 'pending', count: 1, color: 'warning' },
  { status: 'confirmed', count: 1, color: 'info' },
  { status: 'processing', count: 1, color: 'info' },
  { status: 'shipped', count: 0, color: 'info' },
  { status: 'delivered', count: 2, color: 'success' },
  { status: 'cancelled', count: 0, color: 'danger' },
  { status: 'rejected', count: 0, color: 'danger' },
]

export const recentActivity = [
  {
    id: 1,
    type: 'order',
    message: 'New order ORD-005 placed by Amit Sharma',
    timestamp: '2026-09-14T10:30:00Z',
  },
  {
    id: 2,
    type: 'order',
    message: 'Order ORD-004 marked as delivered',
    timestamp: '2026-09-14T09:15:00Z',
  },
  {
    id: 3,
    type: 'verification',
    message: 'Priya Singh submitted verification request',
    timestamp: '2026-09-13T14:20:00Z',
  },
  {
    id: 4,
    type: 'user',
    message: 'New buyer registered: Restaurant Green',
    timestamp: '2026-09-13T11:00:00Z',
  },
  {
    id: 5,
    type: 'order',
    message: 'Order ORD-003 confirmed by Ramesh Kumar',
    timestamp: '2026-09-12T16:45:00Z',
  },
]