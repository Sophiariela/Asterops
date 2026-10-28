import type { ManualStockReason, OrderChannel, OrderStatus, ProductStatus, StockMovementReason } from './types';

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  PENDING: 'Pendente',
  PROCESSING: 'Processando',
  FULFILLED: 'Entregue',
  CANCELLED: 'Cancelado',
  REFUNDED: 'Reembolsado',
};

export const ORDER_STATUS_STYLE: Record<OrderStatus, string> = {
  PENDING: 'bg-amber-100 text-amber-700',
  PROCESSING: 'bg-blue-100 text-blue-700',
  FULFILLED: 'bg-emerald-100 text-emerald-700',
  CANCELLED: 'bg-slate-200 text-slate-500',
  REFUNDED: 'bg-rose-100 text-rose-600',
};

export const PRODUCT_STATUS_LABEL: Record<ProductStatus, string> = {
  ACTIVE: 'Ativo',
  DRAFT: 'Rascunho',
  ARCHIVED: 'Arquivado',
};

export const ORDER_CHANNEL_LABEL: Record<OrderChannel, string> = {
  ONLINE: 'Online',
  POS: 'Ponto de venda',
  MANUAL: 'Manual',
};

export const STOCK_REASON_LABEL: Record<StockMovementReason, string> = {
  RESTOCK: 'Reabastecimento',
  SALE: 'Venda',
  ADJUSTMENT: 'Ajuste',
  RETURN: 'Devolução',
};

export const MANUAL_STOCK_REASON_LABEL: Record<ManualStockReason, string> = {
  RESTOCK: 'Reabastecimento',
  ADJUSTMENT: 'Ajuste (perda, avaria, correção de contagem)',
  RETURN: 'Devolução',
};
