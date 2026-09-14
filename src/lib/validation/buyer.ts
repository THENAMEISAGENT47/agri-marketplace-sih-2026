import { z } from 'zod'

export const buyerProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  type: z.enum(['individual', 'retailer', 'wholesaler', 'institution']),
  business_name: z.string().optional(),
  location_lat: z.number().min(-90).max(90).optional(),
  location_lng: z.number().min(-180).max(180).optional(),
  address: z.string().optional(),
  district: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().regex(/^\d{6}$/, 'Invalid pincode').optional(),
})

export type BuyerProfileInput = z.infer<typeof buyerProfileSchema>