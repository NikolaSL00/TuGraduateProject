import { ScrapingStoreCompletedEvent } from '@shopsmart/common';
import { Store } from '../models/store';
import { Product } from '../models/product';
import { Location } from '../models/location';

export const processData = async (
  data: ScrapingStoreCompletedEvent['data']
) => {
  const { name, locations, products } = data;

  const store = Store.build({
    name,
    locations: [],
    products: [],
  });

  console.log('store build');
  await store.save();
  console.log('store saved');

  locations.map(async (locationData) => {
    const location = Location.build({ ...locationData });
    await location.save();
    console.log(`location ${locationData}`);
    store.locations.push(location);
  });
  products.map(async (productData) => {
    const product = Product.build({
      ...productData,
      price: parseFloat(productData.price),
      store,
    });
    await product.save();
    store.products.push(product);
  });

  await store.save();
  return store;
};
