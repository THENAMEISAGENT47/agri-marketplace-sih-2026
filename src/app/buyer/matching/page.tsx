'use client'

import { useState } from 'react'
import { MatchingSearch } from '@/components/marketplace/matching-search'
import { Card, CardContent, CardHeader, CardTitle, Alert } from '@/components/ui'

export default function BuyerMatchingPage() {
  const [selectedItems, setSelectedItems] = useState<any[]>([])
  const [showAlert, setShowAlert] = useState(false)

  const handleOrderPlacement = (combination: any[]) => {
    setSelectedItems(combination)
    setShowAlert(true)
    
    // In a real implementation, this would create an order
    console.log('Order placement with combination:', combination)
    
    // Reset after 3 seconds
    setTimeout(() => {
      setShowAlert(false)
      setSelectedItems([])
    }, 3000)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">AI Supplier Matching</h2>
        <p className="text-gray-600">Find the best suppliers for your requirements using our AI-powered matching system</p>
      </div>

      {/* Demo Scenario Info */}
      <Card>
        <CardHeader>
          <CardTitle>Demo Scenario</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 mb-2">
            Try searching for <strong>800kg of Tomatoes</strong> to see the matching engine in action.
          </p>
          <p className="text-sm text-gray-600">
            The system will find the best combination of suppliers (Ramesh Kumar: 500kg + Suresh FPO: 300kg)
            and calculate the optimal cost and logistics.
          </p>
        </CardContent>
      </Card>

      {showAlert && (
        <Alert type="success" onClose={() => setShowAlert(false)}>
          Order placed successfully with {selectedItems.length} supplier(s)!
        </Alert>
      )}

      {/* Matching Search */}
      <MatchingSearch
        onOrderPlacement={handleOrderPlacement}
        showFullResults={true}
      />
    </div>
  )
}