import mongoose from 'mongoose';


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
    purchaser:{
        type:String,
        unique:true
    },

})
export const ticketModel = mongoose.model(collection,schema);
