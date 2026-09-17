import { prisma } from '../../lib/prisma.js';
import { CommerceError } from '../../lib/commerceError.js';

export async function listCustomers(ownerId: string, search?: string) {
  return prisma.commerceCustomer.findMany({
    where: {
      ownerId,
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { email: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {}),
    },
    include: { _count: { select: { orders: true } } },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getCustomer(ownerId: string, id: string) {
  const customer = await prisma.commerceCustomer.findFirst({
    where: { id, ownerId },
    include: { orders: { orderBy: { createdAt: 'desc' }, include: { items: true } } },
  });
  if (!customer) throw new CommerceError(404, 'Customer not found.');
  return customer;
}

export async function createCustomer(
  ownerId: string,
  data: { name: string; email?: string | null; phone?: string | null; notes?: string | null },
) {
  return prisma.commerceCustomer.create({ data: { ownerId, ...data } });
}

export async function updateCustomer(
  ownerId: string,
  id: string,
  data: Partial<{ name: string; email: string | null; phone: string | null; notes: string | null }>,
) {
  const existing = await prisma.commerceCustomer.findFirst({ where: { id, ownerId } });
  if (!existing) throw new CommerceError(404, 'Customer not found.');
  return prisma.commerceCustomer.update({ where: { id }, data });
}

export async function deleteCustomer(ownerId: string, id: string) {
  const existing = await prisma.commerceCustomer.findFirst({ where: { id, ownerId } });
  if (!existing) throw new CommerceError(404, 'Customer not found.');

  const hasOrders = await prisma.commerceOrder.findFirst({ where: { customerId: id } });
  if (hasOrders) throw new CommerceError(409, 'This customer has order history and cannot be deleted.');

  await prisma.commerceCustomer.delete({ where: { id } });
}
