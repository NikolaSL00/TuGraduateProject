const puppeteer = require("puppeteer");

const { parentPort } = require("worker_threads");

const scrape = async (url, page, products) => {
  await page.goto(url);
  let nextPageUrl = url;
  
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
  
        const descriptionValue = " ";
  
        let priceValue;
        try{
          priceValue = await element.$eval(
            "span.prize",
            (el) => el.textContent
          );
        } catch(err) {
          console.log(err);
          console.log('error is not a problem');
          continue;
        }

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
  }
};

(async () => {
  const products = [];

  const browser = await puppeteer.launch({
    headless: 'new', // Run the browser with a visible UI
  });

  try {
    const page = await browser.newPage();
    const urlToScrape = "https://gastronom.bg/products?query=&order-by=date&sorted-by=desc&limit=100";
    await scrape(urlToScrape, page, products);

    parentPort.postMessage({
      result: products,
      locations: [
        {
          country: "Bulgaria",
          city: "Plovdiv",
          isPhysical: false,
        },
        {
          country: "Bulgaria",
          city:"Sofia",
          isPhysical: false,
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
