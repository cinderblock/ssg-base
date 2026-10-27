# SSG Base

A boilerplate for static sites built with React Router 7, Vite, and TypeScript.

## Stack

- **React 19** + **React Router 7** — UI and routing
- **Vite** — build tool and dev server
- **TypeScript** — strict mode
- **Bun** — package manager and runtime
- **Playwright** — end-to-end testing
- **oxfmt** + **lefthook** — code formatting and pre-commit hooks
- **Cloudflare Pages** — deployment (via GitHub Actions)

## Getting Started

```sh
bun install
bun run dev
```

## Scripts

| Script              | Description                  |
| ------------------- | ---------------------------- |
| `bun run dev`       | Start dev server             |
| `bun run build`     | Build static site            |
| `bun run preview`   | Preview built site           |
| `bun run test`      | Run Playwright tests         |
| `bun run test:ui`   | Run tests with Playwright UI |
| `bun run fmt`       | Format all files with oxfmt  |
| `bun run fmt:check` | Check formatting             |
| `bun run typecheck` | Type check                   |

## Project Structure

```
app/
  root.tsx          — HTML shell and layout
  routes.ts         — Route definitions
  routes/
    home.tsx        — Index page
    404.tsx         — Not found page
  styles/
    global.css      — Global styles (light/dark mode)
public/
  favicon-light.svg — Favicon for light mode
  favicon-dark.svg  — Favicon for dark mode
tests/
  home.spec.ts      — E2E tests
```

## Deployment

Sites deploy as git-connected **Cloudflare Pages** projects: Cloudflare builds
every push itself, deploying `master` to production and other branches to
preview URLs. The GitHub Actions workflow (`.github/workflows/ci.yml`) only
checks the code (format, types, tests, and build) and deploys nothing.

To set up a new site:

1. Create the Pages project with these build settings (for sites managed in the
   [ops repo](https://github.com/cinderblock/ops), add a `pages:` entry in
   `cloudflare/config/`):

   | Setting                | Value           |
   | ---------------------- | --------------- |
   | Production branch      | `master`        |
   | Build command          | `bun run build` |
   | Build output directory | `build/client`  |

2. Grant the **Cloudflare Workers and Pages** GitHub app access to the new repo
   (GitHub → Settings → Applications → Cloudflare Workers and Pages →
   Configure). Without it, Pages never builds and the site answers with a 522.

### Unknown paths get a real 404

The not-found page (the `"*"` route) is prerendered to `build/client/404.html`,
which Cloudflare Pages serves with a 404 status for any path that isn't a page
or a file. Without it, Pages would answer every unknown path with the home page
and a 200, which search engines treat as a soft 404. `bun run build` ends with
`scripts/check-build.ts`, which fails the build if `404.html` is missing or
isn't the not-found page.

To see the real statuses locally, serve the build with Cloudflare's emulator:

```sh
bun run build
bunx wrangler pages dev build/client
```

It listens on port 8788. If that fails with "Address already in use" on
Windows, Hyper-V may have reserved the port (check with
`netsh int ipv4 show excludedportrange protocol=tcp`); add `--port 4321` or
another free port.

### Alternative: deploy from GitHub Actions

For a Pages project that isn't git-connected (a "Direct Upload" project), let
the workflow deploy with Wrangler instead. Add a step after **Build** in
`.github/workflows/ci.yml`:

```yaml
- name: Deploy to Cloudflare Pages
  if: github.event_name != 'pull_request'
  uses: cloudflare/wrangler-action@v4
  with:
    apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
    accountId: ${{ vars.CLOUDFLARE_ACCOUNT_ID }}
    command: pages deploy build/client --project-name=my-site --branch=${{ github.ref_name }}
```

Then add a `CLOUDFLARE_API_TOKEN` repository secret (a token with the
**Cloudflare Pages: Edit** permission) and a `CLOUDFLARE_ACCOUNT_ID`
repository variable, and set `--project-name` to the Pages project's name.

## Adding Routes

1. Create a new file in `app/routes/`
2. Add it to `app/routes.ts`

All routes are automatically pre-rendered during build (configured via `prerender: true` in `react-router.config.ts`).

## Development Tips

- Append `?light` to any URL during development to force light mode (e.g., `http://localhost:5173/?light`).
- Favicons automatically adapt to the user's light/dark mode preference. Replace the SVGs in `public/` with your own.
