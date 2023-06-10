import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import { errorHandler, NotFoundError } from '@shopsmart/common';
import { searchProductRouter } from './routes/searchProduct';
import { searchListRouter } from './routes/searchList';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(searchProductRouter);
app.use(searchListRouter);


app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
