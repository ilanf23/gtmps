import { customAlphabet } from 'nanoid';

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz0123456789';
const RANDOM_LENGTH = 10;

const nanoid = customAlphabet(ALPHABET, RANDOM_LENGTH);

/**
 * Generate a URL-safe, collision-resistant slug from an email address.
 *
 * Format: `<first 4 alphanumeric chars of email local part>_<10 random chars>`
 *
 * @example
 *   generateMagnetSlug('richard@mabbly.com') // 'rich_a1b2c3d4e5'
 *   generateMagnetSlug('adam@mabbly.com')    // 'adam_x9y8z7w6v5'
 */
export function generateMagnetSlug(email: string): string {
  const localPart = (email.split('@')[0] ?? '').toLowerCase();
  const cleaned = localPart.replace(/[^a-z0-9]/g, '');
  const prefix = (cleaned.slice(0, 4) || 'user').padEnd(1, 'u');

  let randomSuffix: string;
  try {
    randomSuffix = nanoid();
  } catch {
    randomSuffix = (
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID().replace(/-/g, '')
        : Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2)
    ).slice(0, RANDOM_LENGTH);
  }

  return `${prefix}_${randomSuffix}`;
}
