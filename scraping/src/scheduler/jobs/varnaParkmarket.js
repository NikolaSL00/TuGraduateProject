const puppeteer = require("puppeteer");

const { Cluster } = require("puppeteer-cluster");
const { parentPort } = require("worker_threads");
const { Buffer } = require("buffer");
(async () => {
  let products = [];
  //   try {
  const browser = await puppeteer.launch({
    headless: true,
    // slowMo: 100,
    // args: ["--start-maximized"],
  });
  const page = await browser.newPage();

  await page.goto("https://varna.parkmart.bg/");
  const urlsToScrape = [];
  const categories = await page.$$("div.category-item");
  for (const cat of categories) {
    const url = await cat.$("a");
    const urlValue = await url.evaluate((el) => el.href);
    urlsToScrape.push(urlValue);
  }

  for (let i = 0; i < urlsToScrape.length; i++) {
    await scrape(urlsToScrape[i], page, products);
  }

  await browser.close();

  //parentPort.postMessage({ result: products });
  // } catch (err) {
  //   parentPort.postMessage({ error: err });
  // }
  // console.log(`Scraped ${products.length} products`);
})();

scrape = async (url, page, products) => {
  await page.goto(url);
  let nextPageUrl = url;

  while (nextPageUrl) {
    const elements = await page.$$("div.product");

    for (const element of elements) {
      const title = await element.$("h3");
      const titleValue = await title.$eval("a", (el) => el.textContent);

      const productUrl = await title.$eval("a", (el) => el.href);

      const descriptionValue = "";
      let priceValue = await element.$eval(
        "div.final-price",
        (el) => el.textContent
      );
      const unitValue = priceValue.slice(9, 15);
      priceValue = priceValue.slice(0, 9);

      const img = await element.$("img.attachment-thumb");

      const imageUrl = await img.evaluate((el) =>
        el.getAttribute("data-lazy-src")
      );

      products.push({
        title: titleValue,
        description: descriptionValue,
        imageUrl: imageUrl,
        price: priceValue,
        unit: unitValue,
        productUrl: productUrl,
      });
      console.log({
        title: titleValue,
        description: descriptionValue,
        imageUrl: imageUrl,
        price: priceValue,
        unit: unitValue,
        productUrl: productUrl,
      });
    }

    const nextPage = await page.$("a.next.page-numbers");
    if (nextPage) {
      nextPageUrl = await nextPage.evaluate((el) => el.href);

      await page.goto(nextPageUrl);
    } else {
      nextPageUrl = "";
    }
  }
};
