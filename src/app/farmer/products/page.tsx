'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, Button, Badge, Modal, Input, Select, Alert } from '@/components/ui'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase/client'
import Link from 'next/link'

export default function FarmerProductsPage() {
  const { user } = useAuth()
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (user) {
      fetchProducts()
    }
  }, [user])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      
      // For demo, use mock data since we don't have real farmer IDs yet
      const mockProducts = [
        {
          id: '1',
          name: 'Tomatoes',
          variety: 'Roma',
          quantity: 500,
          unit: 'kg',
          price_per_unit: 25,
          harvest_date: '2026-09-10',
          availability_date: '2026-09-13',
          is_available: true,
          quality_grade: 'A',
        },
        {
          id: '2',
          name: 'Onions',
          variety: 'Red',
          quantity: 400,
          unit: 'kg',
          price_per_unit: 18,
          harvest_date: '2026-09-08',
          availability_date: '2026-09-13',
          is_available: true,
          quality_grade: 'A',
        },
      ]
      
      setProducts(mockProducts)
    } catch (error) {
      console.error('Error fetching products:', error)
      setError('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  const toggleAvailability = async (productId: string, currentStatus: boolean) => {
    try {
      // Mock toggle for now
      setProducts(products.map(p => 
        p.id === productId ? { ...p, is_available: !currentStatus } : p
      ))
      setSuccess('Product availability updated')
      setTimeout(() => setSuccess(''), 3000)
    } catch (error) {
      setError('Failed to update product')
    }
  }

  const deleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return
    
    try {
      // Mock delete for now
      setProducts(products.filter(p => p.id !== productId))
      setSuccess('Product deleted successfully')
      setTimeout(() => setSuccess(''), 3000)
    } catch (error) {
      setError('Failed to delete product')
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
          <h2 className="text-2xl font-bold text-gray-900">My Products</h2>
          <p className="text-gray-600">Manage your product listings</p>
        </div>
        <Button variant="primary" onClick={() => setShowAddModal(true)}>
          Add New Product
        </Button>
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

      {/* Products Grid */}
      {products.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-500 mb-4">You haven't listed any products yet</p>
            <Button variant="primary" onClick={() => setShowAddModal(true)}>
              Add Your First Product
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle>{product.name}</CardTitle>
                  <Badge variant={product.is_available ? 'success' : 'warning'}>
                    {product.is_available ? 'Available' : 'Unavailable'}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">{product.variety}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Quantity:</span>
                    <span className="font-semibold">{product.quantity} {product.unit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Price:</span>
                    <span className="font-semibold text-primary">₹{product.price_per_unit}/{product.unit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Grade:</span>
                    <Badge variant={product.quality_grade === 'A' ? 'success' : 'warning'}>
                      Grade {product.quality_grade}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Harvested:</span>
                    <span className="text-sm">{product.harvest_date}</span>
                  </div>
                  <div className="pt-4 space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => toggleAvailability(product.id, product.is_available)}
                    >
                      {product.is_available ? 'Mark Unavailable' : 'Mark Available'}
                    </Button>
                    <div className="flex space-x-2">
                      <Button variant="secondary" size="sm" className="flex-1">
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        className="flex-1"
                        onClick={() => deleteProduct(product.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add Product Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Product"
        size="lg"
      >
        <AddProductForm
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false)
            fetchProducts()
            setSuccess('Product added successfully')
            setTimeout(() => setSuccess(''), 3000)
          }}
        />
      </Modal>
    </div>
  )
}

function AddProductForm({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    name: '',
    variety: '',
    quantity: '',
    unit: 'kg',
    price_per_unit: '',
    harvest_date: '',
    availability_date: '',
    quality_grade: 'A',
    description: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Mock submission for now
      console.log('Adding product:', formData)
      onSuccess()
    } catch (err: any) {
      setError(err.message || 'Failed to add product')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <Alert type="error">{error}</Alert>}
      
      <Input
        label="Product Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        placeholder="e.g., Tomatoes"
        required
      />
      
      <Input
        label="Variety"
        value={formData.variety}
        onChange={(e) => setFormData({ ...formData, variety: e.target.value })}
        placeholder="e.g., Roma"
        required
      />
      
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Quantity"
          type="number"
          value={formData.quantity}
          onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
          placeholder="500"
          required
        />
        <Select
          label="Unit"
          value={formData.unit}
          onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
          options={[
            { value: 'kg', label: 'Kilograms (kg)' },
            { value: 'quintal', label: 'Quintal' },
            { value: 'tonne', label: 'Tonne' },
            { value: 'pieces', label: 'Pieces' },
            { value: 'dozen', label: 'Dozen' },
          ]}
          required
        />
      </div>
      
      <Input
        label="Price per Unit (₹)"
        type="number"
        value={formData.price_per_unit}
        onChange={(e) => setFormData({ ...formData, price_per_unit: e.target.value })}
        placeholder="25"
        required
      />
      
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Harvest Date"
          type="date"
          value={formData.harvest_date}
          onChange={(e) => setFormData({ ...formData, harvest_date: e.target.value })}
          required
        />
        <Input
          label="Availability Date"
          type="date"
          value={formData.availability_date}
          onChange={(e) => setFormData({ ...formData, availability_date: e.target.value })}
          required
        />
      </div>
      
      <Select
        label="Quality Grade"
        value={formData.quality_grade}
        onChange={(e) => setFormData({ ...formData, quality_grade: e.target.value })}
        options={[
          { value: 'A', label: 'Grade A (Premium)' },
          { value: 'B', label: 'Grade B (Good)' },
          { value: 'C', label: 'Grade C (Standard)' },
        ]}
        required
      />
      
      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" isLoading={loading}>
          Add Product
        </Button>
      </div>
    </form>
  )
}