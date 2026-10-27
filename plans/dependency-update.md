# ssg-base — Update to latest stable

## Goal

Bring `github.com/cinderblock/ssg-base` to latest: git already current; update
ALL dependencies to latest stable ("latest version of everything"), including
major bumps, verifying the project still builds/typechecks/formats/tests.

## Environment / context

- Path: `C:\Users\camer\git\Personal Projects\ssg-base`
- Package manager: **Bun** (bun.lock present, bun v1.3.0)
- Stack: React Router v7 (framework mode, SSG), React 19, Vite, TypeScript, oxfmt, lefthook, Playwright
- Scripts: dev/build/preview/test/fmt/fmt:check/typecheck/prepare
- Branch: master, clean, == origin/master (already at latest commit 71b7c3a)

## Decisions already made (don't re-ask)

- User wants "latest stable version of everything" → take Latest column, incl. majors.
- Do it the "best" way: verify each step, don't just bump blindly.

## Major bumps to watch (from `bun outdated`)

- react-router / @react-router/node / @react-router/dev: 7.13.1 → **8.1.0** (MAJOR)
- vite: 6.4.1 → **8.1.2** (TWO majors)
- typescript: 5.9.3 → **6.0.3** (MAJOR)
- @types/node: 25 → **26.0.1** (MAJOR, but types-only)
- oxfmt: 0.43.0 → **0.57.0** (0.x, may reformat)
- in-range/minor: isbot, react, react-dom, @types/react, lefthook, @playwright/test

## Plan / steps

1. [ ] Baseline: run typecheck + build + fmt:check on current versions (know good state)
2. [ ] Bump in-range + non-RR majors first? Or all at once. Decide based on baseline.
3. [ ] Update package.json to latest, `bun install`
4. [ ] Run typecheck → fix breakage (RR8, TS6)
5. [ ] Run build → fix breakage (Vite 8, RR8)
6. [ ] Run fmt (oxfmt may reformat) → review diff
7. [ ] Run Playwright tests
8. [ ] Review full diff, report to user (commit only if asked)

## Findings / gotchas

- TS 6.0 breaking change: side-effect imports now require type decls (TS2882).
  `import "@fontsource-variable/inter"` (bare, resolves to main `index.css`)
  failed because the bare specifier doesn't match vite/client's `*.css` ambient
  module. Fix: `import "@fontsource-variable/inter/index.css"` (valid subpath
  export, matches `*.css`). Relative `./styles/global.css` was already fine.
- RR8, Vite 8, oxfmt 0.57: NO source changes needed — build/typecheck/fmt clean.
- Playwright 1.61 needed new browser binaries: `bunx playwright install`.

## RESULT — all green

- typecheck ✅ build ✅ fmt:check (source) ✅ tests 18/18 ✅ (chromium/firefox/webkit)
- Only source change: 1 line in app/root.tsx. package.json + bun.lock bumped.
- Committed as `c4a7a08` (2026-06-30). This plan is finished; follow-up work
  is in `plans/template-modernization.md`.

## Things not to do

- Don't commit/push unless user asks.
- Don't commit build artifacts (build/, .react-router/ gitignored — good).

## Progress log

- [x] Done: committed as `c4a7a08`.
