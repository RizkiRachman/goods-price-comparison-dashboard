import { http, HttpResponse } from 'msw'
import { mockStoresWithStats, storeProductPrices } from './data'
import type { ProductListResponse, StoreListResponse, ReceiptCorrectResponse } from '@/types/api'

// Mock products data
const mockProducts = [
  {
    id: 1,
    name: 'Beras Premium 5kg',
    category: 'food',
    brand: 'Maknyuss',
    unit: 'PIECE',
    status: 'approved' as const,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    detail: {
      price: {
        avg: 65000,
        updatedAt: '2026-05-04T14:30:00Z'
      }
    }
  },
  {
    id: 2,
    name: 'Minyak Goreng 2L',
    category: 'food',
    brand: 'Bimoli',
    unit: 'PIECE',
    status: 'approved' as const,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    detail: {
      price: {
        avg: 42000,
        updatedAt: '2026-05-04T12:00:00Z'
      }
    }
  },
  {
    id: 3,
    name: 'FIESTA RTS BEEF YAKINIKU 300GR',
    category: 'food',
    brand: undefined,
    unit: 'PIECE',
    status: 'approved' as const,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    detail: {
      price: {
        avg: 55200,
        updatedAt: '2026-05-04T17:40:24.336387Z'
      }
    }
  },
  {
    id: 4,
    name: 'Gula Pasir 1kg',
    category: 'food',
    brand: 'Gulaku',
    unit: 'PIECE',
    status: 'approved' as const,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    detail: {
      price: {
        avg: 18500,
        updatedAt: '2026-05-04T10:15:00Z'
      }
    }
  },
  {
    id: 5,
    name: 'Susu UHT Full Cream 1L',
    category: 'beverage',
    brand: 'Ultra Milk',
    unit: 'PIECE',
    status: 'approved' as const,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    detail: {
      price: {
        avg: 22500,
        updatedAt: '2026-05-04T09:45:00Z'
      }
    }
  },
  {
    id: 6,
    name: 'Telur Ayam 1kg',
    category: 'food',
    brand: undefined,
    unit: 'PIECE',
    status: 'approved' as const,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    detail: {
      price: {
        avg: 32000,
        updatedAt: '2026-05-04T11:20:00Z'
      }
    }
  },
  {
    id: 7,
    name: 'Kecap Manis 600ml',
    category: 'food',
    brand: 'ABC',
    unit: 'PIECE',
    status: 'approved' as const,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    detail: {
      price: {
        avg: 18500,
        updatedAt: '2026-05-04T13:00:00Z'
      }
    }
  },
  {
    id: 8,
    name: 'Mie Instan Ayam Bawang',
    category: 'food',
    brand: 'Indomie',
    unit: 'PIECE',
    status: 'approved' as const,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    detail: {
      price: {
        avg: 3500,
        updatedAt: '2026-05-04T15:30:00Z'
      }
    }
  },
  {
    id: 9,
    name: 'Sabun Mandi 100g',
    category: 'household',
    brand: 'Lifebuoy',
    unit: 'PIECE',
    status: 'approved' as const,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    detail: {
      price: {
        avg: 8500,
        updatedAt: '2026-05-04T08:45:00Z'
      }
    }
  },
  {
    id: 10,
    name: 'Deterjen Bubuk 1kg',
    category: 'household',
    brand: 'Rinso',
    unit: 'PIECE',
    status: 'approved' as const,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    detail: {
      price: {
        avg: 28500,
        updatedAt: '2026-05-04T16:00:00Z'
      }
    }
  }
]

export const handlers = [
  // Products list endpoint
  http.get('/api/v1/products', ({ request }) => {
    const url = new URL(request.url)
    const search = url.searchParams.get('search')?.toLowerCase() ?? ''
    const category = url.searchParams.get('category') ?? ''
    const storeId = url.searchParams.get('storeId') ? parseInt(url.searchParams.get('storeId')!, 10) : null
    const page = parseInt(url.searchParams.get('page') ?? '1', 10)
    const pageSize = parseInt(url.searchParams.get('pageSize') ?? '10', 10)

    // Filter products
    let filtered = [...mockProducts]

    // Filter by store if storeId is provided
    if (storeId) {
      const storeProductIds = new Set(Object.keys(storeProductPrices[storeId] ?? {}).map(Number))
      filtered = filtered.filter((p) => storeProductIds.has(p.id))
    }

    if (search) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(search) ||
          (product.brand?.toLowerCase().includes(search) ?? false)
      )
    }

    if (category && category !== 'All') {
      filtered = filtered.filter((product) => product.category === category)
    }

    // Add store-specific price data if storeId provided
    if (storeId) {
      const prices = storeProductPrices[storeId] ?? {}
      filtered = filtered.map((p) => {
        const storePrice = prices[p.id]
        if (storePrice) {
          return {
            ...p,
            latestPrice: storePrice.price,
            avgPrice: storePrice.price,
            detail: {
              price: {
                avg: storePrice.price,
                updatedAt: '2026-05-04T12:00:00Z',
              },
            },
          }
        }
        return p
      })
    }

    // Pagination
    const totalItems = filtered.length
    const totalPages = Math.ceil(totalItems / pageSize)
    const start = (page - 1) * pageSize
    const end = start + pageSize
    const paginatedData = filtered.slice(start, end)

    const response: ProductListResponse = {
      data: paginatedData,
      pagination: {
        page,
        pageSize,
        totalItems,
        totalPages,
        hasNext: page < totalPages,
        hasPrevious: page > 1,
      },
    }

    return HttpResponse.json(response)
  }),

  // Store list endpoint with search
  http.get('/api/v1/stores', ({ request }) => {
    const url = new URL(request.url)
    const search = url.searchParams.get('search')?.toLowerCase() ?? ''
    const chain = url.searchParams.get('chain') ?? ''
    const page = parseInt(url.searchParams.get('page') ?? '1', 10)
    const pageSize = parseInt(url.searchParams.get('pageSize') ?? '8', 10)

    // Filter stores
    let filtered = [...mockStoresWithStats]

    if (search) {
      filtered = filtered.filter(
        (store) =>
          store.name.toLowerCase().includes(search) ||
          store.location.toLowerCase().includes(search) ||
          (store.chain?.toLowerCase().includes(search) ?? false)
      )
    }

    if (chain && chain !== 'All') {
      filtered = filtered.filter((store) => store.chain === chain)
    }

    // Pagination
    const totalItems = filtered.length
    const totalPages = Math.ceil(totalItems / pageSize)
    const start = (page - 1) * pageSize
    const end = start + pageSize
    const paginatedData = filtered.slice(start, end)

    const response: StoreListResponse = {
      data: paginatedData,
      pagination: {
        page,
        pageSize,
        totalItems,
        totalPages,
        hasNext: page < totalPages,
        hasPrevious: page > 1,
      },
    }

    return HttpResponse.json(response)
  }),

  // Get store chains for filter
  http.get('/api/v1/stores/chains', () => {
    const chains = [...new Set(mockStoresWithStats.map((s) => s.chain).filter(Boolean))]
    return HttpResponse.json({ data: chains })
  }),

  // Trigger product price recalculation job
  http.post('/v1/admin/jobs/product-prices-calculate', () =>
    HttpResponse.json({ jobId: crypto.randomUUID(), status: 'PENDING' }),
  ),

  // Correct receipt
  http.post('/v1/receipts/:id/correct', async ({ params }) => {
    const response: ReceiptCorrectResponse = {
      receiptId: params.id as string,
      status: 'PENDING_REVIEW',
    }
    return HttpResponse.json(response)
  }),

  // Get single store with stats
  http.get('/api/v1/stores/:storeId', ({ params }) => {
    const storeId = parseInt(params.storeId as string, 10)
    const store = mockStoresWithStats.find((s) => s.id === storeId)

    if (!store) {
      return new HttpResponse(null, { status: 404 })
    }

    return HttpResponse.json(store)
  }),
]
