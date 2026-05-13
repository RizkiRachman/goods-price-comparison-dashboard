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

### Added
- Release plan, PR template, changelog, and project-level documentation
- Store name display on product price detail page
- UI consistency across pages (gradient headers, overlap pattern, gray color scheme)
- Staggered entrance animations on card grids
- Price stat cards with clean floating design
- Pending receipts page at `/receipts/pending` with approve/reject actions, accessible from navbar

### Changed
- Vite dev server proxy: `/api` now routes to `http://dev.good-prices:8082/goods-price-service` instead of `http://localhost:8080`
- GoodsListPage: refactored with overlap pattern, consistent header gradient
- StoreDetailPage: refactored with overlap pattern, consistent styling
- GoodCard, StoreCard, SkeletonCard: unified to `rounded-2xl` and gray color scheme
- SearchModeToggle, SearchBar: updated colors to match design language
- PriceSummary cards: replaced gradient backgrounds with white/backdrop-blur for clean overlap
- ReceiptRow: added color accent bar, store avatar, availability indicator, badges
- ReceiptHistoryDrawer: removed approved/rejected count stats grid for cleaner layout

### Removed
- ReceiptHistoryDrawer: quick stats grid with approved/rejected counts

### Fixed
- "Terbaru" stat now shows most recent price instead of cheapest
- Pending receipts page upload button now opens upload modal inline instead of navigating to home page

### Changed
- Moved total product/store count from stats bar into navbar badge on main page
- Removed Disetujui and Struk stat cards from main page stats bar
