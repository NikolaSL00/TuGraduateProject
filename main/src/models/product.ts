import mongoose from 'mongoose';
import { StoreDoc } from './store';

interface ProductAttrs {
    store: StoreDoc,
    title: string,
    description: string,
    imageUrl: string,
    price: number,
    unit: string,
    productUrl: string
}

export interface ProductDoc extends mongoose.Document {
    store: StoreDoc,
    title: string,
    description: string,
    imageUrl: string,
    price: number,
    unit: string,
    productUrl: string
}

interface ProductModel extends mongoose.Model<ProductDoc> {
    build(attrs: ProductAttrs): ProductDoc;
}

const productSchema = new mongoose.Schema(
    {
        store: {
            type: mongoose.Types.ObjectId,
            ref: 'Store',
            required: true
        },
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        imageUrl: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
            min: 0,
        },
        unit: {
            type: String,
            required: true,
        },
        productUrl: {
            type: String,
            required: true,
        },
    }

);



const Product = mongoose.model<ProductDoc, ProductModel>('Product', productSchema);

export { Product };
