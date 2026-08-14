export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function truncate(str: string, length: number, suffix = '...'): string {
  if (str.length <= length) return str;
  return str.slice(0, length - suffix.length) + suffix;
}

export function toTitleCase(str: string): string {
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => capitalize(word))
    .join(' ');
}

export function camelToKebab(str: string): string {
  return str
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .toLowerCase();
}

export function kebabToCamel(str: string): string {
  return str.replace(/-([a-z0-9])/g, (g) => g[1].toUpperCase());
}

export function removeSpecialChars(str: string): string {
  return str.replace(/[^\w\s]/g, '');
}

export function generateSlug(text: string, maxLength = 50): string {
  return slugify(text).slice(0, maxLength);
}

export function extractEmails(text: string): string[] {
  const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi;
  return text.match(emailRegex) || [];
}
