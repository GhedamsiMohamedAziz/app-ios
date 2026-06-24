// Owned by: e2e-runner
import { test, expect } from "@playwright/test";

test("home shows open requests", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Demandes ouvertes" })).toBeVisible();
});

test("buyer can open a request and see ranked bids", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: /Plaquettes de frein/ }).first().click();
  await expect(page.getByText("Offres classées")).toBeVisible();
  await expect(page.getByText("Meilleur deal")).toBeVisible();
});

test("buyer can post a new request", async ({ page }) => {
  await page.goto("/requests/new");
  await page.getByLabel("Marque").fill("Toyota");
  await page.getByLabel("Modèle").fill("Yaris");
  await page.getByLabel("Pièce").fill("Filtre à air");
  await page.getByLabel("Détails").fill("Filtre à air moteur 1.0L essence");
  await page.getByRole("button", { name: /Publier/ }).click();
  await expect(page.getByText("Filtre à air")).toBeVisible();
});
