import {Router} from 'express';
const router = Router();

/*=============================================
=                   Session                   =
=============================================*/

// Session management 
router.get('/session', (req, res)=>{
    if(req.session.counter){
        req.session.counter++;
        res.send(`Se ha visitado este sitio ${req.session.counter} veces` )
    }else{
        req.session.counter = 1;
        res.send("Bienvenido!!")
    }
})

export default router;