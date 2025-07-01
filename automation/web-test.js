const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.connectOverCDP('http://localhost:9222');
  const contexts = browser.contexts();
  const context = contexts.length ? contexts[0] : await browser.newContext();
  const pages = context.pages();
  const page = pages.length ? pages[0] : await context.newPage();
  await page.waitForLoadState('load');
  const element = await page.$('body');
  if (element) {
    const text = await page.evaluate(el => el.innerText.slice(0, 100), element);
    console.log('Body snippet:', text);
  }
  await browser.close();
})();

