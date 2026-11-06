const { Router } = require("express");
const indexController = require("../controllers/controller")

const indexRouter = Router();

indexRouter.get("/", indexController.frontGet); // Front page

indexRouter.get("/games", indexController.gamesGet); // Choosing games
indexRouter.get("/games/:gameId", indexController.gameGet); // Game chosen

indexRouter.get("/scores/", indexController.scoreGet); // Chart View
indexRouter.get("/scores/:gameId/:playerId", indexController.scoreGameGet); // Chart Content

indexRouter.post("/scores", indexController.scorePost) // Post own score

module.exports = indexRouter;