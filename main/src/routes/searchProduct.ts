import express from "express";
import { Product } from "../models/product";
import { Store } from "../models/store";
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

  const filteredProductsByCityAndName = await Store.aggregate([
    {
      $lookup: {
        from: 'locations',
        localField: 'locations',
        foreignField: '_id',
        as: 'populatedLocations'
      }
    },
    {
      $match: {
        'populatedLocations.city': userLocationCity
      }
    },
    {
      $lookup: {
        from: 'products',
        localField: 'products',
        foreignField: '_id',
        as: 'matchedProducts'
      }
    },
    {
      $unwind: '$matchedProducts'
    },
    {
      $match: {
        'matchedProducts.title': {
          $regex: regex
        }
      }
    },
    {
      $lookup: {
        from: 'stores',
        localField: 'matchedProducts.store',
        foreignField: '_id',
        as: 'populatedStore'
      }
    },
    {
      $unwind: '$populatedStore'
    },
    {
      $replaceRoot: {
        newRoot: {
          $mergeObjects: ['$matchedProducts', { store: '$populatedStore' }]
        }
      }
    },
    {
      $sort: {
        price: 1
      }
    }
  ]);
  
  const onlyProducts = filteredProductsByCityAndName.map((product) => {
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

  res.status(200).send(onlyProducts);
});

export { router as searchProductRouter };
