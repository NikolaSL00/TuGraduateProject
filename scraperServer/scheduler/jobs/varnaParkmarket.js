const puppeteer = require("puppeteer");

const { Cluster } = require("puppeteer-cluster");
const { parentPort } = require("worker_threads");

(async () => {
  let products = [];
  //   try {
  const browser = await puppeteer.launch({
    headless: true, // Run the browser with a visible UI
    // slowMo: 100, // Slow down Puppeteer operations by 100ms
    // args: ["--start-maximized"], // Start the browser maximized
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

  //   while (nextPageUrl) {
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

    let imageUrl = await element.$eval(
      "img.attachment-thumb",
      (img) => img.dataset.src
    );
    if (!imageUrl) {
      imageUrl = await element.$eval("img.attachment-thumb", (img) => img.src);
    } else {
      imageUrl = "https:" + imageUrl;
    }
    console.log(imageUrl);
    //     let unitValue = await unitDiv.$eval("span", (el) => el.textContent);
    //     unitValue = unitValue.replace(/\s+/g, "");
    //     products.push({
    //       title: titleValue,
    //       description: descriptionValue,
    //       imageUrl: imageUrl,
    //       price: priceValue,
    //       unit: unitValue,
    //       productUrl: productUrl,
    //     });
    //   console.log({
    //     title: titleValue,
    //     description: descriptionValue,
    //     imageUrl: imageUrl,
    //     price: priceValue,
    //     unit: unitValue,
    //     productUrl: productUrl,
    //   });
  }
  //     const nextPageLi = await page.$("li.next.disabled");

  //     if (nextPageLi) {
  //       const nextPage = await nextPageLi.$("a");
  //       nextPageUrl = await nextPage.evaluate((el) => el.href);

  //       //nextPageUrl = await page.$eval("a.next.page-numbers", (a) => a.href);
  //       await page.goto(nextPageUrl);
  //     } else {
  //       nextPageUrl = "";
  //     }

  //   }
};
