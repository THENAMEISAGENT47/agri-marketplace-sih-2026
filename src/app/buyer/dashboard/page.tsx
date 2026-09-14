'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, Button, Alert } from '@/components/ui'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase/client'
import Link from 'next/link'
import { DemandForecast, RouteOptimization } from '@/components/ai'
import { DemoGuide } from '@/components/shared'

export default function BuyerDashboardPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<'overview' | 'forecast' | 'logistics'>('overview')
  const [stats, setStats] = useState({
    totalSavings: 0,
    totalOrders: 0,
    activeOrders: 0,
    totalSpent: 0,
  })
  const [recentOrders, setRecentOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (user) {
      fetchBuyerData()
    }
  }, [user])

  const fetchBuyerData = async () => {
    try {
      setLoading(true)
      
      // Mock data for demo
      setStats({
        totalSavings: 45000,
        totalOrders: 30,
        activeOrders: 3,
        totalSpent: 285000,
      })

      setRecentOrders([
        {
          id: 'ORD-001',
          products: 'Tomatoes, Onions',
          total_amount: 19500,
          status: 'delivered',
          savings: 3300,
          created_at: '2026-09-13',
        },
        {
          id: 'ORD-002',
          products: 'Potatoes, Carrots',
          total_amount: 12500,
          status: 'processing',
          savings: 2100,
          created_at: '2026-09-12',
        },
        {
          id: 'ORD-003',
          products: 'Tomatoes',
          total_amount: 6600,
          status: 'confirmed',
          savings: 1100,
          created_at: '2026-09-11',
        },
      ])
    } catch (error) {
      console.error('Error fetching buyer data:', error)
      setError('Failed to load dashboard data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary"></div>
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
      <DemoGuide />
      {/* AI Features Tabs */}
      <div className="flex space-x-2 mb-6">
        <Button
          variant={activeTab === 'overview' ? 'secondary' : 'outline'}
          size="sm"
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </Button>
        <Button
          variant={activeTab === 'forecast' ? 'secondary' : 'outline'}
          size="sm"
          onClick={() => setActiveTab('forecast')}
        >
          Demand Forecast
        </Button>
        <Button
          variant={activeTab === 'logistics' ? 'secondary' : 'outline'}
          size="sm"
          onClick={() => setActiveTab('logistics')}
        >
          Route Optimization
        </Button>
      </div>

      {activeTab === 'overview' && (
        <>
          {/* Demo Scenario Card */}
          <Card>
            <CardHeader>
              <CardTitle>🎯 Demo Scenario</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-3">
                Try the complete demo scenario:
              </p>
              <ol className="space-y-2 text-sm text-gray-600">
                <li>1. Click <strong>Demand Forecast</strong> → Select "Tomatoes" → See AI predictions</li>
                <li>2. Click <strong>Route Optimization</strong> → Load Demo Data → See optimized delivery</li>
                <li>3. Click <strong>AI Matching</strong> → Search for 800kg Tomatoes → See supplier combinations</li>
              </ol>
            </CardContent>
          </Card>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-gray-600">Total Savings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-secondary">₹{stats.totalSavings.toLocaleString()}</div>
                <p className="text-xs text-gray-500 mt-1">Via direct sourcing</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-gray-600">Total Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">{stats.totalOrders}</div>
                <p className="text-xs text-gray-500 mt-1">All time orders</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-gray-600">Active Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-accent">{stats.activeOrders}</div>
                <p className="text-xs text-gray-500 mt-1">In progress</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-gray-600">Total Spent</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">₹{stats.totalSpent.toLocaleString()}</div>
                <p className="text-xs text-gray-500 mt-1">Total purchases</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Link href="/buyer/matching">
                  <Button variant="secondary" className="w-full">
                    AI Matching
                  </Button>
                </Link>
                <Link href="/marketplace">
                  <Button variant="primary" className="w-full">
                    Browse Marketplace
                  </Button>
                </Link>
                <Link href="/buyer/orders">
                  <Button variant="outline" className="w-full">
                    View Orders
                  </Button>
                </Link>
                <Link href="/buyer/profile">
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
                        <p className="font-medium">{order.products}</p>
                        <p className="text-sm text-gray-600">₹{order.total_amount.toLocaleString()} • Saved ₹{order.savings.toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                          order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                          order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'confirmed' ? 'bg-yellow-100 text-yellow-800' :
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

          {/* Platform Impact */}
          <Card>
            <CardHeader>
              <CardTitle>Your Impact</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">₹{stats.totalSavings.toLocaleString()}</div>
                  <p className="text-sm text-gray-600">Money Saved</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-secondary mb-2">{stats.totalOrders * 2}</div>
                  <p className="text-sm text-gray-600">Intermediaries Avoided</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">{stats.totalOrders * 15}%</div>
                  <p className="text-sm text-gray-600">Average Cost Reduction</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {activeTab === 'forecast' && (
        <DemandForecast showFullUI={true} />
      )}

      {activeTab === 'logistics' && (
        <RouteOptimization showFullUI={true} />
      )}
    </div>
  )
}