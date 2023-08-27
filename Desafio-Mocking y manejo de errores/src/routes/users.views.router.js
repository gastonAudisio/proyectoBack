import {Router} from 'express';
const router = Router();
import {authToken} from '../utils.js';
import { allUsers,handleInactiveUsersDeletion,deleteUserId,updateUserRole  } from '../controllers/user.controller.js';
import { auth } from '../routes/sessions.router.js'

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
        user: req.user
    });
})

router.get("/error", (req, res)=>{
    res.render("error");
});

router.get("/current", (req, res)=>{
    res.render("profile", {
        user: req.session.user
    });
});

router.get('/launcher', (req, res)=>{
    res.render("launcher");
});

router.get('/allUsers', allUsers);
router.delete('/allUsers/:id', deleteUserId);
router.put('/allUsers/:id', updateUserRole);


// Endpoint DELETE para eliminar usuarios inactivos
router.delete('/deleteInactive', auth, async (req, res) => {
    try {
        await handleInactiveUsersDeletion(); 
        res.status(200).json({ message: 'Usuarios inactivos eliminados y correos enviados' });
    } catch (error) {
        console.error('Error al eliminar usuarios inactivos:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});


export default router;