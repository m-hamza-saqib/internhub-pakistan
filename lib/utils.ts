import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-PK', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
}

export function formatCurrency(amount: number, currency: 'PKR' | 'USD' = 'PKR'): string {
  if (currency === 'PKR') {
    return `PKR ${amount.toLocaleString('en-PK')}`;
  }
  return `$${amount.toFixed(2)}`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length) + '...';
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function calculateDaysLeft(endDate: string): number {
  const end = new Date(endDate);
  const now = new Date();
  const diff = end.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export function generateCertificateId(count: number): string {
  const year = new Date().getFullYear();
  return `IH-${year}-${String(count + 1).padStart(5, '0')}`;
}

export function generateOfferLetterId(count: number): string {
  const year = new Date().getFullYear();
  return `IH-OL-${year}-${String(count + 1).padStart(5, '0')}`;
}
