
import { cartModel } from '../models/cart.model.js';
import { generateJWToken } from '../utils.js';


export async function githubCallback(req, res) {
  const user = req.user;
  req.logger.debug(user);
  
  if (user.email === 'adminCoder@coder.com' && user.password === '$2b$10$j25iwNSa.pjPky3qkmuJHO7yIZgNH8Dp5MIpyHL9F4kmYkB3YJrt2') {
    req.session.admin = true;
    req.logger.debug('es admin');

    if (!user) return  res.status(401).send(getErrorMessage('INVALID_CREDENTIALS'));

    const cart = {
      cart_id: user._id,
      products: [],
    };
    const cartResult = await cartModel.create(cart);

    req.logger.debug('carrito numero ' + cartResult._id + ' creado con exito');

    req.session.user = {
      _id: user._id,
      name: `${user.first_name} ${user.last_name}`,
      email: user.email,
      age: user.age,
      rol: 'admin',
      cart: {
        cart_id: cartResult._id,
        products: [],
      },
    };

    const uuser = req.session.user;
    req.logger.debug(user.email + ' logueado con exito');
    req.logger.debug(uuser._id);

    const access_token = generateJWToken(user);

    res.send({
      status: 'success',
      payload: req.session.user,
      access_token: access_token,
      message: '¡Primer logueo realizado! :)',
    });
  } else {
    req.session.admin = false;
    req.logger.debug('no es admin');

    if (!user) return  res.status(401).send(getErrorMessage('INVALID_CREDENTIALS'));
    const cart = {
      cart_id: user._id,
      products: [],
    };
    const cartResult = await cartModel.create(cart);
    req.logger.debug('carrito numero ' + cartResult._id + ' creado con exito');

    req.session.user = {
      _id: user._id,
      name: `${user.first_name} ${user.last_name}`,
      email: user.email,
      age: user.age,
      rol: 'usuario',
      cart: {
        cart_id: cartResult._id,
        products: [],
      },
    };

    
    const access_token = generateJWToken(user);

    res.send({
      status: 'success',
      payload: req.session.user,
      access_token: access_token,
      message: '¡Primer logueo realizado! :)',
    });
  }
}

export function register(req, res) {
  req.logger.info('Registrando nuevo usuario.');
  res.status(201).send({ status: 'success', message: 'Usuario creado con éxito.' });
}

export async function login(req, res) {

    req.logger.info('User found to login:');
    const user = req.user;
    req.logger.debug(user);
  
    if (user.email === 'adminCoder@coder.com' && user.password === '$2b$10$j25iwNSa.pjPky3qkmuJHO7yIZgNH8Dp5MIpyHL9F4kmYkB3YJrt2') {
      req.session.admin = true;
      
      req.logger.debug('es admin');
      if (!user) return  res.status(401).send(getErrorMessage('INVALID_CREDENTIALS'));
  
      const cart = {
        cart_id: user._id,
        products: [],
      };
      const cartResult = await cartModel.create(cart);
      req.logger.info('carrito numero ' + cartResult._id + ' creado con exito');
  
      req.session.user = {
        _id: user._id,
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        age: user.age,
        rol: 'admin',
        cart: {
          cart_id: cartResult._id,
          products: [],
        },
      };
  
      const uuser = req.session.user;
      req.logger.debug(user.email + ' logueado con exito');
      req.logger.debug(uuser._id);
      const access_token = generateJWToken(user);
  
      res.send({
        status: 'success',
        payload: req.session.user,
        access_token: access_token,
        message: '¡Primer logueo realizado! :)',
      });
    } else {
      req.session.admin = false;
      req.logger.debug('no es admin');
  
      if (!user) return  res.status(401).send(getErrorMessage('INVALID_CREDENTIALS'));
  
      const cart = {
        cart_id: user._id,
        products: [],
      };
      const cartResult = await cartModel.create(cart);
      req.logger.info('carrito numero ' + cartResult._id + ' creado con exito');

      req.session.user = {
        _id: user._id,
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        age: user.age,
        rol: 'usuario',
        cart: {
          cart_id: cartResult._id,
          products: [],
        },
      };
  
      
      const access_token = generateJWToken(user);
  
      res.send({
        status: 'success',
        payload: req.session.user,
        access_token: access_token,
        message: '¡Primer logueo realizado! :)',
      });
    }
  }
