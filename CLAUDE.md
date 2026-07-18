# CLAUDE.md — SAIL repo guide

Guidance for Claude Code (and any collaborator) working in this repository.

## What this is

**SAIL** is a business plan for a multi-tenant SaaS: it turns a small business's own transaction data + external signals (weather, holidays, local events) into KPI dashboards, demand forecasts, and prescriptive recommendations for US SMBs (cafés, restaurants, ice-cream shops, hotels, motels). This repo holds the plan (Markdown) and a self-contained web viewer, hosted on GitHub Pages.

## Hard conventions — follow exactly

1. **Product name is only "SAIL."** Never expand it or invent a tagline in the documents.
2. **No personal names anywhere.** Refer to people by role only: **Founder** (business/GTM), **Developer / technical lead**, **the founding team**, or first-person **we/us/our**.
3. **Development cost, effort (person-weeks), and timeline (weeks) are intentionally blank** — written as `_TBD_`. **Do not fill these in** unless explicitly asked; the founding team decides them.
4. **Operating (infrastructure) costs ARE quantified** and should stay concrete (COGS, per-tenant cost, gross margin, tier prices, ARPU, MRR/ARR).
5. **Single source of truth for every number:** [`docs/appendix/C_Assumptions_and_Constants.md`](docs/appendix/C_Assumptions_and_Constants.md). Change a figure there first, then propagate. Do not introduce a number that contradicts Appendix C.
6. **Document style:** each doc starts with an `# H1` title and a metadata line (`**Project:** SAIL · **Doc:** NN · **Date:** … · **Status:** …`), uses tables/mermaid where useful, and ends with a `## Related documents` list. Cross-links are relative `.md` paths.

## Repo layout

```
index.html              → viewer shell (root; served by GitHub Pages)
assets/css/styles.css   → all styles (kept separate from HTML)
assets/js/app.js        → viewer logic + the DOCS manifest (nav is generated from it)
assets/js/marked.min.js → Markdown parser (vendored)
assets/js/mermaid.min.js→ diagram renderer (vendored)
docs/                   → business-plan documents 00–15
docs/appendix/          → appendices A–D (C = source of truth)
.nojekyll               → tells GitHub Pages to serve files as-is (no Jekyll)
```

## The viewer — how it works

- `index.html` is a static shell. `assets/js/app.js` builds the sidebar + header menu from the **`DOCS` manifest** and **fetches the Markdown files live** over HTTP, rendering them with marked + mermaid. There is **no build step.**
- **Edit a document:** just edit its file in `docs/`. Changes appear on next load.
- **Add / remove / reorder a document:** update the `DOCS` array in `assets/js/app.js` (`id`, `path`, `title`, `group`, `badge`). Keep `id` equal to the filename without `.md` so cross-links resolve.
- **Cross-links** between docs are rewritten to in-app navigation by filename, so relative-path depth doesn't matter inside the viewer.

## Hosting

- **GitHub Pages**, public repo, served from the `main` branch root. Live URL: **https://faraz7321.github.io/sail/**
- The pages carry a `noindex, nofollow` meta tag, so search engines won't list them — but anyone with the URL can view. Treat the link as semi-private.
- **To publish changes:** commit and push to `main`; Pages redeploys automatically (usually within a minute).

## Local preview

The viewer fetches Markdown over HTTP, so `file://` won't work. From the repo root:

```bash
python3 -m http.server 8080   # then open http://localhost:8080/
```
