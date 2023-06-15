import express from "express";
import { BadRequestError } from "@shopsmart/common";
import { Location } from "../models/location";
const router = express.Router();

router.post("/api/main/getLocations", async (req, res) => {
  const { locationsIds } = req.body;
  // if (!locationsIds) {
  //   throw new BadRequestError("Невалидни данни");
  // }
  const locations = await Location.find({
    _id: { $in: locationsIds },
  })
    .populate("coordinates")
    .select({ coordinates: 1, _id: 0 });
  res.status(200).send(locations);
});

export { router as getLocationsRouter };
