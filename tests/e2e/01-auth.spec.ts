import { test, expect } from "@playwright/test";
import { requireEnv, signIn, testEmail } from "./helpers/auth";

test("a visitor can sign up, land on the dashboard, sign out, and sign back in", async ({ page }) => {
  const password = requireEnv("E2E_PASSWORD");
  // A brand-new throw-away account every run.
  const email = testEmail(`e2e-${Date.now()}`);

  await page.goto("/sign-up");
  await page.getByLabel("Full Name", { exact: true }).fill("Test Client");
  await page.getByLabel("Email Address", { exact: true }).fill(email);
  await page.getByLabel("Mobile Number", { exact: true }).fill("9876543210");
  await page.getByLabel("Password", { exact: true }).fill(password);
  await page.getByLabel("Confirm Password", { exact: true }).fill(password);
  await page.getByLabel(/I agree/).check();
  await page.getByRole("button", { name: "Create Account" }).click();

  await expect(page).toHaveURL(/\/portal\/dashboard/);
  await expect(page.getByText(/Welcome back/)).toBeVisible();

  await page.getByRole("button", { name: "Log Out" }).click();
  // Your route guard sends signed-out visitors to Sign In.
  await expect(page).toHaveURL(/\/sign-in/);

  await signIn(page, email, password);
  await expect(page).toHaveURL(/\/portal\/dashboard/);
});


