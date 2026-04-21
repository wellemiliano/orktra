import { expect, test } from "@playwright/test";

test("login page renders ORKTRA branding", async ({ page }) => {
  await page.goto("/login");
  await expect(page.getByRole("heading", { name: "Acessar ORKTRA" })).toBeVisible();
  await expect(page.getByLabel("E-mail")).toBeVisible();
  await expect(page.getByLabel("Senha")).toBeVisible();
});
