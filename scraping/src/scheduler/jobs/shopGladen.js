const puppeteer = require("puppeteer");

const { parentPort } = require("worker_threads");

const scrape = async (url, page, products, skippedProducts) => {
  await page.goto(url);
  let nextPageUrl = url;

  while (nextPageUrl) {
    const elements = await page.$$("div._product-inner");

    for (const element of elements) {
      const imageImg = await element.$(
        "span._product-image-thumb-holder > img.lazyload-image"
      );
      const imageUrl = await imageImg.evaluate((img) =>
        img.getAttribute("data-first-src")
      );

      const title = await element.$("h3._product-name-tag > a");
      const productUrl = await title.evaluate((a) => a.href);
      const titleValue = await title.evaluate((a) => a.textContent);

      const productUnit = await element.$("div._product-unit-text > span");
      let unit = " ";
      if (productUnit) {
        unit = await productUnit.evaluate((span) => span.textContent);
      }

      const description = await element.$("div._product-description");
      let descriptionValue = " ";
      if (description) {
        descriptionValue = await description.evaluate((el) => el.textContent);
      }

      const priceSpan = await element.$(
        "div._product-price-inner > span.price"
      );
      let priceValue;
      if (priceSpan) {
        priceValue = await priceSpan.evaluate((span) => span.textContent);
      } else {
        const priceSpanDiscount = await element.$(
          "div._product-price-inner > span._product-price-compare"
        );
        priceValue = await priceSpanDiscount.evaluate(
          (span) => span.textContent
        );
      }
      priceValue = priceValue.split(" ")[0];
      priceValue = priceValue.replace(",", ".");

      console.log(`${titleValue} <--> ${parseFloat(priceValue)}`);
      console.log("Skipped products due lack of price: ", skippedProducts);
      if (isNaN(parseFloat(priceValue))) {
        skippedProducts++;
        continue;
      }

      products.push({
        title: titleValue,
        description: descriptionValue,
        imageUrl,
        price: priceValue,
        unit,
        productUrl: productUrl,
      });
      console.log(products.length);
    }

    const nextPage = await page.$("li.next > a");
    if (nextPage) {
      nextPageUrl = await nextPage.evaluate((el) => el.href);
      console.log(nextPageUrl);
      if (nextPageUrl === "javascript:void(0);") {
        console.log("FINISHED CATEGORY");
        break;
      }

      await page.goto(`${nextPageUrl}?per_page=96`);
    }
  }
  return skippedProducts;
};

(async () => {
  let products = [];

  const browser = await puppeteer.launch({
    headless: "new",
    protocolTimeout: 4_000_000,
  });

  try {
    const url = "https://shop.gladen.bg/";
    const page = await browser.newPage();
    await page.goto(url);

    const urlsToScrape = new Set();
    const categoriesAnchors = await page.$$(
      "a._navigation-main-list-item-link._figure-stack"
    );
    for (let anchor of categoriesAnchors) {
      let url = await anchor.evaluate((a) => a.href);
      urlsToScrape.add(url);
    }

    let skippedProducts = 0;
    for (let url of urlsToScrape) {
      console.log(url);
      skippedProducts = await scrape(
        `${url}?per_page=96`,
        page,
        products,
        skippedProducts
      );
      console.log("Returned number of skippedProducts", skippedProducts);
    }

    parentPort.postMessage({
      result: products,
      locations: [
        {
          country: "Bulgaria",
          city: "Sofia",
          isPhysical: false,
        },
      ],
    });
  } catch (err) {
    console.log(err);
    parentPort.postMessage({ error: err });
  } finally {
    await browser.close();
    process.exit(0);
  }
})();
