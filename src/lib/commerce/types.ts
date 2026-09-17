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
  costPrice: number | null;
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

export type BusinessPulse = {
  revenue: { current: number; previous: number; pctChange: number | null };
  orders: { current: number; previous: number; pctChange: number | null };
  newCustomers: { current: number; previous: number; pctChange: number | null };
  lowStockCount: number;
  lowStockProducts: { id: string; name: string; stockQuantity: number; reorderPoint: number }[];
  dormantCustomerCount: number;
  dormantCustomers: { id: string; name: string; lastOrderAt: string }[];
  topProducts: { id: string; name: string; unitsSold: number; revenue: number }[];
  recommendedActions: string[];
};

export type HealthFactor = {
  key: string;
  label: string;
  available: boolean;
  score: number | null;
  detail: string;
};

export type ProductHealth = {
  productId: string;
  name: string;
  score: number;
  factors: HealthFactor[];
  badges: { tone: 'good' | 'warn'; label: string }[];
};

export type Opportunity = {
  key: string;
  label: string;
  available: boolean;
  estimate: number;
  basis: string;
  items?: { label: string; estimate: number }[];
};

export type AuditCheck = {
  key: string;
  label: string;
  measured: boolean;
  penalty: number;
  detail: string;
  recommendation: string | null;
};

export type AuditResult = {
  score: number;
  checks: AuditCheck[];
  recommendations: string[];
};

export type TimelineEvent = {
  type: string;
  at: string;
  label: string;
  detail?: string;
  orderId?: string;
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
