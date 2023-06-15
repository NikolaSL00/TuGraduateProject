import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import { errorHandler, NotFoundError } from "@shopsmart/common";
import { searchProductRouter } from "./routes/searchProduct";
import { searchListRouter } from "./routes/searchList";
import { getCitiesRouter } from "./routes/getCities";
import { getLocationsRouter } from "./routes/getLocations";
const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(searchProductRouter);
app.use(searchListRouter);
app.use(getCitiesRouter);
app.use(getLocationsRouter);

app.all("*", async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
