import { test, expect } from "@playwright/test";
import { requireEnv, signIn } from "./helpers/auth";

test("a client can pick a package, submit a request, and see it in My Requests", async ({ page }) => {
  await signIn(page, requireEnv("E2E_CLIENT_EMAIL"), requireEnv("E2E_PASSWORD"));
  await expect(page).toHaveURL(/\/portal\/dashboard/);

  // 1. Browse packages and request the first one.
  await page.goto("/portal/packages");
  await page.getByRole("button", { name: "Request This Package" }).first().click();
  await expect(page).toHaveURL(/\/portal\/requests\/new\?packageId=/);

  // 2. Fill in the form. The optional date is left blank on purpose.
  await page.getByLabel("Service Category", { exact: true }).click();
  await page.getByRole("option", { name: "Society Accounting", exact: true }).click();
  await page
    .getByLabel("Brief Description of Work", { exact: true })
    .fill("Automated test: monthly accounts for our society.");
  await page.getByRole("button", { name: "Submit Request" }).click();

  // 3. Confirmation, then My Requests.
  await expect(page.getByText(/your request has been submitted/)).toBeVisible();
  await page.getByRole("button", { name: "Go to My Requests" }).click();

  await expect(page).toHaveURL(/\/portal\/requests$/);
  // .first() because every test run adds another REQ-... row.
  await expect(page.getByRole("link", { name: /^REQ-/ }).first()).toBeVisible();
});


