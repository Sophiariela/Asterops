import type { CommerceOrderChannel, CommerceOrderStatus } from '@prisma/client';
import { prisma } from '../../lib/prisma.js';
import { CommerceError } from '../../lib/commerceError.js';

export async function listOrders(
  ownerId: string,
  opts: { status?: CommerceOrderStatus; customerId?: string } = {},
) {
  return prisma.commerceOrder.findMany({
    where: {
      ownerId,
      ...(opts.status ? { status: opts.status } : {}),
      ...(opts.customerId ? { customerId: opts.customerId } : {}),
    },
    include: { customer: true, items: { include: { product: { select: { name: true, sku: true } } } } },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getOrder(ownerId: string, id: string) {
  const order = await prisma.commerceOrder.findFirst({
    where: { id, ownerId },
    include: { customer: true, items: { include: { product: true } } },
  });
  if (!order) throw new CommerceError(404, 'Order not found.');
  return order;
}

export async function createOrder(
  ownerId: string,
  data: {
    customerId: string;
    channel?: CommerceOrderChannel;
    notes?: string;
    items: { productId: string; quantity: number }[];
  },
) {
  return prisma.$transaction(async (tx) => {
    const customer = await tx.commerceCustomer.findFirst({ where: { id: data.customerId, ownerId } });
    if (!customer) throw new CommerceError(400, 'Customer not found.');

    const productIds = data.items.map((i) => i.productId);
    const products = await tx.product.findMany({ where: { id: { in: productIds }, ownerId } });
    const productMap = new Map(products.map((p) => [p.id, p]));

    let subtotal = 0;
    for (const item of data.items) {
      const product = productMap.get(item.productId);
      if (!product) throw new CommerceError(400, `Product ${item.productId} not found.`);
      if (product.stockQuantity < item.quantity) {
        throw new CommerceError(
          409,
          `Not enough stock for "${product.name}" (have ${product.stockQuantity}, need ${item.quantity}).`,
        );
      }
      subtotal += product.price * item.quantity;
    }

    const order = await tx.commerceOrder.create({
      data: {
        ownerId,
        customerId: data.customerId,
        channel: data.channel ?? 'MANUAL',
        notes: data.notes,
        subtotal,
        total: subtotal,
        items: {
          create: data.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: productMap.get(item.productId)!.price,
          })),
        },
      },
      include: { items: true, customer: true },
    });

    for (const item of data.items) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stockQuantity: { decrement: item.quantity } },
      });
      await tx.stockMovement.create({
        data: { ownerId, productId: item.productId, change: -item.quantity, reason: 'SALE', note: `Order ${order.id}` },
      });
    }

    return order;
  });
}

const RESTOCKING_STATUSES: CommerceOrderStatus[] = ['CANCELLED', 'REFUNDED'];

export async function updateOrderStatus(ownerId: string, id: string, status: CommerceOrderStatus) {
  return prisma.$transaction(async (tx) => {
    const order = await tx.commerceOrder.findFirst({ where: { id, ownerId }, include: { items: true } });
    if (!order) throw new CommerceError(404, 'Order not found.');

    const wasRestocked = RESTOCKING_STATUSES.includes(order.status);
    const willRestock = RESTOCKING_STATUSES.includes(status);

    // Restock only on the transition into cancelled/refunded, and only once —
    // otherwise re-saving the same status would double-credit stock.
    if (willRestock && !wasRestocked) {
      for (const item of order.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stockQuantity: { increment: item.quantity } },
        });
        await tx.stockMovement.create({
          data: {
            ownerId,
            productId: item.productId,
            change: item.quantity,
            reason: 'RETURN',
            note: `Order ${order.id} ${status.toLowerCase()}`,
          },
        });
      }
    }

    return tx.commerceOrder.update({
      where: { id },
      data: { status },
      include: { items: true, customer: true },
    });
  });
}
