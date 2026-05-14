# Changelog

All notable changes to this project are documented here.

## [1.1.0] - 2026-05-13

### Added
- Admin panel at `/admin/*` with sidebar navigation (Motion layout animations)
  - Category management: list, create, edit, delete (`/admin/categories`)
  - Unit management: list, create, edit, delete (`/admin/units`)
- Bill split feature from receipt detail page (`/receipts/:receiptId`)
  - Mode selection: Bagi Rata (equal split) or Pilih Barang (item-based)
  - SELECTION mode: set max participants, add per-person item selections with shared quantity tracking
  - Expandable participant cards with item breakdown
  - Unassigned items summary
- Generic reusable components:
  - `DataTable` — sortable, searchable table with pagination and Motion row animations
  - `FormModal` — bottom-sheet modal with backdrop, drag handle, ESC close
  - `FormBanner` — animated error/success/warning banners
  - `SubmitButton` — 3-state button (loading/done/idle)
  - `AdminLayout` — sidebar + mobile nav + page transitions
- `useSyncFormData` hook — sync API data into form state without ESLint violations
- Admin gear icon in main navbar linking to `/admin/categories`
- Expandable receipt item cards on receipt detail page (card-level + item-level collapse)

### Changed
- Package dependencies: added `motion` (formerly Framer Motion) for layout animations
- `BillSplitOrder` type: now nested under `BillSplitOrderGroup` with `details` array
- Receipt detail page: items section is now collapsible — tap header to show/hide all items
- Split bill modal: redesigned with 3-step flow (mode → participants → items)
- Unit `: UnitType` in API types: `WEIGHT | VOLUME | QUANTITY`

### Removed
- RATIO mode temporarily removed from bill split (restored in this release)

## [Unreleased]

## [0.2.0] - 2026-05-14

### Added
- Motion animation library integration (motiondivision/motion)
- Glassmorphism design system: `GlassCard`, `ModalShell`, `DrawerShell`, `PageTransition`, `StaggerGrid`, `Skeleton` UI primitives
- Admin CRUD pages for categories (`/admin/categories`) and units (`/admin/units`)
  - List, create, edit, delete with DataTable component
  - API-backed via `/v1/categories` and `/v1/units`
  - AdminLayout with top bar navigation between Kategori/Satuan tabs
- Shared config types for Category and Unit in `src/types/api.ts`
- Content Security Policy (CSP) meta tag in `index.html`
- `withCredentials: true` on API client for secure cookie auth

### Changed
- All cards (GoodCard, StoreCard, ReceiptRow) — glassmorphism styling with `bg-white/80 backdrop-blur-xl`
- Modals (ReceiptUpload, ProductPicker, PriceCorrect) — animated via ModalShell with spring physics
- Drawers (PendingReceipts, ReceiptHistory) — animated via DrawerShell
- Filter chips (CategoryChips, ChainFilterChips) — glass inactive states
- Pagination, SearchBar, SearchModeToggle — glassmorphism styling
- SkeletonCard — Motion shimmer loop replacing CSS `animate-pulse`
- GoodsListPage — StaggerGrid replacing CSS `fade-in-up` keyframes
- GoodsDetailPage — StaggerGrid + GlassCard for price summary cards
- StoreDetailPage — StaggerGrid for product cards
- App.tsx — AnimatePresence mode="wait" + PageTransition per route
- index.css — removed 3 custom keyframes (replaced by Motion)
- AdminLayout — simplified to top bar + centered content layout

### Fixed
- Laggy transitions: removed expensive `boxShadow` animations, replaced spring with tween for hovers, removed `layout` from filter chips, lightened spring masses
