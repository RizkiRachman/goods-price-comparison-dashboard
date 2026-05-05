export type Unit = 'kg' | 'pcs' | 'pack' | 'liter' | 'ml' | 'gr'

export interface Store {
  id: string
  name: string
  location: string
  city: string
}

export interface StoreSummary extends Store {
  totalItems: number
  totalCategories: number
  lastReceiptDate: string
}

export interface ReceiptItem {
  id: string
  goodId: string
  goodName: string
  category: string
  unit: Unit
  unitPrice: number
  quantity: number
  totalPrice: number
  discount: number
  store: Store
  receiptDate: string
}

export interface GoodPriceSummary {
  goodId: string
  goodName: string
  category: string
  unit: Unit
  latestPrice: number
  avgPrice: number
  lowestPrice: number
  highestPrice: number
  latestStore: Store
  latestDate: string
  totalReports: number
}

export interface PagedResult<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}
