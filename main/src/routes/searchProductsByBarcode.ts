import express from "express";
import { Product, ProductDoc } from "../models/product";
import { BadRequestError } from "@shopsmart/common";
const router = express.Router();

router.post("/api/main/searchProductByBarcode", async (req, res) => {
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

  let confidenceScoreCriteria = filterProductByCity[0]._doc.confidenceScore;

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

export { router as searchProductByBarcodeRouter };
