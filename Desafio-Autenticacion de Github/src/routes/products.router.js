
//-------------------------------  MONGO  ---------------------------------------------------
import {Router} from "express";
import { productModel } from "../models/product.model.js";
import { checkUser } from '../routes/sessions.router.js';
import { getPaginatedProducts,getAllProducts,createProduct   } from "../controllers/products.controller.js";

const router = Router();
    
router.get('/products', checkUser, getPaginatedProducts);
router.get("/", getAllProducts);
router.post('/', createProduct);


export default router;



