
import { Router } from 'express';
import passport from 'passport';
import { githubCallback, register, login } from '../controllers/sessions.controller.js';

const router = Router();

router.get('/github', passport.authenticate('github', { scope: ['user:email'] }), async (req, res) => {});

router.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/github/error' }), githubCallback);

router.post('/register', passport.authenticate('register', { failureRedirect: '/api/sessions/fail-register' }), register);

router.post('/login', passport.authenticate('login', { failureRedirect: '/api/sessions/fail-login' }), login);

router.get('/fail-register', (req, res) => {
  res.status(401).send({ error: 'Failed to process register!' });
});

router.get('/fail-login', (req, res) => {
  res.status(401).send({ error: 'Failed to process login!' });
});

router.get('/logout', (req, res) => {
  if (req.session && req.session.user) {
    console.log(`${req.session.user.email}  'deslogueado con mucho exito'`);
  }
  req.session.destroy(error => {
    if (error) {
      res.json({ error: 'Error de logout', msg: 'Error al cerrar sesión' });
    }

    console.log('deslogueado con exito');
    res.clearCookie('connect.sid').send('Sesión cerrada correctamente!!');
  });
});



export function auth(req, res, next) {
  if (req.session.user && req.session.user.email === 'adminCoder@coder.com' && req.session.admin) {
    console.log('Usuario autorizado:', req.session.user.email);
    return next();
  } else {
    console.log('Usuario no autorizado:', req.session.user.email);
    return res.status(403).send('Usuario no autorizado para ingresar al recurso');
  }
}

export function authUser(req, res, next) {
  if (!req.session.admin) {
    return next();
  } else {
    return res.status(403).send('Usuario no autorizado para ingresar al recurso');
  }
}

router.get('/private', auth, (req, res) => {
  console.log('usuario autorizado');
  res.render('private', { user: req.session.user });
});

export function checkUser(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    console.log('no se ve la sesion de usuario');
    res.redirect('/users/login');
  }
}

export default router;