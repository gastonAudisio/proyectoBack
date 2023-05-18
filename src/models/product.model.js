import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2'

const productCollection = 'products';

const stringTypeSchemaUniqueRequired = {
    type: String,
    unique: true,
    required: true,
};
const numberTypeSchemaNOnUniqueRequired = {
    type: Number,
    required: true,
    default: 0
};

const stringTypeSchemaNonUniqueRequired = {
    type: String,
    required: true
};

const booleanTypeSchemaNonUniqueRequired = {
    type: Boolean,
    required: true,
    default: 'active'
};


const productSchema = new mongoose.Schema({
    code: stringTypeSchemaUniqueRequired,
    title: stringTypeSchemaUniqueRequired,
    description:stringTypeSchemaNonUniqueRequired,
    price: numberTypeSchemaNOnUniqueRequired,
    thumbnail:stringTypeSchemaNonUniqueRequired,
    stock: numberTypeSchemaNOnUniqueRequired,
    category: stringTypeSchemaNonUniqueRequired,
    status: booleanTypeSchemaNonUniqueRequired,
    carts:{
        type:Array,
        default:[]
    }
},{timestamps:true});


productSchema.plugin(mongoosePaginate);
export const productModel = mongoose.model(productCollection, productSchema);

