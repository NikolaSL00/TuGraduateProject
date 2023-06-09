const puppeteer = require('puppeteer');
const { parentPort } = require('worker_threads');

const mainUrls = [
  "https://www.ebag.bg/categories/khliab/494",
  "https://www.ebag.bg/categories/plodove-i-zelenchutsi/3",
  "https://www.ebag.bg/categories/meso/490",
  "https://www.ebag.bg/categories/presni-khrani/2",
  "https://www.ebag.bg/categories/kolbasi/419",
  "https://www.ebag.bg/categories/bio/1880",
  "https://www.ebag.bg/categories/bio-khrani/6",
  "https://www.ebag.bg/categories/zamrazeni-produkti/1095",
  "https://www.ebag.bg/categories/paketirani-khrani/5",
  "https://www.ebag.bg/categories/napitki/7",
  "https://www.ebag.bg/categories/za-bebeto-i-deteto/27",
  "https://www.ebag.bg/categories/kozmetika/28",
  "https://www.ebag.bg/categories/za-doma/26",
  "https://www.ebag.bg/categories/domashni-liubimtsi/29",
];

const scrape = async (url, page, products) => {
  await page.goto(url);

  let lastHeight = await page.evaluate('document.body.scrollHeight');
        while (true) {
          await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
          await new Promise((resolve) => setTimeout(resolve, 3000)); 
  
          let newHeight = await page.evaluate('document.body.scrollHeight');
          if (newHeight === lastHeight) {
              break;
          }
          lastHeight = newHeight;
          console.log(`scrolled to ${lastHeight} page height`);
      }

  const elements = await page.$$('article.item');

  for (const element of elements) {
    const title = await element.$('h2');
    const titleValue = await title.evaluate((el) => el.textContent);

    const productUrl = await title.$eval('a', (el) => el.href);
    const description = await element.$('p.product-expiry-date');
    let descriptionValue = ' ';
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

    console.log(titleValue);

    products.push({
      title: titleValue,
      description: descriptionValue,
      imageUrl,
      price: priceValue,
      unit: unitValue,
      productUrl
    });
  }
};

(async () => {
  
  const products = [];

  const browser = await puppeteer.launch({
    headless: 'new', 
    protocolTimeout: 4_000_000, // > 1 hr
  });

  try {
    const page = await browser.newPage();

    let urlsSecondary = [];
    for (let i = 0; i < mainUrls.length; i++) {
      await page.goto(mainUrls[i]);
      const elements = await page.$$("li.categories-list__item");
      let urls = [];
      for (const element of elements) {
        const a = await element.$("a");
        const aHref = await a.evaluate((el) => el.href);
        urls.push(aHref);
      }
  
      for (let j = 0; j < urls.length; j++) {
        await page.goto(urls[j]);
        const elements = await page.$$("li.categories-list__item");
        for (const element of elements) {
          const a = await element.$("a");
          let aHref = await a.evaluate((el) => el.href);
          if (!urls.includes(aHref)) {
            urlsSecondary.push(aHref);
            console.log(aHref);
          }
        }
      }
    }
 
    console.log(`All urls to scrape ${urlsSecondary.length}`);
    for (const url of urlsSecondary) {
      console.log(url);
      await scrape(url, page, products);
      console.log(products.length);
    }

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
        {
          country: "Bulgaria",
          city:"Pernik",
          isPhysical: false,
        },
        {
          country: "Bulgaria",
          city:"Dupnica",
          isPhysical: false,
        },
        {
          country: "Bulgaria",
          city:"Blagoevgrad",
          isPhysical: false,
        },
        {
          country: "Bulgaria",
          city:"Bansko",
          isPhysical: false,
        },
        {
          country: "Bulgaria",
          city:"Pazardzhik",
          isPhysical: false,
        },
        {
          country: "Bulgaria",
          city:"Asenovgrad",
          isPhysical: false,
        }
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
