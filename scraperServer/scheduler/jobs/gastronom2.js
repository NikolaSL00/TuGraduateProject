const puppeteer = require("puppeteer");

const { Cluster } = require("puppeteer-cluster");
const { parentPort } = require("worker_threads");

(async () => {
  let products = [];
  //   try {
  const browser = await puppeteer.launch({
    headless: false, // Run the browser with a visible UI
    slowMo: 100, // Slow down Puppeteer operations by 100ms
    args: ["--start-maximized"], // Start the browser maximized
  });
  const page = await browser.newPage();
  //   const urlToScrape = "https://gastronom.bg/products?query=&order-by=default";

  //   await scrape(urlToScrape, page, products);
  const urlsToScrape = [
    "https://gastronom.bg/categories/domashni-liubimtsi",
    // "https://gastronom.bg/categories/gotova-kuhnq",
    // "https://gastronom.bg/categories/hranitelni-dobavki",
    // "https://gastronom.bg/categories/knizharnitsa",
  ];
  //   const categoriesDiv = await page.$("div.link-box.d-none.d-xl-block");
  //   const categoriesLi = await categoriesDiv.$$("li");
  //   for (const cat of categoriesLi) {
  //     const url = await cat.$("a");
  //     const urlValue = await url.evaluate((el) => el.href);
  //     urlsToScrape.push(urlValue);
  //   }

  await page.goto("https://gastronom.bg/");

  const cluster = await Cluster.launch({
    concurrency: Cluster.CONCURRENCY_CONTEXT,
    maxConcurrency: 1,
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

  console.log(`Scraped ${products.length} products`);
})();

scrape = async (url, page, products) => {
  const elements = await page.$$("div.item.product-card");
  //   await page.goto(url);
  //   let nextPageUrl = url;

  //   //while (nextPageUrl) {
  //   const elements = await page.$$("div.item.product-card");
  //   for (const element of elements) {
  //     const titleValue = await element.$eval("h3.title", (el) => el.textContent);

  //     const productUrl = await element.$eval(
  //       "a.product-page-link",
  //       (el) => el.href
  //     );

  //     const descriptionValue = "";

  //     let priceValue = await element.$eval("span.prize", (el) => el.textContent);
  //     priceValue = priceValue.replace(/\s+/g, "");

  //     const imageUrl = await element.$eval("img", (img) => img.src);

  //     const unitDiv = await element.$("div.tag.bg-gray.weight");
  //     let unitValue = await unitDiv.$eval("span", (el) => el.textContent);
  //     unitValue = unitValue.replace(/\s+/g, "");

  //     products.push({
  //       title: titleValue,
  //       description: descriptionValue,
  //       imageUrl: imageUrl,
  //       price: priceValue,
  //       unit: unitValue,
  //       productUrl: productUrl,
  // });
  //   console.log({
  //     title: titleValue,
  //     description: descriptionValue,
  //     imageUrl: imageUrl,
  //     price: priceValue,
  //     unit: unitValue,
  //     productUrl: productUrl,
  //   });
  //   }
  // const nextPageLi = await page.$("li.next.disabled");

  // if (nextPageLi) {
  //   const nextPage = await nextPageLi.$("a");
  //   nextPageUrl = await nextPage.evaluate((el) => el.href);

  //   //nextPageUrl = await page.$eval("a.next.page-numbers", (a) => a.href);
  //   await page.goto(nextPageUrl);
  // } else {
  //   nextPageUrl = "";
  // }
  //}
  console.log(elements.length);
};
