# Parth Vinod Pungle — Applied AI Engineering Portfolio

Full-stack portfolio built with a **React + Tailwind + framer-motion + shadcn/ui** frontend and **FastAPI** backend. The published site at **[partth.online](https://partth.online)** is a fully static build on GitHub Pages; the backend is a local content/authoring tool and is not deployed.

## Architecture
- `frontend/` — React (CRA/craco) single-page site.
  - `src/components/portfolio/` — Nav, Hero (canvas particle mesh + terminal), Marquee, About, Skills (filterable), FeaturedProjects (engineering-detail dialogs), MoreProjects, Credentials (certificate lightbox), Contact form, Footer (IST clock).
  - `public/assets/` — resume.pdf, TechSolstice certificate, OG image, favicons.
  - `public/portfolio.json` — generated content for the static build (do not hand-edit).
- `backend/` — FastAPI, used locally.
  - `seed_data.py` — the single source of truth for portfolio copy.
  - `export_static.py` — dumps `seed_data.py` to `frontend/public/portfolio.json`.
  - `storage.py` — local JSON persistence for contact messages and analytics.
  - `server.py` — API routes.

### Two content modes
The frontend picks its data source from `REACT_APP_BACKEND_URL`:

| | `REACT_APP_BACKEND_URL` | Content from | Contact form | Event tracking |
|---|---|---|---|---|
| Local dev | set (e.g. `http://127.0.0.1:8000`) | `GET /api/portfolio` | `POST /api/contact` | on |
| Static build | unset | `portfolio.json` | `REACT_APP_CONTACT_ENDPOINT` | off (no-op) |

## Running locally
```bash
# Terminal 1 — API
cd backend && uvicorn server:app --reload

# Terminal 2 — client
cd frontend && yarn install && yarn start
```

Preview the static build exactly as GitHub Pages serves it:
```bash
cd frontend && yarn build
cd build && python -m http.server 4173
```

## API (local only)
| Method | Route | Purpose |
|---|---|---|
| GET | `/api/portfolio` | Full portfolio content |
| POST | `/api/contact` | Save a contact-form message (validated) |
| GET | `/api/contact` | List messages, newest first |
| POST | `/api/events` | Track a click event (`resume_download`, `project_link`, `deep_dive_open`) |
| GET | `/api/stats` | Event counts + message count |

## Editing content
Edit `backend/seed_data.py`. Restart the backend for local dev; `yarn build` regenerates
`frontend/public/portfolio.json` automatically via the `prebuild` script.

## Deployment
Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds `frontend/` and publishes
it to GitHub Pages. `frontend/public/CNAME` pins the custom domain to `partth.online`.

## Env
- `backend/.env`: `CORS_ORIGINS`, optional `PORTFOLIO_DATA_PATH` (defaults to `backend/data/portfolio-data.json`)
- `frontend/.env.development.local`: `REACT_APP_BACKEND_URL`
- GitHub Actions repository variable `CONTACT_ENDPOINT` → `REACT_APP_CONTACT_ENDPOINT` for the deployed contact form
