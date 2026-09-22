// Demo inventory data for products
export interface ProductInventory {
  product_id: string
  farmer_id: string
  product_name: string
  product_variety: string
  available_quantity: number
  unit: string
  price_per_unit: number
  category: string
  harvest_date?: string
  availability_date?: string
  is_available?: boolean
  quality_grade?: string
}

export const demoInventory: ProductInventory[] = [
  {
    product_id: 'prod1',
    farmer_id: 'farmer1',
    product_name: 'Tomatoes',
    product_variety: 'Roma',
    available_quantity: 500,
    unit: 'kg',
    price_per_unit: 25,
    category: 'Vegetables',
  },
  {
    product_id: 'prod2',
    farmer_id: 'farmer2',
    product_name: 'Tomatoes',
    product_variety: 'Hybrid',
    available_quantity: 300,
    unit: 'kg',
    price_per_unit: 22,
    category: 'Vegetables',
  },
  {
    product_id: 'prod3',
    farmer_id: 'farmer3',
    product_name: 'Tomatoes',
    product_variety: 'Cherry',
    available_quantity: 200,
    unit: 'kg',
    price_per_unit: 35,
    category: 'Vegetables',
  },
  {
    product_id: 'prod4',
    farmer_id: 'farmer1',
    product_name: 'Onions',
    product_variety: 'Red',
    available_quantity: 400,
    unit: 'kg',
    price_per_unit: 18,
    category: 'Vegetables',
  },
  {
    product_id: 'prod5',
    farmer_id: 'farmer2',
    product_name: 'Potatoes',
    product_variety: 'Jyoti',
    available_quantity: 600,
    unit: 'kg',
    price_per_unit: 15,
    category: 'Tubers',
  },
  {
    product_id: 'prod6',
    farmer_id: 'farmer3',
    product_name: 'Rice',
    product_variety: 'Basmati',
    available_quantity: 1200,
    unit: 'kg',
    price_per_unit: 55,
    category: 'Grains / Cereals',
  },
  {
    product_id: 'prod7',
    farmer_id: 'farmer1',
    product_name: 'Wheat',
    product_variety: 'Lokwan',
    available_quantity: 2000,
    unit: 'kg',
    price_per_unit: 28,
    category: 'Grains / Cereals',
  },
  {
    product_id: 'prod8',
    farmer_id: 'farmer2',
    product_name: 'Maize',
    product_variety: 'Hybrid',
    available_quantity: 1500,
    unit: 'kg',
    price_per_unit: 20,
    category: 'Grains / Cereals',
  },
  {
    product_id: 'prod9',
    farmer_id: 'farmer3',
    product_name: 'Groundnut',
    product_variety: 'Bold',
    available_quantity: 800,
    unit: 'kg',
    price_per_unit: 65,
    category: 'Pulses & Oilseeds',
  },
  {
    product_id: 'prod10',
    farmer_id: 'farmer1',
    product_name: 'Soybean',
    product_variety: 'JS 335',
    available_quantity: 1000,
    unit: 'kg',
    price_per_unit: 45,
    category: 'Pulses & Oilseeds',
  },
  {
    product_id: 'prod11',
    farmer_id: 'farmer3',
    product_name: 'Carrots',
    product_variety: 'Orange Kuroda',
    available_quantity: 500,
    unit: 'kg',
    price_per_unit: 24,
    category: 'Vegetables',
  },
  {
    product_id: 'prod12',
    farmer_id: 'farmer2',
    product_name: 'Cabbage',
    product_variety: 'Golden Acre',
    available_quantity: 700,
    unit: 'kg',
    price_per_unit: 14,
    category: 'Vegetables',
  },
  {
    product_id: 'prod13',
    farmer_id: 'farmer1',
    product_name: 'Cauliflower',
    product_variety: 'Snowball',
    available_quantity: 600,
    unit: 'kg',
    price_per_unit: 26,
    category: 'Vegetables',
  },
  {
    product_id: 'prod14',
    farmer_id: 'farmer2',
    product_name: 'Brinjal',
    product_variety: 'Manjari Gota',
    available_quantity: 450,
    unit: 'kg',
    price_per_unit: 22,
    category: 'Vegetables',
  },
  {
    product_id: 'prod15',
    farmer_id: 'farmer3',
    product_name: 'Cucumbers',
    product_variety: 'Malini',
    available_quantity: 400,
    unit: 'kg',
    price_per_unit: 18,
    category: 'Vegetables',
  },
  {
    product_id: 'prod16',
    farmer_id: 'farmer1',
    product_name: 'Jowar',
    product_variety: 'Maldandi',
    available_quantity: 1200,
    unit: 'kg',
    price_per_unit: 32,
    category: 'Grains / Cereals',
  },
  {
    product_id: 'prod17',
    farmer_id: 'farmer2',
    product_name: 'Bajra',
    product_variety: 'Pioneer Hybrid',
    available_quantity: 1000,
    unit: 'kg',
    price_per_unit: 25,
    category: 'Grains / Cereals',
  },
  {
    product_id: 'prod18',
    farmer_id: 'farmer3',
    product_name: 'Barley',
    product_variety: 'RD 2035',
    available_quantity: 800,
    unit: 'kg',
    price_per_unit: 30,
    category: 'Grains / Cereals',
  },
  {
    product_id: 'prod19',
    farmer_id: 'farmer1',
    product_name: 'Green Chillies',
    product_variety: 'G4 Hot',
    available_quantity: 350,
    unit: 'kg',
    price_per_unit: 40,
    category: 'Spices',
  },
  {
    product_id: 'prod20',
    farmer_id: 'farmer1',
    product_name: 'Potatoes',
    product_variety: 'Kufri Pukhraj',
    available_quantity: 500,
    unit: 'kg',
    price_per_unit: 16,
    category: 'Tubers',
  },
  {
    product_id: 'prod21',
    farmer_id: 'farmer2',
    product_name: 'Ragi',
    product_variety: 'GPU-28',
    available_quantity: 1000,
    unit: 'kg',
    price_per_unit: 37,
    category: 'Grains / Cereals',
  },
  {
    product_id: 'prod22',
    farmer_id: 'farmer3',
    product_name: 'Foxtail Millet',
    product_variety: 'SiA 3088',
    available_quantity: 800,
    unit: 'kg',
    price_per_unit: 37,
    category: 'Grains / Cereals',
  },
  {
    product_id: 'prod23',
    farmer_id: 'farmer1',
    product_name: 'Kodo Millet',
    product_variety: 'TNAU 86',
    available_quantity: 1200,
    unit: 'kg',
    price_per_unit: 26,
    category: 'Grains / Cereals',
  },
  {
    product_id: 'prod24',
    farmer_id: 'farmer2',
    product_name: 'Little Millet',
    product_variety: 'CO 4 / Kutki',
    available_quantity: 900,
    unit: 'kg',
    price_per_unit: 26,
    category: 'Grains / Cereals',
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

export function addInventoryItem(item: ProductInventory): ProductInventory {
  const existingIndex = demoInventory.findIndex(
    i => i.product_id === item.product_id && i.farmer_id === item.farmer_id
  )
  if (existingIndex >= 0) {
    demoInventory[existingIndex] = { ...demoInventory[existingIndex], ...item }
    syncSupplier(demoInventory[existingIndex])
    return demoInventory[existingIndex]
  }

  const newItem: ProductInventory = {
    ...item,
    is_available: item.is_available !== undefined ? item.is_available : true,
    quality_grade: item.quality_grade || 'A',
  }
  demoInventory.unshift(newItem)
  syncSupplier(newItem)
  return newItem
}

export function updateInventoryItem(
  productId: string,
  farmerId: string,
  updates: Partial<ProductInventory>
): ProductInventory | null {
  const item = demoInventory.find(
    i => i.product_id === productId && (!farmerId || i.farmer_id === farmerId)
  )
  if (!item) return null

  Object.assign(item, updates)
  syncSupplier(item)
  return item
}

export function deleteInventoryItem(productId: string, farmerId?: string): boolean {
  const index = demoInventory.findIndex(
    i => i.product_id === productId && (!farmerId || i.farmer_id === farmerId)
  )
  if (index === -1) return false

  const removed = demoInventory.splice(index, 1)[0]
  removeSupplier(removed.product_id, removed.farmer_id)
  return true
}

function syncSupplier(item: ProductInventory) {
  try {
    // Dynamically require or import demoSuppliers to keep in sync
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { demoSuppliers } = require('@/services/matching/matcher')
    const supplier = demoSuppliers.find(
      (s: { product_id: string; farmer_id: string }) => 
        s.product_id === item.product_id && s.farmer_id === item.farmer_id
    )

    const farmerCoords: Record<string, { lat: number; lng: number; name: string }> = {
      farmer1: { lat: 19.0760, lng: 72.8777, name: 'Ramesh Kumar' },
      farmer2: { lat: 19.0860, lng: 72.8877, name: 'Suresh FPO' },
      farmer3: { lat: 19.0960, lng: 72.8977, name: 'Priya Singh' },
    }
    const meta = farmerCoords[item.farmer_id] || { lat: 19.0760, lng: 72.8777, name: 'Farmer' }

    if (supplier) {
      supplier.product_name = item.product_name
      supplier.variety = item.product_variety
      supplier.available_quantity = item.available_quantity
      supplier.unit = item.unit
      supplier.price_per_unit = item.price_per_unit
      if (item.is_available !== undefined) supplier.is_available = item.is_available
      if (item.quality_grade) supplier.quality_grade = item.quality_grade
      if (item.harvest_date) supplier.harvest_date = item.harvest_date
      if (item.availability_date) supplier.availability_date = item.availability_date
    } else {
      demoSuppliers.unshift({
        farmer_id: item.farmer_id,
        farmer_name: meta.name,
        location_lat: meta.lat,
        location_lng: meta.lng,
        farmer_rating: 4.5,
        product_id: item.product_id,
        product_name: item.product_name,
        variety: item.product_variety,
        available_quantity: item.available_quantity,
        unit: item.unit,
        price_per_unit: item.price_per_unit,
        quality_grade: item.quality_grade || 'A',
        harvest_date: item.harvest_date || '2026-09-10',
        availability_date: item.availability_date || '2026-09-13',
        is_available: item.is_available !== undefined ? item.is_available : true,
      })
    }
  } catch (e) {
    // If circular or not available in current execution context, ignore
    console.debug('Failed to sync demo supplier:', e)
  }
}

function removeSupplier(productId: string, farmerId: string) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { demoSuppliers } = require('@/services/matching/matcher')
    const idx = demoSuppliers.findIndex(
      (s: { product_id: string; farmer_id: string }) => 
        s.product_id === productId && (!farmerId || s.farmer_id === farmerId)
    )
    if (idx >= 0) {
      demoSuppliers.splice(idx, 1)
    }
  } catch (e) {
    console.debug('Failed to remove demo supplier:', e)
  }
}