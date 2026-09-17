import { prisma } from '../../lib/prisma.js';
import { CommerceError } from '../../lib/commerceError.js';
import { slugify } from '../../lib/slugify.js';

export async function listCategories(ownerId: string) {
  return prisma.category.findMany({
    where: { ownerId },
    orderBy: { name: 'asc' },
    include: { _count: { select: { products: true } } },
  });
}

export async function createCategory(ownerId: string, data: { name: string; description?: string }) {
  const slug = await uniqueSlug(ownerId, data.name);
  return prisma.category.create({ data: { ownerId, name: data.name, description: data.description, slug } });
}

export async function updateCategory(ownerId: string, id: string, data: { name?: string; description?: string }) {
  const existing = await prisma.category.findFirst({ where: { id, ownerId } });
  if (!existing) throw new CommerceError(404, 'Category not found.');

  const slug = data.name && data.name !== existing.name ? await uniqueSlug(ownerId, data.name, id) : undefined;
  return prisma.category.update({ where: { id }, data: { ...data, ...(slug ? { slug } : {}) } });
}

export async function deleteCategory(ownerId: string, id: string) {
  const existing = await prisma.category.findFirst({ where: { id, ownerId } });
  if (!existing) throw new CommerceError(404, 'Category not found.');

  // Products aren't deleted with their category — they just become uncategorized.
  await prisma.product.updateMany({ where: { categoryId: id, ownerId }, data: { categoryId: null } });
  await prisma.category.delete({ where: { id } });
}

async function uniqueSlug(ownerId: string, name: string, excludeId?: string): Promise<string> {
  const base = slugify(name);
  let candidate = base;
  let n = 1;
  // eslint-disable-next-line no-await-in-loop
  while (
    await prisma.category.findFirst({
      where: { ownerId, slug: candidate, ...(excludeId ? { id: { not: excludeId } } : {}) },
    })
  ) {
    n += 1;
    candidate = `${base}-${n}`;
  }
  return candidate;
}
