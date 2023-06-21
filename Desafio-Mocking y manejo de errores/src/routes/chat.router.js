import { Router } from 'express';
import {authUser} from '../routes/sessions.router.js'
const router = Router();

router.get("/",authUser, (req, res)=>{
  res.render("chat");
});

export default router;