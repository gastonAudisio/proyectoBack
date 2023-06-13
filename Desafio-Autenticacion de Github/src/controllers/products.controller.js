import { productModel } from "../models/product.model.js";
import { login } from "./sessions.controller.js";

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
      console.error("No se pudo obtener productos paginados con mongoose: " + error);
      res.status(500).send({ error: "No se pudo obtener productos paginados con mongoose", message: error });
    }
  };

  export const getAllProducts = async (req, res) => {
    try {
      const products = await productModel.find();
      res.send(products);
    } catch (error) {
      console.error("No se pudo obtener productos con mongoose: " + error);
      res.status(500).send({ error: "No se pudo obtener productos con mongoose", message: error });
    }
  };

  export const createProduct = async (req, res) => {
    try {
      const { code, title, description, price, thumbnail, stock, category, status } = req.body;
      const product = await productModel.create({ code, title, description, price, thumbnail, stock, category, status });
      res.status(201).send(product);
    } catch (error) {
      console.error("No se pudo crear el producto con mongoose: " + error);
      res.status(500).send({ error: "No se pudo crear el producto con mongoose", message: error });
    }
  };

  export const deleteProduct = async (req, res) => {
    try {
      const productId = req.params.pid;
      // Buscar y eliminar el producto por su ID
      const deletedProduct = await productModel.findByIdAndDelete(productId);
  
      if (!deletedProduct) {
        return res.status(404).json({ message: 'Producto no encontrado' });
      }
  
      res.status(200).json({ message: 'Producto eliminado correctamente' });
    } catch (error) {
      console.error("No se pudo eliminar el producto con mongoose: " + error);
      res.status(500).send({ error: "No se pudo eliminar el producto con mongoose", message: error });
    }
  };