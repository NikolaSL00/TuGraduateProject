const puppeteer = require("puppeteer");

const { Cluster } = require("puppeteer-cluster");
const { parentPort } = require("worker_threads");

const scrape = async (url, page, products) => {
  await page.goto(url);
  let nextPageUrl = url;
  const pattern = /^([\p{L}\s]+) (\d+([,.]\d+)?[А-Яа-я]+)/u;

  while (nextPageUrl) {
    const elements = await page.$$("div.wc-loop-product-wrapper");

    for (const element of elements) {
      const title = await element.$("h2.wc-loop-product-title");
      let titleValue = await title.evaluate((el) => el.textContent);
      const match = titleValue.match(pattern);
      let unitValue = "";
      if (match) {
        titleValue = match[1];
        unitValue = match[2];
      }

      const productUrl = await title.$eval("a", (el) => el.href);

      const description = await element.$("div.loop-product-categories");
      let descriptionValue = await description.evaluate((el) => el.textContent);
      descriptionValue = descriptionValue.replace(/[\n\t]/g, "");

      //sled purvite 4 elementa src-to go vrashta v base64, urla e zapisan v data-src
      let imageUrl = await element.$eval("img", (img) => img.dataset.src);
      if (!imageUrl) {
        imageUrl = await element.$eval("img", (img) => img.src);
      } else {
        imageUrl = "https:" + imageUrl;
      }

      const priceSpan = await element.$("span.price");
      const newPrice = await priceSpan.$("ins");
      let priceValue = 0.0;
      if (newPrice) {
        priceValue = await newPrice.evaluate((el) => el.textContent);
      } else {
        priceValue = await priceSpan.evaluate((el) => el.textContent);
      }

      products.push({
        title: titleValue,
        description: descriptionValue,
        imageUrl: imageUrl,
        price: priceValue,
        unit: unitValue,
        productUrl: productUrl,
      });
      //   console.log({
      //     title: titleValue,
      //     description: descriptionValue,
      //     imageUrl: imageUrl,
      //     price: priceValue,
      //     unit: unitValue,
      //     productUrl: productUrl,
      //   });
    }
    const nextPage = await page.$("a.next.page-numbers");
    if (nextPage) {
      nextPageUrl = await nextPage.evaluate((el) => el.href);
      //nextPageUrl = await page.$eval("a.next.page-numbers", (a) => a.href);
      await page.goto(nextPageUrl);
    } else {
      nextPageUrl = "";
    }
  }
};

(async () => {
  let products = [];
  //   try {
  const browser = await puppeteer.launch({
    headless: true, // Run the browser with a visible UI
    // slowMo: 100, // Slow down Puppeteer operations by 100ms
    // args: ["--start-maximized"], // Start the browser maximized
  });
  const page = await browser.newPage();
  await page.goto(
    "https://zasiti.bg/category/%d0%b0%d0%bb%d0%ba%d0%be%d1%85%d0%be%d0%bb%d0%bd%d0%b8-%d0%bd%d0%b0%d0%bf%d0%b8%d1%82%d0%ba%d0%b8/"
  );
  const urlsToScrape = [];
  const categories = await page.$$("div.cat_data");
  for (const cat of categories) {
    const url = await cat.$("a");
    const urlValue = await url.evaluate((el) => el.href);
    urlsToScrape.push(urlValue);
  }
  urlsToScrape.splice(1, 3);

  for (let i = 0; i < urlsToScrape.length; i++) {
    await scrape(urlsToScrape[i], page, products);
  }

  //   const url =
  //     "https://zasiti.bg/category/%d0%b0%d0%bb%d0%ba%d0%be%d1%85%d0%be%d0%bb%d0%bd%d0%b8-%d0%bd%d0%b0%d0%bf%d0%b8%d1%82%d0%ba%d0%b8/";

  // await scrape(url, page, products);
  // const cluster = await Cluster.launch({
  //   concurrency: Cluster.CONCURRENCY_CONTEXT,
  //   maxConcurrency: 5,
  // });

  // await cluster.task(async ({ page, data: url }) => {
  //   products = await scrape(url, page, products);
  // });

  // for (const url of urlsToScrape) {
  //   cluster.queue(url);
  // }

  // await cluster.idle();
  // await cluster.close();

  // await browser.close();

  //parentPort.postMessage({ result: products });
  // } catch (err) {
  //   parentPort.postMessage({ error: err });
  // }
  console.log(`Scraped ${products.length} products`);
})();
