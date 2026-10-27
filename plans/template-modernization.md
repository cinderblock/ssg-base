# ssg-base: real 404 and template modernization

## Goal

1. **Fix the soft 404.** Sites built from this template answer unknown paths
   with the home page and HTTP 200 (the `route("*")` page renders only
   client-side). Cloudflare Pages serves a top-level `404.html` with a real 404
   status, so prerender the not-found route to `build/client/404.html`, and add
   a check that the build produces it.
2. **Update and modernize the template**: latest stable of every dependency,
   deploy setup matching how the sites really deploy, full icon / social card
   setup, and anything else outdated, keeping it a minimal, clean template.

Requested by the user on 2026-10-26.

## Environment / context

- Repo: `C:\Users\camer\git\Personal Projects\ssg-base`
  (github.com/cinderblock/ssg-base), branch `master`, Bun 1.4.2.
- Stack: React Router 8 (framework mode, `ssr: false` + prerender), React 19,
  Vite 8, TypeScript, oxfmt, lefthook, Playwright.
- Reference site: `../farmslicer.com` (commit `9951a2a` "A real 404: prerender
  the not-found page as 404.html", verified live: `https://farmslicer.com/nope`
  returns 404). Its `app/root.tsx`, `app/routes/home.tsx`, `app/site.ts`, and
  `.github/workflows/ci.yml` are the models for the icons, meta, and CI.
- Real deploy model: git-connected Cloudflare Pages projects defined in the
  ops repo (`ops/cloudflare/config/*.yaml`, `pages: {repo, production_branch,
build_command: bun run build, build_output_dir: build/client}`). New repos
  need the "Cloudflare Workers and Pages" GitHub app granted access, or Pages
  never builds (site shows 522).

## Decisions already made (don't re-ask)

- Deploy: **support both**. Default is a CI-only workflow (`ci.yml`, like
  farmslicer.com's) with Pages doing the deploy; the README documents the
  wrangler-from-Actions alternative.
- Icons / OG image: **generate PNGs from SVG sources** with a `bun run icons`
  script; commit the generated PNGs.
- Latest stable of everything, majors included.
- Don't touch sibling site repos, Cloudflare, or the ops repo without asking.
  Ask before pushing ssg-base.

## Plan / steps

1. [ ] 404 fix: `react-router.config.ts` prerenders `/404` and moves it to
       `build/client/404.html`; `scripts/check-build.ts` verifies the output and
       runs as part of `bun run build` (so a Pages build fails instead of shipping
       a soft 404).
2. [ ] Dependencies to latest (`bun outdated` on 2026-10-26: react-router
       8.1 → 8.5, vite 8.3.5, typescript **6 → 7** (native compiler), oxfmt 0.74,
       Playwright 1.64, React 19.3, and minor bumps).
3. [ ] CI: replace `deploy.yml` with `ci.yml`; check action versions.
4. [ ] Icons and social meta: `app/site.ts`, single `favicon.svg` source,
       `og.svg` source, `scripts/icons.ts`, theme-color, apple-touch-icon, 32 px
       PNG, canonical, `og:image`, `summary_large_image`.
5. [ ] Other modernization (review config files against current practice).
6. [ ] README: deployment section (Pages via ops repo, GitHub app access,
       wrangler alternative), 404 behavior, icons script.
7. [ ] List sibling repos using the template; offer the 404 port; ask about
       pushing.

## Findings / gotchas

- The earlier dependency-update plan (`plans/dependency-update.md`) was
  finished and committed as `c4a7a08` on 2026-06-30; only the plan file was
  left untracked.

## Progress log

- [x] Read the old plan, git state, and farmslicer.com's setup.
- [x] Asked the deploy-model and icon questions.

## Open questions for the user

(none yet)

## Things not to do

- Don't edit sibling site repos, the ops repo, or Cloudflare.
- Don't push without asking.
