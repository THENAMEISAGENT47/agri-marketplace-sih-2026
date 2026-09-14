'use client'

import { Card, CardContent, CardHeader, CardTitle, Button, Alert } from '@/components/ui'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function FarmerDashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalEarnings: 0,
    activeOrders: 0,
    totalProducts: 0,
    rating: 0,
  })
  const [recentOrders, setRecentOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (user) {
      fetchFarmerData()
    }
  }, [user])

  const fetchFarmerData = async () => {
    try {
      setLoading(true)
      
      // Fetch farmer profile
      const { data: farmerData } = await supabase
        .from('farmers')
        .select('*')
        .eq('user_id', user?.id)
        .single()

      if (farmerData) {
        setStats({
          totalEarnings: farmerData.total_earnings || 0,
          activeOrders: 0, // Will be calculated from orders
          totalProducts: 0, // Will be calculated from products
          rating: farmerData.rating || 0,
        })
      }

      // Fetch recent orders (mock for now, will be real data)
      setRecentOrders([
        {
          id: '1',
          product_name: 'Tomatoes',
          quantity: 500,
          total_amount: 12500,
          status: 'delivered',
          created_at: '2026-09-13',
        },
        {
          id: '2',
          product_name: 'Onions',
          quantity: 200,
          total_amount: 3600,
          status: 'processing',
          created_at: '2026-09-12',
        },
      ])
    } catch (error) {
      console.error('Error fetching farmer data:', error)
      setError('Failed to load dashboard data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert type="error" onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">Total Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">₹{stats.totalEarnings.toLocaleString()}</div>
            <p className="text-xs text-gray-500 mt-1">Lifetime earnings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">Active Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-secondary">{stats.activeOrders}</div>
            <p className="text-xs text-gray-500 mt-1">Orders in progress</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">Total Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-accent">{stats.totalProducts}</div>
            <p className="text-xs text-gray-500 mt-1">Active listings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{stats.rating.toFixed(1)}</div>
            <p className="text-xs text-gray-500 mt-1">Customer rating</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/farmer/products/new">
              <Button variant="primary" className="w-full">
                Add New Product
              </Button>
            </Link>
            <Link href="/farmer/orders">
              <Button variant="secondary" className="w-full">
                View Orders
              </Button>
            </Link>
            <Link href="/farmer/profile">
              <Button variant="outline" className="w-full">
                Update Profile
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {recentOrders.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No orders yet</p>
          ) : (
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{order.product_name}</p>
                    <p className="text-sm text-gray-600">{order.quantity} kg • ₹{order.total_amount.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                      order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                      order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">{order.created_at}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}