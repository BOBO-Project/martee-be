const routes = require("express").Router();
const multer = require("multer");

/* HELPERS */
const { fileStorage, fileFilter } = require("../helpers")

/* CONTROLLERS */
const { BannerController } = require("../controllers");

routes.get('/', BannerController.getBannerImages)
routes.post('/', multer({ storage: fileStorage, fileFilter }).array("image", 3), BannerController.createBanner)
routes.delete('/:id', BannerController.deleteImages)

module.exports = routes;