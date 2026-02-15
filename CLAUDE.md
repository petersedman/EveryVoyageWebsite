# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static marketing website for EveryVoyage, a motorhome/RV travel app. Hosted on GitHub Pages at www.everyvoyage.com. No build tools, bundlers, or package manager — just HTML, CSS, and vanilla JavaScript served as-is.

## Development

To develop locally, serve the root directory with any static file server:
```bash
python3 -m http.server 8000
# or
npx serve .
```

There are no build, lint, or test commands.

## Architecture

### Multi-Language Structure

Root `/` is English (UK). Each language has its own subdirectory with duplicated HTML files:

- `en-us/`, `fr/`, `de/`, `es/`, `it/`, `nl/`, `da/`, `no/`, `sv/`

Each language directory contains: `index.html`, `about.html`, `contact.html`, `faq.html`. Legal pages (`privacy-policy.html`, `terms.html`, `cookie-policy.html`) exist only at root.

**CRITICAL: When editing content or structure on any page, changes must be replicated across ALL 10 language versions** (root + `en-us/`, `fr/`, `de/`, `es/`, `it/`, `nl/`, `da/`, `no/`, `sv/`). The root English (UK) version is the canonical source. Always verify all language directories have been updated before considering a task complete. Translate user-facing text appropriately for each language.

### Navigation

Navigation is implemented as a Web Component (`<site-nav>`) in `assets/js/site-nav.js` with Shadow DOM encapsulation. It handles language switching, mobile menu, and active page state via attributes (`lang`, `page`, `base-path`).

Two nav injector scripts exist: `assets/js/main.js` (all languages) and `assets/js/main-en-us.js` (US English variant).

### Styling

All CSS is inline within `<style>` tags in each HTML file — there are no external stylesheets. Key CSS custom properties are defined in each page's root styles:

- Colors: `#F7F4ED` (cream), `#f54a00` (orange), `#2A2A28` (charcoal)
- Fonts: Fraunces (display/headings), DM Sans (body)
- Easing: `--ease-smooth`, `--ease-bounce`

### Assets

- `assets/img/` — WebP images and PNG fallbacks
- `assets/brand/` — Logo files
- `assets/stores/` — App store badge SVGs (localized per language)
- `assets/icons/` — Favicon
- `assets/js/` — Navigation scripts only

## Key Conventions

- Icons are inline SVGs (no icon library loaded). FontAwesome-style SVG paths are used with `fill="currentColor"` and appropriate viewBox.
- Feature cards on the homepage use `.feature-card` class; unreleased features use `.feature-card.coming-soon` with a "Coming Soon" stamp image.
- Mobile-first responsive design using `clamp()` for fluid typography.
- SEO: JSON-LD structured data (MobileApplication, Organization schemas) and hreflang tags on every page.
- Font loading is optimized: critical weight (400) is preloaded, additional weights loaded async.
