import { Router } from "express";
const router = Router();

router.get("/loggerTest", (req, res) => {
  req.logger.debug("Prueba de log nivel debug!");
  req.logger.http("Prueba de log nivel http!");
  req.logger.info("Prueba de log nivel info!");
  req.logger.warning("Prueba de log nivel warning!");
  req.logger.error("Prueba de log nivel error!");
  req.logger.fatal("Prueba de log nivel fatal!");
  res.send("Prueba de logger!");
});

export default router;