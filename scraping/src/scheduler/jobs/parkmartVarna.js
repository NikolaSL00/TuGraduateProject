const puppeteer = require("puppeteer");
const fs = require('fs');

const scrape = async (url, page, products, imageUrls) => {
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

      imageUrls.push({imageUrl, label:titleValue});
      console.log(imageUrls[imageUrls.length - 1]);
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
  const imageUrls = [];
    try {
  const browser = await puppeteer.launch({
    headless: 'new',
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
    await scrape(urlsToScrape[i], page, products, imageUrls);
  }
  

  parentPort.postMessage({
      result: products,
      locations: [
        {
          country: "Bulgaria",
          city: "Varna",
          isPhysical: true,
          coordinates: [
            {
              latitude: 43.20965466626836,
              longitude: 27.92086208060846
            },
            {
              latitude: 43.22231778771453, 
              longitude: 27.95463668747816
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
