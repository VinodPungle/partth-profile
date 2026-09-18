# Parth Vinod Pungle — Applied AI Engineering Portfolio

Full-stack portfolio built the Emergent way: **React + Tailwind + framer-motion + shadcn/ui** frontend, **FastAPI** backend, **MongoDB** storage.

## Architecture
- `frontend/` — React (CRA/craco) single-page site. Fetches all content from the API with React Query.
  - `src/components/portfolio/` — Nav, Hero (canvas particle mesh + terminal), Marquee, About, Skills (filterable), FeaturedProjects (engineering-detail dialogs), MoreProjects, Credentials (certificate lightbox), Contact (DB-backed form), Footer (IST clock).
  - `public/assets/` — resume.pdf, TechSolstice certificate, OG image, favicons.
- `backend/` — FastAPI.
  - `seed_data.py` — the single source of truth for portfolio copy; upserted into Mongo on startup.
  - `server.py` — API routes.

## API
| Method | Route | Purpose |
|---|---|---|
| GET | `/api/portfolio` | Full portfolio content (profile, education, skills, projects, certifications, achievements) |
| POST | `/api/contact` | Save a contact-form message (validated) |
| GET | `/api/contact` | List messages, newest first |
| POST | `/api/events` | Track a click event (`resume_download`, `project_link`, `deep_dive_open`) |
| GET | `/api/stats` | Event counts + message count |

## Editing content
Edit `backend/seed_data.py` and restart the backend — the `main` portfolio document is re-seeded on startup.

## Env
- `backend/.env`: `MONGO_URL`, `DB_NAME`, `CORS_ORIGINS`
- `frontend/.env`: `REACT_APP_BACKEND_URL`
