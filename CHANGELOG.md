# Changelog

All notable changes to this project are documented here.

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
