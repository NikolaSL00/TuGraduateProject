import express from "express";
import { Store } from "../models/store";
import { BadRequestError, requireAuth, currentUser } from "@shopsmart/common";
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
    res.status(200).send(storeProducts);
  }
);

export { router as searchListRouter };
