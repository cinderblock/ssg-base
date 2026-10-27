import type { MetaDescriptor } from "react-router";

// Facts about the site that more than one page uses.
export const SITE = {
  name: "My Site",
  /** The production origin, without a trailing slash. */
  url: "https://example.com",
  description: "A static site built with React Router and Vite.",
} as const;

/**
 * A page's title, description, canonical link, and social cards (Open Graph
 * and Twitter, with the image from `bun run icons`).
 */
export function pageMeta({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  /** The page's path, starting with "/". */
  path: string;
}): MetaDescriptor[] {
  const url = `${SITE.url}${path}`;
  const image = `${SITE.url}/og.png`;
  return [
    { title },
    { name: "description", content: description },
    { tagName: "link", rel: "canonical", href: url },
    { property: "og:type", content: "website" },
    { property: "og:site_name", content: SITE.name },
    { property: "og:url", content: url },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:image", content: image },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: image },
  ];
}
