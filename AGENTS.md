# Repository Guidelines

## Project Structure & Module Organization

The React single-page application is in `frontend/`; portfolio sections live in
`frontend/src/components/portfolio/`, reusable UI primitives in
`frontend/src/components/ui/`, and static files in `frontend/public/assets/`.
The FastAPI API is in `backend/`: `seed_data.py` contains portfolio copy,
`server.py` defines routes, `storage.py` stores contact messages and events in
local JSON, and `export_static.py` dumps the copy to
`frontend/public/portfolio.json` for the static build. Backend tests belong in
`backend/tests/`. Do not commit the runtime `backend/data/` directory.

## Build, Test, and Development Commands

Run `yarn start` from `frontend/` to serve the client, `yarn build` to create a
production build (its `prebuild` step regenerates `public/portfolio.json`), and
`yarn test` for front-end tests. Start the API from `backend/` with
`uvicorn server:app --reload`. Run backend tests with `python -m pytest`; use
`-n 0` to run serially when diagnosing shared-state tests. The HTTP tests in
`test_portfolio_api.py` need a running backend — point them at it with
`REACT_APP_BACKEND_URL`. Configure `REACT_APP_BACKEND_URL` for the client and,
optionally, `PORTFOLIO_DATA_PATH` for the local JSON data file.

## Coding Style & Naming Conventions

Use 2-space indentation for JSX, JSON, and CSS, and 4 spaces for Python.
Use PascalCase component filenames (for example, `FeaturedProjects.jsx`),
camelCase JavaScript symbols, and snake_case Python modules/functions. Keep
content changes in `backend/seed_data.py`; do not duplicate them in the client.

## Testing Guidelines

Use `test_*.py` for API and storage tests. Cover endpoint validation, contact
persistence, and event statistics when changing backend behavior. For visual
client changes, include the relevant front-end test where practical and verify
desktop and mobile layouts manually.

## Commit & Pull Request Guidelines

Write short, imperative commit subjects, such as `Remove MongoDB persistence`.
Keep commits focused. Pull requests should summarize behavior changes, list
verification, link issues where applicable, and include screenshots for visual
or layout work. Update documentation whenever setup or configuration changes.
