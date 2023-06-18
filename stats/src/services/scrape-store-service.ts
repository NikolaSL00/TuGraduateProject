import { ScrapingStoreCompletedEvent } from "@shopsmart/common";
import { Store } from "../models/store";
import { Product } from "../models/product";
import { Location } from "../models/location";
import { Scraping } from "../models/scraping";

export const processData = async (
  data: ScrapingStoreCompletedEvent["data"]
) => {
  const { name, locations, products } = data;

  let store: any = await Store.findOne({ name })
    .populate("scrapings")
    .populate("locations");

  if (!store) {
    console.log("creating brand new store");
    store = Store.build({
      name,
      locations: [],
      scrapings: [],
    });
    await store.save();
  } else {
    console.log("updating store");

    for (let location of store.locations) {
      await Location.deleteOne({ _id: location._id });
    }
    store.locations = [];

    await store.save();
  }

  await Promise.all(
    locations.map(async (locationData) => {
      const location = Location.build({ ...locationData });
      await location.save();
      store.locations.push(location);
    })
  );

  const scraping = Scraping.build({
    date: new Date(),
    products: [],
  });

  await scraping.save();

  await Promise.all(
    products.map(async (productData) => {
      productData.price = productData.price.replace(",", ".");
      const product = Product.build({
        ...productData,
        price: parseFloat(productData.price),
        store,
      });
      await product.save();
      scraping.products.push(product);
    })
  );
  await scraping.save();

  await scraping.save();
  store.scrapings.push(scraping);
  await store.save();
  return store;
};
