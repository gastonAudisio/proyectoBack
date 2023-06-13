import mongoose from "mongoose";
import config from "./config.js";

export default class MongoSingleton {
    static #instance;

    constructor(){
        this.#connectMongoDB();
    };

    static getInstance(){
        if (this.#instance) {
            console.log("Ya se ha abierto una conexion a MongoDB.");
        } else {
            this.#instance = new MongoSingleton();
        }
        return this.#instance;
    };

    #connectMongoDB = async ()=>{
        try {
            // await mongoose.connect(config.mongoUrl);
            const DB = 'mongodb+srv://admin:audisio1@cluster0.7on3jcb.mongodb.net/ecommerce?retryWrites=true&w=majority'
            await mongoose.connect(DB);
            console.log(DB);
            console.log("Conectado con exito a MongoDB usando Moongose.");
        } catch (error) {
            console.error("No se pudo conectar a la BD usando Moongose: " + error);
            process.exit();
        }
    };
};