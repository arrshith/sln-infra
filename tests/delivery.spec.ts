import { test, expect } from "@playwright/test";

test("direct enquiry shows pending, failure, and confirmed receipt without losing input", async ({
  page,
}) => {
  let respond: (status: number) => void = () => {};
  await page.route("**/api/enquiry", async (route) => {
    const status = await new Promise<number>((resolve) => {
      respond = resolve;
    });
    await route.fulfill({
      status,
      contentType: "application/json",
      body: JSON.stringify(
        status === 200 ? { ok: true } : { error: "Test failure" },
      ),
    });
  });
  await page.goto("http://localhost:3101/contact?project=nidhi-aura");
  await page.locator("#name").fill("Test Visitor");
  await page.locator("#phone").fill("+91 99999 99999");
  await page.locator("#email").fill("visitor@example.com");
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Send your enquiry" }).click();
  await expect(
    page.getByRole("button", { name: "Sending enquiry" }),
  ).toBeDisabled();
  await expect(page.locator("#name")).toBeDisabled();
  respond(502);
  await expect(page.locator("form").getByRole("alert")).toContainText(
    "couldn’t confirm delivery",
  );
  await expect(page.locator("#name")).toHaveValue("Test Visitor");
  await page.getByRole("button", { name: "Send your enquiry" }).click();
  await expect(
    page.getByRole("button", { name: "Sending enquiry" }),
  ).toBeDisabled();
  respond(200);
  await expect(page.getByRole("status")).toContainText(
    "Your enquiry has been received",
  );
  await expect(page.locator("#name")).toHaveValue("");
});
