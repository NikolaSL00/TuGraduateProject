import { ScrapingStoreCompletedEvent } from '@shopsmart/common';
import { Store } from '../models/store';
import { Product } from '../models/product';
import { Location } from '../models/location';

export const processData = async (
  data: ScrapingStoreCompletedEvent['data']
) => {
  const { name, locations, products } = data;

  let store: any = await Store.findOne({ name });

  if (!store) {
    console.log('creating brand new store');
    store = Store.build({
      name,
      locations: [],
      products: [],
    });
    await store.save();
  } else {
    // if the store is present empty the products and the locations
    console.log('updating store');
    store.products = [];
    store.locations = [];
    await store.save();
  }

  locations.map(async (locationData) => {
    const location = Location.build({ ...locationData });
    await location.save();
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

// TODO: Transaction

// export const processData = async (
//   data: ScrapingStoreCompletedEvent['data']
// ) => {
//   const { name, locations, products } = data;

//   let store: any = await Store.findOne({ name });

//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     if (!store) {
//       console.log('creating brand new store');
//       store = Store.build({
//         name,
//         locations: [],
//         products: [],
//       });
//       console.log('builded');

//       await store.save({ session });
//       console.log('saved');
//     } else {
//       // if the store is present empty the products and the locations
//       console.log('updating store');
//       store.products = [];
//       store.locations = [];
//       await store.save({ session });
//     }

//     locations.map(async (locationData) => {
//       const location = Location.build({ ...locationData });
//       await location.save({ session });
//       store.locations.push(location);
//     });

//     products.map(async (productData) => {
//       const product = Product.build({
//         ...productData,
//         price: parseFloat(productData.price),
//         store,
//       });
//       await product.save({ session });
//       store.products.push(product);
//     });

//     await store.save({ session });

//     await session.commitTransaction();
//     return store;
//   } catch (err) {
//     await session.abortTransaction();
//     console.log('transacrtion aborted');
//     console.log(err);
//   } finally {
//     session.endSession();
//   }
// };
