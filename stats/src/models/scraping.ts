import mongoose from 'mongoose';
import { Product, ProductDoc } from './product';
interface ScrapingAttrs {
  date: Date;
  products: ProductDoc[];
}

export interface ScrapingDoc extends mongoose.Document {
  date: Date;
  products: ProductDoc[];
}

interface ScrapingModel extends mongoose.Model<ScrapingDoc> {
  build(attrs: ScrapingAttrs): ScrapingDoc;
}

const scrapingSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  products: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
  ],
});

scrapingSchema.statics.build = (attrs: ScrapingAttrs) => {
  return new Scraping(attrs);
};

const Scraping = mongoose.model<ScrapingDoc, ScrapingModel>(
  'Scraping',
  scrapingSchema
);

export { Scraping };
