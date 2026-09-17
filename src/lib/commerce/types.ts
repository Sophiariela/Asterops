export type ProductStatus = 'ACTIVE' | 'DRAFT' | 'ARCHIVED';
export type OrderChannel = 'ONLINE' | 'POS' | 'MANUAL';
export type OrderStatus = 'PENDING' | 'PROCESSING' | 'FULFILLED' | 'CANCELLED' | 'REFUNDED';
export type StockMovementReason = 'RESTOCK' | 'SALE' | 'ADJUSTMENT' | 'RETURN';
export type ManualStockReason = 'RESTOCK' | 'ADJUSTMENT' | 'RETURN';

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  _count?: { products: number };
};

export type Product = {
  id: string;
  categoryId: string | null;
  category: Category | null;
  name: string;
  slug: string;
  sku: string;
  description: string | null;
  price: number;
  compareAtPrice: number | null;
  status: ProductStatus;
  stockQuantity: number;
  reorderPoint: number;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

export type InventoryRow = {
  id: string;
  name: string;
  sku: string;
  stockQuantity: number;
  reorderPoint: number;
  status: ProductStatus;
  category: { name: string } | null;
};

export type StockMovement = {
  id: string;
  productId: string;
  change: number;
  reason: StockMovementReason;
  note: string | null;
  createdAt: string;
  product: { name: string; sku: string };
};

export type CommerceCustomer = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  _count?: { orders: number };
  orders?: CommerceOrder[];
};

export type CommerceOrderItem = {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  product?: { name: string; sku: string } | Product;
};

export type CommerceOrder = {
  id: string;
  customerId: string;
  customer: CommerceCustomer;
  status: OrderStatus;
  channel: OrderChannel;
  subtotal: number;
  total: number;
  notes: string | null;
  items: CommerceOrderItem[];
  createdAt: string;
  updatedAt: string;
};
