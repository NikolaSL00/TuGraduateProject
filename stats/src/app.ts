import express from "express";
import "express-async-errors";
import { json } from "body-parser";

import { errorHandler, NotFoundError } from "@shopsmart/common";
import { getStoreAveragePricesRouter } from "./routes/getMinMaxPrices";
import { getPricesForProductsRouter } from "./routes/getPricesForProduct";
const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(getStoreAveragePricesRouter);
app.use(getPricesForProductsRouter);
app.all("*", async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
