const { Porto, PortoImage } = require("../models");
const { removeImage, imageQuantityChecker } = require("../helpers");

class PortoController {
  /* Middlewares */
  static async validatePortoInput(req, res, next) {
    try {
      const { name, category } = req.body;
      if (!name) throw { message: "Name must be provided" }
      if (!category) throw { message: "Category must be provided" }

      next()
    } catch (error) {
      return res.status(400).json({
        message: error.message || "Failed to validate input",
        status_code: 400
      })
    }
  }
  static async checkIfPortoExist(req, res, next) {
    try {
      const { id } = req.params;

      const porto = await Porto.findByPk(id)
      if (!porto) throw { message: "Porto not exist" }

      next()
    } catch (error) {
      return res.status(400).json({
        message: error.message || "Failed when check product is exist",
        status_code: 400
      })
    }
  }
  static async checkIfImageExist(req, res, next) {
    try {
      const { id, img_id } = req.params

      const portoImage = await PortoImage.findAll({ where: { PortoId: id, id: img_id } })
      if (!portoImage.length) throw { message: "Porto Image not exist" }

      next()
    } catch (error) {
      return res.status(400).json({
        message: error.message || "Failed when check porto image is exist",
        status_code: 400
      })
    }
  }

  /* Porto Detail Controllers */
  static async createPorto(req, res, next) {
    try {
      const { name, category } = req.body;

      const createPorto = await Porto.create({ name, category })

      return res.status(200).json({
        message: "Successfully create porto",
        data: createPorto
      })
    } catch (error) {
      return res.status(400).json({
        message: error.message || "Failed to create porto",
        status_code: 400
      })
    }
  }

  static async updatePorto(req, res, next) {
    try {
      const id = req.param.id;
      const { name, category } = req.body;
      if (!name && !category) throw { message: "Please provide name or category to update" }

      const paylaod = { name, category };
      !name && delete paylaod.name
      !category && delete paylaod.category

      const updatePorto = await Porto.update(paylaod, { where: { id } })

      return res.status(200).json({
        message: "Successfully update porto",
        data: updatePorto
      })
    } catch (error) {
      return res.status(400).json({
        message: error.message || "Failed to update porto",
        status_code: 400
      })
    }
  }

  static async deletePorto(req, res, next) {
    try {
      const { id } = req.params

      //Destroy product images
      const portoImages = await PortoImage.findAll({ where: { PortoId: id } })

      if (portoImages.length > 0) {
        await portoImages.forEach(img => {
          const path = img.dataValues.image_url
          fs.unlink(path, (err) => console.log(err))
        })

        await PortoImage.destroy({ where: { PortoId: id } })
      }

      /* Destroy Porto*/
      await Porto.destroy({ where: { id } })

      return res.status(200).json({ message: "Successfully delete porto", status_code: 200 })
    } catch (error) {
      return res.status(400).json({
        message: error.message || "Failed to delete porto",
        status_code: 400
      })
    }
  }

  /* Porto Images Controller */
  static async addPortoImage(req, res, next) {
    try {
      const { id } = req.params;
      const incomingFiles = req.files;
      const quantity = 20;

      // Check if product exist
      const isPortoExist = await Porto.findByPk(id)
      if (!isPortoExist) {
        removeImage(incomingFiles)
        throw { message: "Porto not exist" }
      }

      // get images
      const portoImages = await PortoImage.findAll({ where: { PortoId: id } })

      // validate is images have remaining slot
      const isQuantityValid = imageQuantityChecker(portoImages, incomingFiles, quantity);
      if (!isQuantityValid[0]) throw { message: isQuantityValid[1] }

      const filteredFile = req.files.filter((_, idx) => idx < (quantity - portoImages.length))
      const images = filteredFile.map((file) => {
        return {
          image_url: file.path,
          is_main: false,
          PortoId: id
        }
      })

      const createImage = await PortoImage.bulkCreate(images)

      return res.status(200).json({
        data: createImage,
        message: "Successfully create image"
      })

    } catch (error) {
      return res.status(400).json({
        message: error.message || "Failed upload images",
        status_code: 400
      })
    }
  }

  static async setMainImage(req, res, next) {
    try {
      const { img_id } = req.params

      await PortoImage.update({ is_main: false }, { where: { is_main: true } })
      await PortoImage.update({ is_main: true }, { where: { id: img_id } })

      return res.status(200).json({
        message: "Successfully set main image"
      })
    } catch (error) {
      return res.status(400).json({
        message: error.message || "Failed to set main image",
        status_code: 400
      })
    }
  }

  static async deleteImage(req, res, next) {
    try {
      const { id, img_id } = req.params

      // Check if product exist
      const isPortoExist = await Porto.findByPk(id)
      if (!isPortoExist) throw { message: "Porto not exist" }

      // Check if image exist
      const portoImage = await PortoImage.findOne({ where: { PortoId: id, id: img_id } })
      if (!portoImage) throw { message: "Image not found" }

      const imagePath = portoImage.dataValues.image_url;

      // Destroy static image
      fs.unlink(imagePath, (err) => console.log(err))

      // Destroy image in the DB
      await PortoImage.destroy({ where: { PortoId: id, id: img_id } })

      return res.status(200).json({ message: "Successfully delete image", status_code: 200 })
    } catch (error) {
      return res.status(400).json({
        message: error.message || "Failed to delete image",
        status_code: 400
      })
    }
  }

  /* Web Porto Services */
  static async getHomepagePorto(req, res, next) {
    try {
      const getPorto = await Porto.findAll({
        include: [PortoImage],
        limit: 8
      })

      return res.status(200).json({
        message: "Successfully get porto",
        data: getPorto
      })
    } catch (error) {
      return res.status(400).json({
        message: "Failed to get porto",
        status_code: 400
      })
    }
  }

  static async getPortoPage(req, res, next) {
    try {
      const page = req.body.page || 1;
      let limit = 20
      let offset = 0 + (page - 1) * limit

      const getPorto = await Porto.findAll({
        include: [PortoImage],
        limit,
        offset
      })

      return res.status(200).json({
        message: "Successfully get porto",
        data: getPorto
      })
    } catch (error) {
      return res.status(400).json({
        message: "Failed to get porto",
        status_code: 400
      })
    }
  }

  static async getPortoDetail(req, res, next) {
    try {
      const id = req.params.id;
      const getPorto = await Porto.findAll({
        include: [PortoImage],
        where: { id }
      })

      return res.status(200).json({
        message: "Successfully get porto",
        data: getPorto
      })
    } catch (error) {
      return res.status(400).json({
        message: "Failed to get porto",
        status_code: 400
      })
    }
  }
}

module.exports = PortoController;
