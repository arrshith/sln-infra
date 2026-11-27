import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { projects } from "../src/lib/content";
import { validateEnquiry } from "../src/lib/enquiry";
import { POST } from "../src/app/api/enquiry/route";

// The enquiry popup opens 8s into a visit; these tests are about other things.
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    // Also runs in sandboxed frames (the blocked map), where storage throws.
    try {
      localStorage.setItem("sln-enquiry-popup", String(Date.now()));
    } catch {}
  });
});

const routes = [
  "/",
  "/projects",
  "/projects/completed",
  "/projects/ongoing",
  "/projects/upcoming",
  "/about",
  "/contact",
  "/careers",
  "/blog",
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
      "/projects/ongoing",
      "/projects/nidhi-aura",
      "/about",
      "/contact",
      "/careers",
      "/blog",
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

test("stage listings render honestly before SLN assigns stages", async ({
  page,
}) => {
  // No project carries a stage yet, so each stage route must say that plainly
  // rather than showing an empty grid or, worse, guessing.
  const staged = projects.filter((p) => p.stage);

  for (const stage of ["completed", "ongoing", "upcoming"] as const) {
    await page.goto(`/projects/${stage}`);
    await expect(page.locator("main h1")).toHaveCount(1);

    const expected = projects.filter((p) => p.stage === stage);
    await expect(page.locator(".projects-grid article")).toHaveCount(
      expected.length,
    );

    if (expected.length === 0) {
      await expect(page.locator(".stage-empty")).toBeVisible();
      // The route still offers a way onward.
      await expect(
        page.getByRole("link", { name: /View all projects/ }),
      ).toBeVisible();
    }
  }

  // The counter next to an unassigned stage reads as unknown, not as zero.
  await page.goto("/projects");
  const ongoing = page.getByRole("link", { name: /Ongoing/ });
  await expect(ongoing).toContainText(staged.length ? /\d/ : "—");
  await expect(page.locator(".projects-grid article")).toHaveCount(
    projects.length,
  );
});

test("EMI calculator computes a correct reducing-balance instalment", async ({
  page,
}) => {
  await page.goto("/projects/nidhi-aura#emi");
  const figure = page.locator(".emi-figure");
  await expect(figure).toBeVisible();

  // Read the calculator's own inputs, then check the displayed instalment
  // against the standard formula computed independently here.
  const inputs = await page.evaluate(() => {
    const ranges = Array.from(
      document.querySelectorAll<HTMLInputElement>(".emi-field input"),
    ).map((input) => Number(input.value));
    const [price, downPct, rate, tenure] = ranges;
    return { price, downPct, rate, tenure };
  });

  const principal =
    inputs.price - Math.round((inputs.price * inputs.downPct) / 100);
  const r = inputs.rate / 12 / 100;
  const n = inputs.tenure * 12;
  const expected = Math.round(
    (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1),
  );

  const shown = Number((await figure.innerText()).replace(/[^0-9]/g, ""));
  expect(shown).toBe(expected);

  // Moving a control must move the figure.
  await page.locator(".emi-field input").last().fill("10");
  await expect(figure).not.toHaveText(new RegExp(`^\D*${expected}\D*$`));
});

test("a project page shows only the sections it has data for", async ({
  page,
}) => {
  await page.goto("/projects/nidhi-aura");

  // Nidhi Aura has a gallery, a master plan and a RERA registration, but no
  // floor plans or connectivity data — so those sections must be absent
  // rather than present and empty.
  await expect(page.locator("#gallery")).toBeVisible();
  await expect(page.locator("#masterplan")).toBeVisible();
  await expect(page.locator("#rera")).toHaveCount(1);
  await expect(page.locator("#plans")).toHaveCount(0);
  await expect(page.locator("#connectivity")).toHaveCount(0);

  // Section numbering stays contiguous despite the gaps.
  const numbers = await page
    .locator(".project-subnav nav a")
    .evaluateAll((links) => links.length);
  const printed = await page
    .locator("section .label-num")
    .evaluateAll((els) => els.map((el) => el.textContent?.trim()));
  expect(printed.slice(0, numbers)).toEqual(
    Array.from({ length: numbers }, (_, i) => String(i + 1).padStart(2, "0")),
  );
});

/**
 * The footer's closing sequence hides its own content in JavaScript and brings
 * it back on a ScrollTrigger. That is only safe while the trigger is guaranteed
 * to fire — if it ever does not, the site's address, phone number and legal
 * links are invisible with nothing to reveal them.
 *
 * The rest of the suite runs with reduced motion, where the sequence never
 * arms, so this is the one place that exercises it for real. Short pages are
 * included deliberately: they have the least scroll available to reach the
 * trigger.
 */
test.describe("footer closing sequence", () => {
  test.use({ reducedMotion: "no-preference" });

  test("always finishes revealing the footer, at every viewport", async ({
    page,
  }) => {
    // Height is the dimension that matters here — it decides how much scroll a
    // page has left to reach the trigger — so it varies most; width only needs
    // the two layouts.
    for (const height of [900, 700, 620]) {
      for (const width of [1440, 390]) {
        await page.setViewportSize({ width, height });
        for (const route of ["/", "/disclaimer", "/privacy", "/careers"]) {
          await page.goto(route);
          const where = `${route} at ${width}x${height}`;

          // The scroll happens inside the poll rather than once before it. The
          // homepage's pinned sections only add their spacing after they have
          // measured, so a single scroll-to-bottom taken too early lands short
          // and the footer drifts back below the fold as the document grows.
          await expect
            .poll(
              () =>
                page.evaluate(() => {
                  window.scrollTo(0, document.documentElement.scrollHeight);
                  const opacity = (selector: string) => {
                    const el = document.querySelector(selector);
                    return el ? getComputedStyle(el).opacity : "missing";
                  };
                  return {
                    column: opacity(".footer-col"),
                    legal: opacity(".footer-bottom > *"),
                    // Fully uncovered, not left mid-wipe. Matched from the
                    // start of the string, because "inset(100% 0px 0px)"
                    // contains the substring "0%" as well.
                    wordmark: /^(none|inset\(0(%|px))/.test(
                      getComputedStyle(
                        document.querySelector(".footer-wordmark")!,
                      ).clipPath,
                    ),
                  };
                }),
              { message: where, timeout: 10000 },
            )
            .toEqual({ column: "1", legal: "1", wordmark: true });

          await expect(
            page.locator(".footer-col a").first(),
            where,
          ).toBeVisible();
        }
      }
    }
  });

  test("focusing a footer link makes it visible immediately", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/disclaimer");

    const column = page.locator(".footer-col").first();
    // Wait for hydration to actually arm the sequence, otherwise a slow load
    // leaves the footer untouched and the test passes without proving
    // anything.
    await expect
      .poll(() => column.evaluate((el) => getComputedStyle(el).opacity))
      .toBe("0");

    const link = page.locator(".footer-col a").first();
    // Focus arrives while the columns are still transparent.
    await link.focus();

    // No waiting for the timeline — focus is expected to land it at once.
    expect(await link.evaluate((el) => getComputedStyle(el).opacity)).not.toBe(
      "0",
    );
    expect(await column.evaluate((el) => getComputedStyle(el).opacity)).toBe(
      "1",
    );
  });

  test("respects reduced motion by never hiding the footer at all", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/", { waitUntil: "networkidle" });
    expect(
      await page
        .locator(".footer-col")
        .first()
        .evaluate((el) => getComputedStyle(el).opacity),
    ).toBe("1");
  });
});
