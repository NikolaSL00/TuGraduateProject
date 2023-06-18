import { ScrapingStoreCompletedEvent } from "@shopsmart/common";
import { Store } from "../models/store";
import { Product, ProductDoc } from "../models/product";
import { Location } from "../models/location";

export const processData = async (
  data: ScrapingStoreCompletedEvent["data"]
) => {
  const { name, locations, products } = data;

  let store: any = await Store.findOne({ name })
    .populate("products")
    .populate("locations");

  if (!store) {
    console.log("creating brand new store");
    store = Store.build({
      name,
      locations: [],
      products: [],
    });
    await store.save();
  } else {
    // if the store is present empty the products and the locations
    console.log("updating store");

    const productIds = store.products.map((product: ProductDoc) => product._id);
    console.log(productIds.length);
    console.log(productIds[0]);

    // Delete the products
    await Product.deleteMany({ _id: { $in: productIds } });
    store.products = [];

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

  console.log("creating products started");
  await Promise.all(
    products.map(async (productData, index) => {
      productData.price = productData.price.replace(",", ".");
      const product = Product.build({
        ...productData,
        price: parseFloat(productData.price),
        store,
      });
      await product.save();
      store.products.push(product);
    })
  );
  console.log("finished with the products");

  await store.save();
  return store;
};
