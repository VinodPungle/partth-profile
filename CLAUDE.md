# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Personal portfolio site: React 19 SPA (CRA via craco) + FastAPI backend with local JSON persistence.
The published site (partth.online, GitHub Pages) is a **fully static build** — the backend is a
local content/authoring tool and is never deployed.

## Commands

Frontend (run from `frontend/`, package manager is **yarn** 1.x):
- `yarn start` — dev server (craco, port 3000)
- `yarn build` — production build; its `prebuild` step runs `export-content` first
- `yarn export-content` — regenerate `public/portfolio.json` from `backend/seed_data.py`
- `yarn test` — craco/jest tests

Backend (run from `backend/`):
- `uvicorn server:app --reload` — API on :8000
- `python -m pytest` — full suite
- `python -m pytest tests/test_storage.py::test_local_store_persists_contacts_events_and_stats -n 0` — a single test
- `-n 0` forces serial execution; use it when diagnosing shared-state failures

`backend/pytest.ini` pins `addopts = -n 2 --dist loadscope` and says not to modify it. Note `-n 0`,
not `-p no:xdist` (the latter errors because addopts still passes `-n`).

**Two very different test files live in `backend/tests/`:**
- `test_storage.py` — pure unit tests against `LocalStore` with `tmp_path`. Runs anywhere.
- `test_portfolio_api.py` — black-box HTTP tests against a **running server** at
  `REACT_APP_BACKEND_URL` (default `http://127.0.0.1:8000`). Start the backend first, e.g.
  `REACT_APP_BACKEND_URL=http://127.0.0.1:8000 python -m pytest`. Its live frontend-asset check
  skips unless `FRONTEND_URL` is set.

## Architecture

### Content flow (the thing to understand first)
All portfolio copy lives in exactly one place: `backend/seed_data.py`'s `PORTFOLIO` dict. The
frontend holds **no** hardcoded content — to change text, projects, skills, or certifications, edit
`seed_data.py`. Never duplicate copy into JSX.

It reaches the page by one of two paths, chosen in [frontend/src/lib/api.js](frontend/src/lib/api.js)
by whether `REACT_APP_BACKEND_URL` is set:

| | `REACT_APP_BACKEND_URL` | Content source | Contact form | `trackEvent` |
|---|---|---|---|---|
| Local dev | set | `GET /api/portfolio` | `POST /api/contact` | posts to `/api/events` |
| Static build | unset | `public/portfolio.json` | `REACT_APP_CONTACT_ENDPOINT` | no-op |

`backend/export_static.py` generates `frontend/public/portfolio.json`; `yarn build` runs it
automatically via `prebuild`. **Never hand-edit `portfolio.json`** — it is build output.

`test_portfolio_api.py` asserts the exact shape of the `PORTFOLIO` dict (skill group ids, ordered
project ids, certification counts, architecture layer counts per featured project). Adding or
reordering entries in `seed_data.py` will break those assertions — update them deliberately.

### Backend
- [backend/server.py](backend/server.py) — all routes on an `/api` prefixed `APIRouter`; CORS from
  `CORS_ORIGINS`; `lifespan` initializes the JSON store. Pydantic models validate contact/event input.
- [backend/storage.py](backend/storage.py) — `LocalStore`: whole-file JSON read/write per operation,
  guarded by a `threading.Lock`, written atomically via `.tmp` + `replace`. Holds `contacts` and
  `events` lists. Path from `PORTFOLIO_DATA_PATH`, default `backend/data/portfolio-data.json`
  (gitignored — never commit `backend/data/`).

API surface: `GET /api/portfolio`, `POST|GET /api/contact`, `POST /api/events`, `GET /api/stats`.
These serve local development only; the deployed site never calls them.

### Frontend
- `@/` is aliased to `frontend/src/` (craco webpack alias + jsconfig).
- `src/components/portfolio/` — the page sections, composed in order by `App.js`.
  `src/components/ui/` — shadcn/ui primitives (generated; see `components.json`), don't hand-author
  new ones there.
- Analytics: `trackEvent(type, label)` fires and forgets, and is a no-op without a backend. Types in
  use: `resume_download`, `project_link`, `deep_dive_open`. Label convention is `"<placement>"` or
  `"<projectId>:<kind>"`.
- Interactive elements carry `data-testid` attributes in `kebab-case` (`contact-submit-btn`,
  `hero-resume-btn`); preserve them when editing markup.
- `package.json` sets `"homepage": "."` so asset URLs stay relative — this is what lets the same
  build work on partth.online, on a `user.github.io/repo` path, and from a local static server.
- [frontend/craco.config.js](frontend/craco.config.js) exists for the `@` alias, the eslint config,
  reduced watch scope, an opt-in health-check plugin (`ENABLE_HEALTH_CHECK=true`), and
  `makeDevServerV5Compatible` — CRA 5 emits a webpack-dev-server v4 config while this repo pins v5,
  so removing that shim breaks `yarn start`.

### Design system
Theme is "Dark Tactical Cyber-Kinetic": HSL shadcn tokens plus `--ember` (#ff5722), `--cyan`
(#00e5ff), `--emerald` in `frontend/src/index.css` `:root`. Use those variables rather than literal
hex in components. [design_guidelines.json](design_guidelines.json) is the authoritative spec for
palette, fonts (Outfit / Plus Jakarta Sans / JetBrains Mono), and section intent. Tailwind's
`overline` utility is blocklisted so an app-level eyebrow-label class works.

## Deployment

`.github/workflows/deploy.yml` builds `frontend/` on every push to `main` and publishes to GitHub
Pages. It needs Python because the build regenerates `portfolio.json` from `seed_data.py`.
`frontend/public/CNAME` pins the custom domain. The repository variable `CONTACT_ENDPOINT` supplies
`REACT_APP_CONTACT_ENDPOINT` at build time; without it the deployed contact form fails its POST and
falls back to the "email me directly" toast.

## Conventions

- Indentation: 2 spaces for JSX/JSON/CSS, 4 for Python. PascalCase component files, camelCase JS
  symbols, snake_case Python modules and functions. Backend tests are `test_*.py`.
- Commit subjects are short and imperative (e.g. `Remove MongoDB persistence`); keep commits focused.
  PRs summarize behavior changes, list verification, and include screenshots for visual work.

## Content constraints (from memory/PRD.md — enforced by tests)

- "Vin Chat" must never appear anywhere in content; `test_no_vin_chat_anywhere` greps for it.
- Do not mention the `VinodPungle` account name in copy; repo links still point at the real repos.
- TechSolstice '26 is a Certificate of **Participation** only — no award or placement language.
- `EduTrack_main` is the Course Recommendation App; the live demo bioexamprep.com is the AI Virtual
  Tutor (Featured 03).

## Repo files that are not source

- [test_result.md](test_result.md) — testing-agent protocol and task state. The header block is
  explicitly marked do-not-edit; append status entries in the documented YAML shape.
- `memory/PRD.md` — product requirements and decision log. `test_reports/` is tooling output.

## Environment

- `backend/.env`: `CORS_ORIGINS`, optional `PORTFOLIO_DATA_PATH`
- `frontend/.env.development.local`: `REACT_APP_BACKEND_URL` (set for local dev, unset in CI)
- Build-time: `REACT_APP_CONTACT_ENDPOINT` (third-party form endpoint)
