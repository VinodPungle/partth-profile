# PRD — parthpungle.github.io (static portfolio)

## Original problem statement
Single-page personal portfolio for Parth Vinod Pungle (B.Tech CS-AI, MIT Bengaluru,
2024–2028, CGPA 8.1). Positioning: applied AI engineering (LLM apps, agentic/multi-agent
systems, RAG, Azure/GCP). Job-seeking asset for recruiters (30–45s scan) and engineers
(expandable depth). HARD CONSTRAINTS: frontend only, plain HTML/CSS/vanilla JS, no build
step, no runtime libraries, only external request = one Google Fonts stylesheet. Hosted at
https://parthpungle.github.io/ (GitHub user site, deploy from branch root).

## User choices (confirmed 2026-06)
- Repo descriptions: written from public repo contents (multi-agent-ai-platform,
  azure-foundry-chat, CloudSnip crawled from GitHub).
- EduTrack_main = Course Recommendation App: confirmed.
- Availability line: default used as-is (Summer 2027, Bengaluru/Pune/remote, grad May 2028).
- Live demo: https://www.bioexamprep.com/ → coaching-academy repo (Featured 3).
- Repo ownership (VinodPungle vs parthpungle): do NOT mention the account name; just
  describe projects. Links still point to the real repos.
- REMOVED: Vin Chat project (user request).

## Architecture
Deliverable = static files at /app repo root (this is the exact GitHub Pages tree):
index.html, 404.html, .nojekyll, robots.txt, sitemap.xml, README.md, css/style.css,
js/main.js, assets/{resume.pdf, techsolstice-certificate.jpg (1200x848, 83KB),
og-image.png (1200x630, PIL-generated), favicon.svg, apple-touch-icon.png}.
Preview only: frontend package.json "start" runs `python3 -m http.server 3000 --directory /app`
(NOT part of the deliverable; user copies only the listed files to their repo).

## Implemented (June 2026)
- Full single page: hero (availability pill, tagline, summary, CTAs, contact links),
  About & Education, Skills (AI first, plain chips), 3 Featured projects with native
  <details> engineering depth, 4-card More Projects grid, Certifications (AI-900 first)
  & TechSolstice achievement w/ plain-JS certificate lightbox, Contact, footer, 404 page.
- Design: Fraunces + Archivo (single Google Fonts request, display=swap), warm paper/ink
  palette + ember accent, all tokens on :root, dark mode via prefers-color-scheme.
- Motion: hero staggered rise on load + IntersectionObserver section reveals + hover
  states only; all guarded by prefers-reduced-motion; content visible with JS off
  (html.js gate).
- SEO/social: canonical, OG/Twitter absolute URLs, JSON-LD Person, robots.txt, sitemap.xml.
- A11y: one h1, landmarks, skip link, focus-visible styles, alt text, keyboard modal
  (Escape/backdrop/focus return), scroll-margin-top under sticky nav.
- Verified: all 11 paths 200; desktop + 360px (no horizontal overflow); details expand;
  cert modal open/close; nav active indicator.

## Known gaps / user-supplied content pending
- CloudSnip: Parth's specific role NOT stated (HTML comment placeholder in card).
- Featured project screenshots/diagrams: commented placeholders only.
- Certification verification links (Credly etc.): none supplied, none rendered.
- Profile photo: commented placeholder in hero + CSS.

## Backlog
- P1: Fill CloudSnip role; add cert verification links when supplied.
- P2: Project screenshots; profile photo.
