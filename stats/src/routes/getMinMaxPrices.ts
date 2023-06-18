import express from "express";
import { Store } from "../models/store";
import { BadRequestError } from "@shopsmart/common";
import { Scraping } from "../models/scraping";
import { Product } from "../models/product";
const router = express.Router();

router.post("/api/stats/getMinMaxPrices", async (req, res) => {
  // const scrapings = await Store.find().select({ scrapings: 1, _id: 0 });
  // const stores = await Store.find().populate("locations").populate("scrapings");
  const { userLocationCity, searchDate } = req.body;
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
        "populatedLocations.city": userLocationCity,
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

  const givenDate = new Date(searchDate); // Convert given date to JavaScript Date object

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
        scrapingDateWithoutTime.getTime() === givenDateWithoutTime.getTime()
      );
    }),
  }));

  console.log(filteredScrapingsByDate.length);
  const scrapingProducts = filteredScrapingsByDate.map((obj) => ({
    storeName: obj.storeName,
    products: obj.scrapings[0].products,
  }));

  // const averagePrices = scrapingProducts.map((obj) => {
  //   const { storeName, products } = obj;
  //   const sum = products.reduce(
  //     (acc: any, product: any) => acc + product.price,
  //     0
  //   );
  //   const average = sum / products.length;
  //   return { storeName, average };
  // });
  const priceRanges = scrapingProducts.map((obj) => {
    const { storeName, products } = obj;
    const prices = products.map((product: any) => product.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    return { storeName, minPrice, maxPrice };
  });

  res.status(200).send(priceRanges);
});

export { router as getStoreAveragePricesRouter };
