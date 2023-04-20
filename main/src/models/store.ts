import mongoose from 'mongoose';
import { LocationDoc } from './location';
import { ProductDoc } from './product';
interface StoreAttrs {
    name: string,
    locations: LocationDoc[],
    scrapings: ProductDoc[]
}

export interface StoreDoc extends mongoose.Document {
    name: string,
    locations: LocationDoc[],
    scrapings: ProductDoc[]
}

interface StoreModel extends mongoose.Model<StoreDoc> {
    build(attrs: StoreAttrs): StoreDoc;
}

const storeSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        locations: [{
            type: mongoose.Types.ObjectId,
            ref: 'Location',
            required: true
        }],
        products: [{
            type: mongoose.Types.ObjectId,
            ref: 'Products',
            required: true
        }]
    }

);



const Store = mongoose.model<StoreDoc, StoreModel>('Store', storeSchema);

export { Store };
