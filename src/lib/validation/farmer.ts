import { z } from 'zod'

export const farmerProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  type: z.enum(['individual', 'fpo']),
  fpo_name: z.string().optional(),
  location_lat: z.number().min(-90).max(90).optional(),
  location_lng: z.number().min(-180).max(180).optional(),
  address: z.string().optional(),
  district: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().regex(/^\d{6}$/, 'Invalid pincode').optional(),
})

export const productSchema = z.object({
  name: z.string().min(2, 'Product name must be at least 2 characters'),
  category: z.string().optional(),
  variety: z.string().optional(),
  quantity: z.number().positive('Quantity must be positive'),
  unit: z.enum(['kg', 'quintal', 'tonne', 'pieces', 'dozen']),
  price_per_unit: z.number().positive('Price must be positive'),
  harvest_date: z.string().optional(),
  availability_date: z.string(),
  is_available: z.boolean().default(true),
  quality_grade: z.enum(['A', 'B', 'C']).optional(),
  description: z.string().optional(),
  image_url: z.string().url().optional().or(z.literal('')),
  min_order_quantity: z.number().positive().default(1),
})

export type FarmerProfileInput = z.infer<typeof farmerProfileSchema>
export type ProductInput = z.infer<typeof productSchema>