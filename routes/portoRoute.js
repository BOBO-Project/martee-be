const routes = require("express").Router();
const multer = require("multer");

/* HELPERS */
const { fileStorage, fileFilter } = require("../helpers")

/* CONTROLLERS */
const { PortoController } = require("../controllers");

//Porto Details
routes.post('/detail', PortoController.validatePortoInput, PortoController.createPorto)
routes.put('/detail/:id', PortoController.checkIfPortoExist, PortoController.updatePorto)
routes.delete('/detail/:id', PortoController.checkIfPortoExist, PortoController.deletePorto)
routes.get('/detail/:id', PortoController.getPortoDetail)

//Porto Details Image
routes.post('/image/:id', multer({ storage: fileStorage, fileFilter }).array("image", 3), PortoController.addPortoImage)
routes.patch('/image/:id/:img_id', multer({ storage: fileStorage, fileFilter }).single("image"), PortoController.updatePortoImages)
routes.delete('/image/:id/:img_id', PortoController.deleteImage)
routes.patch('/main_image/:id/:img_id', PortoController.checkIfImageExist, PortoController.setMainImage)

routes.get('/homepage', PortoController.getHomepagePorto)
routes.post('/page', PortoController.getPortoPage)


module.exports = routes;