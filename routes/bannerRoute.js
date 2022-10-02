const routes = require("express").Router();
const multer = require("multer");

/* HELPERS */
const { fileStorage, fileFilter } = require("../helpers")

/* CONTROLLERS */
const { BannerController, UserController } = require("../controllers");

routes.get('/', BannerController.getBannerImages)
routes.post('/', UserController.checkAuth, multer({ storage: fileStorage, fileFilter }).array("image", 3), BannerController.createBanner)
routes.patch('/image/:id', UserController.checkAuth, multer({ storage: fileStorage, fileFilter }).single("image", 1), BannerController.updateBannerImages)
routes.patch('/position/:id', UserController.checkAuth, BannerController.updateBannerPosition)
routes.delete('/:id', UserController.checkAuth, BannerController.deleteImages)

module.exports = routes;