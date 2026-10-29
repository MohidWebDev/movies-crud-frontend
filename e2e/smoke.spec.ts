import { test, expect } from "@playwright/test";

test("the app loads in a real browser", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByText("Movies App").first()).toBeVisible();
});
