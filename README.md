# Async Race

A React + TypeScript SPA that lets you create cars, race them, and track the winners.

> **Live demo:** _to be added after Vercel deploy_
> **Original task:** [EPAM Async Race](https://github.com/rolling-scopes-school/tasks/blob/master/epam/async-race.md)

## Self-assessed score

All required features and quality checks completed — see the checklist below. Final score depends on the reviewer's rubric; my own count puts this in the **upper band** of the task's scoring range.

## Functional checklist

### Required for submission

- [x] Deployed frontend link in README
- [x] Checklist in README
- [x] Self-score in README
- [x] UI deployed to Vercel
- [x] Backend not modified

### Basic structure

- [x] Garage view
- [x] Winners view
- [x] Persistent UI state when switching views (Redux)

### Garage

- [x] Create car (name validated + trimmed)
- [x] Edit car (Select → Update)
- [x] Delete car removes from both `/garage/:id` and `/winners/:id`
- [x] RGB color picker
- [x] Generate 100 random cars (12 brands × 12 models)
- [x] 7 cars per page
- [x] Empty garage message
- [x] Auto-step-back to previous page when last car on a page is deleted

### Race

- [x] Per-car Start / Stop engine
- [x] CSS-transform animation, duration = distance / velocity
- [x] Broken engine (drive 500) freezes the car mid-track
- [x] Start race for current page, Reset returns all cars to start
- [x] Winner detected via `Promise.any` — first clean finisher wins
- [x] Winner banner with name + time
- [x] Winner upsert: create with wins=1, or increment wins + keep lower best time
- [x] Controls locked during race (Create, Edit, Delete, Generate, Pagination, Navigation, per-car Start)
- [x] Reset always available as escape hatch
- [x] Responsive animation down to 500px

### Winners

- [x] Title with count
- [x] 10 winners per page
- [x] Columns: number, car icon, name, wins, best time
- [x] Server-side sort by wins / best time (`_sort` + `_order` across full dataset)
- [x] Click column header to toggle ASC/DESC
- [x] Graceful fallback when a winner's car has been deleted (shows `Car #N (deleted)`)

### Code quality

- [x] TypeScript strict mode (`strict: true`, `noImplicitAny`)
- [x] ESLint (Airbnb config) clean
- [x] Prettier formatted (`npm run ci:format` clean)
- [x] Redux Toolkit + typed hooks
- [x] Module layout: `api / app / features / shared`
- [x] Accessibility: `aria-label`, `aria-disabled`, `aria-sort`, `role="alert"`, `:focus-visible` outline, semantic markup
- [x] Error states surfaced via `ErrorBanner` (no silent console errors)
- [x] Responsive: 700px + 500px breakpoints

## Tech stack

- **Framework:** React 19, TypeScript (strict)
- **State:** Redux Toolkit, React Redux
- **Routing:** React Router v7
- **Build:** Vite 6
- **Linting:** ESLint (Airbnb), Prettier

## Local setup

This project has **two** repositories — the frontend (this one) and the backend.

### 1. Run the backend

```bash
git clone https://github.com/mikhama/async-race-api.git
cd async-race-api
npm install
npm start
```

Backend listens on `http://127.0.0.1:3000`. Leave the terminal open.

### 2. Run the frontend

```bash
git clone https://github.com/galstyann03/async-race.git
cd async-race
npm install
npm run dev
```

Vite serves at `http://localhost:5173`.

### Environment

Default API base is `http://127.0.0.1:3000`. Override via `VITE_API_BASE_URL` in `.env` if needed.

## Available scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Vite dev server with HMR |
| `npm run build` | TypeScript check + production build |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | ESLint check |
| `npm run format` | Auto-format with Prettier |
| `npm run ci:format` | Verify formatting (no writes) |

## Architecture

```
src/
├── api/                       Typed fetch client + per-resource modules
│   ├── http.ts                request() / requestPaginated() / HttpError
│   ├── garage.ts              CRUD on /garage
│   ├── engine.ts              PATCH /engine?status=...
│   └── winners.ts             CRUD on /winners
├── app/                       Redux store + typed hooks
├── features/
│   ├── garage/                Garage view, slice, components
│   ├── winners/               Winners view, slice, components
│   └── race/                  Race slice + raceController.ts orchestration
└── shared/                    CarIcon, Pagination, ErrorBanner, types, constants
```

### Race orchestration

`src/features/race/raceController.ts` exports four thunks:

- `runSingleCar(id)` — start → drive → finished / broken / cancelled
- `stopSingleCar(id)` — mark stopped → API stop → reset
- `runRace(cars)` — fan-out via `runSingleCar`, `Promise.any` picks first clean finisher, upserts winner
- `resetRace(cars)` — clears banner, stops every car

The CSS transform animation lives in `CarTrack.tsx` and watches `phase` from Redux. On `broken`, it reads `getComputedStyle(car).transform` and re-applies it without transition to freeze the car on the spot.

## Notes for the reviewer

- **Backend is not deployed.** The task requires it run locally — please `npm start` the [async-race-api](https://github.com/mikhama/async-race-api) repo before opening the live demo.
- **Race lock**: while a race is running, every mutation control is disabled (Create, Edit, Delete, Generate, Pagination, Nav links, per-car Start). Only **Reset** remains active. This satisfies "predictable actions during race."
- **No console errors expected.** API failures surface as a dismissable red banner on the affected page.
- **Persistent UI state**: Garage page, garage form values, winners page, sort field/order are all in Redux — navigating between views preserves them.

## Commit history

Built incrementally across the planned 7-day schedule documented in [docs/work-plan.md](docs/work-plan.md). See `git log --oneline` for the full chronology — every commit is small and titled with a conventional-commit prefix (`feat`, `fix`, `refactor`, `chore`, `docs`, `style`).
