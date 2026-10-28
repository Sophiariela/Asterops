import type { CommerceOrderChannel, CommerceOrderStatus } from '@prisma/client';
import { prisma } from '../../../lib/prisma.js';
import { CommerceError } from '../../../lib/commerceError.js';

const ORDER_CHANNEL_LABEL: Record<CommerceOrderChannel, string> = {
  ONLINE: 'online',
  POS: 'ponto de venda',
  MANUAL: 'manual',
};

const ORDER_STATUS_LABEL: Record<CommerceOrderStatus, string> = {
  PENDING: 'pendente',
  PROCESSING: 'processando',
  FULFILLED: 'entregue',
  CANCELLED: 'cancelado',
  REFUNDED: 'reembolsado',
};

// Event types the brief asked for that ASTER doesn't have data sources for
// yet (site visits, lead capture, campaigns, cart abandonment) are kept in
// this union so the timeline is ready to display them the moment those
// systems exist — but the generator below only ever emits the four types
// backed by real data today.
export type TimelineEventType =
  | 'CUSTOMER_CREATED'
  | 'ORDER_PLACED'
  | 'ORDER_STATUS_CHANGED'
  | 'STOCK_RETURNED'
  | 'FIRST_VISIT'
  | 'LEAD_CAPTURED'
  | 'ABANDONED_CART'
  | 'CAMPAIGN_INTERACTION';

export type TimelineEvent = {
  type: TimelineEventType;
  at: string;
  label: string;
  detail?: string;
  orderId?: string;
};

export async function getCustomerTimeline(ownerId: string, customerId: string): Promise<TimelineEvent[]> {
  const customer = await prisma.commerceCustomer.findFirst({
    where: { id: customerId, ownerId },
    include: { orders: { orderBy: { createdAt: 'asc' }, include: { items: true } } },
  });
  if (!customer) throw new CommerceError(404, 'Cliente não encontrado.');

  const events: TimelineEvent[] = [
    { type: 'CUSTOMER_CREATED', at: customer.createdAt.toISOString(), label: 'Adicionado ao CommerceOS' },
  ];

  customer.orders.forEach((order, index) => {
    events.push({
      type: 'ORDER_PLACED',
      at: order.createdAt.toISOString(),
      label: index === 0 ? 'Primeira compra' : `Compra recorrente #${index + 1}`,
      detail: `${order.items.length} item(ns) via ${ORDER_CHANNEL_LABEL[order.channel]}`,
      orderId: order.id,
    });

    // Only the current status is stored (no status-change log), so this
    // reflects the latest transition, not full history.
    if (order.status !== 'PENDING' && order.updatedAt.getTime() !== order.createdAt.getTime()) {
      events.push({
        type: 'ORDER_STATUS_CHANGED',
        at: order.updatedAt.toISOString(),
        label: `Pedido ${ORDER_STATUS_LABEL[order.status]}`,
        orderId: order.id,
      });
    }
  });

  events.sort((a, b) => new Date(a.at).getTime() - new Date(b.at).getTime());
  return events;
}
