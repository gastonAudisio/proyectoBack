import { productModel } from "../models/product.model.js";
import { getErrorMessage } from './errorHandler.js';
import { sendProductDeletionEmail } from './email.controller.js';
import { userModel } from "../models/user.model.js";

export const getPaginatedProducts = async (req, res) => {
    try {
      let page = parseInt(req.query.page);
      if (!page) page = 1;
      const user = req.session.user;
      const sort = req.query.sortByPrice ? { price: parseInt(req.query.sortByPrice) } : {};
  
      const query = {};
      if (req.query.code) query.code = req.query.code;
      if (req.query.title) query.title = { $regex: req.query.title, $options: 'i' };
      if (req.query.price) query.price = req.query.price;
      if (req.query.stock) query.stock = req.query.stock;
      if (req.query.category) query.category = req.query.category;
      if (req.query.status) query.status = req.query.status;
  
      let result = await productModel.paginate(query, { page, limit: 2, lean: true, sort });
  
      result.prevLink = result.hasPrevPage ? `http://localhost:9090/api/products/products?page=${result.prevPage}` : '';
      result.nextLink = result.hasNextPage ? `http://localhost:9090/api/products/products?page=${result.nextPage}` : '';
      result.isValid = !(page <= 0 || page > result.totalPages);
  
      res.render('products', { ...result, user });
    } catch (error) {
      req.logger.error(`Error al buscar productos: ${getErrorMessage('PRODUCT_NOT_FOUND')}`);
      res.status(500).send(getErrorMessage('PRODUCT_NOT_FOUND'));
    }
  };

  export const getAllProducts = async (req, res) => {
    try {
      const products = await productModel.find();
      res.send(products);
    } catch (error) {
      req.logger.error(`Error al buscar productos: ${getErrorMessage('PRODUCT_NOT_FOUND')}`);
      res.status(500).send(getErrorMessage('PRODUCT_NOT_FOUND'));
    }
  };

  export const createProduct = async (req, res) => {
    try {
      const { code, title, description, price, thumbnail, stock, category, status } = req.body;
      const product = await productModel.create({ code, title, description, price, thumbnail, stock, category, status });
      res.status(201).json({ message: 'Producto creado correctamente', product });
    } catch (error) {
      req.logger.error(`Error al buscar productos: ${getErrorMessage('ERROR_CREATE_PRODUCT')}`);
      res.status(500).send(getErrorMessage('ERROR_CREATE_PRODUCT'));
    }
  };

  export const deleteProduct = async (req, res) => {
    try {
        const productId = req.params.pid;
        // Buscar y eliminar el producto por su ID
        const deletedProduct = await productModel.findByIdAndDelete(productId);

        if (!deletedProduct) {
            req.logger.error(`Error al buscar productos: ${getErrorMessage('ERROR_DELETE_PRODUCT')}`);
            res.status(500).send(getErrorMessage('ERROR_DELETE_PRODUCT'));
        }

        // Obtener todos los usuarios con rol "userPremium"
        const userPremiumUsers = await userModel.find({ rol: 'userPremium' });

        // Enviar el correo electrónico a cada usuario "userPremium"
        for (const user of userPremiumUsers) {
            const userEmail = user.email;
            const productName = deletedProduct.title;

            console.log(`Enviando correo electrónico a ${userEmail} por eliminación del producto ${productName}`);
            await sendProductDeletionEmail(userEmail, productName);
        }

        res.status(200).json({ message: 'Producto eliminado correctamente' });
    } catch (error) {
        req.logger.error(`Error al buscar productos: ${getErrorMessage('ERROR_DELETE_PRODUCT')}`);
        res.status(500).send(getErrorMessage('ERROR_DELETE_PRODUCT'));
    }
};

  export const updateProductStock = async (req, res) => {
    try {
      const productId = req.params.pid;
      const { stock } = req.body;
  
      // Verificar si el producto existe
      const product = await productModel.findById(productId);
      if (!product) {
        req.logger.error(`Error al buscar productos: ${getErrorMessage('PRODUCT_NOT_FOUND')}`);
        res.status(500).send(getErrorMessage('PRODUCT_NOT_FOUND'));
      }
  
      // Actualizar el stock del producto
      product.stock = stock;
      await product.save();
  
      res.status(200).json({ message: 'Stock del producto actualizado correctamente' });
    } catch (error) {
      req.logger.error(`Error al buscar productos: ${getErrorMessage('ERROR_UPDATE_PRODUCT')}`);
      res.status(500).send(getErrorMessage('ERROR_UPDATE_PRODUCT'));
    }
  };