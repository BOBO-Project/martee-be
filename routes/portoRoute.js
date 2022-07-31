const routes = require("express").Router();
const multer = require("multer");

/* HELPERS */
const { fileStorage, fileFilter } = require("../helpers")

/* CONTROLLERS */
const { PortoController } = require("../controllers");

routes.get('/homepage', PortoController.getHomepagePorto)
routes.post('/page', PortoController.getPortoPage)
routes.get('/detail/:id', PortoController.getHomepagePorto)

routes.post('/detail', PortoController.validatePortoInput, PortoController.createPorto)
routes.put('/detail/:id', PortoController.checkIfPortoExist, PortoController.updatePorto)
routes.delete('/detail/:id', PortoController.checkIfPortoExist, PortoController.deletePorto)

routes.post('/image/:id', multer({ storage: fileStorage, fileFilter }).array("image", 20), PortoController.addPortoImage)
routes.post('/main_image/:id/:img_id', PortoController.checkIfImageExist, PortoController.setMainImage)
routes.delete('/image/:id/:img_id', PortoController.deleteImage)

module.exports = routes;