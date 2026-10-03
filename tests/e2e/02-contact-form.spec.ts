import { test, expect } from "@playwright/test";

test("a visitor can submit the public contact form", async ({ page }) => {
  await page.goto("/contact");

  await page.getByLabel("Name", { exact: true }).fill("Test Visitor");
  await page.getByLabel("Phone Number", { exact: true }).fill("9876543210");
  // Unique each run, because the Edge Function limits repeat emails to 3 per 5 minutes.
  await page.getByLabel("Email", { exact: true }).fill(`visitor.${Date.now()}@example.com`);
  await page.getByLabel("Service Interested In", { exact: true }).click();
  await page.getByRole("option", { name: "Society Accounting", exact: true }).click();
  await page.getByLabel("Message", { exact: true }).fill("Interested in monthly society accounting.");

  // The test Turnstile key passes by itself after a second or two. The button is
  // disabled until then, and Playwright automatically waits for it to be enabled.
  await page.getByRole("button", { name: "Send Message" }).click();

  await expect(page.getByText(/Thank you! Your message has been sent/)).toBeVisible();
});


