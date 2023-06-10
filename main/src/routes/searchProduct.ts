import express from "express";
import { Product } from "../models/product";
import { BadRequestError } from "@shopsmart/common";
const router = express.Router();


router.post("/api/main/searchProduct", async (req, res) => {
  const { searchTerm, userLocationCity } = req.body;
  if (!searchTerm || !userLocationCity) {
    throw new BadRequestError('Невалидни данни');
  }
  const searchTerms = searchTerm
    .split(" ")
    .map((term: any) => `(?=.*${term})`)
    .join("");
  const regex = new RegExp(searchTerms, "i");
  const searchResults = await Product.find({ title: { $regex: regex } })
    .populate({
      path: "store",
      populate: {
        path: "locations"
      }
    });
  const filterProductsByCity = searchResults.filter((product) => {
    const locations = product.store.locations;
    return locations.some((location) => location.city === userLocationCity);
  });
  const onlyProducts = filterProductsByCity.map((product) => {
    return {
      store: {
        name: product.store.name,
        locations: product.store.locations
      },
      title: product.title,
      description: product.description,
      imageUrl: product.imageUrl,
      price: product.price,
      unit: product.unit,
      productUrl: product.productUrl,
    };
  });
  const sortedProdcutsByPrice = onlyProducts.sort((a, b) => {
    const priceA = parseFloat(String(a!.price));
    const priceB = parseFloat(String(b!.price));
    return priceA - priceB;
  });

  res.status(200).send(sortedProdcutsByPrice);
});

export { router as searchProductRouter };
