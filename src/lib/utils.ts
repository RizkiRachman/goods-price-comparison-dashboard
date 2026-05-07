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

const MAX_UPLOAD_SIZE = 6 * 1024 * 1024 // 6 MB
const COMPRESS_THRESHOLD = 3.5 * 1024 * 1024 // 3.5 MB
const COMPRESS_QUALITY = 0.5

export interface CompressResult {
  file: File
  compressed: boolean
  originalSize: number
}

/**
 * Compress an image file if it exceeds the threshold.
 * Rejects if the file is still > 6 MB after compression.
 */
export function compressImageIfNeeded(file: File): Promise<CompressResult> {
  if (file.size <= COMPRESS_THRESHOLD) {
    if (file.size > MAX_UPLOAD_SIZE) {
      return Promise.reject(new Error('Ukuran file melebihi batas maksimum 6 MB.'))
    }
    return Promise.resolve({ file, compressed: false, originalSize: file.size })
  }

  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)

    img.onload = () => {
      URL.revokeObjectURL(url)

      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        reject(new Error('Gagal mengompres gambar.'))
        return
      }

      ctx.drawImage(img, 0, 0)

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Gagal mengompres gambar.'))
            return
          }

          if (blob.size > MAX_UPLOAD_SIZE) {
            reject(new Error('Ukuran file melebihi batas maksimum 6 MB.'))
            return
          }

          const compressedFile = new File([blob], file.name, {
            type: file.type,
            lastModified: Date.now(),
          })

          resolve({ file: compressedFile, compressed: true, originalSize: file.size })
        },
        file.type,
        COMPRESS_QUALITY,
      )
    }

    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Gagal membaca gambar.'))
    }

    img.src = url
  })
}
