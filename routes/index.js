const routes = require("express").Router();

//Routes
const bannerRoutes = require("./bannerRoute");
const aboutUsRoute = require("./aboutUsRoute");

routes.use('/banner', bannerRoutes)
routes.use('/about', aboutUsRoute)

module.exports = routes;