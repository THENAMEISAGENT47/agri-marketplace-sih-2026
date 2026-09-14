// Demo inventory data for products
export interface ProductInventory {
  product_id: string
  farmer_id: string
  product_name: string
  product_variety: string
  available_quantity: number
  unit: string
  price_per_unit: number
}

export let demoInventory: ProductInventory[] = [
  {
    product_id: 'prod1',
    farmer_id: 'farmer1',
    product_name: 'Tomatoes',
    product_variety: 'Roma',
    available_quantity: 500,
    unit: 'kg',
    price_per_unit: 25,
  },
  {
    product_id: 'prod2',
    farmer_id: 'farmer2',
    product_name: 'Tomatoes',
    product_variety: 'Hybrid',
    available_quantity: 300,
    unit: 'kg',
    price_per_unit: 22,
  },
  {
    product_id: 'prod3',
    farmer_id: 'farmer3',
    product_name: 'Tomatoes',
    product_variety: 'Cherry',
    available_quantity: 200,
    unit: 'kg',
    price_per_unit: 35,
  },
  {
    product_id: 'prod4',
    farmer_id: 'farmer1',
    product_name: 'Onions',
    product_variety: 'Red',
    available_quantity: 400,
    unit: 'kg',
    price_per_unit: 18,
  },
  {
    product_id: 'prod5',
    farmer_id: 'farmer2',
    product_name: 'Potatoes',
    product_variety: 'Jyoti',
    available_quantity: 600,
    unit: 'kg',
    price_per_unit: 15,
  },
  {
    product_id: 'prod6',
    farmer_id: 'farmer3',
    product_name: 'Carrots',
    product_variety: 'Local',
    available_quantity: 250,
    unit: 'kg',
    price_per_unit: 30,
  },
]

export function getInventory(productId: string, farmerId: string): ProductInventory | undefined {
  return demoInventory.find(
    item => item.product_id === productId && item.farmer_id === farmerId
  )
}

export function checkAvailability(productId: string, farmerId: string, quantity: number): boolean {
  const item = getInventory(productId, farmerId)
  if (!item) return false
  return item.available_quantity >= quantity
}

export function decrementInventory(productId: string, farmerId: string, quantity: number): boolean {
  const item = getInventory(productId, farmerId)
  if (!item) return false
  if (item.available_quantity < quantity) return false
  
  item.available_quantity -= quantity
  return true
}

export function incrementInventory(productId: string, farmerId: string, quantity: number): boolean {
  const item = getInventory(productId, farmerId)
  if (!item) return false
  
  item.available_quantity += quantity
  return true
}

export function getFarmerInventory(farmerId: string): ProductInventory[] {
  return demoInventory.filter(item => item.farmer_id === farmerId)
}

export function getProductInventory(productId: string): ProductInventory[] {
  return demoInventory.filter(item => item.product_id === productId)
}