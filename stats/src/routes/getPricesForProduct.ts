import express from "express";
import { Store } from "../models/store";
import { BadRequestError } from "@shopsmart/common";
import { Scraping } from "../models/scraping";
import { Product } from "../models/product";
const router = express.Router();

router.post("/api/stats/getPricesForProducts", async (req, res) => {
  const { storeName, productId, searchDate } = req.body;
  console.log(storeName);
  const stores = await Store.aggregate([
    {
      $lookup: {
        from: "locations",
        localField: "locations",
        foreignField: "_id",
        as: "populatedLocations",
      },
    },
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
    {
      $group: {
        _id: "$_id",
        name: { $first: "$name" },
        populatedLocations: { $first: "$populatedLocations" },
        populatedScrapings: { $push: "$populatedScrapings" },
      },
    },
  ]);

  const scrapingsStoreArrays = stores.map((store) => ({
    storeName: store.name,
    scrapings: store.populatedScrapings,
  }));

  const givenDate = new Date(searchDate);

  const filteredScrapingsByDate = scrapingsStoreArrays.map((arr) => ({
    storeName: arr.storeName,
    scrapings: arr.scrapings.filter((scraping: any) => {
      const scrapingDate = new Date(scraping.date);
      const givenDateWithoutTime = new Date(
        givenDate.getFullYear(),
        givenDate.getMonth(),
        givenDate.getDate()
      );
      const scrapingDateWithoutTime = new Date(
        scrapingDate.getFullYear(),
        scrapingDate.getMonth(),
        scrapingDate.getDate()
      );
      return (
        scrapingDateWithoutTime.getTime() === givenDateWithoutTime.getTime() ||
        scrapingDateWithoutTime.getTime() > givenDateWithoutTime.getTime()
      );
    }),
  }))[0];

  //   const scrapingProducts = filteredScrapingsByDate.map((obj) => ({
  //     storeName: obj.storeName,
  //     products: obj.scrapings[0].products,
  //   }));
  const products = filteredScrapingsByDate.scrapings.map((scraping:any)=>scraping.products.);

  res.status(200).send(filteredScrapingsByDate);
});

export { router as getPricesForProductsRouter };
