import mongoose from 'mongoose';
import { LocationDoc } from './location';
import { ProductDoc } from './product';

interface StoreAttrs {
  name: string;
  locations: LocationDoc[];
  products: ProductDoc[];
}

export interface StoreDoc extends mongoose.Document {
  name: string;
  locations: LocationDoc[];
  products: ProductDoc[];
}

interface StoreModel extends mongoose.Model<StoreDoc> {
  build(attrs: StoreAttrs): StoreDoc;
}

const storeSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  locations: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'Location',
      required: true,
    },
  ],
  products: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
  ],
});

storeSchema.statics.build = (attrs: StoreAttrs) => {
  return new Store(attrs);
};

const Store = mongoose.model<StoreDoc, StoreModel>('Store', storeSchema);

export { Store };
