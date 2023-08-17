import { Router } from "express";
import { renderLauncher } from "../controllers/sessions.controller.js"; 
const router = Router();

router.get('/', renderLauncher); 


export default router;