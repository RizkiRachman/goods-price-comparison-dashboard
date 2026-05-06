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
