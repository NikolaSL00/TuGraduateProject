const puppeteer = require("puppeteer");
const fs = require('fs');

const { parentPort } = require("worker_threads");

const scrape = async (url, page, products, imageUrls) => {
  await page.goto(url);
  let nextPageUrl = url;
  const pattern = /^([\p{L}\s]+) (\d+([,.]\d+)?[А-Яа-я]+)/u;

  while (nextPageUrl) {
    const elements = await page.$$("div.wc-loop-product-wrapper");

    for (const element of elements) {
      const title = await element.$("h2.wc-loop-product-title");
      const titleValue = await title.evaluate((el) => el.textContent);
      const match = titleValue.match(pattern);
      let unitValue = "";
      if (match) {
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

      imageUrls.push({imageUrl: imageUrl, label: titleValue});
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
  let products = [];
  const imageUrls = [];
  try {
    const browser = await puppeteer.launch({
      headless: 'new', // Run the browser with a visible UI
    });

    const page = await browser.newPage();
    const url = 'https://zasiti.bg/?s=&action=wowmall_ajax_search&post_type=product'

    await scrape(url, page, products, imageUrls);

    console.log(imageUrls.length);
    fs.writeFile('../data/zasitiData.json', JSON.stringify(imageUrls), (err) => {
            if(err){
                console.log(err);
            }
        });

    // parentPort.postMessage({
    //   result: products,
    //   locations: [
    //     {
    //       country: "Bulgaria",
    //       city: "Varna",
    //       isPhysical: false,
    //     },
    //   ],
    // });
    // process.exit(0);
  } catch (err) {
    console.log(err);
    // parentPort.postMessage({ error: err });
    // process.exit(0);
  }
})();
