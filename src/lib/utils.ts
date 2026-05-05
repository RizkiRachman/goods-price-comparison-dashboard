/**
 * Generic utilities for common operations
 */

/**
 * Remove undefined, null, and empty string values from an object
 * Useful for cleaning API request params
 */
export function cleanParams<T extends Record<string, unknown>>(params: T | undefined): Partial<T> | undefined {
  if (!params) return undefined

  return Object.fromEntries(
    Object.entries(params).filter(([, value]) =>
      value !== undefined && value !== null && value !== ''
    )
  ) as Partial<T>
}

/**
 * Format number as Indonesian Rupiah currency
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(price)
}

/**
 * Format date to Indonesian locale string
 */
export function formatDate(dateStr: string, options?: Intl.DateTimeFormatOptions): string {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    ...options,
  }
  return new Date(dateStr).toLocaleDateString('id-ID', defaultOptions)
}

/**
 * Format relative time (e.g., "2 hari lalu")
 */
export function formatRelativeTime(dateStr: string): string {
  const daysAgo = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86_400_000)

  if (daysAgo === 0) return 'hari ini'
  if (daysAgo === 1) return 'kemarin'
  return `${daysAgo} hari lalu`
}

/**
 * Create a range array for pagination or skeleton loaders
 */
export function createRange(length: number): number[] {
  return Array.from({ length }, (_, i) => i)
}

/**
 * Type guard for non-null values
 */
export function isNonNull<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined
}
