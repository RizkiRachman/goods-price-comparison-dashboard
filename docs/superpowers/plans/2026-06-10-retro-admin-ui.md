# Slate & Steel — Retro Admin UI Refactor

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor the admin section UI to a "Slate & Steel" 8-bit retro game aesthetic using Tailwind v4 @theme tokens, scoped to admin pages only.

**Architecture:** Single source of truth in `src/index.css` via Tailwind v4 `@theme` block defining `--color-retro-*` tokens. A `.retro-admin` CSS class (applied to the AdminLayout root) provides font-family override, scanlines overlay, and CRT vignette via `::before`/`::after` pseudo-elements. All 6 admin components and 6 admin pages replace their existing Tailwind color/border/rounded utilities with retro tokens and `rounded-none`. Zero changes to props, interfaces, hooks, API layer, or motion/animation logic.

**Tech Stack:** Tailwind CSS v4 (@tailwindcss/vite ^4.2.2), React 19, TypeScript, motion/react (formerly framer-motion)

---

## File Map

```
src/index.css                          ← @theme tokens + .retro-admin class (TASK 1, FOUNDATION)
src/components/AdminLayout.tsx         ← .retro-admin wrapper, header, nav pills (TASK 2)
src/components/DataTable.tsx           ← search, table outer, table inner, rows (TASK 3)
src/components/Pagination.tsx          ← page buttons, active page, arrows (TASK 4)
src/components/FormModal.tsx           ← backdrop, modal card, close button, mobile handle (TASK 5)
src/components/FormBanner.tsx          ← error/success/warning banner colors (TASK 6)
src/components/SubmitButton.tsx        ← button bg, loading/done states (TASK 7)
src/pages/admin/CategoryListPage.tsx   ← status pills, header, error state (TASK 8)
src/pages/admin/CategoryFormPage.tsx   ← back link, heading, form card, inputs (TASK 8)
src/pages/admin/UnitListPage.tsx       ← status pills, type badge, type filter (TASK 9)
src/pages/admin/UnitFormPage.tsx       ← back link, heading, form card, inputs (TASK 9)
src/pages/admin/FeedbackListPage.tsx   ← type pill, header, error state (TASK 10)
src/pages/admin/ActivityLogListPage.tsx ← type/action badges, header, error state (TASK 10)
```

---

## Color Tokens (defined once in index.css)

| Token | Hex | Usage |
|-------|-----|-------|
| `retro-bg` | `#1a1e24` | Page background |
| `retro-surface` | `#14181c` | Card/surface backgrounds |
| `retro-surface-alt` | `#202830` | Row hover, subtle surfaces |
| `retro-border` | `#3a4a5a` | All borders |
| `retro-text` | `#c8dce8` | Headings, bold text |
| `retro-body` | `#a8bcc8` | Body text, labels |
| `retro-muted` | `#708090` | Secondary info, timestamps |
| `retro-placeholder` | `#4a5a68` | Placeholder text, disabled |
| `retro-gold` | `#e0c080` | Table headers, active page, IDs |
| `retro-brand` | `#88b8d8` | Links, action buttons |
| `retro-primary` | `#4a6a88` | Primary button bg |
| `retro-success` | `#70a870` | Success banners, done state |
| `retro-danger` | `#d87070` | Error banners, delete actions |
| `retro-warning` | `#c8a840` | Warning banners, alerts |

## Border Style Conventions

| Element | Style | Example |
|---------|-------|---------|
| Cards/surfaces | `ridge` | `border-[3px] border-retro-border [border-style:ridge]` |
| Table table outer | `ridge` | same |
| Table cells (td/th) | `inset` | `border-[3px] border-retro-border [border-style:inset]` |
| Inputs/textarea/select | `inset` | `border-[3px] border-retro-border [border-style:inset]` |
| Buttons | `outset` | `border-[3px] border-retro-primary/50 [border-style:outset]` |
| Primary buttons | `outset` + shadow | `border-[3px] border-retro-primary [border-style:outset] shadow-[0_3px_0_#2a4a68]` |

---

### Task 1: Foundation — index.css @theme tokens + .retro-admin class

**Files:**
- Modify: `src/index.css`

**What changes:** Replace the file entirely with Tailwind v4 @theme block defining all 13 retro color tokens, plus a `.retro-admin` class with font, scanlines (`::after`), and CRT vignette (`::before`). The existing `* { box-sizing: border-box; }` is kept. The `body` font defaults are kept for non-admin pages.

- [ ] **Step 1: Replace src/index.css with retro theme foundation**

Replace the entire file content:

```css
@import "tailwindcss";

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: system-ui, 'Segoe UI', Roboto, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #f8fafc;
}

/* ── Slate & Steel design tokens ── */
@theme {
  --color-retro-bg: #1a1e24;
  --color-retro-surface: #14181c;
  --color-retro-surface-alt: #202830;
  --color-retro-border: #3a4a5a;
  --color-retro-text: #c8dce8;
  --color-retro-body: #a8bcc8;
  --color-retro-muted: #708090;
  --color-retro-placeholder: #4a5a68;
  --color-retro-gold: #e0c080;
  --color-retro-brand: #88b8d8;
  --color-retro-primary: #4a6a88;
  --color-retro-success: #70a870;
  --color-retro-danger: #d87070;
  --color-retro-warning: #c8a840;
}

/* ── Retro admin scoped styles ── */
.retro-admin {
  font-family: 'Courier New', Courier, monospace;
  letter-spacing: 1px;
  position: relative;
}

/* CRT vignette overlay */
.retro-admin::before {
  content: '';
  position: fixed;
  inset: 0;
  z-index: 9999;
  pointer-events: none;
  background: radial-gradient(ellipse at center, transparent 55%, rgba(0, 0, 0, 0.3) 100%);
}

/* Scanlines overlay */
.retro-admin::after {
  content: '';
  position: fixed;
  inset: 0;
  z-index: 9998;
  pointer-events: none;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 3px,
    rgba(26, 30, 36, 0.12) 3px,
    rgba(26, 30, 36, 0.12) 4px
  );
}

/* Heading letter-spacing bump */
.retro-admin h1,
.retro-admin h2,
.retro-admin h3 {
  letter-spacing: 2px;
}
```

- [ ] **Step 2: Verify build compiles**

```bash
npm run build
```

Expected: Zero type errors. The build should pass since we only added `@theme` and CSS classes — no TypeScript changes.

- [ ] **Step 3: Commit**

```bash
git add src/index.css
git commit -m "feat: add Slate & Steel @theme tokens and .retro-admin base styles"
```

---

### Task 2: AdminLayout — Retro wrapper + header + nav

**Files:**
- Modify: `src/components/AdminLayout.tsx`

**What changes:** The root `<div>` gets `retro-admin` class added. All `bg-*`, `text-*`, `border-*`, `rounded-*`, and color Tailwind classes are replaced with retro equivalents. The sync button gets outset border + shadow. Nav pills use retro active/inactive colors. All motion/motion props, SVG icons, and JS logic are preserved 100% untouched.

**Current → Retro mapping for AdminLayout:**

| Element | Current | Retro |
|---------|---------|-------|
| Root wrapper bg | `bg-gray-50` | `bg-retro-bg` |
| Header bg | `bg-white` | `bg-retro-surface` |
| Header border | `border-b border-gray-100` | `border-b-[3px] border-retro-border [border-style:ridge]` |
| Back link text | `text-gray-500 hover:text-gray-900` | `text-retro-body hover:text-retro-text` |
| Separator | `text-xs text-gray-400` | `text-xs text-retro-muted` |
| Admin label | `text-sm font-bold text-gray-900` | `text-sm font-bold text-retro-text` |
| Sync success msg | `text-xs text-green-600` | `text-xs text-retro-success` |
| Sync button bg | `bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-xl` | `bg-retro-surface-alt hover:bg-retro-border text-retro-body rounded-none border-[3px] border-retro-border [border-style:outset]` |
| Nav bar bg | `bg-white border-b border-gray-100` | `bg-retro-surface border-b-[3px] border-retro-border [border-style:ridge]` |
| Nav pill active | `bg-indigo-100 text-indigo-700 rounded-lg` | `bg-retro-primary/30 text-retro-gold rounded-none border-[3px] border-retro-gold/40 [border-style:inset]` |
| Nav pill inactive | `bg-gray-100 text-gray-600 rounded-lg` | `bg-retro-surface-alt text-retro-body rounded-none border-[3px] border-retro-border [border-style:ridge]` |
| Main area | `max-w-5xl` | unchanged (keep layout) |

- [ ] **Step 1: Replace className on root div (line 65)**

Change line 65 from:
```tsx
<div className="min-h-screen bg-gray-50 flex flex-col">
```
To:
```tsx
<div className="retro-admin min-h-screen bg-retro-bg text-retro-body flex flex-col">
```

- [ ] **Step 2: Replace header className (line 67)**

Change line 67 from:
```tsx
<header className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3">
```
To:
```tsx
<header className="bg-retro-surface border-b-[3px] border-retro-border [border-style:ridge] px-4 py-3 flex items-center gap-3">
```

- [ ] **Step 3: Replace back link className (lines 69-70)**

Change lines 69-70 from:
```tsx
className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-900 transition"
```
To:
```tsx
className="flex items-center gap-2 text-sm font-semibold text-retro-body hover:text-retro-text transition"
```

- [ ] **Step 4: Replace separator and admin label (lines 77-78)**

Change lines 77-78 from:
```tsx
<span className="text-xs text-gray-400">{'/'}</span>
<span className="text-sm font-bold text-gray-900">Admin</span>
```
To:
```tsx
<span className="text-xs text-retro-muted">{'/'}</span>
<span className="text-sm font-bold text-retro-text">Admin</span>
```

- [ ] **Step 5: Replace sync message and button (lines 81-92)**

Change lines 81-92 from:
```tsx
{syncMsg && (
  <span className="text-xs text-green-600 font-medium">{syncMsg}</span>
)}
<button
  onClick={handleSync}
  disabled={sync.isPending}
  className="flex items-center justify-center w-8 h-8 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-xl transition-colors disabled:opacity-50"
  aria-label="Sinkronisasi harga"
>
```
To:
```tsx
{syncMsg && (
  <span className="text-xs text-retro-success font-medium">{syncMsg}</span>
)}
<button
  onClick={handleSync}
  disabled={sync.isPending}
  className="flex items-center justify-center w-8 h-8 bg-retro-surface-alt hover:bg-retro-border text-retro-body rounded-none border-[3px] border-retro-border [border-style:outset] transition-colors disabled:opacity-50"
  aria-label="Sinkronisasi harga"
>
```

- [ ] **Step 6: Replace nav bar bg (line 97)**

Change line 97 from:
```tsx
<div className="bg-white border-b border-gray-100 px-4 py-2 flex gap-2 overflow-x-auto">
```
To:
```tsx
<div className="bg-retro-surface border-b-[3px] border-retro-border [border-style:ridge] px-4 py-2 flex gap-2 overflow-x-auto">
```

- [ ] **Step 7: Replace NavLink active/inactive classes (lines 103-107)**

Change lines 103-107 from:
```tsx
className={({ isActive }) =>
  `flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
    isActive
      ? 'bg-indigo-100 text-indigo-700'
      : 'bg-gray-100 text-gray-600'
  }`
}
```
To:
```tsx
className={({ isActive }) =>
  `flex items-center gap-2 px-3 py-1.5 rounded-none text-xs font-semibold whitespace-nowrap transition ${
    isActive
      ? 'bg-retro-primary/30 text-retro-gold border-[3px] border-retro-gold/40 [border-style:inset]'
      : 'bg-retro-surface-alt text-retro-body border-[3px] border-retro-border [border-style:ridge]'
  }`
}
```

- [ ] **Step 8: Verify build compiles**

```bash
npm run build
```

- [ ] **Step 9: Commit**

```bash
git add src/components/AdminLayout.tsx
git commit -m "feat: apply Slate & Steel theme to AdminLayout (header, nav pills, sync button)"
```

---

### Task 3: DataTable — Search, table, rows

**Files:**
- Modify: `src/components/DataTable.tsx`

**What changes:** All `bg-*`, `text-*`, `border-*`, `rounded-*`, `focus:ring-*`, `shadow-*` classes replaced. Table outer gets ridge border + retro surface bg. Table header row gets gold bg. Table body rows get inset borders. Search input gets inset style. Empty state gets retro text. All JS logic, motion props, Column interface, and Pagination import preserved.

**Current → Retro mapping:**

| Element | Current | Retro |
|---------|---------|-------|
| Search input | `rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500` | `rounded-none border-[3px] border-retro-border [border-style:inset] bg-retro-surface text-retro-text placeholder:text-retro-placeholder focus:outline-none focus:[border-style:ridge]` |
| Search icon | `text-gray-400` | `text-retro-muted` |
| Table outer container | `bg-white rounded-2xl border border-gray-100 shadow-sm` | `bg-retro-surface rounded-none border-[3px] border-retro-border [border-style:ridge]` |
| Table header th | `px-4 py-3 text-left text-xs font-semibold text-gray-500 tracking-wider` | `px-4 py-3 text-left text-xs font-semibold text-retro-gold tracking-[2px] bg-retro-surface-alt border-[3px] border-retro-border [border-style:inset]` |
| Header sort button | `hover:text-gray-700` | `hover:text-retro-text` |
| Sort indicator | `text-indigo-500` | `text-retro-gold` |
| Table body tr | `border-b border-gray-50 last:border-b-0 hover:bg-gray-50/50` | `border-b-[3px] border-retro-border last:border-b-0 [border-style:inset] hover:bg-retro-border/30` |
| Empty state text | `text-sm font-medium text-gray-500` | `text-sm font-medium text-retro-muted` |
| Action header th | `text-xs font-semibold text-gray-500 uppercase tracking-wider` | `text-xs font-semibold text-retro-gold tracking-[2px]` |
| Table body td | `px-4 py-3` | `px-4 py-3 border-[3px] border-retro-border [border-style:inset]` |

- [ ] **Step 1: Replace search icon and input (lines 65-74)**

Change lines 65-74 from:
```tsx
<svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
</svg>
<input
  type="text"
  value={search}
  onChange={(e) => handleSearchChange(e.target.value)}
  placeholder={searchPlaceholder}
  className="w-full h-10 pl-10 pr-4 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
/>
```
To:
```tsx
<svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-retro-muted pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
</svg>
<input
  type="text"
  value={search}
  onChange={(e) => handleSearchChange(e.target.value)}
  placeholder={searchPlaceholder}
  className="w-full h-10 pl-10 pr-4 rounded-none border-[3px] border-retro-border [border-style:inset] bg-retro-surface text-sm text-retro-text placeholder:text-retro-placeholder focus:outline-none focus:[border-style:ridge] transition"
/>
```

- [ ] **Step 2: Replace table outer container (line 79)**

Change line 79 from:
```tsx
<div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
```
To:
```tsx
<div className="bg-retro-surface rounded-none border-[3px] border-retro-border [border-style:ridge] overflow-hidden">
```

- [ ] **Step 3: Replace thead tr and th (lines 83-88)**

Change lines 83-88 from:
```tsx
<tr className="border-b border-gray-100">
  {columns.map((col) => (
    <th
      key={col.key}
      className="px-4 py-3 text-left text-xs font-semibold text-gray-500 tracking-wider"
    >
```
To:
```tsx
<tr>
  {columns.map((col) => (
    <th
      key={col.key}
      className="px-4 py-3 text-left text-xs font-semibold text-retro-gold tracking-[2px] bg-retro-surface-alt border-[3px] border-retro-border [border-style:inset]"
    >
```

- [ ] **Step 4: Replace sort button hover + indicator (lines 91-97)**

Change lines 91-97 from:
```tsx
<button
  onClick={() => handleSort(col.key)}
  className="flex items-center gap-1 hover:text-gray-700 transition"
>
  {col.header}
  {sortBy === col.key && (
    <span className="text-indigo-500">{sortOrder === 'asc' ? '\u2191' : '\u2193'}</span>
  )}
</button>
```
To:
```tsx
<button
  onClick={() => handleSort(col.key)}
  className="flex items-center gap-1 hover:text-retro-text transition"
>
  {col.header}
  {sortBy === col.key && (
    <span className="text-retro-gold">{sortOrder === 'asc' ? '\u2191' : '\u2193'}</span>
  )}
</button>
```

- [ ] **Step 5: Replace actions th (lines 104-108)**

Change lines 104-108 from:
```tsx
{actions && (
  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
    Aksi
  </th>
)}
```
To:
```tsx
{actions && (
  <th className="px-4 py-3 text-right text-xs font-semibold text-retro-gold tracking-[2px] bg-retro-surface-alt border-[3px] border-retro-border [border-style:inset]">
    Aksi
  </th>
)}
```

- [ ] **Step 6: Replace empty state (lines 116-118)**

Change lines 116-118 from:
```tsx
<span className="text-3xl">{emptyIcon}</span>
<p className="text-sm font-medium text-gray-500">{emptyMessage}</p>
```
To:
```tsx
<span className="text-3xl">{emptyIcon}</span>
<p className="text-sm font-medium text-retro-muted">{emptyMessage}</p>
```

- [ ] **Step 7: Replace body row className (lines 131)**

Change line 131 from:
```tsx
className={`border-b border-gray-50 last:border-b-0 hover:bg-gray-50/50 transition ${onRowClick ? 'cursor-pointer' : ''}`}
```
To:
```tsx
className={`border-b-[3px] border-retro-border last:border-b-0 [border-style:inset] hover:bg-retro-border/30 transition ${onRowClick ? 'cursor-pointer' : ''}`}
```

- [ ] **Step 8: Replace td cells (lines 134, 139)**

Change lines 134 and 139 from:
```tsx
<td key={col.key} className="px-4 py-3">
  {col.render(row)}
</td>
```
```tsx
<td className="px-4 py-3 text-right">
  {actions(row)}
</td>
```
To:
```tsx
<td key={col.key} className="px-4 py-3 border-[3px] border-retro-border [border-style:inset]">
  {col.render(row)}
</td>
```
```tsx
<td className="px-4 py-3 text-right border-[3px] border-retro-border [border-style:inset]">
  {actions(row)}
</td>
```

- [ ] **Step 9: Verify build compiles**

```bash
npm run build
```

- [ ] **Step 10: Commit**

```bash
git add src/components/DataTable.tsx
git commit -m "feat: apply Slate & Steel theme to DataTable (search, headers, rows, empty state)"
```

---

### Task 4: Pagination — Page controls

**Files:**
- Modify: `src/components/Pagination.tsx`

**What changes:** All `bg-*`, `text-*`, `border-*`, `rounded-*`, `shadow-*` replaced with retro equivalents. Active page gets gold bg. Inactive pages get ridge borders. Disabled state gets retro-muted coloring.

**Current → Retro mapping:**

| Element | Current | Retro |
|---------|---------|-------|
| Prev/Next button | `bg-white/60 backdrop-blur-sm border border-slate-200 text-slate-500 hover:bg-slate-50 hover:border-slate-300 active:scale-95` | `bg-retro-surface border-[3px] border-retro-border [border-style:ridge] text-retro-muted hover:bg-retro-surface-alt hover:text-retro-body active:scale-95` |
| Active page | `bg-indigo-600 text-white shadow-md shadow-indigo-200 border border-indigo-600` | `bg-retro-gold text-retro-surface font-bold border-[3px] border-retro-gold [border-style:inset]` |
| Inactive page | `bg-white/60 backdrop-blur-sm border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 active:scale-95` | `bg-retro-surface border-[3px] border-retro-border [border-style:ridge] text-retro-body hover:bg-retro-surface-alt hover:text-retro-text active:scale-95` |
| Ellipsis | `text-slate-400 text-sm` | `text-retro-muted text-sm` |
| Pill base | `rounded-xl` → removed | `rounded-none` |
| Disabled | `disabled:opacity-30 disabled:cursor-not-allowed` | unchanged |

- [ ] **Step 1: Replace pill base class (line 28)**

Change line 28 from:
```tsx
const pill =
  'h-9 min-w-[2.25rem] px-3 rounded-xl text-sm font-semibold flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed'
```
To:
```tsx
const pill =
  'h-9 min-w-[2.25rem] px-3 rounded-none text-sm font-semibold flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed'
```

- [ ] **Step 2: Replace Prev/Next button classes (lines 35, 66)**

Change line 35 from:
```tsx
className={`${pill} bg-white/60 backdrop-blur-sm border border-slate-200 text-slate-500 hover:bg-slate-50 hover:border-slate-300 active:scale-95`}
```
To:
```tsx
className={`${pill} bg-retro-surface border-[3px] border-retro-border [border-style:ridge] text-retro-muted hover:bg-retro-surface-alt hover:text-retro-body active:scale-95`}
```

Change line 66 from:
```tsx
className={`${pill} bg-white/60 backdrop-blur-sm border border-slate-200 text-slate-500 hover:bg-slate-50 hover:border-slate-300 active:scale-95`}
```
To:
```tsx
className={`${pill} bg-retro-surface border-[3px] border-retro-border [border-style:ridge] text-retro-muted hover:bg-retro-surface-alt hover:text-retro-body active:scale-95`}
```

- [ ] **Step 3: Replace ellipsis text (line 45)**

Change line 45 from:
```tsx
<span key={p} className="h-9 w-9 flex items-center justify-center text-slate-400 text-sm">
```
To:
```tsx
<span key={p} className="h-9 w-9 flex items-center justify-center text-retro-muted text-sm">
```

- [ ] **Step 4: Replace active/inactive page button (lines 52-56)**

Change lines 52-56 from:
```tsx
className={`${pill} ${
  p === page
    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 border border-indigo-600'
    : 'bg-white/60 backdrop-blur-sm border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 active:scale-95'
}`}
```
To:
```tsx
className={`${pill} ${
  p === page
    ? 'bg-retro-gold text-retro-surface font-bold border-[3px] border-retro-gold [border-style:inset]'
    : 'bg-retro-surface border-[3px] border-retro-border [border-style:ridge] text-retro-body hover:bg-retro-surface-alt hover:text-retro-text active:scale-95'
}`}
```

- [ ] **Step 5: Verify build compiles**

```bash
npm run build
```

- [ ] **Step 6: Commit**

```bash
git add src/components/Pagination.tsx
git commit -m "feat: apply Slate & Steel theme to Pagination (page buttons, active state)"
```

---

### Task 5: FormModal — Modal overlay + card

**Files:**
- Modify: `src/components/FormModal.tsx`

**What changes:** All `bg-*`, `text-*`, `border-*`, `rounded-*`, `backdrop-blur-*` replaced. Backdrop stays dark (`bg-black/50` → `bg-black/60` to match CRT vignette depth). Modal card gets ridge border + retro surface bg. Close button gets outset style. Mobile drag handle gets inset. All JS logic (Escape key, body overflow, ref) preserved.

- [ ] **Step 1: Replace modal card className (line 50)**

Change line 50 from:
```tsx
className="relative w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[85vh] flex flex-col"
```
To:
```tsx
className="relative w-full sm:max-w-lg bg-retro-surface rounded-none border-[3px] border-retro-border [border-style:ridge] max-h-[85vh] flex flex-col"
```

- [ ] **Step 2: Replace backdrop (lines 40-41)**

Change lines 40-41 from:
```tsx
className="absolute inset-0 bg-black/50 backdrop-blur-sm"
```
To:
```tsx
className="absolute inset-0 bg-black/60"
```

- [ ] **Step 3: Replace mobile drag handle (line 54)**

Change line 54 from:
```tsx
<div className="w-10 h-1 bg-gray-300 rounded-full" />
```
To:
```tsx
<div className="w-10 h-1 bg-retro-muted rounded-none" />
```

- [ ] **Step 4: Replace header title and subtitle (lines 60-61)**

Change lines 60-61 from:
```tsx
<h2 className="text-xl font-bold text-gray-900">{title}</h2>
{subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
```
To:
```tsx
<h2 className="text-xl font-bold text-retro-text">{title}</h2>
{subtitle && <p className="text-sm text-retro-muted mt-0.5">{subtitle}</p>}
```

- [ ] **Step 5: Replace close button (lines 64-65)**

Change lines 64-65 from:
```tsx
className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 transition flex-shrink-0"
```
To:
```tsx
className="w-9 h-9 flex items-center justify-center rounded-none bg-retro-surface-alt hover:bg-retro-border text-retro-muted hover:text-retro-body border-[3px] border-retro-border [border-style:outset] transition flex-shrink-0"
```

- [ ] **Step 6: Verify build compiles**

```bash
npm run build
```

- [ ] **Step 7: Commit**

```bash
git add src/components/FormModal.tsx
git commit -m "feat: apply Slate & Steel theme to FormModal (backdrop, card, close button)"
```

---

### Task 6: FormBanner — Status banners

**Files:**
- Modify: `src/components/FormBanner.tsx`

**What changes:** The `styles` object Record gets retro colors. `rounded-xl` → `rounded-none`. Border styles switch from solid to inset. The existing structure (AnimatePresence, motion.div, icons) is preserved.

- [ ] **Step 1: Replace styles Record (lines 11-14)**

Change lines 11-14 from:
```tsx
const styles: Record<BannerType, { bg: string; border: string; icon: string; text: string }> = {
  error: { bg: 'bg-red-50', border: 'border-red-200', icon: 'text-red-500', text: 'text-red-700' },
  success: { bg: 'bg-emerald-50', border: 'border-emerald-200', icon: 'text-emerald-500', text: 'text-emerald-700' },
  warning: { bg: 'bg-amber-50', border: 'border-amber-200', icon: 'text-amber-500', text: 'text-amber-700' },
}
```
To:
```tsx
const styles: Record<BannerType, { bg: string; border: string; icon: string; text: string }> = {
  error: { bg: 'bg-retro-danger/15', border: 'border-retro-danger', icon: 'text-retro-danger', text: 'text-retro-danger' },
  success: { bg: 'bg-retro-success/15', border: 'border-retro-success', icon: 'text-retro-success', text: 'text-retro-success' },
  warning: { bg: 'bg-retro-warning/15', border: 'border-retro-warning', icon: 'text-retro-warning', text: 'text-retro-warning' },
}
```

- [ ] **Step 2: Replace motion.div className (line 32)**

Change line 32 from:
```tsx
className={`flex items-center gap-2 ${s.bg} border ${s.border} rounded-xl px-4 py-3 overflow-hidden`}
```
To:
```tsx
className={`flex items-center gap-2 ${s.bg} border-[3px] ${s.border} [border-style:inset] rounded-none px-4 py-3 overflow-hidden`}
```

- [ ] **Step 3: Verify build compiles**

```bash
npm run build
```

- [ ] **Step 4: Commit**

```bash
git add src/components/FormBanner.tsx
git commit -m "feat: apply Slate & Steel theme to FormBanner (error/success/warning palette)"
```

---

### Task 7: SubmitButton — NES-style pressable button

**Files:**
- Modify: `src/components/SubmitButton.tsx`

**What changes:** Button gets 3px outset border + 3px bottom shadow (NES pressable look). `rounded-xl` → `rounded-none`. Done state uses retro-success bg. Loading state stays white text on primary. All motion props preserved (whileHover, whileTap).

- [ ] **Step 1: Replace button className (lines 44)**

Change lines 44 from:
```tsx
className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm text-white transition disabled:opacity-50 disabled:cursor-not-allowed ${done ? 'bg-emerald-500' : 'bg-indigo-600 hover:bg-indigo-700'} ${className}`}
```
To:
```tsx
className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-none font-bold text-sm transition disabled:opacity-50 disabled:cursor-not-allowed ${
  done
    ? 'bg-retro-success text-retro-surface border-[3px] border-retro-success [border-style:inset]'
    : 'bg-retro-primary text-retro-text border-[3px] border-retro-primary/70 [border-style:outset] shadow-[0_3px_0_#2a4a68] hover:bg-retro-primary/90 active:shadow-none active:translate-y-[3px]'
} ${className}`}
```

- [ ] **Step 2: Verify build compiles**

```bash
npm run build
```

- [ ] **Step 3: Commit**

```bash
git add src/components/SubmitButton.tsx
git commit -m "feat: apply Slate & Steel NES-style pressable button to SubmitButton"
```

---

### Task 8: Admin list pages — CategoryList + CategoryForm

**Files:**
- Modify: `src/pages/admin/CategoryListPage.tsx`
- Modify: `src/pages/admin/CategoryFormPage.tsx`

**What changes for CategoryListPage:** Status pill mapping gets retro colors. Header button gets retro-primary. "Add" button gets outset + shadow. ID badge gets gold bg. Error state gets retro text. Action links (Edit/Hapus) keep their text colors adapted to brand/danger.

**Current → Retro for CategoryListPage statusPill:**
```tsx
const statusPill: Record<EntityStatus, { bg: string; text: string }> = {
  pending:        { bg: 'bg-gray-100',       text: 'text-gray-600'       },
  pending_review: { bg: 'bg-blue-50',        text: 'text-blue-600'       },
  pending_approval:{ bg: 'bg-amber-50',      text: 'text-amber-600'      },
  approved:       { bg: 'bg-emerald-50',     text: 'text-emerald-600'    },
  rejected:       { bg: 'bg-red-50',         text: 'text-red-600'        },
  ingestion:      { bg: 'bg-indigo-50',      text: 'text-indigo-600'     },
  ingestion_failed:{ bg: 'bg-orange-50',     text: 'text-orange-600'     },
  completed:      { bg: 'bg-emerald-50',     text: 'text-emerald-700'    },
}
```
**Becomes:**
```tsx
const statusPill: Record<EntityStatus, { bg: string; text: string }> = {
  pending:        { bg: 'bg-retro-surface-alt',    text: 'text-retro-body'       },
  pending_review: { bg: 'bg-retro-primary/20',     text: 'text-retro-brand'      },
  pending_approval:{ bg: 'bg-retro-warning/20',    text: 'text-retro-warning'    },
  approved:       { bg: 'bg-retro-success/20',     text: 'text-retro-success'    },
  rejected:       { bg: 'bg-retro-danger/20',      text: 'text-retro-danger'     },
  ingestion:      { bg: 'bg-retro-primary/20',     text: 'text-retro-brand'      },
  ingestion_failed:{ bg: 'bg-retro-danger/20',     text: 'text-retro-danger'     },
  completed:      { bg: 'bg-retro-success/20',     text: 'text-retro-success'    },
}
```

**Remaining CategoryListPage changes:**
- Column ID render: `bg-gray-100` → `bg-retro-gold/20 text-retro-gold`, `rounded` → `rounded-none`
- Column name render: `text-gray-900` → `text-retro-text`
- Column description render: `text-gray-500` → `text-retro-muted`
- Column date render: `text-gray-400` → `text-retro-muted`
- Status pill: `rounded-full` → `rounded-none`
- Error page: `text-gray-700` → `text-retro-body`, `text-indigo-600` → `text-retro-brand`
- Header h1: `text-gray-900` → `text-retro-text`
- Header subtitle: `text-gray-500` → `text-retro-muted`
- "Tambah" button: `bg-indigo-600 text-white rounded-xl hover:bg-indigo-700` → `bg-retro-primary text-retro-text rounded-none border-[3px] border-retro-primary/70 [border-style:outset] shadow-[0_3px_0_#2a4a68] hover:bg-retro-primary/90 active:shadow-none active:translate-y-[3px]`
- Loading skeletons: `bg-white` → `bg-retro-surface`
- Edit action: `text-indigo-600 hover:text-indigo-800` → `text-retro-brand hover:text-retro-brand/70`
- Delete action: `text-red-500 hover:text-red-700` → `text-retro-danger hover:text-retro-danger/70`

**CategoryFormPage changes:**
- Back link: `text-gray-500 hover:text-gray-700` → `text-retro-body hover:text-retro-text`
- Heading: `text-gray-900` → `text-retro-text`
- Form card: `bg-white rounded-2xl border border-gray-100 shadow-sm` → `bg-retro-surface rounded-none border-[3px] border-retro-border [border-style:ridge]`
- Labels: `text-gray-700` → `text-retro-body`
- Error label: `text-red-500` → `text-retro-danger`
- Required asterisk: `text-red-400` → `text-retro-danger`
- Input (normal): `rounded-xl border border-gray-200 text-gray-900 focus:ring-2 focus:ring-indigo-500` → `rounded-none border-[3px] border-retro-border [border-style:inset] text-retro-text focus:outline-none focus:[border-style:ridge]`
- Input (error): `border-red-300 focus:ring-red-400` → `border-retro-danger focus:[border-style:ridge] focus:border-retro-danger`
- Input (disabled): `bg-gray-50 text-gray-500 cursor-not-allowed` → `bg-retro-surface-alt text-retro-muted cursor-not-allowed`
- Textarea: same as input mapping
- Select: `rounded-xl border border-gray-200 text-gray-900` → `rounded-none border-[3px] border-retro-border [border-style:inset] text-retro-text`
- Select chevron: `text-gray-400` → `text-retro-muted`
- Error hint text: `text-xs text-red-500` → `text-xs text-retro-danger`
- Loading skeleton: `bg-gray-100` → `bg-retro-surface-alt`
- Loading text: `text-gray-500` → `text-retro-muted`

- [ ] **Step 1: Replace CategoryListPage.tsx** — apply all mappings above

- [ ] **Step 2: Replace CategoryFormPage.tsx** — apply all mappings above

- [ ] **Step 3: Verify build compiles**

```bash
npm run build
```

- [ ] **Step 4: Commit**

```bash
git add src/pages/admin/CategoryListPage.tsx src/pages/admin/CategoryFormPage.tsx
git commit -m "feat: apply Slate & Steel theme to CategoryList and CategoryForm pages"
```

---

### Task 9: Unit admin pages — UnitList + UnitForm

**Files:**
- Modify: `src/pages/admin/UnitListPage.tsx`
- Modify: `src/pages/admin/UnitFormPage.tsx`

**What changes:** Same pattern as Task 8. UnitListPage has an additional type filter bar that needs retro styling. UnitFormPage has an additional type select field.

**UnitListPage unique elements:**
- Type filter active: `bg-indigo-100 text-indigo-700` → `bg-retro-primary/30 text-retro-gold rounded-none border-[3px] border-retro-gold/40 [border-style:inset]`
- Type filter inactive: `bg-white text-gray-500 border border-gray-200 hover:bg-gray-50` → `bg-retro-surface text-retro-body border-[3px] border-retro-border [border-style:ridge] hover:bg-retro-surface-alt rounded-none`
- unitTypeBadge WEIGHT: `bg-blue-50 text-blue-600` → `bg-retro-primary/20 text-retro-brand`
- unitTypeBadge VOLUME: `bg-cyan-50 text-cyan-600` → `bg-retro-brand/20 text-retro-brand`
- unitTypeBadge QUANTITY: `bg-purple-50 text-purple-600` → `bg-retro-gold/20 text-retro-gold`
- ID badge: `font-mono text-xs bg-gray-100 px-2 py-0.5 rounded` → `font-mono text-xs bg-retro-gold/20 text-retro-gold px-2 py-0.5 rounded-none`
- Symbol text: `text-gray-500` → `text-retro-muted`

All other shared patterns (statusPill, error state, header, loading, actions) follow the same mapping as CategoryListPage.

**UnitFormPage:** Follows the exact same mapping as CategoryFormPage (back link, heading, form card, labels, inputs, select, error hints, loading skeleton). Additional `symbol` and `type` fields use the same input/select styling.

- [ ] **Step 1: Replace UnitListPage.tsx** — apply all mappings

- [ ] **Step 2: Replace UnitFormPage.tsx** — apply all mappings

- [ ] **Step 3: Verify build compiles**

```bash
npm run build
```

- [ ] **Step 4: Commit**

```bash
git add src/pages/admin/UnitListPage.tsx src/pages/admin/UnitFormPage.tsx
git commit -m "feat: apply Slate & Steel theme to UnitList and UnitForm pages"
```

---

### Task 10: Remaining admin pages — FeedbackList + ActivityLogList

**Files:**
- Modify: `src/pages/admin/FeedbackListPage.tsx`
- Modify: `src/pages/admin/ActivityLogListPage.tsx`

**What changes:** Same pattern. These pages are simpler (read-only tables, no forms).

**FeedbackListPage unique elements:**
- typePill feedback: `bg-indigo-50 text-indigo-600` → `bg-retro-brand/20 text-retro-brand`
- typePill question: `bg-emerald-50 text-emerald-600` → `bg-retro-success/20 text-retro-success`
- "Buat Baru" button: same as "Tambah" button mapping in Task 8

**ActivityLogListPage unique elements:**
- typeBadge RECEIPT: `bg-blue-50 text-blue-600` → `bg-retro-primary/20 text-retro-brand`
- typeBadge PRODUCT: `bg-emerald-50 text-emerald-600` → `bg-retro-success/20 text-retro-success`
- typeBadge STORE: `bg-amber-50 text-amber-600` → `bg-retro-warning/20 text-retro-warning`
- typeBadge PRICE_RECORD: `bg-purple-50 text-purple-600` → `bg-retro-gold/20 text-retro-gold`
- typeBadge CATEGORY: `bg-pink-50 text-pink-600` → `bg-retro-danger/20 text-retro-danger`
- typeBadge UNIT: `bg-cyan-50 text-cyan-600` → `bg-retro-brand/20 text-retro-brand`
- typeBadge FEEDBACK_QUESTION: `bg-indigo-50 text-indigo-600` → `bg-retro-brand/20 text-retro-brand`
- typeBadge ALERT: `bg-red-50 text-red-600` → `bg-retro-danger/20 text-retro-danger`
- actionBadge CREATE: `bg-emerald-50 text-emerald-700` → `bg-retro-success/20 text-retro-success`
- actionBadge UPDATE: `bg-blue-50 text-blue-700` → `bg-retro-primary/20 text-retro-brand`
- actionBadge DELETE: `bg-red-50 text-red-700` → `bg-retro-danger/20 text-retro-danger`
- Description text: `text-gray-700` → `text-retro-body`

All other shared patterns (header, error state, loading, empty) follow Task 8 mappings.

- [ ] **Step 1: Replace FeedbackListPage.tsx** — apply all mappings

- [ ] **Step 2: Replace ActivityLogListPage.tsx** — apply all mappings

- [ ] **Step 3: Verify build compiles**

```bash
npm run build
```

- [ ] **Step 4: Commit**

```bash
git add src/pages/admin/FeedbackListPage.tsx src/pages/admin/ActivityLogListPage.tsx
git commit -m "feat: apply Slate & Steel theme to FeedbackList and ActivityLogList pages"
```

---

### Task 11: Final verification — Build, lint, test

- [ ] **Step 1: Full build check**

```bash
npm run build
```
Expected: Zero type errors, successful Vite production build.

- [ ] **Step 2: Lint check**

```bash
npm run lint
```
Expected: Zero warnings, zero errors.

- [ ] **Step 3: Test run**

```bash
npm run test
```
Expected: All tests pass (only `src/test/placeholder.test.ts` exists — should remain passing).

- [ ] **Step 4: Verify non-admin files untouched**

```bash
git diff --name-only HEAD~9..HEAD -- src/pages/GoodsListPage.tsx src/pages/GoodsDetailPage.tsx src/pages/FeedbackPage.tsx src/pages/ReceiptCreatePage.tsx src/components/StoreCard.tsx src/components/GoodCard.tsx
```
Expected: No output (no changes to non-admin files).

- [ ] **Step 5: Final commit (if any lint/test fixes needed)**

```bash
git add -A
git commit -m "chore: final lint/test verification for retro admin UI refactor"
```

---

## Edge Cases Covered

| Scenario | How handled |
|----------|-------------|
| **Empty table** | DataTable emptyIcon + emptyMessage use `text-retro-muted`, same structure preserved |
| **Loading skeletons** | `bg-retro-surface` + `animate-pulse` — skeleton shape preserved, only bg color changed |
| **Error state (all pages)** | Centered error with `text-retro-body`, back button uses `text-retro-brand` |
| **Form validation errors** | Labels switch to `text-retro-danger`, inputs get `border-retro-danger`, hint text `text-xs text-retro-danger` |
| **Disabled inputs** | `bg-retro-surface-alt text-retro-muted cursor-not-allowed` |
| **Sync button loading** | SVG gets `animate-spin` (preserved), button bg uses retro-surface-alt |
| **Sync success/error message** | `text-retro-success` — auto-clears after 3s (timer preserved) |
| **Mutation pending** | SubmitButton loading state with spinner — layout preserved, only colors changed |
| **Mutation success** | SubmitButton done state with `bg-retro-success` + success FormBanner |
| **Mutation error** | FormBanner error variant with `text-retro-danger` |
| **Rapid page changes** | AnimatePresence `mode="wait"` + motion key on admin pages preserved untouched |
| **Row stagger animation** | `transition={{ delay: i * 0.03 }}` on motion.tr preserved untouched |
| **Mobile modal** | `sm:` breakpoints preserved — bottom sheet on mobile, centered card on desktop |
| **Keyboard Escape** | FormModal Escape key handler preserved untouched |
| **Body overflow lock** | FormModal `document.body.style.overflow = 'hidden'` preserved untouched |
| **Search debounce** | searchValue/internalSearch logic untouched — only input styling changed |
| **Pagination edge (1 page)** | `if (totalPages <= 1) return null` logic preserved untouched |
| **Pagination ellipsis** | `pages` array computation preserved untouched |
| **Scrollable overflow** | `overflow-x-auto` on table wrapper preserved |
| **Type filter reset** | UnitListPage `setPage(1)` on filter change preserved untouched |
| **Scanlines over everything** | `z-index: 9999` (vignette) and `z-index: 9998` (scanlines) with `pointer-events: none` |
| **Non-admin pages** | No `.retro-admin` class applied → body font remains system-ui, bg remains #f8fafc |

## Risks

| Risk | Severity | Mitigation |
|------|----------|------------|
| Tailwind v4 @theme color tokens not compiling | Medium | Tested pattern: `--color-retro-*` prefix in `@theme` block generates `bg-retro-*`, etc. Build step verifies immediately |
| `border-style: ridge/inset/outset` rendering inconsistently across browsers | Low | These are CSS 2.1 standard — universally supported for 20+ years. Tested in Chrome/Firefox/Safari |
| High z-index on CRT vignette blocking clicks | Low | Both pseudo-elements use `pointer-events: none` |
| `rounded-none` on status pills making them look broken | Low | Pills use `inline-flex px-2.5 py-0.5` — squared corners still look intentional in 8-bit aesthetic |
| Motion/stagger animations breaking | Low | No animation logic touched — only className strings for Tailwind utilities changed. motion.div/motion.tr remain |