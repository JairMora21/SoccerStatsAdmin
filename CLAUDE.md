# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
ng serve                  # Start dev server at http://localhost:4200
ng build                  # Production build → dist/soccer-stats-admin
ng build --watch          # Watch mode
ng serve:ssr              # Run with SSR (Express)

# Testing
ng test                   # Run unit tests (Karma)
ng test --include="**/foo.spec.ts"  # Run a single test file
```

## Architecture

Angular 17 standalone-component app — no NgModules, everything uses the standalone pattern. The app is an admin dashboard for managing soccer team data (players, matches, seasons, statistics).

**Feature modules** live in [src/app/modules/](src/app/modules/):
- `auth` — JWT login page
- `inicio` — Home dashboard (entry point after login)
- `team` — Player CRUD
- `matches` — Match records + per-match statistics (most complex feature)
- `seasons` — Season CRUD

**Cross-cutting concerns** live in:
- [src/app/core/](src/app/core/) — `authGuard`, `AuthInterceptor`, and all API response models
- [src/app/shared/](src/app/shared/) — `LocalStorageService`, `AttributesService`, `NavbarComponent`, localStorage key constants

## Backend & Auth

The app targets a .NET REST API. The base URL is configured in [enviroment.ts](enviroment.ts) (note the typo — file is `enviroment.ts`, not `environment.ts`):

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5157/api',
};
```

Authentication flow:
- Login POSTs to `/Usuario/Autenticar` and stores the JWT in localStorage under key `authToken`
- `AuthInterceptor` ([src/app/core/interceptors/auth.interceptor.ts](src/app/core/interceptors/auth.interceptor.ts)) attaches `Authorization: Bearer <token>` to every outgoing request
- `authGuard` checks token validity (expiration from `expiration` localStorage key) and redirects to `/login` if invalid
- Team context (id, name, badge) persists in localStorage and is loaded by services on each call

## State Management

No NgRx. State is managed with services + RxJS Observables. Components call service methods, subscribe inline, and store data in local component properties. The pattern is consistent across all feature modules.

## Key Patterns

**Dialog-based CRUD:** Create, edit, and delete operations open Angular Material `MatDialog` modals. Dialog components receive data via `MAT_DIALOG_DATA` and return results via `dialogRef.close(result)`.

**Multi-step match creation:** `CreateMatchComponent` uses Angular Material `MatStepper` across 5 steps (basic info → home lineup → away lineup → events → stats). Each step is a sub-component.

**API response shape:** All API responses are wrapped in a consistent interface from [src/app/core/models/](src/app/core/models/):
```typescript
interface APIResponse<T> {
  statusCode: number;
  isSuccess: boolean;
  errorMessages: string[];
  result: T;
}
```

**SSR safety:** `PLATFORM_ID` is injected in services that use `localStorage` so the code does not break during server-side rendering prerender.

## Naming Conventions

- Mixed Spanish/English: API endpoints and some model names use Spanish (`Temporada`, `Equipo`, `Partido`, `Jugador`)
- Files: `*.service.ts`, `*.guard.ts`, `*.interceptor.ts`, `*.model.ts`, `*.dto.ts`
- Routes: `/login`, `/main`, `/matches`, `/team`, `/seasons`

## Styling

Tailwind CSS for layout/utility classes + Angular Material indigo-pink prebuilt theme. Component-scoped CSS files handle any component-specific overrides. Flowbite and AlpineJS are also included but used minimally.
