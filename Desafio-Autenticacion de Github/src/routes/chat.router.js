import { Router } from 'express';
const router = Router();

router.get('/', (req, res) => {
  res.render('chat'); // Renderizar la plantilla handlebars para el chat
});

export default router;