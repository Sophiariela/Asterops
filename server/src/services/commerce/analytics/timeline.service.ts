import { prisma } from '../../../lib/prisma.js';
import { CommerceError } from '../../../lib/commerceError.js';

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
  if (!customer) throw new CommerceError(404, 'Customer not found.');

  const events: TimelineEvent[] = [
    { type: 'CUSTOMER_CREATED', at: customer.createdAt.toISOString(), label: 'Added to CommerceOS' },
  ];

  customer.orders.forEach((order, index) => {
    events.push({
      type: 'ORDER_PLACED',
      at: order.createdAt.toISOString(),
      label: index === 0 ? 'First purchase' : `Repeat purchase #${index + 1}`,
      detail: `${order.items.length} item(s) via ${order.channel.toLowerCase()}`,
      orderId: order.id,
    });

    // Only the current status is stored (no status-change log), so this
    // reflects the latest transition, not full history.
    if (order.status !== 'PENDING' && order.updatedAt.getTime() !== order.createdAt.getTime()) {
      events.push({
        type: 'ORDER_STATUS_CHANGED',
        at: order.updatedAt.toISOString(),
        label: `Order ${order.status.toLowerCase()}`,
        orderId: order.id,
      });
    }
  });

  events.sort((a, b) => new Date(a.at).getTime() - new Date(b.at).getTime());
  return events;
}
