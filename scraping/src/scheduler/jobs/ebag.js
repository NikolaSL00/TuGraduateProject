const puppeteer = require('puppeteer');
const urlsToScrape = require('./urls.js');
const { Cluster } = require('puppeteer-cluster');
const { parentPort } = require('worker_threads');

const scrape = async (url, page, products) => {
  await page.goto(url);

  await page.evaluate(async () => {
    let scrollHeight = 0;

    while (document.documentElement.scrollHeight > scrollHeight) {
      scrollHeight = document.documentElement.scrollHeight;
      window.scrollBy(0, scrollHeight);

      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  });

  const elements = await page.$$('article.item');

  for (const element of elements) {
    const title = await element.$('h2');
    const titleValue = await title.evaluate((el) => el.textContent);

    const productUrl = await title.$eval('a', (el) => el.href);
    const description = await element.$('p.product-expiry-date');
    let descriptionValue = '';
    if (description) {
      descriptionValue = await description.evaluate((el) => el.textContent);
    }

    const images = await element.$$eval('img', (imgs) => {
      return imgs.map((x) => x.src);
    });

    const imageUrl = images[0];
    const newPrice = await element.$('p.new-price');
    let priceValue = 0.0;
    if (newPrice) {
      priceValue = await newPrice.evaluate((el) => el.textContent);
    } else {
      const price = await element.$('p.product-price');
      priceValue = await price.evaluate((el) => el.textContent);
    }

    const unit = await element.$('.price-per-kg');
    let unitValue = '';
    if (unit) {
      unitValue = await unit.evaluate((el) => el.textContent);
    }

    products.push({
      title: titleValue,
      description: descriptionValue,
      imageUrl: imageUrl,
      price: priceValue,
      unit: unitValue,
      productUrl: productUrl,
    });
  }

  console.log(url + ' ready');
};

(async () => {
  try {
    const browser = await puppeteer.launch({
      executablePath: '/usr/bin/chromium-browser',
      // headless: true, // Run the browser with a visible UI
      // slowMo: 100, // Slow down Puppeteer operations by 100ms
      //    args: ["--no-sandbox"], // Start the browser maximized
    });
    const page = await browser.newPage();

    let products = [];

    const cluster = await Cluster.launch({
      concurrency: Cluster.CONCURRENCY_CONTEXT,
      maxConcurrency: 5,
    });

    await cluster.task(async ({ page, data: url }) => {
      await scrape(url, page, products);
    });

    for (const url of urlsToScrape) {
      cluster.queue(url);
    }

    await cluster.idle();
    await cluster.close();

    await browser.close();

    parentPort.postMessage({ result: products });
  } catch (err) {
    parentPort.postMessage({ error: err });
  }
  // console.log(products.length);
})();
//overlay-inactive-product-text - клас, ако продуктът не е наличен
