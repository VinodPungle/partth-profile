# parthpungle.github.io

Personal portfolio of **Parth Pungle** — plain HTML, CSS, and vanilla JavaScript.
Live at **https://parthpungle.github.io/**

## No build step — edit and it's live

This site has **no build step, no npm, no framework**. The files in this repository
are exactly the files the browser loads. That means you can edit any file directly
in the GitHub web editor (press `.` or click the pencil icon on a file) and the
change goes live on the next commit — usually within a minute or two.

```
index.html                        all page content lives here
404.html                          the styled not-found page
.nojekyll                         DO NOT DELETE — see below
robots.txt                        search engine directives
sitemap.xml                       single-URL sitemap
css/style.css                     all styling; palette tokens at the top
js/main.js                        nav indicator, scroll reveal, certificate viewer
assets/resume.pdf                 downloadable resume
assets/techsolstice-certificate.jpg
assets/og-image.png               the LinkedIn/social share preview image
assets/favicon.svg
assets/apple-touch-icon.png
```

## Enabling GitHub Pages (one-time)

1. Push these files to the `main` branch of the repository **parthpungle.github.io**
   (the repository name must be exactly that — it is a GitHub *user site*).
2. Go to **Settings → Pages**.
3. Under **Source**, choose **Deploy from a branch**.
4. Branch: **main**, folder: **/ (root)** → **Save**.
5. The first deploy takes a few minutes. After that, every push redeploys automatically.

## Why `.nojekyll` must not be deleted

Without it, GitHub Pages runs the site through Jekyll, which **silently drops any
file or folder whose name begins with an underscore** and adds processing time to
every deploy. The empty `.nojekyll` file at the root switches Jekyll off so files
are served exactly as committed. It costs nothing — leave it alone.

## Where to edit each kind of content

Everything is in `index.html`. Search for the section comment banners
(`<!-- ============ 4. FEATURED PROJECTS ============ -->` etc.).

| Change | Where |
| --- | --- |
| **Availability line** | The `<p class="availability">` element at the top of the hero section. Also update the meta `description`, `og:description`, and `twitter:description` in `<head>` if the season changes. |
| **Promote a Tier 2 project to Featured** | Copy one of the `<article class="featured-card">` blocks in section 4, fill in the one-liner, the `<details>` engineering detail (problem → decisions → role), tags, and links. Then delete its `<article class="mini-card">` from section 5. Keep Featured at three — the tier structure is deliberate. |
| **Add a project** | Add an `<article class="mini-card">` inside `.mini-grid` in section 5: title, 2–3 line description, `chips tags` list, GitHub link. |
| **Add a certification** | Add an `<li>` to the `<ol class="cert-list">` in section 6. Numbering is automatic (CSS counter). Keep the most recruiter-recognizable first. |
| **Replace the resume** | Overwrite `assets/resume.pdf` with the new file, keeping the same lowercase filename. Both download links point at it. |
| **Add a profile photo** | Commit the photo as `assets/profile.jpg`, then uncomment the `hero-photo` block in the hero section of `index.html` and the matching CSS under "Profile photo" in `css/style.css`. |
| **Change the palette / fonts / spacing** | Every color, both heading sizes, the body size, and the spacing scale are CSS custom properties on `:root` at the top of `css/style.css` (with a dark-mode override block right below). Change them in one place. |
| **CloudSnip role** | There is a `<!-- FILL IN -->` comment in the CloudSnip card — add your specific role when confirmed. |

## Keep the availability line current

Recruiters screen on availability first. **Update the line each application
season**, and **remove it entirely once you accept a role** — a stale
"Seeking Summer 2027" pill dates the whole site and undoes the work it does now.

## Pre-publish checklist

- [ ] `assets/resume.pdf` downloads and opens (click both buttons).
- [ ] Every GitHub link opens the right repository (there are 7 project links).
- [ ] The live demo link (bioexamprep.com) still resolves.
- [ ] Share the URL in [LinkedIn's Post Inspector](https://www.linkedin.com/post-inspector/)
      and confirm the preview image and title render.
- [ ] Open the page at 360px width (browser dev tools → responsive mode) and
      scroll the whole page; cards should be single-column and nothing overflows.
- [ ] Certificate thumbnail opens the larger view and closes with Escape.

## If this ever moves to a project repository

If the site moves from `parthpungle.github.io` to a project repo (served at
`https://parthpungle.github.io/<repo>/`), update the absolute URLs in four places:

1. `<link rel="canonical">` in `index.html`
2. `og:url` and both `og:image` / `twitter:image` URLs in `index.html`
3. `sitemap.xml` (the `<loc>` value)
4. `robots.txt` (the `Sitemap:` line)

Relative asset paths (`css/style.css`, `assets/...`) keep working either way.
