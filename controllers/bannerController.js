const fs = require('fs');

/* MODELS */
const { Banner } = require("../models");

/* HELPERS */
const { imageQuantityChecker } = require("../helpers");

class BannerController {
  /* CREATE Banner */
  static async createBanner(req, res, next) {
    try {
      const incomingFiles = req.files;
      const quantity = 3;
      const bannerImages = await Banner.findAll();

      const isQuantityValid = imageQuantityChecker(bannerImages, incomingFiles, quantity);
      if (!isQuantityValid[0]) throw { message: isQuantityValid[1] }

      const filteredFile = req.files.filter((_, idx) => idx < (quantity - bannerImages.length))

      const images = filteredFile.map((file) => {
        return {
          image_url: file.path
        }
      })

      const createImage = await Banner.bulkCreate(images)

      return res.status(200).json({
        data: createImage.map(({ dataValues }) => dataValues),
        message: "Successfully create images",
        status_code: 200
      })

    } catch (error) {
      return res.status(400).json({
        message: error.message || "Failed upload images",
        error: 400
      })
    }
  }

  static async getBannerImages(req, res, next) {
    try {
      const bannerImages = await Banner.findAll();
      return res.status(200).json({
        data: bannerImages || [],
        message: "Successfully get banner images",
        status_code: 200
      })
    } catch (error) {
      return res.status(400).json({
        message: "Failed to get images",
        error: 400
      })
    }
  }

  static async deleteImages(req, res, next) {
    try {
      const id = req.params.id;
      const bannerImages = await Banner.findAll({ where: { id } })
      if(!bannerImages.length) throw {message: "Image not found"}

      //Destroy images
      if (bannerImages.length > 0) {
        await bannerImages.forEach(img => {
          const path = img.dataValues.image_url
          fs.unlink(path, (err) => console.log(err))
        })

        await Banner.destroy({ where: { id } })
      }

      return res.status(200).json({
        message: "Successfully destroy image",
        status_code: 200
      })
    } catch (error) {
      console.log(error)
      return res.status(400).json({
        message: error.message || "Failed to delete image",
        status_code: 400
      })
    }
  }
}

module.exports = BannerController