import { Router } from 'express';
import passport from 'passport';
import {cartModel} from '../models/cart.model.js';
import { generateJWToken } from '../utils.js';


const router = Router();

router.get("/github", passport.authenticate('github', {scope: ['user:email']}), async (req, res) => {});

// router.get("/githubcallback", passport.authenticate('github', {failureRedirect: '/github/error'}), async (req, res) => {
//     const user = req.user;
//     req.session.user= {
//         name : `${user.first_name} ${user.last_name}`,
//         email: user.email,
//         age: user.age
//     };
//     req.session.admin = true;
//     res.redirect("/github");
// });


//--------------------------------------------------------------------------------
router.get("/githubcallback", passport.authenticate('github', {failureRedirect: '/github/error'}), async (req, res) => {
    console.log("User found to login:");
    const user = req.user;
    console.log(user);
    // Verificar si el correo electrónico es igual al del administrador
    if (user.email === 'adminCoder@coder.com' && user.password === '$2b$10$j25iwNSa.pjPky3qkmuJHO7yIZgNH8Dp5MIpyHL9F4kmYkB3YJrt2') {
        req.session.admin = true;
        console.log('es admin');
        
        if(!user) return res.status(401).send({status:"error",error:"Incorrect credentials"});
                // Crear carrito para el usuario
                const cart = {
                    cart_id: user._id,
                    products: []
                };
                const cartResult = await cartModel.create(cart);
                console.log('carrito numero ' + cartResult._id +' creado con exito');
        req.session.user = {
            _id: user._id,
            name : `${user.first_name} ${user.last_name}`,
            email: user.email,
            age: user.age,
            rol: "admin",
            cart: {
                cart_id: cartResult._id,
                products: []
              }
        };
        const uuser= req.session.user;
        console.log(user.email + ' logueado con exito');
        console.log(uuser._id);
        const access_token = generateJWToken(user);
        // console.log(access_token);
        // res.send({ status: "success", payload: req.session.user,access_token: access_token, message: "¡Primer logueo realizado! :)" });
        res.redirect("/github");
    } else {
        req.session.admin = false;
        console.log('no es admin');
      
        if(!user) return res.status(401).send({status:"error",error:"Incorrect credentials"});
        
                 // Crear carrito para el usuario
                 const cart = {
                    cart_id: user._id,
                    products: []
                };
                const cartResult = await cartModel.create(cart);
                console.log('carrito numero ' + cartResult._id +' creado con exito');
        req.session.user = {
            _id: user._id,
            name : `${user.first_name} ${user.last_name}`,
            email: user.email,
            age: user.age,
            rol: "usuario",
            cart: {
                cart_id: cartResult._id,
                products: []
              }
        }
        const uuser= req.session.user;

        // console.log(uuser._id);
        // console.log(cart_id);
        const access_token = generateJWToken(user);
        // console.log(access_token);
        // res.send({ status: "success", payload: req.session.user,access_token: access_token, message: "¡Primer logueo realizado! :)" });
        res.redirect("/github");    
    }
});
//-----------------------------------------------------------------------------
router.post("/register", passport.authenticate('register', { failureRedirect: '/api/sessions/fail-register' }),
    async (req, res) => {
        console.log("Registrando nuevo usuario.");
        res.status(201).send({ status: "success", message: "Usuario creado con extito." });
    });

//-----------------------------------------------------------------------------
 router.post("/login", passport.authenticate('login', { failureRedirect: '/api/sessions/fail-login' }), async (req, res) => {
    console.log("User found to login:");
    const user = req.user;
    console.log(user);
    // Verificar si el correo electrónico es igual al del administrador
    if (user.email === 'adminCoder@coder.com' && user.password === '$2b$10$j25iwNSa.pjPky3qkmuJHO7yIZgNH8Dp5MIpyHL9F4kmYkB3YJrt2') {
        req.session.admin = true;
        console.log('es admin');
        
        if(!user) return res.status(401).send({status:"error",error:"Incorrect credentials"});
                // Crear carrito para el usuario
                const cart = {
                    cart_id: user._id,
                    products: []
                };
                const cartResult = await cartModel.create(cart);
                console.log('carrito numero ' + cartResult._id +' creado con exito');
        req.session.user = {
            _id: user._id,
            name : `${user.first_name} ${user.last_name}`,
            email: user.email,
            age: user.age,
            rol: "admin",
            cart: {
                cart_id: cartResult._id,
                products: []
              }
        };
        const uuser= req.session.user;
        console.log(user.email + ' logueado con exito');
        console.log(uuser._id);
        const access_token = generateJWToken(user);
        // console.log(access_token);
        res.send({ status: "success", payload: req.session.user,access_token: access_token, message: "¡Primer logueo realizado! :)" });
    } else {
        req.session.admin = false;
        console.log('no es admin');
      
        if(!user) return res.status(401).send({status:"error",error:"Incorrect credentials"});
        
                 // Crear carrito para el usuario
                 const cart = {
                    cart_id: user._id,
                    products: []
                };
                const cartResult = await cartModel.create(cart);
                console.log('carrito numero ' + cartResult._id +' creado con exito');
        req.session.user = {
            _id: user._id,
            name : `${user.first_name} ${user.last_name}`,
            email: user.email,
            age: user.age,
            rol: "usuario",
            cart: {
                cart_id: cartResult._id,
                products: []
              }
        }
        const uuser= req.session.user;

        // console.log(uuser._id);
        // console.log(cart_id);
        const access_token = generateJWToken(user);
        // console.log(access_token);
        res.send({ status: "success", payload: req.session.user,access_token: access_token, message: "¡Primer logueo realizado! :)" });
        }
});

router.get("/fail-register", (req, res) => {
    res.status(401).send({ error: "Failed to process register!" });
});

router.get("/fail-login", (req, res) => {
    res.status(401).send({ error: "Failed to process login!" });
});


//-----------------------------------------------------------------------------
router.get('/logout', (req, res)=>{
    if (req.session && req.session.user) {
        console.log(`${req.session.user.email}  'deslogueado con mucho exito'`);
     }
     req.session.destroy(error => {
        if(error){
            res.json({error: "Error de logout", msg: 'Error al cerrar session'})
        }
        
        console.log('deslogueado con exito');
        res.clearCookie('connect.sid').send("Sesion cerrada correctamente!!")
    })
})
//-----------------------------------------------------------------------------
function auth(req, res,next){
    if(req.session.user.email === 'adminCoder@coder.com' && req.session.admin){
        return next();
    }else{
        return res.status(403).send('Usuario no autorizado para ingresar al recurso')
    }
}


router.get('/private', auth,  (req, res)=>{
    console.log('usuario autorizado');
    res.render("private", {user: req.session.user})
})
//-----------------------------------------------------------------------------
export function checkUser(req, res,next){
    if (req.session.user) {
        next();
      } else {
        console.log("no se ve la sesion de usuario");
        res.redirect('/users/login');
      }
}
export default router;