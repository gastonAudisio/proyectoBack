
//-------------------------------  MONGO  ---------------------------------------------------
import {Router} from "express";
import { checkUser,auth } from '../routes/sessions.router.js';
import { getPaginatedProducts,getAllProducts,createProduct,deleteProduct } from "../controllers/products.controller.js";

const router = Router();
    
router.get('/products', checkUser, getPaginatedProducts);
router.get("/", getAllProducts);
router.post('/',auth, createProduct);
router.delete('/:pid',auth, deleteProduct);


export default router;



