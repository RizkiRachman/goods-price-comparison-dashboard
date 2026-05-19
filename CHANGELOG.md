# Changelog

All notable changes to this project are documented here.

## [0.3.0] - 2026-05-18

### Added
- About Us overlay accessible from navbar info icon (`(i)` button)
  - App overview with bullet-point feature list
  - Admin preview section with links to Category and Unit management
  - Source code links: API spec, backend service, frontend dashboard repos
  - Feedback CTA button linking to feedback form
- Feedback & Questions feature (`/feedback`)
  - Full-page form with name, email, type toggle (Feedback / Pertanyaan), message
  - Client-side validation with error states
  - Success state with "Kirim Lagi" and "Kembali" buttons
  - API integration via `POST /v1/feedback-questions`
- Admin Feedback list page (`/admin/feedback`)
  - DataTable with type, name, email, message, date columns
  - Sortable by type and date
  - "Buat Baru" button linking to feedback form
  - New "Feedback" nav pill in AdminLayout
- Transparent full-page overlay pattern for AboutDrawer and ReceiptHistoryDrawer
  - `bg-black/30 backdrop-blur-md` backdrop
  - `bg-white/80 backdrop-blur-xl` glass card container
  - Scale + fade entrance animation
- API layer: `src/api/feedback.ts` — create, list, getById
- Hooks: `useFeedbackSubmit` (mutation), `useFeedbackList` (paginated query)
- Types: `FeedbackQuestion`, `CreateFeedbackQuestionRequest`, `FeedbackQuestionListResponse`, `FeedbackType`

### Changed
- ReceiptHistoryDrawer: migrated from DrawerShell to transparent full-page overlay
- AboutDrawer: migrated from DrawerShell to transparent full-page overlay
- README.md updated with new routes, features, project structure, and API reference

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

## [0.4.0] - 2026-05-19

### Added
- Admin Activity Logs page (`/admin/activity-logs`)
  - Paginated table with type, action, description, and timestamp columns
  - Sortable by created date, type, and action
  - Color-coded type badges (Struk, Produk, Toko, Harga, Kategori, Satuan, Feedback, Alert)
  - Color-coded action badges (Buat, Ubah, Hapus)
  - "Aktivitas" nav pill in AdminLayout with clock icon
- API layer: `src/api/activity-logs.ts` — list with pagination/sort/filter params, get by ID
- Hooks: `useActivityLogsList`, `useActivityLog` (via query factory)
- Types: `ActivityLog`, `ActivityLogType`, `ActivityLogAction`, `ActivityLogListResponse`

### Changed
- DataTable column headers no longer forced uppercase (removed `uppercase` CSS class)

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
