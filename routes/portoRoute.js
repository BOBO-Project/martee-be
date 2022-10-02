const routes = require("express").Router();
const multer = require("multer");

/* HELPERS */
const { fileStorage, fileFilter } = require("../helpers")

/* CONTROLLERS */
const { PortoController, UserController } = require("../controllers");

//Porto Details
routes.post('/detail', UserController.checkAuth, PortoController.validatePortoInput, PortoController.createPorto)
routes.put('/detail/:id', UserController.checkAuth, PortoController.checkIfPortoExist, PortoController.updatePorto)
routes.delete('/detail/:id', UserController.checkAuth, PortoController.checkIfPortoExist, PortoController.deletePorto)
routes.get('/detail/:id', PortoController.getPortoDetail)

//Porto Details Image
routes.post('/image/:id', UserController.checkAuth, multer({ storage: fileStorage, fileFilter }).array("image", 3), PortoController.addPortoImage)
routes.patch('/image/:id/:img_id', UserController.checkAuth, multer({ storage: fileStorage, fileFilter }).single("image"), PortoController.updatePortoImages)
routes.delete('/image/:id/:img_id', UserController.checkAuth, PortoController.deleteImage)
routes.patch('/main_image/:id/:img_id', UserController.checkAuth, PortoController.checkIfImageExist, PortoController.setMainImage)

routes.get('/', PortoController.getPorto)


module.exports = routes;