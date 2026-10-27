import { SITE, pageMeta } from "~/site";
import type { Route } from "./+types/home";

export const meta: Route.MetaFunction = () =>
  pageMeta({ title: SITE.name, description: SITE.description, path: "/" });

export default function Home() {
  return (
    <main className="container">
      <section className="hero">
        <h1>Hello, World</h1>
        <p className="subtitle">
          Edit <code>app/routes/home.tsx</code> to get started.
        </p>
      </section>
    </main>
  );
}
