import { test, expect } from "@playwright/test";

test.describe("Home Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("has correct title", async ({ page }) => {
    await expect(page).toHaveTitle("My Site");
  });

  test("displays heading", async ({ page }) => {
    const heading = page.getByRole("heading", { level: 1 });
    await expect(heading).toHaveText("Hello, World");
  });

  test("has proper meta description", async ({ page }) => {
    const metaDescription = page.locator('meta[name="description"]');
    await expect(metaDescription).toHaveAttribute(
      "content",
      "A static site built with React Router and Vite.",
    );
  });

  test("has a canonical link and social cards", async ({ page }) => {
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      "https://example.com/",
    );
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
      "content",
      "My Site",
    );
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
      "content",
      "https://example.com/og.png",
    );
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
      "content",
      "summary_large_image",
    );
  });

  test("serves its icons and social card", async ({ page, request }) => {
    const hrefs = await page
      .locator('link[rel="icon"], link[rel="apple-touch-icon"]')
      .evaluateAll((links) => links.map((l) => l.getAttribute("href")!));
    expect(hrefs).toHaveLength(3);
    // og:image is absolute (production URL), so check its path here.
    for (const href of [...hrefs, "/og.png"]) {
      const response = await request.get(href);
      expect(response.status(), href).toBe(200);
      expect(response.headers()["content-type"], href).toMatch(/^image\//);
    }
  });
});

test.describe("404 Page", () => {
  test("displays not found message", async ({ page }) => {
    await page.goto("/nonexistent-page");
    const heading = page.getByRole("heading", { level: 1 });
    await expect(heading).toHaveText("404");
  });

  test("has link back to home", async ({ page }) => {
    await page.goto("/nonexistent-page");
    const link = page.getByRole("link", { name: "Go back home" });
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute("href", "/");
  });
});
