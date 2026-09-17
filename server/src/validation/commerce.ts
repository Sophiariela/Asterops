import { z } from 'zod';

export const productStatusValues = ['ACTIVE', 'DRAFT', 'ARCHIVED'] as const;
export const orderChannelValues = ['ONLINE', 'POS', 'MANUAL'] as const;
export const orderStatusValues = ['PENDING', 'PROCESSING', 'FULFILLED', 'CANCELLED', 'REFUNDED'] as const;
// SALE is written internally by the order service, never accepted from a client request.
export const manualStockReasonValues = ['RESTOCK', 'ADJUSTMENT', 'RETURN'] as const;

export const createCategorySchema = z.object({
  name: z.string().min(1).max(120),
  description: z.string().max(2000).optional(),
});

export const updateCategorySchema = createCategorySchema.partial();

export const createProductSchema = z.object({
  name: z.string().min(1).max(200),
  sku: z.string().min(1).max(64),
  description: z.string().max(4000).optional(),
  price: z.number().int().nonnegative(),
  compareAtPrice: z.number().int().nonnegative().nullable().optional(),
  categoryId: z.string().min(1).nullable().optional(),
  status: z.enum(productStatusValues).optional(),
  stockQuantity: z.number().int().nonnegative().optional(),
  reorderPoint: z.number().int().nonnegative().optional(),
  imageUrl: z.string().url().nullable().optional(),
});

// Stock isn't editable here — it only ever changes through a StockMovement,
// via the inventory adjustment endpoint or an order being placed/cancelled.
export const updateProductSchema = createProductSchema.omit({ stockQuantity: true }).partial();

export const createCustomerSchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email().nullable().optional(),
  phone: z.string().max(40).nullable().optional(),
  notes: z.string().max(2000).nullable().optional(),
});

export const updateCustomerSchema = createCustomerSchema.partial();

export const createOrderSchema = z.object({
  customerId: z.string().min(1),
  channel: z.enum(orderChannelValues).optional(),
  notes: z.string().max(2000).optional(),
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        quantity: z.number().int().positive(),
      }),
    )
    .min(1, 'An order needs at least one item.'),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(orderStatusValues),
});

export const adjustStockSchema = z.object({
  productId: z.string().min(1),
  change: z.number().int().refine((n) => n !== 0, 'change must not be zero.'),
  reason: z.enum(manualStockReasonValues),
  note: z.string().max(2000).optional(),
});

export const listQuerySchema = z.object({
  search: z.string().optional(),
  cursor: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
});
