'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, Badge, Table, TableRow, TableCell, Button, Alert } from '@/components/ui'
import { useAuth } from '@/hooks/useAuth'
import { useCurrentUser, useFarmerId } from '@/hooks/useCurrentUser'
import { Order, OrderStatus, canTransitionTo } from '@/types/orders'

export default function FarmerOrdersPage() {
  const { user } = useAuth()
  const { userId } = useCurrentUser()
  const farmerId = useFarmerId()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<OrderStatus | 'all'>('all')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null)

  useEffect(() => {
    if (farmerId) {
      fetchOrders()
    }
  }, [farmerId])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      setError('')
      
      // Use farmer_id for filtering orders assigned to this farmer
      const response = await fetch(`/api/orders?farmer_id=${farmerId}`)
      
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

  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      setUpdatingOrderId(orderId)
      const response = await fetch('/api/orders/update-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_id: orderId,
          status: newStatus,
        }),
      })

      if (response.ok) {
        setSuccess('Order status updated successfully')
        setError('')
        // Refresh orders
        await fetchOrders()
      } else {
        const errorData = await response.json()
        setError(`Failed to update status: ${errorData.error}`)
        setSuccess('')
      }
    } catch (error) {
      console.error('Error updating order status:', error)
      setError('Failed to update order status. Please try again.')
      setSuccess('')
    } finally {
      setUpdatingOrderId(null)
    }
  }

  const getStatusActions = (status: OrderStatus, orderId: string) => {
    const actions: { label: string; status: OrderStatus }[] = []

    if (status === 'pending') {
      actions.push({ label: 'Confirm', status: 'confirmed' })
      actions.push({ label: 'Reject', status: 'rejected' })
    } else if (status === 'confirmed') {
      actions.push({ label: 'Start Processing', status: 'processing' })
      actions.push({ label: 'Cancel', status: 'cancelled' })
    } else if (status === 'processing') {
      actions.push({ label: 'Ready for Pickup', status: 'ready_for_pickup' })
    } else if (status === 'ready_for_pickup') {
      actions.push({ label: 'Ship', status: 'shipped' })
    } else if (status === 'shipped') {
      actions.push({ label: 'Mark Delivered', status: 'delivered' })
    }

    return actions
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
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Orders</h2>
        <p className="text-gray-600">Manage your orders and deliveries</p>
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
            {(['all', 'pending', 'confirmed', 'processing', 'ready_for_pickup', 'shipped', 'delivered'] as const).map(status => (
              <Button
                key={status}
                variant={filter === status ? 'primary' : 'outline'}
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
              headers={['Order ID', 'Buyer', 'Total', 'Status', 'Date', 'Actions']}
            >
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>{order.buyer_name}</TableCell>
                  <TableCell>₹{order.total_amount.toLocaleString()}</TableCell>
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
                    <div className="flex gap-2">
                      {getStatusActions(order.status, order.id).map((action) => (
                        <Button
                          key={action.status}
                          variant="outline"
                          size="sm"
                          onClick={() => updateOrderStatus(order.id, action.status)}
                          disabled={updatingOrderId === order.id}
                        >
                          {updatingOrderId === order.id ? 'Updating...' : action.label}
                        </Button>
                      ))}
                    </div>
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
            <div className="text-3xl font-bold text-primary">{orders.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-warning">
              {orders.filter(o => o.status === 'pending').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-accent">
              {orders.filter(o => ['confirmed', 'processing', 'ready_for_pickup', 'shipped'].includes(o.status)).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-success">
              {orders.filter(o => o.status === 'delivered').length}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}