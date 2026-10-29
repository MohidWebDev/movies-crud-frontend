# Movies CRUD Frontend

React + TypeScript frontend for the Movies CRUD API — browse, add, edit, and delete movies with poster uploads.

Backend repo: [movies-crud-api](https://github.com/MohidWebDev/movies-crud-api)

## Features

- Browse all movies in a searchable, filterable grid
- View full details for a single movie
- Add, edit, and delete movies
- Upload and replace movie posters (stored via Cloudinary on the backend)
- Delete confirmation modal
- Loading and error states throughout

## Tech Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS
- Motion (animations)
- Lucide React (icons)
- Jest + React Testing Library (testing)

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Required variable:
| Variable | Description |
|---|---|
| `VITE_API_BASE_URL` | Base URL of the running backend API (e.g. `http://localhost:3000`) |

### 3. Run the dev server

```bash
npm run dev
```

The app will run at `http://localhost:5173`.

## Connecting to the Backend

This frontend requires the [movies-crud-api](https://github.com/MohidWebDev/movies-crud-api) backend to be running and reachable at the URL set in `VITE_API_BASE_URL`. All movie data and poster uploads are fetched from and sent to that API — this frontend holds no data of its own.

To run the full app locally:

1. Start the backend (`movies-crud-api`) — runs on `http://localhost:3000`
2. Start this frontend (`movies-crud-frontend`) — runs on `http://localhost:5173`
3. Make sure `VITE_API_BASE_URL` in this project's `.env` points to the backend's URL

## Testing

Tests use **Jest** (jsdom environment) and **React Testing Library** with `user-event` and `jest-dom`.

```bash
npm test                # run all tests
npm run test:watch      # re-run on file changes
npm run test:coverage   # run tests and write a coverage report to coverage/
```

### What is tested

| Component                                       | What the tests check                                                                                                                                 |
| ----------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `LoginForm`                                     | Rendering, calling `login` with the typed credentials, redirect on success, loading state, error message, required-field validation                  |
| `RegisterForm`                                  | Same flow for `register`, plus the required fields and minimum password length                                                                       |
| `AddReviewForm`                                 | Star selection, submitting the rating and trimmed comment, cache invalidation, form reset, loading and error states, guards for no rating or no user |
| `DeleteModal`                                   | Open/closed rendering, confirm, cancel, close button and backdrop behaviour                                                                          |
| `StarRating`                                    | Filled stars for each value, read-only vs interactive mode, `onChange` values                                                                        |
| `ProtectedRoute`                                | Loading state, redirect to `/login`, role-based redirect, rendering children                                                                         |
| `optimizePosterUrl` (`src/utils/cloudinary.ts`) | Adds resize and auto-format options to Cloudinary poster URLs, and leaves other URLs untouched                                                       |

The other components (movie grid, details page, navbar and so on) are not covered yet.

### How API calls are mocked

- The service modules (`src/services/*Api.ts`) are mocked with `jest.mock`, so tests never touch axios or the network. Each test decides what an API call returns or rejects with.
- `useAuth` and `useToast` are mocked too, so a test can say "the user is an admin" in one line.
- Shared helpers live in `src/test/`: `factories.ts` (fake movies, users, reviews), `mocks.ts` (`mockAuth`, `mockToast`) and `renderWithProviders.tsx` (React Query client and router).

### Setup notes

- Jest runs through Babel (`babel.config.cjs`), with a plugin that rewrites `import.meta.env` (which Vite uses and Jest cannot parse) to `process.env`.
- `axios` is mapped to its CommonJS build in `jest.config.js`, because its default ES module build does not load under Jest.

### Testing approach: unit, integration and end-to-end

- **Unit-style tests**: `StarRating` and `DeleteModal` take everything through props, so they are tested in isolation with `jest.fn()` callbacks.
- **Integration-style tests**: the forms and `ProtectedRoute` render real child components, a real router and a real React Query client, then simulate what a user does (typing, clicking) and check what appears on screen. Only the network layer is mocked.
- **End-to-end tests** (a real browser against the real frontend and backend) are not part of this project.

## End-to-end tests

E2E tests use **Playwright** and drive a real Chromium browser against the real frontend and a real backend. The backend runs on a temporary in-memory database with seeded data (`npm run e2e:server` in `movies-crud-api`), so no real database or Cloudinary account is ever touched.

Requirement: `movies-crud-api` and `movies-crud-frontend` must sit side by side in the same folder.

```bash
npm run e2e:install       # once: downloads Chromium
npm run e2e               # starts both servers and runs the tests
npm run e2e -- --headed   # same, with a visible browser
npm run e2e:report        # opens the HTML report of the last run
```

The E2E servers use their own ports (frontend 5174, API 3100), so your normal dev servers can keep running. The tests are in `e2e/` and named `*.spec.ts`, so Jest (`*.test.ts(x)`) never picks them up.

| Test                           | What it checks                                                                                                                                        |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `e2e/smoke.spec.ts`            | The app loads in a real browser                                                                                                                       |
| `e2e/login-and-search.spec.ts` | An admin logs in through the form, sees all seeded movies with admin controls, searches for one movie, and clearing the search brings everything back |

## Performance notes

- Movie cards are a memoized component (`MovieCard`), so typing in the search box no longer re-renders every card.
- Poster images are requested through Cloudinary with automatic format and quality and a maximum width, and grid images load lazily. For 15 posters this cut the image transfer from about 3.4 MB (before the change).
- Search is debounced (400 ms) and React Query caches results for 60 seconds.
