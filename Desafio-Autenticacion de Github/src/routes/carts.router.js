
import { Router } from "express";
import {
  renderCarts,
  renderCartById,
  getAllCarts,
  createCart,
  addProductToCart,
  deleteProductFromCart,
  addProductIdToCartId,
  deleteAllProductsFromCart,
} from "../controllers/carts.controller.js";

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
router.put("/:id", addProductToCart);

// DELETE ONE PRODUCT
router.delete("/:id/products/:pid", deleteProductFromCart);

// PUT - ADD productId to cartId
router.put("/:id/products/:pid", addProductIdToCartId);

// DELETE ALL PRODUCTS
router.delete("/:id/products", deleteAllProductsFromCart);

export default router;