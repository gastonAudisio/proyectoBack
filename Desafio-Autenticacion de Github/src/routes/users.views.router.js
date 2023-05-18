import {Router} from 'express';
const router = Router();
import {authToken} from '../utils.js';

router.get('/login', (req, res)=>{
    res.render("login");
})

router.get('/register', (req, res)=>{
    res.render("register");
})

router.get('/', (req, res)=>{
    res.render("profile", {
        user: req.session.user
    });
})

router.get('/', authToken, (req, res)=>{
    res.render("profile", {
        // user: req.session.user
        user: req.user
    });
})

router.get("/error", (req, res)=>{
    res.render("error");
});


export default router;