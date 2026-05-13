export type EntityStatus =
  | 'pending'
  | 'pending_review'
  | 'pending_approval'
  | 'approved'
  | 'rejected'
  | 'ingestion'
  | 'ingestion_failed'
  | 'completed'

export type ReceiptStatus =
  | 'PENDING'
  | 'PENDING_REVIEW'
  | 'INGESTING'
  | 'INGESTION_FAILED'
  | 'APPROVED'
  | 'REJECTED'
  | 'FAILED'
  | 'COMPLETED'

export type Granularity = 'daily' | 'weekly' | 'monthly'

export type NotificationMethod = 'email' | 'push' | 'sms'

export type PromoType = 'discount' | 'bundle' | 'buy_one_get_one' | 'clearance'

export type ProductAvailability = 'in_stock' | 'low_stock' | 'out_of_stock' | 'unknown'

export type SortDirection = 'asc' | 'desc'

export interface Pagination {
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
  hasNext: boolean
  hasPrevious: boolean
}

export interface DateRange {
  from?: string
  to?: string
}

export interface ErrorDetails {
  code: string
  message: string
  details?: ValidationError[]
  timestamp: string
  path: string
}

export interface ValidationError {
  field: string
  message: string
}

export interface ErrorResponse {
  error: ErrorDetails
}

export interface ApiVersionResponse {
  version: string
  fullVersion: string
  status: 'stable' | 'beta' | 'deprecated' | 'sunset'
  supportedVersions: {
    version: string
    status: 'stable' | 'beta' | 'deprecated' | 'sunset'
    baseUrl: string
  }[]
  deprecationInfo: {
    deprecatedSince: string
    sunsetDate: string
    migrationGuide: string
  } | null
}

export interface HealthResponse {
  status: 'UP' | 'DOWN'
  components: {
    api: 'UP' | 'DOWN'
    database: 'UP' | 'DOWN'
    ocr?: 'UP' | 'DOWN'
  }
  timestamp: string
  version: string
}

export interface MetricsResponse {
  uptime: number
  requests: {
    total: number
    successful: number
    failed: number
    ratePerMinute: number
  }
  responseTime: {
    average: number
    p50: number
    p95: number
    p99: number
  }
  errors: {
    validationErrors: number
    notFoundErrors: number
    serverErrors: number
  }
  timestamp: string
}

export interface Product {
  id: number
  name: string
  category?: string
  brand?: string
  unit?: string
  status: EntityStatus
  createdAt: string
  updatedAt: string
  // Price detail from backend (available when includePrice=true)
  detail?: {
    price?: {
      avg?: number
      min?: number
      max?: number
      updatedAt?: string // ISO datetime string (e.g., "2026-05-04T11:30:00Z")
    }
  }
  // Price summary fields (for backward compatibility)
  latestPrice?: number
  avgPrice?: number
  lowestPrice?: number
  highestPrice?: number
  latestStore?: {
    id: number
    name: string
    location: string
  }
  latestDate?: string
  totalReports?: number
}

export interface CreateProductRequest {
  name: string
  category?: string
  brand?: string
  unit?: string
  status?: EntityStatus
}

export interface UpdateProductRequest {
  name?: string
  category?: string | null
  brand?: string | null
  unit?: string | null
  status?: EntityStatus
}

export interface ProductListResponse {
  data: Product[]
  pagination: Pagination
}

export interface Store {
  id: number
  name: string
  location: string
  chain?: string
  address?: string
  latitude?: number
  longitude?: number
  status: EntityStatus
  createdAt: string
  // Stats fields (optional, returned by search/list endpoints)
  totalProducts?: number
  priceRange?: {
    min: number
    max: number
  }
  avgPrice?: number
  lastUpdated?: string
}

export interface CreateStoreRequest {
  name: string
  location: string
  chain?: string
  address?: string
  latitude?: number
  longitude?: number
}

export interface UpdateStoreRequest {
  name?: string
  location?: string
  chain?: string | null
  address?: string | null
  latitude?: number | null
  longitude?: number | null
  status?: EntityStatus
}

export interface StoreListResponse {
  data: Store[]
  pagination: Pagination
}

export interface PriceRecord {
  id: number
  productId: number
  storeId: number
  storeName: string
  price: number
  unitPrice?: number
  dateRecorded: string
  isPromo: boolean
  promoDetails?: PromoDetails | null
  availability: ProductAvailability
  status: EntityStatus
  createdAt: string
  updatedAt: string
}

export interface PromoDetails {
  promoType: PromoType
  discountPercentage?: number
  validUntil?: string
}

export interface CreatePriceRecordRequest {
  storeId: number
  price: number
  unitPrice?: number
  dateRecorded?: string
  isPromo?: boolean
  promoDetails?: PromoDetails | null
  availability?: ProductAvailability
  status?: EntityStatus
}

export interface UpdatePriceRecordRequest {
  price?: number
  unitPrice?: number | null
  dateRecorded?: string
  isPromo?: boolean
  promoDetails?: PromoDetails | null
  availability?: ProductAvailability
  status?: EntityStatus
}

export interface PriceRecordListResponse {
  data: PriceRecord[]
  pagination: Pagination
}

export interface PriceSearchRequest {
  productName: string
  dateRange?: DateRange
  location?: string
  sortBy?: 'price' | 'date' | 'store'
  sortOrder?: SortDirection
}

export interface PriceResult {
  storeId: number
  storeName: string
  storeLocation: string
  price: number
  unitPrice: number
  dateRecorded: string
  isPromo: boolean
}

export interface CheapestPrice {
  storeName: string
  price: number
  savings: number
}

export interface PriceSearchResponse {
  productName: string
  results: PriceResult[]
  cheapest: CheapestPrice
}

export interface PriceSearchRequestV2 {
  productName: string
  dateRange?: DateRange
  location?: string
  brand?: string
  category?: string
  storeChain?: string
  sortBy?: 'price' | 'date' | 'store' | 'relevance'
  sortOrder?: SortDirection
  includePrediction?: boolean
  includeHistory?: boolean
  page?: number
  pageSize?: number
}

export interface PriceResultV2 {
  storeId: number
  storeName: string
  storeLocation: string
  storeChain?: string
  price: number
  unitPrice: number
  dateRecorded: string
  isPromo: boolean
  promoDetails?: PromoDetails | null
  priceHistory?: { date: string; price: number }[] | null
  priceChange?: {
    changeAmount: number
    changePercentage: number
    trend: 'rising' | 'falling' | 'stable'
  }
  availability: ProductAvailability
  distance?: number
  relevanceScore?: number
}

export interface PriceSearchResponseV2 {
  productName: string
  results: PriceResultV2[]
  cheapest: CheapestPrice
  pagination: Pagination
  predictions?: {
    nextWeekPrice: number
    confidence: number
    trend: 'rising' | 'falling' | 'stable'
  } | null
  metadata?: {
    searchTime: string
    resultCount: number
    filtersApplied: string[]
  }
}

export interface ReceiptUploadResponse {
  receiptId: string
  status: ReceiptStatus
}

export interface ReceiptStatusResponse {
  receiptId: string
  status: ReceiptStatus
}

export interface ReceiptResultItem {
  productName: string
  category?: string
  quantity: number
  unitPrice: number
  totalPrice: number
  unit?: string
}

export interface ReceiptResultResponse {
  receiptId: string
  storeName: string
  storeLocation?: string
  date?: string
  items: ReceiptResultItem[]
  totalAmount: number
}

export interface ReceiptApproveResponse {
  receiptId: string
  status: ReceiptStatus
}

export interface ReceiptRejectResponse {
  receiptId: string
  status: ReceiptStatus
}

export interface ReceiptCorrectRequest {
  storeName: string
  storeLocation?: string
  date?: string
  totalAmount: number
  items: ReceiptResultItem[]
}

export interface ReceiptCorrectResponse {
  receiptId: string
  status: ReceiptStatus
}

export interface ReceiptCreateRequest {
  storeName: string
  storeLocation?: string
  date?: string
  totalAmount: number
  items: ReceiptResultItem[]
}

export type ReceiptCreateResponse = ReceiptResultResponse

export interface ShoppingOptimizeRequest {
  items: string[]
  preferences?: ShoppingPreferences
}

export interface ShoppingPreferences {
  maxStores?: number
  prioritizePrice?: boolean
}

export interface ShoppingItem {
  productName: string
  price: number
  quantity: number | null
  unit?: string | null
}

export interface StoreVisit {
  storeId: number
  storeName: string
  storeLocation: string
  items: ShoppingItem[]
  subtotal: number
  estimatedTime: string
}

export interface ShoppingSavings {
  comparedToSingleStore: number
  percentage: number
}

export interface ShoppingOptimizeResponse {
  totalItems: number
  totalCost: number
  storesToVisit: number
  route: StoreVisit[]
  savings: ShoppingSavings
}

export interface ProductTrendResponse {
  productId: number
  productName: string
  trend: TrendDataPoint[]
  trendDirection: 'increasing' | 'decreasing' | 'stable'
  priceChange: number
}

export interface TrendDataPoint {
  period: string
  avgPrice: number
  minPrice: number
  maxPrice: number
  dataPoints: number
}

export interface AlertSubscriptionRequest {
  productId: number
  targetPrice: number
  notificationMethod: NotificationMethod
  email?: string
}

export interface AlertSubscriptionResponse {
  subscriptionId: string
  status: 'ACTIVE' | 'PAUSED' | 'EXPIRED'
  productName: string
  currentPrice: number
  targetPrice: number
  message: string
}

export interface TrackedJob {
  receiptId: string
  status: ReceiptStatus
  fileName?: string
  result?: ReceiptResultResponse
  addedAt: number
}

// ── Category types ────────────────────────────────────────────────

export interface Category {
  id: string
  name: string
  description?: string | null
  status: EntityStatus
  createdAt: string
  updatedAt: string
}

export interface CreateCategoryRequest {
  id: string
  name: string
  description?: string
  status?: EntityStatus
}

export interface UpdateCategoryRequest {
  name?: string
  description?: string | null
  status?: EntityStatus
}

export interface CategoryListResponse {
  data: Category[]
  pagination: Pagination
}

// ── Unit types ────────────────────────────────────────────────────

export type UnitType = 'WEIGHT' | 'VOLUME' | 'QUANTITY'

export interface Unit {
  id: string
  name: string
  symbol?: string
  type: UnitType
  description?: string | null
  status: EntityStatus
  createdAt: string
  updatedAt: string
}

export interface CreateUnitRequest {
  id: string
  name: string
  symbol?: string
  type: UnitType
  description?: string
  status?: EntityStatus
}

export interface UpdateUnitRequest {
  name?: string
  symbol?: string | null
  type?: UnitType
  description?: string | null
  status?: EntityStatus
}

export interface UnitListResponse {
  data: Unit[]
  pagination: Pagination
}

// ── Bill Split types ──────────────────────────────────────────────

export type BillSplitType = 'RATIO' | 'SELECTION'

export interface BillSplitOrder {
  name: string
  productId: number
  quantity: number
}

export interface BillSplitOrderGroup {
  name: string
  details: BillSplitOrder[]
}

export interface BillSplitRequest {
  type: BillSplitType
  numberOfParticipants: number
  orders?: BillSplitOrderGroup[]
}

export interface BillSplitItem {
  productId: number
  productName: string
  quantity: number
  unitPrice: number
  subtotal: number
}

export interface BillSplitParticipant {
  name: string
  items: BillSplitItem[]
  subtotal: number
}

export interface BillSplitResponse {
  receiptId: string
  type: BillSplitType
  numberOfParticipants: number
  totalAmount: number
  unassignedTotal: number
  participants: BillSplitParticipant[]
}
