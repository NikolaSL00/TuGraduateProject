const puppeteer = require("puppeteer");

const { parentPort } = require("worker_threads");

(async () => {
  const browser = await puppeteer.launch({
    headless: "new",
    protocolTimeout: 4_000_000,
  });

  try {
    const page = await browser.newPage();

    await page.goto("https://bulmag.org/category/all");

    await new Promise((resolve) => setTimeout(resolve, 3000));

    console.log("Bulmag page loaded");

    const buttonOpenMenu = await page.$("button.btn-none.dropdown-toggle");
    await buttonOpenMenu.click();

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const dropdownLocation = await page.$("ul.dropdown-menu.dropdown-menu-end");
    const locations = await dropdownLocation.$$("a");

    for (let location of locations) {
      const loc = await location.evaluate((a) => a.textContent);
      if (loc.includes("Търговище")) {
        await location.click();
      }
    }
    console.log("Tyrgovishte selected");

    await new Promise((resolve) => setTimeout(resolve, 3000));

    let lastHeight = await page.evaluate("document.body.scrollHeight");
    while (true) {
      await page.evaluate("window.scrollTo(0, document.body.scrollHeight)");
      await new Promise((resolve) => setTimeout(resolve, 3500));

      let newHeight = await page.evaluate("document.body.scrollHeight");
      if (newHeight === lastHeight) {
        break;
      }
      lastHeight = newHeight;
      console.log(`scrolled to ${lastHeight} page height`);
    }

    const elements = await page.$$(
      "div.h-100.d-flex.flex-column.text-center.position-relative"
    );

    const products = [];
    for (const element of elements) {
      const urlImageContainer = await element.$("div.image-container");

      const urlElement = await urlImageContainer.$("a");
      const url = await urlElement.evaluate((a) => a.href);

      const imageElement = await urlImageContainer.$("img");
      const imageSrc = await imageElement.evaluate((img) => img.src);

      const titleUnitPriceContainer = await element.$(
        "div.d-flex.content-container"
      );
      const titleElement = await titleUnitPriceContainer.$("h5");
      const title = await titleElement.evaluate((h5) => h5.textContent);

      let priceUnitContainer = await titleUnitPriceContainer.$(
        "div.product-promo-price"
      );
      let price;
      let unit;
      if (!priceUnitContainer) {
        priceUnitContainer = await titleUnitPriceContainer.$(
          "div.product-price"
        );

        const priceUnitElements = await priceUnitContainer.$$("span");
        price = await priceUnitElements[0].evaluate((span) => span.textContent);

        const unitText = await priceUnitElements[1].evaluate(
          (span) => span.textContent
        );
        unit = unitText.split("./")[1];
      } else {
        const priceUnitElements = await priceUnitContainer.$$("span");

        const priceUnit = await priceUnitElements[0].evaluate(
          (span) => span.textContent
        );
        price = priceUnit.split(" ")[0];
        unit = priceUnit.split("/")[1];
      }

      products.push({
        title,
        description: " ",
        imageUrl: imageSrc,
        price,
        unit,
        productUrl: url,
      });
    }

    parentPort.postMessage({
      result: products,
      locations: [
        {
          country: "Bulgaria",
          city: "Tyrgovishte",
          isPhysical: true,
          coordinates: [
            {
              latitude: 43.24460680089036,
              longitude: 26.57756828530888,
            },
            {
              latitude: 43.24198046147365,
              longitude: 26.557861451774883,
            },
            {
              latitude: 43.253361232074404,
              longitude: 26.570574042458937,
            },
            {
              latitude: 43.24235792727597,
              longitude: 26.56851410601272,
            },
          ],
        },
      ],
    });
  } catch (err) {
    parentPort.postMessage({ error: err });
  } finally {
    await browser.close();
    process.exit(0);
  }
})();
