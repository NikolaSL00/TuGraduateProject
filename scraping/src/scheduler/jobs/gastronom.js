const puppeteer = require("puppeteer");

const { Cluster } = require("puppeteer-cluster");
const { parentPort } = require("worker_threads");

const scrape = async (url, page, products) => {
  await page.goto(url);
  let nextPageUrl = url;
  let i = 0;
  while (nextPageUrl) {
    const elements = await page.$$("div.item.product-card");
    for (const element of elements) {
      const titleValue = await element.$eval(
        "h3.title",
        (el) => el.textContent
      );

      const productUrl = await element.$eval(
        "a.product-page-link",
        (el) => el.href
      );

      const descriptionValue = "";

      let priceValue = await element.$eval(
        "span.prize",
        (el) => el.textContent
      );
      priceValue = priceValue.replace(/\s+/g, "");

      const imageUrl = await element.$eval("img", (img) => img.src);

      const unitDiv = await element.$("div.tag.bg-gray.weight");
      let unitValue = await unitDiv.$eval("span", (el) => el.textContent);
      unitValue = unitValue.replace(/\s+/g, "");

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
    const nextPageLi = await page.$("li.next.disabled");

    if (nextPageLi) {
      const nextPage = await nextPageLi.$("a");
      nextPageUrl = await nextPage.evaluate((el) => el.href);

      //nextPageUrl = await page.$eval("a.next.page-numbers", (a) => a.href);
      await page.goto(nextPageUrl);
    } else {
      nextPageUrl = "";
    }
    console.log(i++);
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
  const urlToScrape = "https://gastronom.bg/products?query=&order-by=default";
  await scrape(urlToScrape, page, products);

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

  await browser.close();

  //parentPort.postMessage({ result: products });
  // } catch (err) {
  //   parentPort.postMessage({ error: err });
  // }
  // console.log(`Scraped ${products.length} products`);
})();
