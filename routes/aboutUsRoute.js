const routes = require("express").Router();
const multer = require("multer");

/* HELPERS */
const { fileStorage, fileFilter } = require("../helpers")

/* CONTROLLERS */
const { AboutUsController } = require("../controllers");

routes.get('/', AboutUsController.getAboutUsImages)
routes.post('/', multer({ storage: fileStorage, fileFilter }).array("image", 4), AboutUsController.createAboutUsImage)
routes.delete('/:id', AboutUsController.deleteAboutUsImages)

module.exports = routes;