
import passport from 'passport';
import passportLocal from 'passport-local';
import {userModel} from '../models/user.model.js';
// import {cartModel} from '../models/cart.model.js';
import { createHash, isValidPassword } from '../utils.js';
import GitHubStrategy from 'passport-github2';



// Declaramos nuestra estrategia
const localStrategy = passportLocal.Strategy;

const initializePassport = ()=>{


    // estrategia github
    passport.use('github', new GitHubStrategy(
        {
            clientID: 'Iv1.f2c9d6be4d3e78ad', 
            clientSecret: '8852061505725cca5b62c5661efeb4f1811d88cc',
            callbackUrl: 'http://localhost:9090/api/sessions/githubcallback'
        }, 
        async (accessToken, refreshToken, profile, done) => {
            console.log("Profile obtenido del usuario: ");
            console.log(profile);
            try {
                const user = await userModel.findOne({email: profile._json.email});
                console.log("Usuario encontrado para login:");
                console.log(user);
                if (!user) {
                    console.warn("User doesn't exists with username: " + profile._json.email);
                    let newUser = {
                        first_name: profile._json.name,
                        last_name: 'audisio',
                        age: 34,
                        email: profile._json.email,
                        password: '123',
                        loggedBy: "GitHub"
                    };
                    const result = await userModel.create(newUser);
                    return done(null, result);
                } else {
                    
                    return done(null, user);
                }
            } catch (error) {
                return done(error);
            }
        })
    );
//--------------------------------------------------------------------------------    
    // estrategia register
    passport.use('register', new localStrategy(
    
        { passReqToCallback: true, usernameField: 'email' },
        async(req, username, password, done) =>{
            const { first_name, last_name, email, age } = req.body;
            try {

                const exists = await userModel.findOne({ email });
                if (exists) {
                    console.log("El usuario ya existe.");
                    return done(null, false);
                }
                const user = {
                    first_name,
                    last_name,
                    email,
                    age,
                    password: createHash(password)
                };
                const result = await userModel.create(user);
                console.log("Usuario creado con ID: " + result.id);
                return done(null, result);
            } catch (error) {
                return done("Error registrando el usuario: " + error);
            }
        }

    ))
//--------------------------------------------------------------------------------

    // estrategia login
    passport.use('login', new localStrategy(
        { passReqToCallback: true, usernameField: 'email' }, async (req, username, password, done) => {
            try {
                const email = username;
                // Verificar si el correo electrónico es igual al del administrador
                if (email === 'adminCoder@coder.com' && password === '$2b$10$j25iwNSa.pjPky3qkmuJHO7yIZgNH8Dp5MIpyHL9F4kmYkB3YJrt2') 
                {
                    const user = await userModel.findOne({ email: username }); 
                    if(!user) return done(null, false);
                    
                        if(!isValidPassword(user,password )){
                            return done(null, false);
                    }
                    console.log(user.email + ' logueado con exito');
                    return done(null, user);
                } else {
                    const user = await userModel.findOne({email}); 
                    if(!user)return done(null, false);
                        if(!isValidPassword(user,password )){
                            return done(null, false);
                    }
                    return done(null, user);
                    }
            } catch (error) {
                return done(error);
            }
        })
    );


//--------------------------------------------------------------------------------

    //Funciones de Serializacion y Desserializacion
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            let user = await userModel.findById(id);
            done(null, user);
        } catch (error) {
            console.error("Error deserializando el usuario: " + error);
        }
    });
}


export default initializePassport;