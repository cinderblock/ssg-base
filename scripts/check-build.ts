// Checks the static build for what the host needs: a top-level 404.html
// holding the not-found page, which Cloudflare Pages serves with a 404 status
// for unknown paths. Runs after `react-router build`, so a broken build fails
// before it deploys a site whose every unknown path is a soft 404.

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const client = join(import.meta.dirname, "..", "build", "client");

// The id of the "*" route in app/routes.ts. A prerendered page lists the
// modules of the routes it matched, so this is in the not-found page only.
const notFoundRoute = '"routes/404":';

const problems: string[] = [];

function page(path: string): string | undefined {
  const file = join(client, path);
  if (existsSync(file)) return readFileSync(file, "utf8");
  problems.push(`missing build/client/${path}`);
}

const notFound = page("404.html");
if (notFound !== undefined && !notFound.includes(notFoundRoute)) {
  problems.push("build/client/404.html is not the not-found page");
}
if (existsSync(join(client, "404"))) {
  problems.push("build/client/404/ is left over (serve it as /404.html only)");
}
if (page("index.html")?.includes(notFoundRoute)) {
  problems.push("build/client/index.html is the not-found page");
}

if (problems.length) {
  console.error(
    `Build check failed:\n${problems.map((p) => `  - ${p}`).join("\n")}`,
  );
  process.exit(1);
}
console.log("Build check passed: build/client/404.html is the not-found page.");
