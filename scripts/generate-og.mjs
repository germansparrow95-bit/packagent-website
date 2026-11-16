import { mkdir } from "node:fs/promises";
import { chromium } from "playwright-core";

const executablePath = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";

await mkdir("public", { recursive: true });

const browser = await chromium.launch({
  executablePath,
  headless: true,
  args: ["--use-angle=swiftshader", "--enable-webgl", "--ignore-gpu-blocklist"],
});

const page = await browser.newPage({
  viewport: { width: 1200, height: 630 },
  deviceScaleFactor: 1,
});

await page.goto("http://localhost:3000/", { waitUntil: "domcontentloaded" });
await page.locator("h1").first().waitFor();
await page.waitForTimeout(2200);
await page.screenshot({ path: "public/og.png" });
await browser.close();

console.log("Generated public/og.png");
