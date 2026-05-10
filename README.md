<a id="readme-top"></a>

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![CI](https://img.shields.io/github/actions/workflow/status/RizkiRachman/goods-price-comparison-dashboard/ci-build.yml?style=for-the-badge)](https://github.com/RizkiRachman/goods-price-comparison-dashboard/actions/workflows/ci-build.yml)

<br />
<div align="center">
  <a href="https://github.com/RizkiRachman/goods-price-comparison-dashboard">
    <img src="public/favicon.svg" alt="Logo" width="80" height="80">
  </a>

<h3 align="center">HargaKu</h3>

  <p align="center">
    Pantau Harga Belanjaan Pribadi — Track, compare, and optimize your grocery spending across stores.
    <br />
    <a href="https://github.com/RizkiRachman/goods-price-comparison-dashboard"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/RizkiRachman/goods-price-comparison-dashboard">View Demo</a>
    &middot;
    <a href="https://github.com/RizkiRachman/goods-price-comparison-dashboard/issues/new?labels=bug">Report Bug</a>
    &middot;
    <a href="https://github.com/RizkiRachman/goods-price-comparison-dashboard/issues/new?labels=enhancement">Request Feature</a>
  </p>
</div>

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#routes">Routes</a></li>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
        <li><a href="#environment">Environment</a></li>
      </ul>
    </li>
    <li>
      <a href="#usage">Usage</a>
      <ul>
        <li><a href="#scripts">Scripts</a></li>
        <li><a href="#project-structure">Project Structure</a></li>
      </ul>
    </li>
    <li><a href="#api-reference">API Reference</a></li>
    <li><a href="#architecture">Architecture</a></li>
    <li><a href="#development">Development</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>

## About The Project

HargaKu is a personal grocery price tracking dashboard. Upload receipt photos or manually input items, then compare prices across stores to find the best deals. Built with React 19, TypeScript, and Vite.

### Features

**Receipt Processing**
- Upload receipt images with auto-compression (< 6MB via Canvas API)
- OCR-based item extraction with status polling
- Approve, reject, or correct extracted receipt data

**Product & Store Search**
- Dual-mode search: toggle between product and store browsing
- Filter by category or store chain
- Paginated results with price summaries

**Price Tracking**
- Per-product detail pages with price history (lowest, latest, highest)
- Cross-store price comparison with promo badges
- Subscribe to price drop alerts per product

**Shopping Trip Optimizer**
- Build a shopping list (up to 5 items)
- Get optimized multi-store route recommendations with cost savings
- Compare single-store vs multi-store scenarios

**Data Management**
- Manual receipt creation with dynamic item entry
- Price correction modal for adjusting individual store prices
- Receipt history persisted in localStorage

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Routes

| Path | Page | Description |
|------|------|-------------|
| `/` | Redirect → `/goods` | Root redirect |
| `/goods` | `GoodsListPage` | Search products or stores, upload receipts |
| `/goods/:id` | `GoodsDetailPage` | Product price history and details |
| `/stores/:storeId` | `StoreDetailPage` | Store details and product catalog |
| `/tracker` | `GoodsTrackerPage` | Shopping trip optimizer |
| `/receipts/pending` | `PendingReceiptsPage` | Pending uploads and approvals |
| `/receipts/create` | `ReceiptCreatePage` | Manual receipt entry |
| `/receipts/:receiptId` | `ReceiptDetailPage` | Single receipt view with approve/reject |
| `/receipts/:receiptId/correct` | `ReceiptCorrectionPage` | Correct receipt data |

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

* [![React][React.js]][React-url]
* [![TypeScript][TypeScript]][TypeScript-url]
* [![Vite][Vite]][Vite-url]
* [![Tailwind CSS][Tailwind]][Tailwind-url]
* [![React Query][ReactQuery]][ReactQuery-url]
* [![React Router][ReactRouter]][ReactRouter-url]
* [![Axios][Axios]][Axios-url]
* [![Vitest][Vitest]][Vitest-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Getting Started

### Prerequisites

| Tool | Version | Notes |
|------|---------|-------|
| Node.js | >= 20 (LTS) | Check with `node -v` |
| npm | >= 10 | Bundled with Node.js |

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/RizkiRachman/goods-price-comparison-dashboard.git
   cd goods-price-comparison-dashboard
   ```
2. Install dependencies
   ```sh
   npm install
   ```
3. Start the dev server
   ```sh
   npm run dev
   ```
4. Open [http://localhost:5173](http://localhost:5173)

### Environment

```bash
VITE_API_BASE_URL=/api
```

The dev server proxies `/api` requests to your backend. Configure the target in `vite.config.ts`:

```ts
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8080',
      changeOrigin: true,
      secure: false,
      rewrite: (path) => path.replace(/^\/api/, ''),
    },
  },
}
```

All env vars must be prefixed with `VITE_` (Vite convention). Optional — defaults to empty string if unset.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Usage

### Scripts

```bash
npm run dev         # Start dev server on localhost:5173
npm run build       # TypeScript check + production build
npm run lint        # ESLint (flat config)
npm run test        # Vitest
npm run test:watch  # Vitest watch mode
npm run preview     # Preview production build
```

### Project Structure

```
src/
├── api/                # API client layer
│   ├── client.ts       # Axios instance with env base URL
│   ├── factory.ts      # Generic CRUD factory (list/get/create/update/delete)
│   ├── products.ts     # Product endpoints
│   ├── stores.ts       # Store endpoints  
│   ├── prices.ts       # Price search & CRUD (v1 & v2 search)
│   ├── receipts.ts     # Upload, status, approve/reject, correct, create
│   ├── shopping.ts     # Shopping optimizer
│   ├── alerts.ts       # Price drop alert subscriptions
│   ├── admin.ts        # Admin job triggers
│   └── system.ts       # Version, health, metrics
├── components/         # Reusable UI components
│   ├── SearchBar.tsx
│   ├── SearchModeToggle.tsx
│   ├── CategoryChips.tsx
│   ├── ChainFilterChips.tsx
│   ├── GoodCard.tsx / StoreCard.tsx
│   ├── Pagination.tsx
│   ├── SkeletonCard.tsx
│   ├── PriceComponents.tsx
│   ├── PriceCorrectModal.tsx
│   ├── ReceiptUploadModal.tsx
│   ├── PendingReceiptsDrawer.tsx
│   ├── ReceiptHistoryDrawer.tsx
│   ├── ProductPickerModal.tsx
│   ├── RecentUploadsStrip.tsx
│   └── ContributionStats.tsx
├── hooks/              # Custom React hooks (17 hooks)
│   ├── useGoods.ts / useStores.ts / usePrices.ts
│   ├── useReceiptManager.ts / useReceiptJobs.ts / useReceiptHistory.ts
│   ├── useShopping.ts / useShoppingOptimizeMutation.ts
│   ├── useReceiptCreate.ts / useReceiptCorrection.ts
│   ├── useAlerts.ts / useSystem.ts / usePriceCorrection.ts
│   ├── useProductPricesCalculate.ts
│   ├── useProductsByStore.ts
│   ├── useDebounce.ts / usePagination.ts
│   └── usePriceCorrection.ts
├── lib/                # Utilities
│   ├── utils.ts        # Formatting (IDR, dates), image compression, cleanup
│   └── query-factory.ts # Standardized TanStack Query hook factory
├── mocks/              # MSW mock service worker
│   ├── data.ts         # 6 stores × 10 products × prices
│   └── handlers.ts     # 344 lines of API mock handlers
├── pages/              # Route-level page components
│   ├── GoodsListPage.tsx + GoodsListPage.logic.ts
│   ├── GoodsDetailPage.tsx
│   ├── GoodsTrackerPage.tsx
│   ├── PendingReceiptsPage.tsx
│   ├── ReceiptCreatePage.tsx
│   ├── ReceiptDetailPage.tsx
│   ├── ReceiptCorrectionPage.tsx
│   ├── StoreDetailPage.tsx
│   └── GoodsDetailPage.tsx
├── types/              # TypeScript type definitions
│   ├── api.ts          # 480 lines — full API contract types
│   ├── goods.ts        # Frontend-specific types
│   └── receipt.ts      # Receipt job types
├── test/               # Test files
├── App.tsx             # Router configuration
└── main.tsx            # Entry point (QueryClient + BrowserRouter)
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## API Reference

The backend exposes a REST API under `/v1/`. All requests go through the Axios client at `src/api/client.ts`.

| Category | Endpoint | Method | Description |
|----------|----------|--------|-------------|
| **Products** | `/v1/products` | GET | List (paginated, search, filter by category/brand) |
| | `/v1/products` | POST | Create |
| | `/v1/products/:id` | GET | Detail |
| | `/v1/products/:id` | PUT | Update |
| | `/v1/products/:id` | DELETE | Delete |
| | `/v1/products/trend/:id` | GET | Price trend data |
| **Stores** | `/v1/stores` | GET | List (paginated, search, filter by chain) |
| | `/v1/stores` | POST | Create |
| | `/v1/stores/:id` | GET | Detail |
| | `/v1/stores/:id` | PUT | Update |
| | `/v1/stores/:id` | DELETE | Delete |
| | `/v1/stores/chains` | GET | List unique chain names |
| **Prices** | `/v1/prices/search` | POST | Search (v1) |
| | `/v2/prices/search` | POST | Search (v2, with predictions) |
| | `/v1/products/:productId/prices` | GET | List for product |
| | `/v1/products/:productId/prices` | POST | Create for product |
| | `/v1/prices/:priceId` | GET/ PUT/ DELETE | Single price CRUD |
| **Receipts** | `/v1/receipts/upload` | POST | Upload image (multipart) |
| | `/v1/receipts` | POST | Create manually |
| | `/v1/receipts/:id/status` | GET | Processing status |
| | `/v1/receipts/:id/results` | GET | Extracted results |
| | `/v1/receipts/:id/approve` | POST | Approve |
| | `/v1/receipts/:id/reject` | DELETE | Reject |
| | `/v1/receipts/:id/correct` | POST | Correct data |
| **Shopping** | `/v1/shopping/optimize` | POST | Optimize shopping trip |
| **Alerts** | `/v1/alerts/subscribe` | POST | Subscribe to price alerts |
| **Admin** | `/v1/admin/jobs/product-prices-calculate` | POST | Recalculate prices |
| **System** | `/v1/version` | GET | API version |
| | `/v1/health` | GET | Health check |
| | `/v1/metrics` | GET | API metrics |

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Architecture

### State Management
- **Server state**: TanStack React Query (staleTime: 60s, retry: 1). All API calls flow through `src/api/` modules.
- **UI state**: Local `useState`/`useReducer` — no global state store.
- **Receipt jobs**: In-memory + localStorage persistence via `useReceiptJobs` hook with status polling.
- **Receipt history**: localStorage (max 50 entries).

### Data Flow
```
Page → Custom Hook (e.g., useProducts) → API Module (e.g., products.ts) → Axios Client → Backend
                                              ↕
                                     React Query Cache
                                              ↕
                                    Query Factory (createListQueryHook, etc.)
```

### Key Design Patterns
- **Generic CRUD factory** (`src/api/factory.ts`) — standardizes list/get/create/update/delete for products and stores
- **Query factory** (`src/lib/query-factory.ts`) — generates typed TanStack Query hooks with auto-invalidation
- **Receipt manager** (`useReceiptManager`) — composites job tracking + history + stats into one hook
- **Image compression** — Canvas API compresses uploads > 3.5MB at 0.5 quality to stay under 6MB

### CI/CD
| Workflow | Trigger | Steps |
|----------|---------|-------|
| `ci-build` | Push/PR to main | `npm ci` → `tsc` → `lint` → `test` → `build` |
| `ci-release` | Push to main (version bump) | Build + create GitHub Release |
| `ci-publish` | Push to main / manual | Production build |
| `pr-labeler` | PR events | Auto-label based on config |
| `codeql` | Push/PR + weekly | CodeQL security analysis |

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Development

### Mock API

MSW (Mock Service Worker) handlers simulate all major endpoints with realistic data — 10 products, 6 stores, and a matrix of store-product prices. No backend required for frontend development.

To enable MSW:
```ts
// src/main.tsx — uncomment or add:
async function enableMocking() {
  const { worker } = await import('./mocks/browser')
  return worker.start()
}
```

### Code Quality

```bash
npm run build    # Must pass: zero type errors
npm run lint     # Must pass: zero warnings  
npm run test     # Must pass: 100% pass rate
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Roadmap

- [x] Receipt upload with OCR and status polling
- [x] Manual receipt entry with dynamic items
- [x] Product and store search with dual-mode toggle
- [x] Product detail with price history and trends
- [x] Shopping trip optimizer with multi-store routing
- [x] Receipt approve/reject/correct workflow
- [x] Price alert subscriptions
- [ ] Dark mode (Tailwind dark variant ready)
- [ ] Barcode scanning for quick product lookup
- [ ] Price history charts (weekly/monthly granularity)
- [ ] Export receipts to PDF/CSV
- [ ] Multi-language support (i18n)
- [ ] Push notifications for price drops

See the [open issues](https://github.com/RizkiRachman/goods-price-comparison-dashboard/issues) for a full list of proposed features and known issues.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Contributing

Contributions make the open source community an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'feat: add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Commit Convention

```
<type>: <description>
```

Types: `feat` | `fix` | `refactor` | `docs` | `test` | `chore` | `style`

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## License

Distributed under the MIT License.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Contact

Rizki Rachman — [@RizkiRachman](https://github.com/RizkiRachman)

Project Link: [https://github.com/RizkiRachman/goods-price-comparison-dashboard](https://github.com/RizkiRachman/goods-price-comparison-dashboard)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
[contributors-shield]: https://img.shields.io/github/contributors/RizkiRachman/goods-price-comparison-dashboard.svg?style=for-the-badge
[contributors-url]: https://github.com/RizkiRachman/goods-price-comparison-dashboard/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/RizkiRachman/goods-price-comparison-dashboard.svg?style=for-the-badge
[forks-url]: https://github.com/RizkiRachman/goods-price-comparison-dashboard/network/members
[stars-shield]: https://img.shields.io/github/stars/RizkiRachman/goods-price-comparison-dashboard.svg?style=for-the-badge
[stars-url]: https://github.com/RizkiRachman/goods-price-comparison-dashboard/stargazers
[issues-shield]: https://img.shields.io/github/issues/RizkiRachman/goods-price-comparison-dashboard.svg?style=for-the-badge
[issues-url]: https://github.com/RizkiRachman/goods-price-comparison-dashboard/issues
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[TypeScript]: https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white
[TypeScript-url]: https://www.typescriptlang.org/
[Vite]: https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white
[Vite-url]: https://vitejs.dev/
[Tailwind]: https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white
[Tailwind-url]: https://tailwindcss.com/
[ReactQuery]: https://img.shields.io/badge/React_Query-FF4154?style=for-the-badge&logo=reactquery&logoColor=white
[ReactQuery-url]: https://tanstack.com/query/latest
[ReactRouter]: https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=reactrouter&logoColor=white
[ReactRouter-url]: https://reactrouter.com/
[Axios]: https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white
[Axios-url]: https://axios-http.com/
[Vitest]: https://img.shields.io/badge/Vitest-6B9F3A?style=for-the-badge&logo=vitest&logoColor=white
[Vitest-url]: https://vitest.dev/
