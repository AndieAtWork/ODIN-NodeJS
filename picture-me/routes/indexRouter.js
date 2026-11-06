const { Router } = require("express");
const indexController = require("../controllers/indexController");
const indexRouter = Router();

indexRouter.get("/", indexController.loginGet); // Primera pagina
indexRouter.post("/", indexController.loginPost); // Form primera pagina

indexRouter.get("/sign-up", indexController.signUpGet); // Form
indexRouter.post("/sign-up", indexController.signUpPost); // Crear usuario

indexRouter.get("/welcome", indexController.portadaGet); // Portada

indexRouter.post("/logout", indexController.logoutPost); // Cierra usuario

module.exports = indexRouter;