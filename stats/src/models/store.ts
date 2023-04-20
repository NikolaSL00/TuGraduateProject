import mongoose from 'mongoose';
import { LocationDoc } from './location';
import { ScrapingDoc } from './scraping';

interface StoreAttrs {
    name: string,
    locations: LocationDoc[],
    scrapings: ScrapingDoc[]
}

export interface StoreDoc extends mongoose.Document {
    name: string,
    locations: LocationDoc[],
    scrapings: ScrapingDoc[]
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
        scrapings: [{
            type: mongoose.Types.ObjectId,
            ref: 'Scraping',
            required: true
        }]
    }

);



const Store = mongoose.model<StoreDoc, StoreModel>('Store', storeSchema);

export { Store };
