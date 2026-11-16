import { mkdir } from "node:fs/promises";
import { chromium } from "playwright-core";

const executablePath = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const outputDir = "qa";

await mkdir(outputDir, { recursive: true });

const browser = await chromium.launch({
  executablePath,
  headless: true,
  args: ["--use-angle=swiftshader", "--enable-webgl", "--ignore-gpu-blocklist"],
});

const errors = [];

async function inspect(page, name) {
  page.on("pageerror", (error) => errors.push(`${name}: ${error.message}`));
  const layout = await page.evaluate(() => ({
    viewport: window.innerWidth,
    scrollWidth: document.documentElement.scrollWidth,
    title: document.title,
  }));
  console.log(name, layout);

  if (layout.scrollWidth > layout.viewport + 1) {
    errors.push(`${name}: horizontal overflow ${layout.scrollWidth} > ${layout.viewport}`);
  }
}

const desktop = await browser.newPage({ viewport: { width: 1680, height: 950 } });
await desktop.goto("http://localhost:3000/", { waitUntil: "domcontentloaded" });
await desktop.locator("h1").first().waitFor();
await desktop.waitForTimeout(1800);
await inspect(desktop, "desktop");
await desktop.screenshot({ path: `${outputDir}/desktop-hero.png` });

await desktop.addStyleTag({
  content:
    ".fallback-box-scene { opacity: 1 !important; } .hero-stage canvas { display: none !important; }",
});
await desktop.screenshot({ path: `${outputDir}/desktop-hero-fallback.png` });

await desktop.getByRole("link", { name: "工作流", exact: true }).first().click();
await desktop.waitForTimeout(250);
const workflowTop = await desktop.locator("#workflow").evaluate((node) =>
  node.getBoundingClientRect().top,
);
if (workflowTop < 60 || workflowTop > 110) {
  errors.push(`desktop: workflow anchor landed at ${workflowTop}px`);
}
await desktop.locator('[role="tab"]').nth(3).click();
await desktop.waitForTimeout(500);
await desktop.screenshot({ path: `${outputDir}/desktop-workflow.png` });

await desktop.locator("#capabilities").scrollIntoViewIfNeeded();
await desktop.waitForTimeout(800);
await desktop.screenshot({ path: `${outputDir}/desktop-capabilities.png` });

await desktop.locator("#feedback").scrollIntoViewIfNeeded();
await desktop.waitForTimeout(500);
await desktop.screenshot({ path: `${outputDir}/desktop-feedback.png` });

await desktop.locator("#download").scrollIntoViewIfNeeded();
await desktop.waitForTimeout(800);
await desktop.screenshot({ path: `${outputDir}/desktop-download.png` });

const mobile = await browser.newPage({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 1,
});
await mobile.goto("http://localhost:3000/", { waitUntil: "domcontentloaded" });
await mobile.locator("h1").first().waitFor();
await mobile.waitForTimeout(1600);
await inspect(mobile, "mobile");
await mobile.screenshot({ path: `${outputDir}/mobile-hero.png` });

await mobile.locator("#workflow").scrollIntoViewIfNeeded();
await mobile.waitForTimeout(700);
await mobile.locator('[role="tab"]').nth(2).click();
await mobile.waitForTimeout(500);
await mobile.screenshot({ path: `${outputDir}/mobile-workflow.png` });

await mobile.locator("#feedback").scrollIntoViewIfNeeded();
await mobile.waitForTimeout(500);
await mobile.screenshot({ path: `${outputDir}/mobile-feedback.png` });

await mobile.locator("#download").scrollIntoViewIfNeeded();
await mobile.waitForTimeout(800);
await mobile.screenshot({ path: `${outputDir}/mobile-download.png` });

await mobile.locator(".menu-button").click();
await mobile.waitForTimeout(250);
if (!(await mobile.locator(".main-nav").isVisible())) {
  errors.push("mobile: navigation did not open");
}
await mobile.screenshot({ path: `${outputDir}/mobile-menu.png` });

await mobile.goto("http://localhost:3000/install", { waitUntil: "domcontentloaded" });
await mobile.locator("h1").first().waitFor();
await mobile.waitForTimeout(500);
await inspect(mobile, "mobile-install");
await mobile.screenshot({ path: `${outputDir}/mobile-install.png` });

await browser.close();

if (errors.length) {
  console.error(errors.join("\n"));
  process.exitCode = 1;
} else {
  console.log("Visual and layout checks passed.");
}
