import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { projects } from "../src/lib/content";
import { validateEnquiry } from "../src/lib/enquiry";
import { POST } from "../src/app/api/enquiry/route";

const routes = [
  "/",
  "/projects",
  "/about",
  "/contact",
  "/privacy",
  "/disclaimer",
  ...projects.map((p) => `/projects/${p.slug}`),
];

test("all pages render, stay within the viewport, and have accessible landmarks and metadata", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.route("https://maps.google.com/**", (route) => route.abort());
  for (const width of [1440, 1280, 1024, 768, 390, 375]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of routes) {
      const response = await page.goto(route, {
        waitUntil: "networkidle",
      });
      expect(response?.status(), `${route} at ${width}px`).toBe(200);
      await expect(page.locator("main h1")).toHaveCount(1);
      await expect(page).toHaveTitle(/SLN Infra/);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        "href",
        `https://www.slninfra.in${route === "/" ? "" : route}`,
      );
      await page.evaluate(() => document.fonts.ready);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth + 1,
        ),
        `${route} overflows at ${width}px`,
      ).toBe(true);
    }
  }
  expect(errors).toEqual([]);
});

test("city filters show the matching community and navigation preserves project intent", async ({
  page,
}) => {
  await page.goto("/projects");
  await page.getByRole("button", { name: "Hyderabad" }).click();
  await expect(page.locator(".projects-grid article")).toHaveCount(1);
  await expect(page.locator(".projects-grid")).toContainText(
    "SLN Sundaram Palms",
  );
  await page
    .getByRole("link", { name: "Explore SLN Sundaram Palms", exact: true })
    .click();
  await page.getByRole("link", { name: "Arrange a private visit" }).click();
  await expect(page.locator("#project")).toHaveValue("sundaram-palms");
  await expect(page.locator("#message")).toHaveValue(/arrange a visit/);
});

test("mobile menu traps focus, supports Escape, restores focus, and closes on navigation", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "Open navigation menu" });
  await trigger.click();
  const menu = page.getByRole("dialog", { name: "Navigation menu" });
  await expect(menu).toBeVisible();
  for (let i = 0; i < 12; i++) {
    await page.keyboard.press("Tab");
    expect(
      await page.evaluate(
        () =>
          document.activeElement === document.body ||
          !!document.activeElement?.closest("dialog"),
      ),
    ).toBe(true);
  }
  await page.keyboard.press("Escape");
  await expect(menu).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await trigger.click();
  await menu.getByRole("link", { name: /Our projects/ }).click();
  await expect(page).toHaveURL(/\/projects$/);
  await expect(menu).not.toBeVisible();
  expect(await page.evaluate(() => document.body.style.overflow)).toBe("");
});

test("gallery supports keyboard browsing and returns focus", async ({
  page,
}) => {
  await page.goto("/projects/nidhi-aura");
  const image = page.getByRole("button", {
    name: "Enlarge A considered streetscape",
  });
  await image.click();
  const gallery = page.getByRole("dialog", {
    name: "SLN Nidhi Aura image gallery",
  });
  await expect(gallery).toBeVisible();
  await page.keyboard.press("ArrowRight");
  await expect(gallery).toContainText("2 / 2");
  await page.keyboard.press("Escape");
  await expect(gallery).not.toBeVisible();
  await expect(image).toBeFocused();
});

test("email enquiry validates, preserves input, and never claims an unsent email was delivered", async ({
  page,
}) => {
  await page.goto("/contact?project=nidhi-aura");
  await page.getByRole("button", { name: "Prepare your enquiry" }).click();
  await expect(page.locator("#name")).toBeFocused();
  await page.locator("#name").fill("Test Visitor");
  await page.locator("#phone").fill("abcdefgh");
  await page.locator("#email").fill("visitor@example.com");
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Prepare your enquiry" }).click();
  await expect(page.locator("form").getByRole("alert")).toContainText(
    "valid phone number",
  );
  await page.locator("#phone").fill("+91 99999 99999");
  await page.getByRole("button", { name: "Prepare your enquiry" }).click();
  await expect(page.getByRole("status")).toContainText("has not been sent yet");
  const href = await page
    .getByRole("link", { name: "Open email draft" })
    .getAttribute("href");
  expect(decodeURIComponent(href!)).toContain("SLN Nidhi Aura");
  expect(href).toMatch(/^mailto:sales@slninfra.net\?/);
  await expect(page.locator("#name")).toHaveValue("Test Visitor");
});

test("main page types have no automated WCAG A/AA violations", async ({
  page,
}) => {
  await page.route("https://maps.google.com/**", (route) => route.abort());
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 960 });
    for (const route of [
      "/",
      "/projects",
      "/projects/nidhi-aura",
      "/about",
      "/contact",
    ]) {
      await page.goto(route);
      await page.evaluate(() => document.fonts.ready);
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze();
      expect(
        results.violations,
        `${route} at ${width}: ${JSON.stringify(results.violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target) })))}`,
      ).toEqual([]);
    }
  }
});

test("server rejects invalid enquiries and reports actual delivery outcomes", async () => {
  const input = {
    name: "Test Visitor",
    phone: "+91 99999 99999",
    email: "visitor@example.com",
    project: "nidhi-aura",
    message: "Test only",
    consent: true,
    website: "",
  };
  expect(validateEnquiry({ ...input, consent: false })).toHaveProperty("error");
  expect(
    validateEnquiry({ ...input, project: "invented-project" }),
  ).toHaveProperty("error");
  expect(validateEnquiry({ ...input, website: "spam" })).toHaveProperty(
    "error",
  );
  expect(
    validateEnquiry({ ...input, message: "x".repeat(2001) }),
  ).toHaveProperty("error");
  const req = (body: unknown = input, origin = "http://localhost") =>
    new Request("http://localhost/api/enquiry", {
      method: "POST",
      headers: { origin, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  expect((await POST(req(input, "https://other.example"))).status).toBe(403);
  expect((await POST(req({ ...input, email: "invalid" }))).status).toBe(400);
  expect(
    (await POST(req({ ...input, message: "x".repeat(17000) }))).status,
  ).toBe(413);
  const originalFetch = globalThis.fetch;
  const endpoint = process.env.ENQUIRY_WEBHOOK_URL;
  const secret = process.env.ENQUIRY_WEBHOOK_SECRET;
  try {
    delete process.env.ENQUIRY_WEBHOOK_URL;
    delete process.env.ENQUIRY_WEBHOOK_SECRET;
    expect((await POST(req())).status).toBe(503);
    process.env.ENQUIRY_WEBHOOK_URL = "https://example.invalid/test-only";
    process.env.ENQUIRY_WEBHOOK_SECRET = "test-only";
    globalThis.fetch = async () => new Response("", { status: 503 });
    expect((await POST(req())).status).toBe(502);
    globalThis.fetch = async (_url, options) => {
      expect(JSON.parse(String(options?.body))).toMatchObject(input);
      expect(options?.headers).toMatchObject({
        Authorization: "Bearer test-only",
      });
      return new Response("", { status: 200 });
    };
    expect((await POST(req())).status).toBe(200);
  } finally {
    globalThis.fetch = originalFetch;
    if (endpoint === undefined) delete process.env.ENQUIRY_WEBHOOK_URL;
    else process.env.ENQUIRY_WEBHOOK_URL = endpoint;
    if (secret === undefined) delete process.env.ENQUIRY_WEBHOOK_SECRET;
    else process.env.ENQUIRY_WEBHOOK_SECRET = secret;
  }
});

test("sitemap, legacy redirects, real images, and missing pages behave correctly", async ({
  request,
}) => {
  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.status()).toBe(200);
  for (const p of projects) {
    expect(await sitemap.text()).toContain(`/projects/${p.slug}`);
    expect((await request.get(p.image)).status()).toBe(200);
  }
  expect((await request.get("/robots.txt")).status()).toBe(200);
  expect((await request.get("/about-us", { maxRedirects: 0 })).status()).toBe(
    308,
  );
  expect((await request.get("/projects/no-such-project")).status()).toBe(404);
});
