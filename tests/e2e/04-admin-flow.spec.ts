import { test, expect } from "@playwright/test";
import { requireEnv, signIn } from "./helpers/auth";

test("an admin can open the newest request and change its status", async ({ page }) => {
  await signIn(page, requireEnv("E2E_ADMIN_EMAIL"), requireEnv("E2E_PASSWORD"));
  // Admins are redirected automatically to the admin dashboard.
  await expect(page).toHaveURL(/\/admin\/dashboard/);

  await page.goto("/admin/requests");
  // The list is newest-first, so this is the request test 03 just created.
  await page.getByRole("link", { name: /^REQ-/ }).first().click();
  await expect(page).toHaveURL(/\/admin\/requests\/.+/);

  // The page has exactly one dropdown: the status selector.
  await page
    .getByRole("combobox")
    .filter({ hasText: /^(Received|In Progress|Completed)$/ })
    .click();
  await page.getByRole("option", { name: "In Progress" }).click();

  await expect(page.getByTestId("status-badge")).toHaveText("In Progress");
});

