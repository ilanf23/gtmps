import { chromium } from "playwright";
const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  reducedMotion: "no-preference",
});
const page = await ctx.newPage();
await page.goto("http://localhost:8081/m/vercel", {
  waitUntil: "networkidle",
  timeout: 30000,
});
await page.waitForTimeout(2000);

await page.screenshot({
  path: "/tmp/nav-top.png",
  clip: { x: 0, y: 0, width: 1440, height: 90 },
});

await page.evaluate(() => window.scrollTo(0, 1500));
await page.waitForTimeout(800);
await page.screenshot({
  path: "/tmp/nav-scrolled.png",
  clip: { x: 0, y: 0, width: 1440, height: 90 },
});
const scrollDiag = await page.evaluate(() => {
  const nav = document.querySelector("[data-wayfinder]");
  return {
    scrollY: window.scrollY,
    docHeight: document.documentElement.scrollHeight,
    navRect: nav?.getBoundingClientRect().toJSON() ?? null,
    navPosition: nav ? getComputedStyle(nav).position : null,
    navZ: nav ? getComputedStyle(nav).zIndex : null,
    activeLabel: nav?.querySelector("button[aria-label*='Section']")?.getAttribute("aria-label") ?? null,
  };
});
console.log("scroll diag:", JSON.stringify(scrollDiag, null, 2));

await page.evaluate(() => window.scrollTo(0, 5000));
await page.waitForTimeout(800);
await page.screenshot({
  path: "/tmp/nav-deep.png",
  clip: { x: 0, y: 0, width: 1440, height: 90 },
});

await page.evaluate(() => window.scrollTo(0, 1500));
await page.waitForTimeout(400);
const trigger = page
  .locator("[data-wayfinder] button[aria-label*='Section']")
  .first();
await trigger.click({ force: true });
await page.waitForTimeout(300);
await page.screenshot({
  path: "/tmp/nav-open.png",
  clip: { x: 0, y: 0, width: 1440, height: 560 },
});

await ctx.close();

const mctx = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
});
const m = await mctx.newPage();
await m.goto("http://localhost:8081/m/vercel", { waitUntil: "networkidle" });
await m.waitForTimeout(1500);
await m.screenshot({
  path: "/tmp/nav-mobile.png",
  clip: { x: 0, y: 0, width: 390, height: 90 },
});
await m.evaluate(() => window.scrollTo(0, 1500));
await m.waitForTimeout(600);
await m.screenshot({
  path: "/tmp/nav-mobile-scrolled.png",
  clip: { x: 0, y: 0, width: 390, height: 90 },
});

await browser.close();
console.log("done");
