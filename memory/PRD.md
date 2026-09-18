# PRD — Parth Vinod Pungle Portfolio (full-stack rebuild)

## Original problem statement
Single-page personal portfolio for Parth Vinod Pungle (B.Tech CS-AI, MIT Bengaluru, 2024–2028,
CGPA 8.1). Positioning: applied AI engineering (LLM apps, agentic/multi-agent systems, RAG,
Azure/GCP). Job-seeking asset for recruiters (30–45s scan) and engineers (expandable depth).

**2026-06 pivot (user):** "Rebuild this website without any constraints. No constraints on using
database or any kind of front end technologies and tools." → the earlier
plain-static GitHub Pages deliverable was replaced by a React + FastAPI app with local JSON persistence. Old root
static files (index.html, css/, js/, assets/, robots, sitemap, .nojekyll) were removed.

## Confirmed content decisions (carry-over)
- EduTrack_main = Course Recommendation App.
- Live demo https://www.bioexamprep.com/ → AI Virtual Tutor (Featured 03).
- Do NOT mention the `VinodPungle` account name; links still point to the real repos.
- Vin Chat REMOVED — must never appear.
- TechSolstice '26 is a Certificate of PARTICIPATION only (no award/placement language).
- Availability: "Seeking Summer 2027 SWE & AI/ML internships · Bengaluru, Pune, or remote ·
  Graduating May 2028" (the `[months]` placeholder from the original brief was dropped).

## Architecture
- Frontend: React 19 (CRA/craco), Tailwind, framer-motion, shadcn/ui (Dialog, Sonner), lucide-react,
  React Query. Design: "Dark Tactical Cyber-Kinetic" — #090A0F void, ember #FF5722 + cyan #00E5FF
  accents, Outfit / Plus Jakarta Sans / JetBrains Mono, glass pill nav, grain overlay.
  Components in `frontend/src/components/portfolio/`. Assets in `frontend/public/assets/`.
- Backend: FastAPI with local JSON persistence. `seed_data.py` = content source of truth, served directly by
  `portfolio` collection (key "main") on startup (lifespan).
- Collections: `portfolio`, `contact_messages`, `events`.
- API: GET /api/portfolio · POST/GET /api/contact · POST /api/events · GET /api/stats.

## Implemented (June 2026)
- Sticky glass nav with framer-motion active-section pill, mobile menu, Resume CTA.
- Hero: availability pill, per-letter kinetic name (word-wrapped, gradient surname), canvas
  particle mesh (mouse-reactive, reduced-motion aware), typed terminal widget, CTAs, contact links.
- Marquee of focus areas + AI skills; About (bento) & Education card (CGPA, timeline, coursework,
  core focus); Skills with filter buttons; 3 Featured projects with highlight tiles, stack chips,
  Engineering-detail Dialog (sections, role, links); More Projects (4 cards, CloudSnip team badge);
  Certifications (AI-900 first) + TechSolstice certificate lightbox; Contact form (client + server
  validation, sonner toast, saved locally); footer with kinetic signature + live IST clock.
- Click analytics events: resume_download, project_link, deep_dive_open.
- Profile photo (2026-06): user-supplied portrait cropped to 720x720 → `public/assets/profile.jpg`;
  hero shows a gradient-ring portrait card above the terminal on desktop and a 72px circular
  avatar on mobile. `profile.photo_url` in seed_data.
- Spacing fix (2026-06, user bug): removed alternating section backgrounds (#0b0d15 bands) and
  marquee border/bg; section padding py-10 lg:py-14, header mb-8 lg:mb-10, hero min-h-[92vh].
  Verified iteration_2: uniform bg, 108px gap between sections.
- Architecture diagrams (2026-06): `featured_projects[].architecture` {caption, layers[{label,
  nodes[{name, hot}]}]} in seed_data; rendered by `ArchitectureDiagram.jsx` at the top of each
  Engineering-detail dialog (ember = key decision). Verified iteration_2 (9/9 backend, all UI).
- Email alerts (2026-06, REMOVED 2026-09): `backend/email_service.py` sent the owner a templated
  alert from a POST /api/contact BackgroundTask via a hosted email API. Deleted in the 2026-09
  static migration along with its vendor dependency; the contact form now posts to a third-party
  form service (REACT_APP_CONTACT_ENDPOINT).
- Tested: testing agent iteration_1 — backend 8/8, frontend 14/14 pass; no horizontal overflow
  at 360px; no "Vin Chat" anywhere.

## Known gaps / user-supplied content pending
- ~~CloudSnip: role not stated~~ — resolved 2026-09: `more_projects[].role` added (React frontend +
  ML service / Isolation Forest anomaly detection), rendered on the More Projects card.
- Featured project screenshots: none supplied (diagrams are built in).
- Certification verification links (Credly etc.): none supplied.
- Contact inbox (GET /api/contact) is unauthenticated — fine for now; add owner auth if exposed.

## Backlog
- P1: Owner inbox page (/inbox) to read contact messages + stats, behind a simple password.
- P1: cert verification links. (CloudSnip role text: done 2026-09.)

## Content updates (2026-09)
- CloudSnip role recorded in `seed_data.py` and surfaced on the card via a new optional
  `more_projects[].role` field (`MoreProjects.jsx` renders it only when present).
- Coursework now lists the eleven key topics from the last four semesters: DSA, Operating Systems,
  Computer Organization, Computer Networks, Data Communication, Database Management, Discrete
  Mathematical Structures, Probability & Optimization, Artificial Intelligence, Agentic AI, Data
  Analytics. Database Management and Agentic AI were kept at the user's request; only Systems
  Programming was dropped from the old list.
