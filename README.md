# PixelHunt

A full-stack "Where's Waldo?"-style hidden object game built as part of The Odin Project curriculum. The player explores a dense illustrated board, identifies hidden characters, races the clock, and submits a server-verified score to the leaderboard.

Live demo: [odin-wheres-waldo-pnmu.vercel.app](https://odin-wheres-waldo-pnmu.vercel.app/)

![PixelHunt demo](docs/preview.gif)

## Project Snapshot

- Search for hidden characters on a large illustrated map.
- Validate every click against coordinates stored in the database instead of trusting the client.
- Track a live timer during play, then compute the final leaderboard time on the server.
- Save high scores and display the fastest runs in a dedicated leaderboard view.
- Use a frontend/backend split that mirrors a real production app instead of a purely client-side toy project.

## Gallery

| Home | Gameplay | Completion |
| --- | --- | --- |
| ![Home screen](docs/frame-04.png) | ![Gameplay board](docs/frame-16.png) | ![Mission complete modal](docs/frame-31.png) |

## Why This Project Matters

This project is a deceptively rich full-stack exercise. On the surface it looks like a simple hidden-object game, but building it well requires responsive coordinate math, client/server trust boundaries, relational data modeling, stateful gameplay, and deployment concerns such as CORS, environment variables, and API hosting.

It also has strong academic value because it connects several subjects that are often learned separately:

- frontend interactivity and state updates
- backend route design
- persistent storage with relational data
- security-minded score handling
- UI/UX feedback loops for clicks, errors, loading, and completion

## Stack

| Layer | Tools | Why they matter here |
| --- | --- | --- |
| Frontend | React 19, TypeScript, Vite, React Router | Handles routing, game flow, and responsive UI updates |
| Styling | Tailwind CSS 4, Lucide icons | Fast visual iteration and consistent component styling |
| Client data | Axios | Keeps API access centralized and simple |
| State | Zustand `persist` middleware | Stores small client-side preferences cleanly |
| Backend | Express 5, TypeScript | Serves game, validation, and leaderboard endpoints |
| Database | PostgreSQL + Prisma | Stores maps, characters, game sessions, and scores |
| Deployment | Vercel configs in `frontend/` and `backend/` | Reflects a split deployment architecture |

## Architecture

```mermaid
flowchart LR
    P[Player] --> F[React frontend]
    F -->|GET /api/maps| B[Express API]
    F -->|GET /api/maps/:id| B
    F -->|POST /api/game/start| B
    F -->|POST /api/game/validate| B
    F -->|GET /api/scores| B
    F -->|POST /api/scores| B
    B --> O[Prisma Client]
    O --> D[(PostgreSQL)]
```

## Data Model

```mermaid
erDiagram
    MAP ||--o{ CHARACTER : contains
    MAP ||--o{ GAME : starts
    MAP ||--o{ SCORE : records

    MAP {
        string id
        string name
        string imageUrl
    }

    CHARACTER {
        string id
        string name
        string iconUrl
        float xPct
        float yPct
        string mapId
    }

    GAME {
        string id
        datetime startTime
        string mapId
    }

    SCORE {
        string id
        string name
        int time
        string mapId
    }
```

## API Surface

| Route | Method | Purpose |
| --- | --- | --- |
| `/api/maps` | `GET` | Fetch the available game boards |
| `/api/maps/:id` | `GET` | Fetch one board and its hidden characters |
| `/api/game/start` | `POST` | Open a timed game session |
| `/api/game/validate` | `POST` | Check whether a click matches a chosen character |
| `/api/scores` | `GET` | Return the top scores, ordered by fastest time |
| `/api/scores` | `POST` | Save a finished run using the server-side session time |

## Notable Implementation Details

### 1. Responsive Click Coordinates

The frontend does not store raw pixel coordinates. It converts a click into percentages relative to the displayed image size, which makes hit detection portable across screen sizes:

```ts
const rect = e.currentTarget.getBoundingClientRect();
const x = ((e.clientX - rect.left) / rect.width) * 100;
const y = ((e.clientY - rect.top) / rect.height) * 100;
```

This is one of the most important ideas in the whole project. Without it, the game would break as soon as the image resized on another device.

### 2. Server-Verified Target Matching

The backend compares the submitted percentages against stored character coordinates and uses a margin of error:

```ts
const margin = 2.0;
const isMatch =
  Math.abs(char.xPct - x) <= margin &&
  Math.abs(char.yPct - y) <= margin;
```

That keeps the validation logic authoritative and avoids relying on hidden positions stored in the browser.

### 3. Server-Authoritative Score Timing

The client shows a live timer for user feedback, but the final score is calculated on the backend from the recorded game session:

```ts
const duration = Math.floor(
  (Date.now() - gameSession.startTime.getTime()) / 1000
);
```

That is a much better design than trusting a timer value submitted by the client, because it reduces obvious cheating and keeps leaderboard data more credible.

## What I Learned

- How to translate DOM click positions into normalized coordinates that still work on responsive images.
- How to split responsibility correctly: the frontend handles interaction and feedback, while the backend remains the source of truth for validation and scores.
- How to model a game domain relationally with `Map`, `Character`, `Game`, and `Score`.
- How small UX details such as skeleton loading states, error toasts, markers, and completion modals make a project feel dramatically more polished.
- How deployment details like CORS, base URLs, and environment configuration become part of the real engineering problem.

## Difficulties and Tradeoffs

- Hitbox calibration is harder than it looks. If the margin is too small, correct clicks feel unfair; if it is too large, the game becomes sloppy.
- The game board is visually dense, so overlay placement and click feedback need to be readable without hiding too much of the artwork.
- A client-only timer is easy to build, but it is not trustworthy for a leaderboard. Using a server-side game session is the more disciplined solution.
- The app structure already supports multiple maps, but content authoring still takes time because every hidden character needs accurate coordinates.

## Optimization Notes

- Percentage-based coordinates avoid expensive remapping logic when the image scales.
- `GET /api/maps/:id` only selects the character fields the UI actually needs.
- Leaderboard queries are limited to the fastest 10 scores.
- The Axios client normalizes the base URL once so frontend requests stay consistent between local and deployed environments.
- Found markers and character completion states are kept in local UI state, which keeps interaction snappy and avoids unnecessary refetching.

## Academic Value

| Concept | How this project exercises it |
| --- | --- |
| Responsive UI math | Converts raw click positions into percentages independent of viewport size |
| Client/server trust boundaries | Keeps hidden coordinates and final score validation on the server |
| Relational database design | Separates maps, characters, temporary game sessions, and final scores |
| Full-stack integration | Connects React state, HTTP requests, backend routes, Prisma queries, and persistence |
| UX engineering | Balances correctness, feedback, pacing, and visual clarity in a single interaction loop |
| Deployment thinking | Requires environment configuration, API URLs, static assets, and CORS setup |

## Running Locally

This repository is organized as two separate apps, so local development uses two terminals.

### Backend

```bash
cd backend
npm install
```

Create `backend/.env`:

```bash
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DB_NAME
NODE_ENV=development
ORIGIN=http://localhost:5173
PORT=3000
```

Then run Prisma and start the API:

```bash
npx prisma migrate dev
npx prisma db seed
npm run dev
```

### Frontend

```bash
cd frontend
npm install
```

Optional `frontend/.env`:

```bash
VITE_API_URL=http://localhost:3000
```

Start the frontend:

```bash
npm run dev
```

### Important Note About Seed Data

The current checked-in seed file defines the structure of the content, but the `xPct` and `yPct` values in `backend/src/config/seed.ts` are placeholders. For a fully playable local clone, those coordinates need to be calibrated to the real hiding spots or imported from the production dataset.

## Future Improvements

- Add an internal coordinate-picker tool for authoring new maps faster.
- Expose map-specific leaderboards directly in the UI.
- Add automated tests for click validation and score submission.
- Improve touch/mobile targeting for smaller screens.
- Add rate limiting or replay protection around score submission.

## Media

- Demo GIF: [`docs/preview.gif`](docs/preview.gif)
- Full capture: [`docs/preview.webm`](docs/preview.webm)

## Credits

- Built for The Odin Project's "Where's Waldo?" assignment.
- Artwork and board assets are provided through the project's configured game data.
