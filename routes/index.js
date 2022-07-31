const routes = require("express").Router();

//Routes
const bannerRoutes = require("./bannerRoute");
const aboutUsRoute = require("./aboutUsRoute");
const portoRoute = require("./portoRoute");

routes.use('/banner', bannerRoutes)
routes.use('/about', aboutUsRoute)
routes.use('/porto', portoRoute)

module.exports = routes;