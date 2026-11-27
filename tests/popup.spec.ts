import { test, expect } from "@playwright/test";

const popup = (page: import("@playwright/test").Page) =>
  page.getByRole("dialog", { name: "Enquire with SLN Infra" });

test("enquiry popup opens after 8s, once, and submits a compact enquiry", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/projects/vogue");
  await page.waitForTimeout(6500);
  await expect(popup(page)).not.toBeVisible();
  await expect(popup(page)).toBeVisible({ timeout: 4000 });
  await expect(popup(page).locator("#project")).toHaveValue("vogue");

  await popup(page).locator("#name").fill("Test Visitor");
  await popup(page).locator("#phone").fill("+91 99999 99999");
  await popup(page).locator("#email").fill("visitor@example.com");
  await popup(page).getByRole("checkbox").check();
  await popup(page)
    .getByRole("button", { name: "Prepare your enquiry" })
    .click();
  await expect(popup(page).getByRole("status")).toContainText(
    "has not been sent yet",
  );

  await page.keyboard.press("Escape");
  await expect(popup(page)).not.toBeVisible();
  expect(await page.evaluate(() => document.body.style.overflow)).toBe("");

  await page.reload();
  await page.waitForTimeout(9500);
  await expect(popup(page)).not.toBeVisible();
});

test("enquiry popup stays off pages that already are the enquiry", async ({
  page,
}) => {
  await page.goto("/contact");
  await page.waitForTimeout(9500);
  await expect(popup(page)).not.toBeVisible();
});
