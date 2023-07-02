import express from "express";
import { Store } from "../models/store";
import { BadRequestError, requireAuth, currentUser } from "@shopsmart/common";
import { ProductDoc } from "../models/product";
const router = express.Router();

router.post(
  "/api/main/searchList",
  currentUser,
  requireAuth,
  async (req, res) => {
    const { listData, userLocationCity } = req.body;
    if (!listData || !userLocationCity) {
      throw new BadRequestError("Невалидни данни");
    }

    const stores = await Store.find({})
      .populate({
        path: "locations",
      })
      .populate({
        path: "products",
      });

    const filtersStoresByCity = stores.filter((store) => {
      const locations = store.locations;
      return locations.some((location) => location.city === userLocationCity);
    });

    let storeProducts = [];
    for (const store of filtersStoresByCity) {
      let matchArray = [];
      for (const element of listData) {
        const searchTerms = element
          .split(" ")
          .map((term: any) => `(?=.*${term})`)
          .join("");
        const regex = new RegExp(searchTerms, "i");
        const storeProducts = store.products.filter((product) =>
          regex.test(product.title)
        );
        if (storeProducts.length > 0) {
          matchArray.push(storeProducts);
        }
      }
      storeProducts.push({
        store: { name: store.name, locations: store.locations },
        products: matchArray,
      });
    }

    let lowestPricesForStores: {
      store: any;
      lowestPriceProducts: ProductDoc[];
    }[] = [];
    for (const store of storeProducts) {
      let lowest = {
        store: store.store,
        lowestPriceProducts: [] as ProductDoc[],
      };
      for (const productsArray of store.products) {
        // magazina ima produkti v masivi, koito matchvat opredelen regex
        const sortedProductsArray = productsArray.sort(
          (a, b) => a.price - b.price
        );
        const lowestPriceObject = sortedProductsArray[0]; // ot tqh se izbira nai-evtiniq
        lowest.lowestPriceProducts.push(lowestPriceObject);
      }
      lowestPricesForStores.push(lowest); // masiv s nai-evitinite produkti za edin magazin
    }

    let storesWithSumPrice = [];
    for (const store of lowestPricesForStores) {
      //sumirat se cenite na produktite za vseki magazin i se izbira nai-evtinata
      const sum = store.lowestPriceProducts
        .reduce((total, obj: any) => total + obj.price, 0)
        .toFixed(2);
      storesWithSumPrice.push({
        store: store.store,
        sum: sum,
        products: store.lowestPriceProducts,
      });
    }

    storesWithSumPrice.sort((a: any, b: any) => {
      if (a.products.length !== b.products.length) {
        return a.products.length - b.products.length;
      }
      return a.sum - b.sum;
    });

    res.status(200).send(storesWithSumPrice);
  }
);

export { router as searchListRouter };
