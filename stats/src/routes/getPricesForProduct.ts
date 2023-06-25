import express from "express";
import { Store } from "../models/store";
import { BadRequestError, requireAuth, currentUser } from "@shopsmart/common";
import { Scraping } from "../models/scraping";
import { Product } from "../models/product";
const router = express.Router();

router.post(
  "/api/stats/getPricesForProducts",
  currentUser,
  requireAuth,
  async (req, res) => {
    const { storeName, productUrl, searchDate } = req.body;
    console.log(storeName);
    const stores = await Store.aggregate([
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
        $group: {
          _id: "$_id",
          name: { $first: "$name" },
          populatedScrapings: { $push: "$populatedScrapings" },
        },
      },
    ]);

    const scrapingsStoreArrays = stores.map((store) => ({
      storeName: store.name,
      scrapings: store.populatedScrapings,
    }));

    const givenDate = new Date(searchDate);

    const filteredScrapingsByDate: any = scrapingsStoreArrays.map((arr) => ({
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
          scrapingDateWithoutTime.getTime() ===
            givenDateWithoutTime.getTime() ||
          scrapingDateWithoutTime.getTime() > givenDateWithoutTime.getTime()
        );
      }),
    }))[0];

    // const scrapingProducts = filteredScrapingsByDate.map((obj: any) => ({
    //   storeName: obj.storeName,
    //   products: obj.scrapings[0].products,
    // }));
    const scrapingProducts = await Promise.all(
      filteredScrapingsByDate.scrapings.map(async (scraping: any) => {
        const { date, products } = scraping;

        const populatedProducts = await Promise.all(
          products.map(async (productId: any) => {
            const product = await Product.findById(productId).exec();
            return product;
          })
        );

        return {
          date,
          products: populatedProducts,
        };
      })
    );

    let prices = scrapingProducts.flatMap((scraping: any) =>
      scraping.products
        .filter((product: any) => product.productUrl === productUrl)
        .map((product: any) => product.price)
    );

    let dates = filteredScrapingsByDate.scrapings.flatMap((scraping: any) => {
      const date = new Date(scraping.date).toISOString().split("T")[0];
      const [year, month, day] = date.split("-");
      return `${month}-${day}`;
    });
    dates = dates.sort((a: any, b: any) => {
      const monthA = parseInt(a.split("-")[0]);
      const monthB = parseInt(b.split("-")[0]);

      if (monthA === monthB) {
        return 0;
      } else if (monthA < monthB) {
        return -1;
      } else {
        return 1;
      }
    });

    let datetime = new Date();
    datetime.setDate(new Date().getDate() - 7);
    if (
      datetime.getDate() == givenDate.getDate() &&
      datetime.getMonth() == givenDate.getMonth()
    ) {
      console.log("week");
      dates = dates.filter((_: any, index: any) => index % 2 !== 0);
      prices = prices.filter((_: any, index: any) => index % 2 !== 0);
    }
    datetime = new Date();
    datetime.setDate(new Date().getDate() - 31);

    if (
      datetime.getDate() == givenDate.getDate() &&
      datetime.getMonth() == givenDate.getMonth()
    ) {
      console.log("month");
      dates = dates.filter((_: any, index: any) => index % 8 !== 7);
      prices = prices.filter((_: any, index: any) => index % 8 !== 7);
      console.log(dates);
    }
    datetime = new Date();
    datetime.setDate(new Date().getDate() - 182);
    console.log("given", givenDate);
    console.log("datetime", datetime);
    let datetimeForYear = new Date();
    datetimeForYear.setDate(new Date().getDate() - 365);

    if (
      (datetime.getDate() == givenDate.getDate() &&
        datetime.getMonth() == givenDate.getMonth()) ||
      (datetimeForYear.getDate() == givenDate.getDate() &&
        datetimeForYear.getMonth() == givenDate.getMonth())
    ) {
      console.log("6 months 1year");

      const uniqueMonths = Array.from(
        new Set(dates.map((date: any) => date.split("-")[0]))
      );
      console.log(uniqueMonths);

      prices = uniqueMonths.map((month) => {
        const pricesOfMonth = prices.filter((_, index) =>
          dates[index].startsWith(month)
        );
        const averagePrice = (
          pricesOfMonth.reduce((a, b) => a + b, 0) / pricesOfMonth.length
        ).toFixed(2);
        return averagePrice;
      });
      dates = uniqueMonths;
    }
    res.status(200).send({ prices, dates });
  }
);

export { router as getPricesForProductsRouter };
