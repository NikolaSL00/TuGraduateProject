import express from "express";
import { Product } from "../models/product";
import { BadRequestError } from "@shopsmart/common";
const router = express.Router();

router.post("/api/main/searchProduct", async (req, res) => {
  const { searchTerm, userLocationCity } = req.body;

  if (!searchTerm || !userLocationCity) {
    throw new BadRequestError("Невалидни данни");
  }
  const lowerCaseSearchTerm = searchTerm.toLowerCase();

  //@ts-ignore
  const products = await Product.fuzzySearch({
    query: lowerCaseSearchTerm,
    minSize: 4,
  })
    .populate({
      path: "store",
      select: ["name", "locations"],
      populate: {
        path: "locations",
      },
    })
    .select("-title_fuzzy");

  //@ts-ignore
  const filterProductByCity = products.filter((product) => {
    const locations = product.store.locations;
    //@ts-ignore
    return locations.some((location) => location.city === userLocationCity);
  });

  let confidenceScoreCriteria = filterProductByCity[0]?._doc.confidenceScore;

  //@ts-ignore
  const filterProductByConfidenceScore = filterProductByCity.filter(
    //@ts-ignore
    (product) => product._doc.confidenceScore >= confidenceScoreCriteria * 0.85
  );

  //@ts-ignore
  filterProductByConfidenceScore.sort((a, b) => {
    if (a._doc.confidenceScore === b._doc.confidenceScore) {
      return a.price - b.price;
    } else {
      // Sort by confidenceScore
      return b._doc.confidenceScore - a._doc.confidenceScore;
    }
  });

  res.status(200).send(filterProductByConfidenceScore);
});

export { router as searchProductRouter };

// const searchTerms = searchTerm
//     .split(" ")
//     .map((term: any) => `(?=.*${term})`)
//     .join("");
//   const regex = new RegExp(searchTerms, "i");

//   const filteredProductsByCityAndName = await Store.aggregate([
//     {
//       $lookup: {
//         from: "locations",
//         localField: "locations",
//         foreignField: "_id",
//         as: "populatedLocations",
//       },
//     },
//     {
//       $match: {
//         "populatedLocations.city": userLocationCity,
//       },
//     },
//     {
//       $lookup: {
//         from: "products",
//         localField: "products",
//         foreignField: "_id",
//         as: "matchedProducts",
//       },
//     },
//     {
//       $unwind: "$matchedProducts",
//     },
//     {
//       $match: {
//         "matchedProducts.title": {
//           $regex: regex,
//         },
//       },
//     },
//     {
//       $lookup: {
//         from: "stores",
//         localField: "matchedProducts.store",
//         foreignField: "_id",
//         as: "populatedStore",
//       },
//     },
//     {
//       $unwind: "$populatedStore",
//     },
//     {
//       $replaceRoot: {
//         newRoot: {
//           $mergeObjects: ["$matchedProducts", { store: "$populatedStore" }],
//         },
//       },
//     },
//     {
//       $sort: {
//         price: 1,
//       },
//     },
//   ]);

//   const onlyProducts = filteredProductsByCityAndName.map(
//     (product: ProductDoc) => {
//       return {
//         store: {
//           name: product.store.name,
//           locations: product.store.locations,
//         },
//         title: product.title,
//         description: product.description,
//         imageUrl: product.imageUrl,
//         price: product.price,
//         unit: product.unit,
//         productUrl: product.productUrl,
//       };
//     }
//   );
