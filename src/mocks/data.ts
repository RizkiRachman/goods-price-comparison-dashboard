import type { Store } from '@/types/api'

export const mockStores: Store[] = [
  { id: 1, name: 'Indomaret Sudirman', location: 'Jl. Sudirman No. 123, Jakarta Pusat', chain: 'Indomaret', address: 'Jl. Sudirman No. 123', latitude: -6.2088, longitude: 106.8456, status: 'approved', createdAt: '2024-01-15T08:00:00Z' },
  { id: 2, name: 'Alfamart Thamrin', location: 'Jl. MH Thamrin Kav. 10, Jakarta Pusat', chain: 'Alfamart', address: 'Jl. MH Thamrin Kav. 10', latitude: -6.1938, longitude: 106.8230, status: 'approved', createdAt: '2024-01-20T10:30:00Z' },
  { id: 3, name: 'Superindo Kelapa Gading', location: 'Jl. Kelapa Gading Boulevard, Jakarta Utara', chain: 'Superindo', address: 'Jl. Kelapa Gading Boulevard Blok A', latitude: -6.1693, longitude: 106.9015, status: 'approved', createdAt: '2024-02-01T09:15:00Z' },
  { id: 4, name: 'Indomaret Tebet', location: 'Jl. Tebet Raya No. 45, Jakarta Selatan', chain: 'Indomaret', address: 'Jl. Tebet Raya No. 45', latitude: -6.2294, longitude: 106.8541, status: 'approved', createdAt: '2024-02-10T14:20:00Z' },
  { id: 5, name: 'Alfamidi Kemang', location: 'Jl. Kemang Raya No. 78, Jakarta Selatan', chain: 'Alfamidi', address: 'Jl. Kemang Raya No. 78', latitude: -6.2615, longitude: 106.8120, status: 'approved', createdAt: '2024-02-15T11:00:00Z' },
  { id: 6, name: 'Hypermart Puri Indah', location: 'Puri Indah Mall, Jakarta Barat', chain: 'Hypermart', address: 'Puri Indah Mall Lt. 2', latitude: -6.1844, longitude: 106.7314, status: 'approved', createdAt: '2024-03-01T08:45:00Z' },
]

export interface StoreWithStats extends Store {
  totalProducts: number
  priceRange: { min: number; max: number }
  avgPrice: number
  lastUpdated: string
}

export const mockStoresWithStats: StoreWithStats[] = [
  { ...mockStores[0], totalProducts: 156, priceRange: { min: 5000, max: 125000 }, avgPrice: 45200, lastUpdated: '2026-05-04T12:30:00Z' },
  { ...mockStores[1], totalProducts: 203, priceRange: { min: 3500, max: 89000 }, avgPrice: 38500, lastUpdated: '2026-05-04T14:15:00Z' },
  { ...mockStores[2], totalProducts: 892, priceRange: { min: 2500, max: 450000 }, avgPrice: 67200, lastUpdated: '2026-05-04T11:45:00Z' },
  { ...mockStores[3], totalProducts: 178, priceRange: { min: 4500, max: 98000 }, avgPrice: 41200, lastUpdated: '2026-05-04T16:20:00Z' },
  { ...mockStores[4], totalProducts: 245, priceRange: { min: 5500, max: 145000 }, avgPrice: 52300, lastUpdated: '2026-05-04T10:00:00Z' },
  { ...mockStores[5], totalProducts: 1256, priceRange: { min: 1800, max: 890000 }, avgPrice: 89500, lastUpdated: '2026-05-04T15:30:00Z' },
]

export const mockShoppingOptimizeResponse = {
  singleStore: {
    totalItems: 2,
    totalCost: 84000,
    storesToVisit: 1,
    route: [
      {
        storeId: 6,
        storeName: 'Hypermart Puri Indah',
        storeLocation: 'Puri Indah Mall, Jakarta Barat',
        items: [
          { productName: 'Beras Premium 5kg', price: 63500, quantity: 1 },
          { productName: 'Minyak Goreng 2L', price: 42800, quantity: 1 },
        ],
        subtotal: 106300,
        estimatedTime: '15 menit',
      },
    ],
    savings: { comparedToSingleStore: 0, percentage: 0 },
  },
  multiStore: {
    totalItems: 4,
    totalCost: 115500,
    storesToVisit: 2,
    route: [
      {
        storeId: 6,
        storeName: 'Hypermart Puri Indah',
        storeLocation: 'Puri Indah Mall, Jakarta Barat',
        items: [
          { productName: 'Beras Premium 5kg', price: 63500, quantity: 1 },
          { productName: 'Telur Ayam 1kg', price: 30500, quantity: 1 },
        ],
        subtotal: 94000,
        estimatedTime: '15 menit',
      },
      {
        storeId: 2,
        storeName: 'Alfamart Thamrin',
        storeLocation: 'Jl. MH Thamrin Kav. 10, Jakarta Pusat',
        items: [
          { productName: 'Minyak Goreng 2L', price: 41000, quantity: 1 },
          { productName: 'Gula Pasir 1kg', price: 18200, quantity: 1 },
        ],
        subtotal: 59200,
        estimatedTime: '10 menit',
      },
    ],
    savings: { comparedToSingleStore: 14700, percentage: 5.2 },
  },
}

// Per-store product prices: storeId → { productId → price }
export const storeProductPrices: Record<number, Record<number, { price: number }>> = {
  1: { 1: { price: 65000 }, 2: { price: 42000 }, 4: { price: 18500 }, 5: { price: 22500 }, 6: { price: 32000 }, 7: { price: 18500 } },
  2: { 1: { price: 67000 }, 3: { price: 55200 }, 4: { price: 19000 }, 8: { price: 3500 }, 6: { price: 33500 } },
  3: { 1: { price: 64000 }, 2: { price: 43500 }, 5: { price: 21800 }, 6: { price: 31000 }, 7: { price: 18000 }, 8: { price: 3400 }, 9: { price: 8500 }, 10: { price: 28500 } },
  4: { 1: { price: 66000 }, 2: { price: 41000 }, 4: { price: 18200 }, 5: { price: 23000 }, 6: { price: 32500 }, 7: { price: 18800 } },
  5: { 1: { price: 65500 }, 3: { price: 56000 }, 4: { price: 18700 }, 6: { price: 32800 }, 8: { price: 3600 }, 9: { price: 8200 } },
  6: { 1: { price: 63500 }, 2: { price: 42800 }, 3: { price: 54800 }, 4: { price: 17800 }, 5: { price: 21500 }, 6: { price: 30500 }, 7: { price: 17500 }, 8: { price: 3300 }, 9: { price: 7800 }, 10: { price: 27500 } },
}
