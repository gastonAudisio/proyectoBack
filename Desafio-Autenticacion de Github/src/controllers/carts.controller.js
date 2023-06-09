import { cartModel } from "../models/cart.model.js";

export const renderCarts = async (req, res) => {
  try {
    const carts = await cartModel.find().populate("products.product").lean();
    res.render('carts', { carts });
  } catch (error) {
    console.error(`Error al obtener los carritos: ${error}`);
    res.status(500).send('Error interno del servidor');
  }
};

export const renderCartById = async (req, res) => {
  try {
    const cart = await cartModel.findById(req.params.id).populate("products.product").lean();
    res.render('cartId', { cart });
  } catch (error) {
    console.error(`Error al obtener el carrito: ${error}`);
    res.status(500).send('Error interno del servidor');
  }
};

export const getAllCarts = async (req, res) => {
  try {
    const carts = await cartModel.find();
    res.send(carts);
  } catch (error) {
    console.error("No se pudo obtener los carritos con mongoose: " + error);
    res.status(500).send({ error: "No se pudo obtener los carritos con mongoose", message: error });
  }
};

export const createCart = async (req, res) => {
  try {
    const { products = [] } = req.body;
    const cart = await cartModel.create({ products });
    res.status(201).send(cart);
  } catch (error) {
    console.error("No se pudo crear el carrito con mongoose: " + error);
    res.status(500).send({ error: "No se pudo crear el carrito con mongoose", message: error });
  }
};

export const addProductToCart = async (req, res) => {
  try {
    const { id } = req.params;
    const { productId } = req.body;

    const updatedCart = await cartModel.findByIdAndUpdate(
      id,
      { $addToSet: { products: { product: productId } } },
      { new: true }
    );

    res.status(200).json(updatedCart);
  } catch (error) {
    console.error("No se pudo agregar el producto al carrito con mongoose: " + error);
    res.status(500).send({ error: "No se pudo agregar el producto al carrito con mongoose", message: error });
  }
};

export const deleteProductFromCart = async (req, res) => {
  try {
    const { id, pid } = req.params;

    const updatedCart = await cartModel.findOneAndUpdate(
      { _id: id },
      { $pull: { products: { product: pid } } },
      { new: true }
    );

    res.status(200).json(updatedCart);
  } catch (error) {
    console.error("No se pudo eliminar el producto del carrito con mongoose: " + error);
    res.status(500).send({ error: "No se pudo eliminar el producto del carrito con mongoose", message: error });
  }
};

export const addProductIdToCartId = async (req, res) => {
  try {
    const { id, pid } = req.params;
    const { productId, quantity } = req.body;

    const cart = await cartModel.findById(id);
    const productIndex = cart.products.findIndex(p => p.product.toString() === pid);

    if (productIndex !== -1) {
      cart.products[productIndex].quantity += quantity;
    } else {
      cart.products.push({ product: productId, quantity });
    }

    const updatedCart = await cart.save();

    res.status(200).json(updatedCart);
  } catch (error) {
    console.error("No se pudo agregar el producto al carrito con mongoose: " + error);
    res.status(500).send({ error: "No se pudo agregar el producto al carrito con mongoose", message: error });
  }
};
export const deleteAllProductsFromCart = async (req, res) => {
    try {
      const { id } = req.params;
  
      const updatedCart = await cartModel.findByIdAndUpdate(
        { _id: id },
        { $set: { products: [] } },
        { new: true }
      );
  
      res.status(200).json(updatedCart);
    } catch (error) {
      console.error("No se pudo actualizar el carrito con Mongoose: " + error);
      res.status(500).send({
        error: "No se pudo actualizar el carrito con Mongoose",
        message: error,
      });
    }
  };