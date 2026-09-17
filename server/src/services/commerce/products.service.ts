import type { ProductStatus } from '@prisma/client';
import { prisma } from '../../lib/prisma.js';
import { CommerceError } from '../../lib/commerceError.js';
import { slugify } from '../../lib/slugify.js';

type CreateProductInput = {
  name: string;
  sku: string;
  description?: string;
  price: number;
  compareAtPrice?: number | null;
  categoryId?: string | null;
  status?: ProductStatus;
  stockQuantity?: number;
  reorderPoint?: number;
  imageUrl?: string | null;
};

type UpdateProductInput = Omit<Partial<CreateProductInput>, 'stockQuantity'>;

export async function listProducts(
  ownerId: string,
  opts: { search?: string; categoryId?: string; status?: string } = {},
) {
  return prisma.product.findMany({
    where: {
      ownerId,
      ...(opts.categoryId ? { categoryId: opts.categoryId } : {}),
      ...(opts.status ? { status: opts.status as ProductStatus } : {}),
      ...(opts.search
        ? {
            OR: [
              { name: { contains: opts.search, mode: 'insensitive' } },
              { sku: { contains: opts.search, mode: 'insensitive' } },
            ],
          }
        : {}),
    },
    include: { category: true },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getProduct(ownerId: string, id: string) {
  const product = await prisma.product.findFirst({ where: { id, ownerId }, include: { category: true } });
  if (!product) throw new CommerceError(404, 'Product not found.');
  return product;
}

export async function createProduct(ownerId: string, data: CreateProductInput) {
  await assertSkuAvailable(ownerId, data.sku);
  if (data.categoryId) await assertCategoryOwned(ownerId, data.categoryId);
  const slug = await uniqueProductSlug(ownerId, data.name);
  const stockQuantity = data.stockQuantity ?? 0;

  return prisma.$transaction(async (tx) => {
    const product = await tx.product.create({
      data: {
        ownerId,
        name: data.name,
        sku: data.sku,
        slug,
        description: data.description,
        price: data.price,
        compareAtPrice: data.compareAtPrice ?? undefined,
        categoryId: data.categoryId ?? undefined,
        status: data.status ?? 'ACTIVE',
        stockQuantity,
        reorderPoint: data.reorderPoint ?? 0,
        imageUrl: data.imageUrl ?? undefined,
      },
    });

    if (stockQuantity > 0) {
      await tx.stockMovement.create({
        data: {
          ownerId,
          productId: product.id,
          change: stockQuantity,
          reason: 'RESTOCK',
          note: 'Initial stock on product creation.',
        },
      });
    }

    return product;
  });
}

export async function updateProduct(ownerId: string, id: string, data: UpdateProductInput) {
  const existing = await prisma.product.findFirst({ where: { id, ownerId } });
  if (!existing) throw new CommerceError(404, 'Product not found.');
  if (data.sku && data.sku !== existing.sku) await assertSkuAvailable(ownerId, data.sku);
  if (data.categoryId) await assertCategoryOwned(ownerId, data.categoryId);

  const slug = data.name && data.name !== existing.name ? await uniqueProductSlug(ownerId, data.name, id) : undefined;

  return prisma.product.update({
    where: { id },
    data: { ...data, ...(slug ? { slug } : {}) },
  });
}

export async function deleteProduct(ownerId: string, id: string) {
  const existing = await prisma.product.findFirst({ where: { id, ownerId } });
  if (!existing) throw new CommerceError(404, 'Product not found.');

  const usedInOrder = await prisma.commerceOrderItem.findFirst({ where: { productId: id } });
  if (usedInOrder) {
    throw new CommerceError(409, 'This product has order history and cannot be deleted — archive it instead.');
  }

  await prisma.product.delete({ where: { id } });
}

async function assertSkuAvailable(ownerId: string, sku: string) {
  const existing = await prisma.product.findFirst({ where: { ownerId, sku } });
  if (existing) throw new CommerceError(409, `SKU "${sku}" is already in use.`);
}

async function assertCategoryOwned(ownerId: string, categoryId: string) {
  const category = await prisma.category.findFirst({ where: { id: categoryId, ownerId } });
  if (!category) throw new CommerceError(400, 'Category not found.');
}

async function uniqueProductSlug(ownerId: string, name: string, excludeId?: string): Promise<string> {
  const base = slugify(name);
  let candidate = base;
  let n = 1;
  // eslint-disable-next-line no-await-in-loop
  while (
    await prisma.product.findFirst({
      where: { ownerId, slug: candidate, ...(excludeId ? { id: { not: excludeId } } : {}) },
    })
  ) {
    n += 1;
    candidate = `${base}-${n}`;
  }
  return candidate;
}
