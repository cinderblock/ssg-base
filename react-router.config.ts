import type { Config } from "@react-router/dev/config";
import { renameSync, rmdirSync } from "node:fs";
import { join } from "node:path";

export default {
  ssr: false,
  // Every route, plus the not-found page (the "*" route) rendered at /404.
  async prerender({ getStaticPaths }) {
    return [...getStaticPaths(), "/404"];
  },
  // Cloudflare Pages answers unknown paths with /404.html and a 404 status
  // (without it, every unknown path gets the home page with a 200).
  async buildEnd({ reactRouterConfig }) {
    const client = join(reactRouterConfig.buildDirectory, "client");
    renameSync(join(client, "404", "index.html"), join(client, "404.html"));
    rmdirSync(join(client, "404"));
  },
} satisfies Config;
