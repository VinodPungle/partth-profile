# PRD — Parth Vinod Pungle Portfolio (full-stack rebuild)

## Original problem statement
Single-page personal portfolio for Parth Vinod Pungle (B.Tech CS-AI, MIT Bengaluru, 2024–2028,
CGPA 8.1). Positioning: applied AI engineering (LLM apps, agentic/multi-agent systems, RAG,
Azure/GCP). Job-seeking asset for recruiters (30–45s scan) and engineers (expandable depth).

**2026-06 pivot (user):** "Rebuild this website using emergent's own way without any constraints.
No constraints on using database or any kind of front end technologies and tools." → the earlier
plain-static GitHub Pages deliverable was replaced by a React + FastAPI + MongoDB app. Old root
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
- Backend: FastAPI, Motor. `seed_data.py` = content source of truth, upserted to
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
  validation, sonner toast, saved to Mongo); footer with kinetic signature + live IST clock.
- Click analytics events: resume_download, project_link, deep_dive_open.
- Tested: testing agent iteration_1 — backend 8/8, frontend 14/14 pass; no horizontal overflow
  at 360px; no "Vin Chat" anywhere.

## Known gaps / user-supplied content pending
- CloudSnip: Parth's specific role not stated (description says "team project").
- Featured project screenshots / architecture diagrams: none supplied.
- Certification verification links (Credly etc.): none supplied.
- Profile photo: none supplied.
- Contact inbox (GET /api/contact) is unauthenticated — fine for now; add owner auth if exposed.

## Backlog
- P1: Owner inbox page (/inbox) to read contact messages + stats, behind a simple password.
- P1: CloudSnip role text; cert verification links.
- P2: Project screenshots/diagrams in the detail dialogs; profile photo in hero.
- P2: Email notification on new contact message (Resend).
