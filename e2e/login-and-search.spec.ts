import { test, expect } from "@playwright/test";

// Seeded by movies-crud-api/scripts/e2eServer.js
const ADMIN = { email: "admin@example.com", password: "password123" };

test("an admin logs in, sees the movies and finds one by searching", async ({
  page,
}) => {
  const movieCards = page.locator('[id^="movie-card-"]');

  await test.step("log in through the form", async () => {
    await page.goto("/login");
    await page.getByPlaceholder("you@example.com").fill(ADMIN.email);
    await page.getByPlaceholder("••••••••").fill(ADMIN.password);
    await page.getByRole("button", { name: "Log In" }).click();

    await expect(page).toHaveURL(/\/movies$/);
    await expect(page.getByRole("button", { name: "Logout" })).toBeVisible();
  });

  await test.step("see every seeded movie, with admin controls", async () => {
    await expect(
      page.getByRole("heading", { name: "All Movies" }),
    ).toBeVisible();
    await expect(movieCards).toHaveCount(6);
    await expect(
      page.getByRole("button", { name: "Delete Inception" }),
    ).toBeVisible();
  });

  await test.step("search narrows the grid to the matching movie", async () => {
    await page.getByPlaceholder("Search movies...").fill("Matrix");

    await expect(movieCards).toHaveCount(1);
    await expect(
      page.getByRole("heading", { name: "The Matrix" }),
    ).toBeVisible();
    await expect(page.getByRole("heading", { name: "Inception" })).toHaveCount(
      0,
    );
  });

  await test.step("clearing the search brings every movie back", async () => {
    await page.getByPlaceholder("Search movies...").fill("");

    await expect(movieCards).toHaveCount(6);
  });
});
