import express from "express";
import { Store } from "../models/store";
import { BadRequestError } from "@shopsmart/common";
import { Scraping } from "../models/scraping";
import { Product } from "../models/product";
const router = express.Router();

router.post("/api/stats/getPricesForProducts", async (req, res) => {
  const { storeName, productId, searchDate } = req.body;
  console.log(storeName);
  const store = await Store.aggregate([
    {
      $match: {
        name: storeName,
      },
    },
    {
      $lookup: {
        from: "scrapings",
        localField: "scrapings",
        foreignField: "_id",
        as: "populatedScrapings",
      },
    },
    {
      $unwind: "$populatedScrapings",
    },
    {
      $lookup: {
        from: "products",
        localField: "populatedScrapings.products",
        foreignField: "_id",
        as: "populatedScrapings.products",
      },
    },
  ]);
  console.log(store[0].populatedScrapings.length);
  //   const store = await Store.findOne({ name: storeName });

  //   const scrapingsStoreArrays = stores.map((store) => ({
  //     storeName: store.name,
  //     scrapings: store.populatedScrapings,
  //   }));

  //   const givenDate = new Date(searchDate);

  //   const filteredScrapingsByDate = scrapingsStoreArrays.map((arr) => ({
  //     storeName: arr.storeName,
  //     scrapings: arr.scrapings.filter((scraping: any) => {
  //       const scrapingDate = new Date(scraping.date);
  //       const givenDateWithoutTime = new Date(
  //         givenDate.getFullYear(),
  //         givenDate.getMonth(),
  //         givenDate.getDate()
  //       );
  //       const scrapingDateWithoutTime = new Date(
  //         scrapingDate.getFullYear(),
  //         scrapingDate.getMonth(),
  //         scrapingDate.getDate()
  //       );
  //       return (
  //         scrapingDateWithoutTime.getTime() === givenDateWithoutTime.getTime() ||
  //         scrapingDateWithoutTime.getTime() > givenDateWithoutTime.getTime()
  //       );
  //     }),
  //   }));

  //   const scrapingProducts = filteredScrapingsByDate.map((obj) => ({
  //     storeName: obj.storeName,
  //     products: obj.scrapings[0].products,
  //   }));

  res.status(200).send(store);
});

export { router as getPricesForProductsRouter };
