# HargaKu — Pantau Harga Belanjaan Pribadi

Aplikasi pencatatan harga belanja pribadi. Dibangun dengan React 18, TypeScript, Vite, dan Tailwind CSS.

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18, TypeScript |
| Build | Vite |
| State (server) | React Query v5 |
| Routing | React Router v6 |
| Styling | Tailwind CSS |
| HTTP | Axios |
| API mocking | MSW (Mock Service Worker) |

## Dev Commands

```bash
npm run dev      # Start dev server (localhost:5173)
npm run build    # TypeScript check + production build
npm run lint     # ESLint
npm run test     # Vitest
npm run test -- --coverage  # With coverage report
```

## Project Structure

```
src/
├── api/          # API client layer (axios calls)
├── components/   # Reusable UI components
├── hooks/        # Custom React hooks
├── lib/          # Utilities, factories
├── mocks/        # MSW handlers and mock data
├── pages/        # Route-level page components
└── types/        # Shared TypeScript interfaces
```

## Environment

| Variable | Description |
|----------|-------------|
| `VITE_API_BASE_URL` | Backend API base URL |

## Release Process

See [release-plan skill](.opencode/skills/release-plan/SKILL.md) for the full release checklist covering quality gates, testing, changelog, and deployment verification.
