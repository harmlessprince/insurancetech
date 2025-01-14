export enum ProductTypes {
  AUTO = 'auto',
  HEALTH = 'health',
}


export function slugify(slug: string): string {
  return slug
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

module.exports = {
  slugify,
  ProductTypes,
};