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

1. [x] 404 fix (`c901cce`): `react-router.config.ts` prerenders `/404` and
       moves it to `build/client/404.html`; `scripts/check-build.ts` runs in
       `bun run build` and fails unless 404.html is the not-found page.
2. [x] Dependencies to latest (`0aab0c8`): react-router 8.5, vite 8.3,
       typescript 7.0.2 (native compiler), React 19.3, Playwright 1.64, oxfmt
       0.74. No source changes needed.
3. [x] CI (`4aebcdb`): `deploy.yml` became CI-only `ci.yml`
       (checkout@v7, Playwright report artifact on failure). README covers Pages
       settings, the GitHub app access, the real 404, and the Wrangler
       alternative.
4. [x] `~/*` alias fix (`025c268`): `resolve.tsconfigPaths` in Vite.
5. [x] Icons and social meta (`eac88d9`): `app/site.ts` + `pageMeta()`, single
       `public/favicon.svg`, `assets/og.svg`, `scripts/icons.ts` (Playwright
       Chromium), theme-color, apple-touch-icon, 32 px PNG, canonical, og:image,
       summary_large_image; generated `Route` types for meta; tests.
6. [x] Scripts resolve paths from `import.meta.url` (`5c7123c`); README stack
       versions (`e67f37b`).
7. [ ] **Current:** user decisions: push ssg-base? Port the 404 fix to which
       sibling repos?

## Findings / gotchas

- The earlier dependency-update plan (`plans/dependency-update.md`) was
  finished and committed as `c4a7a08` on 2026-06-30; only the plan file was
  left untracked.
- Verified with `bunx wrangler pages dev build/client --port 4321`: `/` is
  200, `/nope` and `/deep/nope` are 404 with the not-found page, `/404` is 200
  (Pages serves 404.html at its pretty URL), `/404.html` redirects (308).
- On this machine Hyper-V reserves TCP 8788–8987, so wrangler's default port
  8788 fails with "Address already in use" though nothing listens. Check with
  `netsh int ipv4 show excludedportrange protocol=tcp`.
- The build also emits `build/client/__spa-fallback.html` (React Router does
  this because of the `"*"` route). Harmless on Pages; left alone.
- The check keys on `"routes/404":` in `window.__reactRouterRouteModules`
  (present only in the not-found page), not on the title, so sites can
  retitle the 404 page freely.
- The `~/*` alias resolved in `react-router build` but not in the dev server
  ("Cannot find module '~/site'") until `resolve: { tsconfigPaths: true }`.
- `git rm` of the last files in `public/` deleted the directory; also, staged
  deletions ride along into the next commit (caught and redone before push).
- React Router 8 has only `unstable_` future flags; the default server entry
  still imports `isbot` and `@react-router/node`, so both stay.
- ops repo has no `BUN_VERSION` for Pages projects; the Pages image default
  Bun runs `check-build.ts`.

## Sibling repos using the template (not touched)

All have `ssr: false` and prerender; all but WebPress have a `"*"` route.
Only farmslicer.com has the 404 fix. Custom prerender configs (need care):
Empyrean Upgrades, WebPress, empyreangate.org, hyparhuts.org, print-template,
svdsa.org. Plain `prerender: true`: blake.tacklind.com, cameron.tacklind.com,
tacklind.com, tomsawyerlabs.com. Uncommitted work present in svdsa.org (2),
tomsawyerlabs.com (1), and the "cameron.tacklind.com - Copy" folder (13).
arbitraryshit.com is not checked out locally.

## Progress log

- [x] Read the old plan, git state, and farmslicer.com's setup.
- [x] Asked the deploy-model and icon questions.
- [x] Steps 1 to 6 done; clean-state run: fmt, typecheck, build check, and
      Playwright 21/21 (chromium, firefox, webkit) all pass.
- [ ] Push (awaiting the user's OK).
- [ ] 404 port to sibling repos (awaiting the user's choice).

## Open questions for the user

1. Push ssg-base's 9 commits to `origin/master`? (Recommended: yes.)
2. Port the 404 fix to which sibling repos? (Recommended: all with a `"*"`
   route, one commit each, checking each custom prerender config.)

## Things not to do

- Don't edit sibling site repos, the ops repo, or Cloudflare without asking.
- Don't push without asking.
