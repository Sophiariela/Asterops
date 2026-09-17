import type { StockMovementReason } from '@prisma/client';
import { prisma } from '../../lib/prisma.js';
import { CommerceError } from '../../lib/commerceError.js';

export async function listInventory(ownerId: string, opts: { lowStockOnly?: boolean } = {}) {
  const products = await prisma.product.findMany({
    where: { ownerId },
    orderBy: { name: 'asc' },
    select: {
      id: true,
      name: true,
      sku: true,
      stockQuantity: true,
      reorderPoint: true,
      status: true,
      category: { select: { name: true } },
    },
  });
  return opts.lowStockOnly ? products.filter((p) => p.stockQuantity <= p.reorderPoint) : products;
}

export async function listMovements(ownerId: string, productId?: string) {
  return prisma.stockMovement.findMany({
    where: { ownerId, ...(productId ? { productId } : {}) },
    include: { product: { select: { name: true, sku: true } } },
    orderBy: { createdAt: 'desc' },
    take: 100,
  });
}

export async function adjustStock(
  ownerId: string,
  input: { productId: string; change: number; reason: StockMovementReason; note?: string },
) {
  return prisma.$transaction(async (tx) => {
    const product = await tx.product.findFirst({ where: { id: input.productId, ownerId } });
    if (!product) throw new CommerceError(404, 'Product not found.');

    const nextQuantity = product.stockQuantity + input.change;
    if (nextQuantity < 0) {
      throw new CommerceError(400, `That would bring stock below zero (current: ${product.stockQuantity}).`);
    }

    const [updated] = await Promise.all([
      tx.product.update({ where: { id: product.id }, data: { stockQuantity: nextQuantity } }),
      tx.stockMovement.create({
        data: { ownerId, productId: product.id, change: input.change, reason: input.reason, note: input.note },
      }),
    ]);
    return updated;
  });
}
