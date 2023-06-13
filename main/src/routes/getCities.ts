import express from "express";
import { Store } from "../models/store";
import { BadRequestError } from "@shopsmart/common";
import { Location } from "../models/location";
const router = express.Router();

router.get("/api/main/getCities", async (req, res) => {
  const locations = await Location.find({}).select({ city: 1, _id: 0 });

  const uniqueCities = locations.reduce(
    (acc, location) => acc.add(location.city),
    new Set()
  );

  res.status(200).send([...uniqueCities]);
});

export { router as getCitiesRouter };
