
//------------------ IMPORTS ---------------------------------

import express from 'express';
import productRouter from "./routes/products.router.js"
import cartsRouter from "./routes/carts.router.js"
import handlebars from 'express-handlebars';
import __dirname from './utils.js';
import viewsRouter from './routes/views.router.js'
import {Server} from 'socket.io'
// import ProductManager from './service/ProductManager.js';

import mongoose from 'mongoose';

import { productModel } from "./models/product.model.js";
// import { cartModel } from "./models/cart.model.js";


import usersViewRouter from './routes/users.views.router.js';
import sessionsRouter from './routes/sessions.router.js'
import session from 'express-session';
import MongoStore from 'connect-mongo';

import passport from 'passport';
import initializePassport from './config/passport.config.js';
import githubLoginViewRouter from './routes/github-login.views.router.js'

//------------------------------------------------------------

const app = express();
// const userManager = new ProductManager()


const SERVER_PORT = 9090;

//--------------------------------------------------------
//Preparar la configuracion del servidor para recibir objetos JSON.
app.use(express.json());
app.use(express.urlencoded({extended: true}));


//--------------------------------------------------------
app.get("/", (req, res)=>{
   res.send("Hola mundo!");
});//--------------------------------------------------------

//Uso de vista de plantillas
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + "/views");
app.set('view engine', 'handlebars');

// app.use('/', viewsRouter)
//--------------------------------------------------------
//Carpeta public
app.use(express.static(__dirname+'/public'));
//--------------------------------------------------------
const httpServer = app.listen(SERVER_PORT, () => {
    console.log("Servidor escuchando por el puerto: " + SERVER_PORT);
});

//--------------------------------------------------------
// const socketServer = new Server
const socketServer = new Server(httpServer);

// Abrimos el canal de comunicacion
socketServer.on('connection', socket=>{
    console.log('conectado a socketServer!');

    // socket.on("product", product =>{
    // userManager.addProductForm(product)
    // })

    // socket.on("id", data => {
    // userManager.deleteProduct(data)
    // })
    socket.on("product", async product =>{
        const newProduct = await productModel.create(product);
        console.log("Producto creado:", newProduct);
    });

    socket.on("id", async data => {
        const deletedProduct = await productModel.deleteOne({_id: data});
        console.log("Producto eliminado:", deletedProduct);
    });


});

//--------------------------------------------------------

    // Conectamos la base de datos
    const DB = 'mongodb+srv://admin:audisio1@cluster0.7on3jcb.mongodb.net/ecommerce?retryWrites=true&w=majority'
    const connectMongoDB = async()=>{
        try {
            await mongoose.connect(DB)
            console.log("Conectado con exito a MongoDB usando Mongoose");

    
//---------------------------------------------------------------------------
    let idProduct ="6440755ebfadf6a346584b8f" ;
    let idCart = "644d8a49f9c276242d8bce45";
//---------------------------------------------------------------------------
// CREAR UN CART
    // let newCart = await cartModel.create({})
    // let cart = await cartModel.findOne({_id: newCart._id }).populate('products')
    // console.log(cart)
    

//---------------------------------------------------------------------------
    // CREAR UN PRODUCT
    // let newProduct = await productModel.create({
    //     code: "ff",
    //     title: "ff",
    //     description:"ff",
    //     price: 3444,
    //     thumbnail:"ff",
    //     stock: 44,
    //     category: "ffffffff",
    //     status: true,
    // })
    // let producto = await productModel.findOne({_id: newProduct._id});
    // console.log(producto);
//---------------------------------------------------------------------------

// Creamos la conxion/referencia PARA AGREGAR UN idProduct A UN idCart

    // let cart = await cartModel.findOne({_id:idCart})
    // // console.log(JSON.stringify(cart, null, '\t'))

    // const productIndex = cart.products.findIndex(p => p.product == idProduct);
    // if (productIndex >= 0) {
    //   cart.products[productIndex].quantity++;
    // } else {
    //   cart.products.push({ product: idProduct, quantity: 1 });
    // }
    
    // let result = await cartModel.updateOne({_id:idCart}, cart )
    // // console.log(result);

        } catch (error) {
            console.error("No se pudo conectar a la BD usando Moongose: " + error);
            process.exit();
        }
}

//--------------------------------------------------------
app.use(session({

    store:MongoStore.create({
        mongoUrl:DB,
        mongoOptions: {useNewUrlParser: true, useUnifiedTopology: true},
        ttl: 40
    }),
    secret:"CoderS3cret",
    resave: false,
    saveUninitialized: true
}))
//--------------------------------------------------------
//Middlewares Passport
initializePassport();
app.use(passport.initialize());
app.use(passport.session());
//--------------------------------------------------------
//Routers
app.use('/',viewsRouter);
app.use('/users',usersViewRouter);
app.use('/api/sessions',sessionsRouter);
app.use("/api/products", productRouter);
app.use("/api/carts", cartsRouter);
app.use("/github", githubLoginViewRouter);
connectMongoDB()



