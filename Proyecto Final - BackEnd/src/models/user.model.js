import mongoose from 'mongoose';


const collection = "users";
const schema = mongoose.Schema({
    first_name:String,
    last_name:String,
    email:{
        type:String,
        unique:true
    },
    age: Number,
    password:String,
    loggedBy: String,
    rol: String,
    lastConnection: Date
})

export const userModel = mongoose.model(collection,schema);
