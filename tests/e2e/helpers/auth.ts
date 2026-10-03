import type { Page } from "@playwright/test";

/** Reads a setting from .env.e2e.local and complains clearly if it is missing. */
export function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing ${name}. Add it to .env.e2e.local (see Step 10).`);
  }
  return value;
}

/** yourname@gmail.com + "e2eclient"  ->  yourname+e2eclient@gmail.com */
export function testEmail(tag: string): string {
  const [user, domain] = requireEnv("E2E_BASE_EMAIL").split("@");
  return `${user}+${tag}@${domain}`;
}

/** Opens the Sign In page, fills it in, and clicks the button. */
export async function signIn(page: Page, email: string, password: string) {
  await page.goto("/sign-in");
  await page.getByLabel("Email Address", { exact: true }).fill(email);
  await page.getByLabel("Password", { exact: true }).fill(password);
  await page.getByRole("button", { name: "Sign In", exact: true }).click();
}

