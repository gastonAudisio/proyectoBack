
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
import MongoSingleton from './config/mongodb-singleton.js';
import config from './config/config.js'
import cors from 'cors';
import chatRouter from "./routes/chat.router.js"
//------------------------------------------------------------

const app = express();
// const userManager = new ProductManager()


app.use(cors());
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
const SERVER_PORT = 9090;
// const SERVER_PORT = config.port;
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

    socket.on('chatMessage', message => {
        console.log('Mensaje del servidor recibido: ' + message);
        // Aquí puedes agregar lógica adicional para manejar el mensaje recibido, como mostrarlo en la interfaz de usuario
      });
    

    

});

//--------------------------------------------------------

    // Conectamos la base de datos
    const DB = 'mongodb+srv://admin:audisio1@cluster0.7on3jcb.mongodb.net/ecommerce?retryWrites=true&w=majority'
//     const connectMongoDB = async()=>{
//         try {
//             await mongoose.connect(DB)
//             console.log("Conectado con exito a MongoDB usando Mongoose");
//         } catch (error) {
//             console.error("No se pudo conectar a la BD usando Moongose: " + error);
//             process.exit();
//         }
// }
const mongoInstance = async () => {
    try {
        await MongoSingleton.getInstance();
    } catch (error) {
        console.error(error);
    }
};
mongoInstance();
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
app.use("/chat", chatRouter);
// connectMongoDB()



