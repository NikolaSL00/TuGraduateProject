const puppeteer = require("puppeteer");

const { parentPort } = require("worker_threads");

const scrape = async (url, page, products) => {
  await page.goto(url);
  let nextPageUrl = url;

  while (nextPageUrl) {
    const elements = await page.$$("div.col-md-3.col-sm-6.col-xs-6");

    for (const element of elements) {
        const imageImg = await element.$("img.wp-post-image");
        const imageUrl = await imageImg.evaluate((img) => img.src);
        
        const productLinkAnchor = await element.$("h3.product-title > a");
        const productUrl = await productLinkAnchor.evaluate(a => a.href);
        const titleValue = await productLinkAnchor.evaluate(a => a.textContent);

        let unit = " ";
        let descriptionValue = " ";

        let priceSpan = await element.$("span.price > span.amount");
        let priceValue;
        if(priceSpan){
            priceValue = await priceSpan.evaluate(span => span.textContent);
        } else {
            priceSpan = await element.$("span.woocommerce-Price-amount.amount");
            if(!priceSpan){
                continue;
            }
            priceValue = await priceSpan.evaluate(span => span.textContent);
        }
        priceValue = priceValue.split('&')[0];

        console.log(titleValue);
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

    const nextPage = await page.$("a.next.page-numbers");
    if (nextPage) {
      nextPageUrl = await nextPage.evaluate((el) => el.href);
      console.log(nextPageUrl);
      await page.goto(nextPageUrl);
    } else {
        break;
    }
  }
};

(async () => {
  let products = [];

  const browser = await puppeteer.launch({
    headless: 'new',
  });
  
  try {
    const url = 'https://minamart.eu/';
    const page = await browser.newPage();
    await page.goto(url);

    const urlsToScrape = new Set();
    const categoriesAnchors = await page.$$("li.cat-item.cat-parent > a");
    for (let anchor of categoriesAnchors){
        let url = await anchor.evaluate((a) => a.href);
        urlsToScrape.add(url);
    }

    for (let url of urlsToScrape){
        console.log(url);
        await scrape(url, page, products);
    }

    
    parentPort.postMessage({
      result: products,
      locations: [
        {
          country: "Bulgaria",
          city: "Varna",
          isPhysical: false,
        },
      ],
    });
    
  } catch (err) {
    console.log(err);
    parentPort.postMessage({ error: err });
  }
  finally {
    await browser.close();
    process.exit(0);
}
})();
