const fs = require('fs');

/* MODELS */
const { AboutUs } = require("../models");

/* HELPERS */
const { imageQuantityChecker } = require("../helpers");

class AboutUsController {
  /* CREATE AboutUs */
  static async createAboutUsImage(req, res, next) {
    try {
      const incomingFiles = req.files;
      const quantity = 4;
      const aboutUsImages = await AboutUs.findAll();
      console.log(incomingFiles, "INCOMING FILES")
      const isQuantityValid = imageQuantityChecker(aboutUsImages, incomingFiles, quantity);
      if (!isQuantityValid[0]) throw { message: isQuantityValid[1] }

      const filteredFile = req.files.filter((_, idx) => idx < (quantity - aboutUsImages.length))

      const images = filteredFile.map((file) => {
        return {
          image_url: file.path
        }
      })

      const createImage = await AboutUs.bulkCreate(images)

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

  static async getAboutUsImages(req, res, next) {
    try {
      const aboutUsImages = await AboutUs.findAll();
      return res.status(200).json({
        data: aboutUsImages || [],
        message: "Successfully get About Us images",
        status_code: 200
      })
    } catch (error) {
      return res.status(400).json({
        message: "Failed to get images",
        error: 400
      })
    }
  }

  static async deleteAboutUsImages(req, res, next) {
    try {
      const id = req.params.id;
      const aboutUsImages = await AboutUs.findAll({ where: { id } })
      if(!aboutUsImages.length) throw {message: "Image not found"}

      //Destroy images
      if (aboutUsImages?.length > 0) {
        await aboutUsImages.forEach(img => {
          const path = img?.dataValues?.image_url
          fs.unlink(path, (err) => console.log(err))
        })

        await AboutUs.destroy({ where: { id } })
      }

      return res.status(200).json({
        message: "Successfully destroy image",
        status_code: 200
      })
    } catch (error) {
      return res.status(400).json({
        message: error.message || "Failed to delete image",
        status_code: 400
      })
    }
  }
}

module.exports = AboutUsController