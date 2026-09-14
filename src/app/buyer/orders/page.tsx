'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, Badge, Table, TableRow, TableCell, Button, Alert } from '@/components/ui'
import { useAuth } from '@/hooks/useAuth'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { Order, OrderStatus, isCancellable } from '@/types/orders'

export default function BuyerOrdersPage() {
  const { user } = useAuth()
  const { userId } = useCurrentUser()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<OrderStatus | 'all'>('all')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(null)

  useEffect(() => {
    if (userId) {
      fetchOrders()
    }
  }, [userId])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      setError('')
      
      const response = await fetch(`/api/orders?buyer_id=${userId}`)
      
      if (response.ok) {
        const data = await response.json()
        setOrders(data)
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch orders')
      }
    } catch (err: any) {
      console.error('Error fetching orders:', err)
      setError(err.message)
      // Set demo data as fallback
      setOrders([
        {
          id: 'ORD-001',
          buyer_id: 'buyer1',
          buyer_name: 'Amit Sharma',
          status: 'delivered',
          total_amount: 19500,
          logistics_cost: 1200,
          logistics_savings: 800,
          intermediary_savings: 3300,
          delivery_address: 'Market Area, Thane',
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
      ])
    } finally {
      setLoading(false)
    }
  }

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true
    return order.status === filter
  })

  const cancelOrder = async (orderId: string) => {
    if (!confirm('Are you sure you want to cancel this order?')) return
    
    try {
      setCancellingOrderId(orderId)
      const response = await fetch('/api/orders/update-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_id: orderId,
          status: 'cancelled',
        }),
      })

      if (response.ok) {
        setSuccess('Order cancelled successfully')
        setError('')
        await fetchOrders()
      } else {
        const errorData = await response.json()
        setError(`Failed to cancel order: ${errorData.error}`)
        setSuccess('')
      }
    } catch (error) {
      console.error('Error cancelling order:', error)
      setError('Failed to cancel order. Please try again.')
      setSuccess('')
    } finally {
      setCancellingOrderId(null)
    }
  }

  const formatItems = (items: any[]) => {
    return items.map(item => `${item.quantity} ${item.unit} ${item.product_name}`).join(', ')
  }

  const formatFarmers = (items: any[]) => {
    const farmers = [...new Set(items.map(item => item.farmer_name))]
    return farmers.join(', ')
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
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">My Orders</h2>
        <p className="text-gray-600">Track and manage your orders</p>
      </div>

      {error && (
        <Alert type="error" onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert type="success" onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-2">
            {(['all', 'pending', 'confirmed', 'processing', 'ready_for_pickup', 'shipped', 'delivered', 'cancelled'] as const).map(status => (
              <Button
                key={status}
                variant={filter === status ? 'secondary' : 'outline'}
                size="sm"
                onClick={() => setFilter(status)}
              >
                {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Order History</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredOrders.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No orders found</p>
          ) : (
            <Table
              headers={['Order ID', 'Total Amount', 'Savings', 'Status', 'Date', 'Actions']}
            >
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>₹{order.total_amount.toLocaleString()}</TableCell>
                  <TableCell className="text-green-600 font-semibold">₹{order.intermediary_savings.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant={
                      order.status === 'delivered' ? 'success' :
                      order.status === 'cancelled' || order.status === 'rejected' ? 'danger' :
                      order.status === 'pending' ? 'warning' :
                      'info'
                    }>
                      {order.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    {isCancellable(order.status) && (
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => cancelOrder(order.id)}
                        disabled={cancellingOrderId === order.id}
                      >
                        {cancellingOrderId === order.id ? 'Cancelling...' : 'Cancel'}
                      </Button>
                    )}
                    {order.status === 'delivered' && (
                      <Button variant="primary" size="sm">
                        Reorder
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Order Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-secondary">{orders.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">Total Spent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">
              ₹{orders.reduce((sum, order) => sum + order.total_amount, 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">Total Savings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              ₹{orders.reduce((sum, order) => sum + order.intermediary_savings, 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">Avg Savings/Order</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-accent">
              ₹{orders.length > 0 ? Math.round(orders.reduce((sum, order) => sum + order.intermediary_savings, 0) / orders.length).toLocaleString() : 0}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}