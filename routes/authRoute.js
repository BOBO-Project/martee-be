const routes = require("express").Router();

/* CONTROLLERS */
const { UserController } = require("../controllers");

routes.post("/register", UserController.register)
routes.post("/login", UserController.login)
routes.post("/checkAuth", UserController.checkAuth)

module.exports = routes;