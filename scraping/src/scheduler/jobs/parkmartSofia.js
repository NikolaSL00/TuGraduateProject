const puppeteer = require("puppeteer");
const fs = require('fs');

const scrape = async (url, page, products) => {
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

      const img = await element.$("img");

      const imageUrl = await img.evaluate((el) =>
        el.getAttribute("src")
      );

      products.push({
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

(async () => {
  const products = [];
    try {
  const browser = await puppeteer.launch({
    headless: 'new',
  });
  const page = await browser.newPage();

  await page.goto("https://sofia.parkmart.bg/");
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

  parentPort.postMessage({
      result: products,
      locations: [
        {
          country: "Bulgaria",
          city: "Sofia",
          isPhysical: true,
          coordinates: [
            {
              latitude: 42.870305172003654, 
              longitude: 23.317033101582226,
            }
          ]
        },
      ],
    });
  }
  catch(err) {
      parentPort.postMessage({ error: err });
  }
  finally {
      await browser.close();
      process.exit(0);
  }
})();
