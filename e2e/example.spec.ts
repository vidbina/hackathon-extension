import { test, expect } from "./fixtures";

test("Navigate to playwright.dev", async ({ page, extensionId }) => {
	test.setTimeout(5_000);
	console.log("extensionId", extensionId);
	await page.goto("https://www.playwright.dev/");
	//await page.goto(`chrome-extension://${extensionId}/sidepanel.html`);
	//await expect(page.locator("body")).toHaveText("my-extension popup");
	expect(await page.locator("body")).toHaveText("playwright");
});

test("Open sidepanel", async ({ page, extensionId }) => {
	await page.goto(`chrome-extension://${extensionId}/sidepanel.html`);
	expect(await page.locator("body")).toContainText("Activity Log");
});
