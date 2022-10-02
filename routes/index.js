const routes = require("express").Router();

//Routes
const bannerRoutes = require("./bannerRoute");
const aboutUsRoute = require("./aboutUsRoute");
const portoRoute = require("./portoRoute");
const authRoute = require("./authRoute");

routes.use('/auth', authRoute)
routes.use('/banner', bannerRoutes)
routes.use('/about', aboutUsRoute)
routes.use('/porto', portoRoute)

module.exports = routes;