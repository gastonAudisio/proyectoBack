
import { Router } from "express";
import {
  renderCarts,
  renderCartById,
  getAllCarts,
  createCart,
  addProductToCart,
  deleteProductFromCart,
  addProductIdToCartId,
  deleteCartById,
  deleteAllProductsFromCart,
  purchaseTicket,
} from "../controllers/carts.controller.js";
import {authUser} from '../routes/sessions.router.js'

const router = Router();

// CARTS RENDERIZADOS
router.get('/carts', renderCarts);

// CART POR ID RENDERIZADO
router.get('/carts/:id', renderCartById);

// GET
router.get("/", getAllCarts);

// POST
router.post('/', createCart);

// PUT - ADD PRODUCT TO CART
router.put("/:id",/*authUser,*/ addProductToCart);

// DELETE ONE PRODUCT
router.delete("/:id/products/:pid", deleteProductFromCart);

// PUT - ADD productId to cartId
router.put("/:id/products/:pid",/*authUser,*/ addProductIdToCartId);

// PUT - DELETE cartId
router.delete("/:id",/*authUser,*/ deleteCartById);

// DELETE ALL PRODUCTS
router.delete("/:id/products", deleteAllProductsFromCart);

// PROCESO DE COMPRA
router.post("/:cid/purchase", purchaseTicket);


export default router;