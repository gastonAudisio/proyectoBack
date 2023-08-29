
//------------------ IMPORTS ---------------------------------

import express from 'express';
import productRouter from "./routes/products.router.js"
import cartsRouter from "./routes/carts.router.js"
import handlebars from 'express-handlebars';
import __dirname from './utils.js';
import viewsRouter from './routes/views.router.js'
import {Server} from 'socket.io'
import mongoose from 'mongoose';
import { productModel } from "./models/product.model.js";
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
import emailRouter from "./routes/email.router.js"
import mockingProductsRouter from './routes/mockingProducts.router.js';
import loggerTestRouter from './routes/loggerTest.router.js';
import { addLogger } from './config/logger.js';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUiExpress from 'swagger-ui-express';
import launcherRouter from "./routes/launcher.router.js"
//------------------------------------------------------------
const app = express();
const PORT = process.env.PORT || 9090 ;
const conecction = mongoose.connect(process.env.MONGO_URL)
app.use(addLogger);
app.use(cors());


//--------------------------------------------------------
//Preparar la configuracion del servidor para recibir objetos JSON.
app.use(express.json());
app.use(express.urlencoded({extended: true}));
//--------------------------------------------------------
app.get("/", (req, res)=>{
   res.send("Hola mundo!");
});
//--------------------------------------------------------
//Uso de vista de plantillas
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + "/views");
app.set('view engine', 'handlebars');

//Carpeta public
app.use(express.static(__dirname+'/public'));
//--------------------------------------------------------
// Conectamos la base de datos
const DB = config.mongoUrl
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
app.use("/api/email", emailRouter);
app.use("/mockingproducts", mockingProductsRouter);
app.get("/loggerTest", loggerTestRouter);
app.use("/launcher", launcherRouter);

//--------------------------------------------------------
const SERVER_PORT = config.port ;
const httpServer = app.listen(SERVER_PORT, () => {
    console.log("Servidor escuchando por el puerto: " + SERVER_PORT);
});
// config de swagger
const swaggerOptions = {
    definition: {
        openapi: '3.0.1',
        info: {
            title: 'Documentacion API Ecommerce',
            description: 'Documentacion para uso de swagger!!'
        }
    },
    apis: [`./docs/**/*.yaml`]
}
// creamos el specs 
const specs = swaggerJSDoc(swaggerOptions);
console.log(specs);
// Declamos swagger API - endpoint
app.use('/apidocs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs));
//--------------------------------------------------------
// const socketServer = new Server
const socketServer = new Server(httpServer);
let messages = []
// Abrimos el canal de comunicacion
socketServer.on('connection', socket=>{
    
    socket.on("product", async product =>{
        const newProduct = await productModel.create(product);
        console.log("Producto creado:", newProduct);
        
    });

    socket.on("id", async data => {
        const deletedProduct = await productModel.deleteOne({_id: data});
        
        if (deletedProduct.deletedCount > 0) {
            console.log("Producto eliminado:", deletedProduct);
            socket.emit("productDeleted", { success: true });
        } else {
            console.log("Producto No encontrado:", deletedProduct);
            socket.emit("productDeleted", { success: false });
        }
    });

//---------------chat----------------//

socket.on('message', data =>{
    messages.push(data);
    socketServer.emit('messageLogs', messages )
})

// hacemos un broadcast del nuevo usuario que se conecta al chat
socket.on('userConnected', data =>{
    socket.broadcast.emit('userConnected', data.user)
})
});


