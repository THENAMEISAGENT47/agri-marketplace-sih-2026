'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Badge, LoadingSpinner, Alert } from '@/components/ui'
import { MatchingSearch } from '@/components/marketplace/matching-search'
import { DemoModeIndicator } from '@/components/shared/demo-mode-indicator'
import { useCurrentUser } from '@/hooks/useCurrentUser'

// Mock data for demo - will be replaced with real data from Supabase
const mockProducts = [
  {
    id: 'prod1',
    name: 'Tomatoes',
    variety: 'Roma',
    quantity: 500,
    unit: 'kg',
    price_per_unit: 25,
    farmer_name: 'Ramesh Kumar',
    farmer_id: 'farmer1',
    farmer_location: 'Nashik, Maharashtra',
    quality_grade: 'A',
    harvest_date: '2026-09-10',
    availability_date: '2026-09-13',
  },
  {
    id: 'prod2',
    name: 'Tomatoes',
    variety: 'Hybrid',
    quantity: 300,
    unit: 'kg',
    price_per_unit: 22,
    farmer_name: 'Suresh FPO',
    farmer_id: 'farmer2',
    farmer_location: 'Nashik, Maharashtra',
    quality_grade: 'A',
    harvest_date: '2026-09-11',
    availability_date: '2026-09-13',
  },
  {
    id: 'prod3',
    name: 'Tomatoes',
    variety: 'Cherry',
    quantity: 200,
    unit: 'kg',
    price_per_unit: 35,
    farmer_name: 'Priya Singh',
    farmer_id: 'farmer3',
    farmer_location: 'Pune, Maharashtra',
    quality_grade: 'A',
    harvest_date: '2026-09-12',
    availability_date: '2026-09-14',
  },
  {
    id: 'prod4',
    name: 'Onions',
    variety: 'Red',
    quantity: 400,
    unit: 'kg',
    price_per_unit: 18,
    farmer_name: 'Ramesh Kumar',
    farmer_id: 'farmer1',
    farmer_location: 'Nashik, Maharashtra',
    quality_grade: 'A',
    harvest_date: '2026-09-08',
    availability_date: '2026-09-13',
  },
  {
    id: 'prod5',
    name: 'Potatoes',
    variety: 'Jyoti',
    quantity: 600,
    unit: 'kg',
    price_per_unit: 15,
    farmer_name: 'Suresh FPO',
    farmer_id: 'farmer2',
    farmer_location: 'Nashik, Maharashtra',
    quality_grade: 'A',
    harvest_date: '2026-09-09',
    availability_date: '2026-09-13',
  },
  {
    id: 'prod6',
    name: 'Carrots',
    variety: 'Local',
    quantity: 250,
    unit: 'kg',
    price_per_unit: 30,
    farmer_name: 'Priya Singh',
    farmer_id: 'farmer3',
    farmer_location: 'Pune, Maharashtra',
    quality_grade: 'B',
    harvest_date: '2026-09-10',
    availability_date: '2026-09-13',
  },
]

export default function MarketplacePage() {
  const { userId, email, isDemoMode } = useCurrentUser()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showMatching, setShowMatching] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isInventoryLoading, setIsInventoryLoading] = useState(true)
  const [inventory, setInventory] = useState<Record<string, number>>({})
  const [orderError, setOrderError] = useState('')
  const [orderSuccess, setOrderSuccess] = useState('')

  useEffect(() => {
    fetchInventory()
  }, [])

  const fetchInventory = async () => {
    try {
      setIsInventoryLoading(true)
      const response = await fetch('/api/inventory')
      if (response.ok) {
        const data = await response.json()
        const inventoryMap: Record<string, number> = {}
        data.forEach((item: any) => {
          const key = `${item.product_id}_${item.farmer_id}`
          inventoryMap[key] = item.quantity || item.available_quantity
        })
        setInventory(inventoryMap)
      }
    } catch (error) {
      console.error('Error fetching inventory:', error)
    } finally {
      setIsInventoryLoading(false)
    }
  }

  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.variety.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || product.name.toLowerCase() === selectedCategory.toLowerCase()
    return matchesSearch && matchesCategory
  })

  const categories = ['all', ...Array.from(new Set(mockProducts.map(p => p.name)))]

  const handleOrder = async (productId: string, farmerId: string) => {
    try {
      setOrderError('')
      const product = mockProducts.find(p => p.id === productId)
      if (!product) return

      const inventoryKey = `${productId}_${farmerId}`
      const availableStock = inventory[inventoryKey] || product.quantity

      if (availableStock <= 0) {
        setOrderError('This product is out of stock')
        return
      }

      const response = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          buyer_id: userId, // Use current user ID (falls back to demo ID)
          items: [{
            product_id: productId,
            farmer_id: farmerId,
            quantity: availableStock, // Order full available stock
            price_per_unit: product.price_per_unit,
          }],
          delivery_address: 'Market Area, Thane',
          delivery_lat: 19.033,
          delivery_lng: 73.0297,
        }),
      })

      if (response.ok) {
        const order = await response.json()
        setOrderSuccess(`Order created successfully! Order ID: ${order.id}`)
        setOrderError('')
        // Refresh inventory
        await fetchInventory()
      } else {
        const error = await response.json()
        setOrderError(`Failed to create order: ${error.error}`)
        setOrderSuccess('')
      }
    } catch (error) {
      console.error('Order error:', error)
      setOrderError('Failed to create order. Please try again.')
    }
  }

  const handleOrderPlacement = (combination: any[]) => {
    console.log('Placing order with combination:', combination)
    // TODO: Implement actual order placement
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DemoModeIndicator />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Marketplace</h1>
          <p className="text-gray-600">Browse fresh produce directly from farmers</p>
        </div>

        {/* View Toggle */}
        <div className="mb-6">
          <div className="flex space-x-2">
            <Button
              variant={!showMatching ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setShowMatching(false)}
            >
              Browse Products
            </Button>
            <Button
              variant={showMatching ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setShowMatching(true)}
            >
              AI Supplier Matching
            </Button>
          </div>
        </div>

        {/* AI Matching Search */}
        {showMatching && (
          <MatchingSearch
            onOrderPlacement={handleOrderPlacement}
            showFullResults={true}
          />
        )}

        {/* Regular Product Browse */}
        {!showMatching && (
          <>
            {/* Search and Filters */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              {orderError && (
                <Alert type="error" onClose={() => setOrderError('')} className="mb-4">
                  {orderError}
                </Alert>
              )}
              {orderSuccess && (
                <Alert type="success" onClose={() => setOrderSuccess('')} className="mb-4">
                  {orderSuccess}
                </Alert>
              )}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search products or varieties..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="md:w-64">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white text-foreground"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category === 'all' ? 'All Categories' : category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {isInventoryLoading ? (
              <div className="flex justify-center items-center py-12">
                <LoadingSpinner size="lg" />
                <p className="ml-3 text-gray-600">Loading inventory...</p>
              </div>
            ) : isLoading ? (
              <div className="flex justify-center items-center py-12">
                <LoadingSpinner size="lg" />
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No products found matching your search.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map(product => {
                  const inventoryKey = `${product.id}_${product.farmer_id}`
                  const availableStock = inventory[inventoryKey] || product.quantity
                  const isOutOfStock = availableStock <= 0

                  return (
                    <Card key={product.id} className={`hover:shadow-lg transition-shadow ${isOutOfStock ? 'opacity-60' : ''}`}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-xl">{product.name}</CardTitle>
                            <p className="text-sm text-gray-500 font-medium">{product.variety}</p>
                          </div>
                          <Badge variant={product.quality_grade === 'A' ? 'success' : 'warning'}>
                            Grade {product.quality_grade}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {/* Key Information - Prominent */}
                          <div className="grid grid-cols-2 gap-3 p-3 bg-gray-50 rounded-lg">
                            <div>
                              <p className="text-xs text-gray-500 uppercase tracking-wide">Stock</p>
                              <p className={`text-lg font-bold ${isOutOfStock ? 'text-red-600' : 'text-green-600'}`}>
                                {availableStock} {product.unit}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 uppercase tracking-wide">Price</p>
                              <p className="text-lg font-bold text-primary">
                                ₹{product.price_per_unit}/{product.unit}
                              </p>
                            </div>
                          </div>

                          {/* Secondary Information - Smaller */}
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between text-gray-600">
                              <span>Farmer:</span>
                              <span className="font-medium text-gray-900">{product.farmer_name}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                              <span>Location:</span>
                              <span>{product.farmer_location}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                              <span>Harvested:</span>
                              <span>{product.harvest_date}</span>
                            </div>
                          </div>

                          <div className="pt-2">
                            <Button
                              variant={isOutOfStock ? 'outline' : 'primary'}
                              className="w-full"
                              onClick={() => handleOrder(product.id, product.farmer_id)}
                              disabled={isOutOfStock}
                            >
                              {isOutOfStock ? 'Out of Stock' : 'Place Order'}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}