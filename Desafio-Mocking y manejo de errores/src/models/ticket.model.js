import mongoose from 'mongoose';
import { userModel } from './user.model.js';

const collection = "tickets";
const schema = mongoose.Schema({
    code:{
        type:Number,
        unique:true
    },
    purchase_datetime:{ 
        type: Date, default: Date.now 
    },
    amount: Number,
    purchaser: String,
})
export const ticketModel = mongoose.model(collection,schema);
