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
