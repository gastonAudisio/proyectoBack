import { cartModel } from "../models/cart.model.js";
import { productModel } from "../models/product.model.js";
import { ticketService } from "../service/ticketService.js";
import { getErrorMessage } from './errorHandler.js';
import { sendEmail } from './email.controller.js';

export const renderCarts = async (req, res) => {
  try {
    const carts = await cartModel.find().populate("products.product").lean();
    res.render('carts', { carts });
  } catch (error) {
    console.error(`Error al obtener los carritos: ${getErrorMessage('CARTS_NOT_FOUND')}`);
    res.status(500).send(getErrorMessage('CARTS_NOT_FOUND'));
  }
};

export const renderCartById = async (req, res) => {
  try {
    const cart = await cartModel.findById(req.params.id).populate("products.product").lean();
    res.render('cartId', { cart });
  } catch (error) {
    console.error(`Error al obtener los carritos: ${getErrorMessage('CART_NOT_FOUND')}`);
    res.status(500).send(getErrorMessage('CART_NOT_FOUND'));
  }
};

export const getAllCarts = async (req, res) => {
  try {
    const carts = await cartModel.find();
    res.send(carts);
  } catch (error) {
    console.error(`Error al obtener los carritos: ${getErrorMessage('CARTS_NOT_FOUND')}`);
    res.status(500).send(getErrorMessage('CARTS_NOT_FOUND'));
  }
};

export const createCart = async (req, res) => {
  try {
    const { products = [] } = req.body;
    const cart = await cartModel.create({ products });
    res.status(201).send(cart);
  } catch (error) {
    console.error(`Error al obtener los carritos: ${getErrorMessage('ERROR_CREATE_CART')}`);
    res.status(500).send(getErrorMessage('ERROR_CREATE_CART'));
  }
};


export const addProductToCart = async (req, res) => {
  try {
    const { id } = req.params;
    const { productId, quantity } = req.body;

    const updatedCart = await cartModel.findByIdAndUpdate(
      id,
      { $addToSet: { products: { product: productId, quantity } } },
      { new: true }
    );

    res.status(200).json(updatedCart);
  } catch (error) {
    console.error(`Error al obtener los carritos: ${getErrorMessage('ERROR_ADD_TO_CART')}`);
    res.status(500).send(getErrorMessage('ERROR_ADD_TO_CART'));
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
    console.error(`Error al obtener los carritos: ${getErrorMessage('ERROR_DELETE_TO_CART')}`);
    res.status(500).send(getErrorMessage('ERROR_DELETE_TO_CART'));
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
    console.error(`Error al obtener los carritos: ${getErrorMessage('ERROR_ADD_TO_CART')}`);
    res.status(500).send(getErrorMessage('ERROR_ADD_TO_CART'));
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
      console.error(`Error al obtener los carritos: ${getErrorMessage('ERROR_DELETE_ALL_TO_CART')}`);
    res.status(500).send(getErrorMessage('ERROR_DELETE_ALL_TO_CART'));
    }
  };

  export const deleteCartById = async (req, res) => {
    try {
      const { id } = req.params;
  
      await cartModel.findByIdAndRemove(id);
  
      res.status(200).send({ message: "Carrito eliminado correctamente" });
    } catch (error) {

      console.error(`Error al obtener los carritos: ${getErrorMessage('ERROR_DELETE_CART')}`);
      res.status(500).send(getErrorMessage('ERROR_DELETE_CART'));
    }
  };


export const purchaseTicket = async (req, res) => {
  const cartId = req.params.cid;
  console.log('carrito numero = ' + cartId);
  try {
    // Obtener el carrito de la base de datos
    const cart = await cartModel.findById(cartId).populate('products.product');
    console.log('productos en el carrito ' + cart);
    // Verificar si el carrito existe
    if (!cart) {
      
      console.error(`Error al obtener los carritos: ${getErrorMessage('CARTS_NOT_FOUND')}`);
      res.status(500).send(getErrorMessage('CARTS_NOT_FOUND'));
    }

    // Verificar el stock de cada producto en el carrito
    const failedProducts = [];

    for (const item of cart.products) {
      const productId = item.product._id;
      const quantity = item.quantity;

      // Obtener el producto de la base de datos
      const product = await productModel.findById(productId);

      // Verificar el stock del producto
      if (product.stock >= quantity) {
        // Restar la cantidad del stock del producto
        product.stock -= quantity;
        await product.save();
      } else {
        // No hay suficiente stock, agregar el producto a la lista de productos no procesados
        failedProducts.push(productId);
        console.log(`Stock insuficiente para el producto: ${product.title}`);
        console.error(`Error al obtener los carritos: ${getErrorMessage('INSUFFICIENT_STOCK')}`);
        res.status(500).send(getErrorMessage('INSUFFICIENT_STOCK'));
      }
    }

    // Eliminar los productos no procesados del carrito
    cart.products = cart.products.filter((p) => !failedProducts.includes(p.product));

    // Guardar los cambios en el carrito
    await cart.save();

    // Obtener el correo electrónico del usuario
    const userEmail = req.session.user.email;
    console.log('Email de la compra = ' + userEmail);
    // Crear un ticket con los datos de la compra y los productos no procesados
    await ticketService.createTicket(cart, failedProducts, userEmail);
    // Envía el correo electrónico al usuario
    const emailOptions = {
      from: 'Tu Tienda Online',
      to: userEmail,
      subject: 'Confirmación de compra',
      text: 'Gracias por tu compra. ¡Hemos recibido tu pedido!',
    };
    await sendEmail(emailOptions); 
    res.json({ message: 'Compra realizada con éxito' });
  } catch (error) {
    console.error(`Error al obtener los carritos: ${getErrorMessage('ERROR_PURCHASER')}`);
    res.status(500).send(getErrorMessage('ERROR_PURCHASER'));
  }
};