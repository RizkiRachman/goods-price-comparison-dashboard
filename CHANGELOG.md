# Changelog

All notable changes to this project are documented here.

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
