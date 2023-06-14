const puppeteer = require("puppeteer");

const { parentPort } = require("worker_threads");

(async () => {
  const browser = await puppeteer.launch({
    headless: "new",
    protocolTimeout: 4_000_000, // 50 min
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
      if (loc.includes("Шумен")) {
        await location.click();
      }
    }
    console.log("Shumen selected");
    await new Promise((resolve) => setTimeout(resolve, 3000));

    let lastHeight = await page.evaluate("document.body.scrollHeight");
    while (true) {
      await page.evaluate("window.scrollTo(0, document.body.scrollHeight)");
      await page.waitForFunction(`document.body.scrollHeight > ${lastHeight}`);
      await new Promise((resolve) => setTimeout(resolve, 1000));

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
        description: "",
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
          city: "Shumen",
          isPhysical: true,
          coordinates: [
            {
              latitude: 43.269868321735665,
              longitude: 26.935813128031132,
            },
            {
              latitude: 43.2750018009251,
              longitude: 26.93164180339388,
            },
            {
              latitude: 43.2724359231767,
              longitude: 26.935675829504035,
            },
            {
              latitude: 43.2695397363026,
              longitude: 26.94271396178772,
            },
            {
              latitude: 43.27764859926871,
              longitude: 26.92126482678486,
            },
            {
              latitude: 43.276298946740674,
              longitude: 26.954987749784195,
            },
            {
              latitude: 43.27690008259027,
              longitude: 26.958701282462425,
            },
            {
              latitude: 43.27965708811592,
              longitude: 26.91057540560333,
            },
          ],
        },
      ],
    });
  } catch (err) {
    parentPort.postMessage({ error: err });
    console.log(err);
  } finally {
    await browser.close();
    process.exit(0);
  }
})();
