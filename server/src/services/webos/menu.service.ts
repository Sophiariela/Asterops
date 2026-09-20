import { prisma } from '../../lib/prisma.js';
import { CommerceError } from '../../lib/commerceError.js';

async function assertSiteOwned(ownerId: string, siteId: string) {
  const site = await prisma.site.findFirst({ where: { id: siteId, ownerId } });
  if (!site) throw new CommerceError(404, 'Site not found.');
}

const MENU_INCLUDE = { items: { orderBy: { order: 'asc' as const } } };

export async function getMenu(ownerId: string, siteId: string) {
  await assertSiteOwned(ownerId, siteId);
  return prisma.menuCategory.findMany({ where: { siteId }, orderBy: { order: 'asc' }, include: MENU_INCLUDE });
}

// Unauthenticated read — the same "real infrastructure, no live caller
// yet" story as publicLeadsRouter and public reservations: once a site
// is served on a live public URL, its menu page fetches this directly.
export async function getPublicMenu(siteId: string) {
  const site = await prisma.site.findUnique({ where: { id: siteId } });
  if (!site) throw new CommerceError(404, 'Site not found.');
  return prisma.menuCategory.findMany({ where: { siteId }, orderBy: { order: 'asc' }, include: MENU_INCLUDE });
}

export async function createCategory(ownerId: string, siteId: string, data: { name: string }) {
  await assertSiteOwned(ownerId, siteId);
  const count = await prisma.menuCategory.count({ where: { siteId } });
  return prisma.menuCategory.create({ data: { siteId, name: data.name, order: count }, include: MENU_INCLUDE });
}

export async function updateCategory(ownerId: string, siteId: string, id: string, data: { name?: string; order?: number }) {
  await assertSiteOwned(ownerId, siteId);
  const existing = await prisma.menuCategory.findFirst({ where: { id, siteId } });
  if (!existing) throw new CommerceError(404, 'Menu category not found.');
  return prisma.menuCategory.update({ where: { id }, data, include: MENU_INCLUDE });
}

export async function deleteCategory(ownerId: string, siteId: string, id: string) {
  await assertSiteOwned(ownerId, siteId);
  const existing = await prisma.menuCategory.findFirst({ where: { id, siteId } });
  if (!existing) throw new CommerceError(404, 'Menu category not found.');
  await prisma.menuCategory.delete({ where: { id } });
}

async function assertCategoryOwned(ownerId: string, siteId: string, categoryId: string) {
  const category = await prisma.menuCategory.findFirst({ where: { id: categoryId, siteId, site: { ownerId } } });
  if (!category) throw new CommerceError(404, 'Menu category not found.');
  return category;
}

export async function createItem(
  ownerId: string,
  siteId: string,
  categoryId: string,
  data: { name: string; description?: string; priceCents?: number; available?: boolean; featured?: boolean },
) {
  await assertCategoryOwned(ownerId, siteId, categoryId);
  const count = await prisma.menuItem.count({ where: { categoryId } });
  return prisma.menuItem.create({ data: { categoryId, order: count, ...data } });
}

export async function updateItem(
  ownerId: string,
  siteId: string,
  id: string,
  data: Partial<{ name: string; description: string | null; priceCents: number | null; available: boolean; featured: boolean; order: number }>,
) {
  const item = await prisma.menuItem.findFirst({ where: { id, category: { siteId, site: { ownerId } } } });
  if (!item) throw new CommerceError(404, 'Menu item not found.');
  return prisma.menuItem.update({ where: { id }, data });
}

export async function deleteItem(ownerId: string, siteId: string, id: string) {
  const item = await prisma.menuItem.findFirst({ where: { id, category: { siteId, site: { ownerId } } } });
  if (!item) throw new CommerceError(404, 'Menu item not found.');
  await prisma.menuItem.delete({ where: { id } });
}
