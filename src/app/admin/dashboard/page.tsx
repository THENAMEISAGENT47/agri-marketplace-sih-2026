'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, Table, TableRow, TableCell, Badge, Button, Alert } from '@/components/ui'
import { demoAdminStats, demoUsers, demoFarmers, orderStatusDistribution, recentActivity } from '@/lib/demo/admin'

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(demoAdminStats)
  const [users, setUsers] = useState(demoUsers)
  const [farmers, setFarmers] = useState(demoFarmers)
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'farmers' | 'activity'>('overview')
  const [loading, setLoading] = useState(false)
  const [resetMessage, setResetMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error'>('success')

  const handleVerifyFarmer = async (farmerId: string, status: 'verified' | 'rejected') => {
    try {
      // Update local state for demo
      setFarmers(farmers.map(f => 
        f.id === farmerId ? { ...f, verification_status: status } : f
      ))
    } catch (error) {
      console.error('Error updating farmer verification:', error)
    }
  }

  const handleBanUser = async (userId: string) => {
    if (!confirm('Are you sure you want to ban this user?')) return
    
    try {
      // Update local state for demo
      setUsers(users.filter(u => u.id !== userId))
    } catch (error) {
      console.error('Error banning user:', error)
    }
  }

  const handleResetDemo = async () => {
    if (!confirm('Are you sure you want to reset all demo data to initial state? This will clear all orders, notifications, and changes made during the demo.')) return
    
    try {
      setLoading(true)
      const response = await fetch('/api/demo/reset', {
        method: 'POST',
      })
      
      if (response.ok) {
        const result = await response.json()
        setResetMessage('Demo data reset successfully! Please refresh the page to see changes.')
        setMessageType('success')
        setTimeout(() => setResetMessage(''), 3000)
      } else {
        throw new Error('Failed to reset demo data')
      }
    } catch (error) {
      console.error('Error resetting demo data:', error)
      setResetMessage('Failed to reset demo data. Please try again.')
      setMessageType('error')
    } finally {
      setLoading(false)
    }
  }

  const handleSetupSIHDemo = async () => {
    if (!confirm('Setup the complete 800kg tomato SIH demo scenario? This will create the optimal multi-supplier order (Ramesh Kumar: 500kg + Suresh FPO: 300kg = ₹19,100).')) return
    
    try {
      setLoading(true)
      const response = await fetch('/api/demo/sih-scenario', {
        method: 'POST',
      })
      
      if (response.ok) {
        const result = await response.json()
        setResetMessage(`SIH Demo setup complete! Order ID: ${result.order.id}. Total: ₹${result.order.total_amount.toLocaleString()}`)
        setMessageType('success')
        setTimeout(() => setResetMessage(''), 5000)
      } else {
        throw new Error('Failed to setup SIH demo')
      }
    } catch (error) {
      console.error('Error setting up SIH demo:', error)
      setResetMessage('Failed to setup SIH demo. Please try again.')
      setMessageType('error')
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
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Admin Dashboard</h2>
          <p className="text-gray-600">Platform overview and management</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={handleSetupSIHDemo}
            disabled={loading}
          >
            {loading ? 'Setting up...' : '🍅 Setup SIH Demo'}
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={handleResetDemo}
            disabled={loading}
          >
            {loading ? 'Resetting...' : 'Reset Demo Data'}
          </Button>
        </div>
      </div>

      {resetMessage && (
        <Alert type={messageType} onClose={() => setResetMessage('')}>
          {resetMessage}
        </Alert>
      )}

      {/* Tabs */}
      <div className="flex space-x-2">
        <Button
          variant={activeTab === 'overview' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </Button>
        <Button
          variant={activeTab === 'users' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setActiveTab('users')}
        >
          Users
        </Button>
        <Button
          variant={activeTab === 'farmers' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setActiveTab('farmers')}
        >
          Farmers
        </Button>
        <Button
          variant={activeTab === 'activity' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setActiveTab('activity')}
        >
          Activity
        </Button>
      </div>

      {activeTab === 'overview' && (
        <>
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-gray-600">Total Farmers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">{stats.totalFarmers}</div>
                <p className="text-xs text-gray-500 mt-1">Registered farmers</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-gray-600">Total Buyers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-secondary">{stats.totalBuyers}</div>
                <p className="text-xs text-gray-500 mt-1">Registered buyers</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-gray-600">Total Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-accent">{stats.totalOrders}</div>
                <p className="text-xs text-gray-500 mt-1">All time orders</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-gray-600">Transaction Value</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">₹{stats.totalTransactionValue.toLocaleString()}</div>
                <p className="text-xs text-gray-500 mt-1">Total volume</p>
              </CardContent>
            </Card>
          </div>

          {/* Order Status */}
          <Card>
            <CardHeader>
              <CardTitle>Order Status Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orderStatusDistribution.map((item) => {
                  const maxCount = Math.max(...orderStatusDistribution.map(d => d.count))
                  const percentage = maxCount > 0 ? (item.count / maxCount) * 100 : 0
                  return (
                    <div key={item.status} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Badge variant={item.color as any}>
                            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                          </Badge>
                          <span className="text-sm">{item.status.replace('_', ' ')}</span>
                        </div>
                        <span className="font-semibold">{item.count}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            item.color === 'success' ? 'bg-green-500' :
                            item.color === 'warning' ? 'bg-yellow-500' :
                            item.color === 'danger' ? 'bg-red-500' :
                            item.color === 'info' ? 'bg-blue-500' :
                            'bg-gray-500'
                          }`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Platform Impact */}
          <Card>
            <CardHeader>
              <CardTitle>Platform Impact</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">₹{stats.totalFarmerEarnings.toLocaleString()}</div>
                  <p className="text-sm text-gray-600">Farmer Earnings</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-secondary mb-2">₹{stats.totalBuyerSavings.toLocaleString()}</div>
                  <p className="text-sm text-gray-600">Buyer Savings</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">₹{stats.totalLogisticsSavings.toLocaleString()}</div>
                  <p className="text-sm text-gray-600">Logistics Savings</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent mb-2">{stats.intermediariesAvoided}</div>
                  <p className="text-sm text-gray-600">Intermediaries Avoided</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      activity.type === 'order' ? 'bg-primary' :
                      activity.type === 'verification' ? 'bg-warning' :
                      'bg-secondary'
                    }`} />
                    <div className="flex-1">
                      <p className="text-sm text-gray-700">{activity.message}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(activity.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {activeTab === 'users' && (
        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
          </CardHeader>
          <CardContent>
            <Table
              headers={['Email', 'Role', 'Verified', 'Created', 'Actions']}
            >
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={user.role === 'admin' ? 'info' : 'info'}>
                      {user.role.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.is_verified ? 'success' : 'warning'}>
                      {user.is_verified ? 'Verified' : 'Pending'}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    {user.role !== 'admin' && (
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleBanUser(user.id)}
                      >
                        Ban
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </Table>
          </CardContent>
        </Card>
      )}

      {activeTab === 'farmers' && (
        <Card>
          <CardHeader>
            <CardTitle>Farmer Verification</CardTitle>
          </CardHeader>
          <CardContent>
            <Table
              headers={['Name', 'Type', 'Earnings', 'Rating', 'Orders', 'Status', 'Actions']}
            >
              {farmers.map((farmer) => (
                <TableRow key={farmer.id}>
                  <TableCell>{farmer.name}</TableCell>
                  <TableCell>
                    <Badge variant={farmer.type === 'fpo' ? 'info' : 'info'}>
                      {farmer.type.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>₹{farmer.total_earnings.toLocaleString()}</TableCell>
                  <TableCell>{farmer.rating.toFixed(1)}/5</TableCell>
                  <TableCell>{farmer.total_orders}</TableCell>
                  <TableCell>
                    <Badge variant={
                      farmer.verification_status === 'verified' ? 'success' :
                      farmer.verification_status === 'rejected' ? 'danger' :
                      'warning'
                    }>
                      {farmer.verification_status.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {farmer.verification_status === 'pending' && (
                      <div className="flex gap-2">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleVerifyFarmer(farmer.id, 'verified')}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleVerifyFarmer(farmer.id, 'rejected')}
                        >
                          Reject
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </Table>
          </CardContent>
        </Card>
      )}

      {activeTab === 'activity' && (
        <Card>
          <CardHeader>
            <CardTitle>Platform Activity Log</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-4 p-4 border border-border rounded">
                  <div className={`w-3 h-3 rounded-full mt-1 ${
                    activity.type === 'order' ? 'bg-primary' :
                    activity.type === 'verification' ? 'bg-warning' :
                    'bg-secondary'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(activity.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}