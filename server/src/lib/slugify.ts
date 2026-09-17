export function slugify(input: string): string {
  const slug = input
    .normalize('NFD')
    .replace(/[^\x00-\x7F]/g, '') // drop accents left behind by NFD decomposition
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  return slug || 'item';
}
