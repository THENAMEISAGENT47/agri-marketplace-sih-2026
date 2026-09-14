import { z } from 'zod'

export const orderItemSchema = z.object({
  product_id: z.string().uuid(),
  farmer_id: z.string().uuid(),
  quantity: z.number().positive(),
  unit: z.string(),
  price_per_unit: z.number().positive(),
})

export const createOrderSchema = z.object({
  buyer_id: z.string().uuid(),
  items: z.array(orderItemSchema).min(1, 'At least one item is required'),
  total_amount: z.number().positive(),
})

export const updateOrderStatusSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']),
})

export type OrderItemInput = z.infer<typeof orderItemSchema>
export type CreateOrderInput = z.infer<typeof createOrderSchema>
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>