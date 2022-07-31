const multer = require("multer");

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images')
  },
  filename: (req, file, cb) => {
    const uniqueImageName = new Date().getTime() + "-" + file.originalname
    const finalName = uniqueImageName.replace(/\s+/g, '-').toLocaleLowerCase()
    cb(null, finalName)
  }
})

const fileFilter = (req, file, cb) => {
  const imgType = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif']
  const isValid = imgType.filter(type => file.mimetype === type)
  if (isValid.length > 0) {
    cb(null, true)
  } else {
    cb(null, false)
  }
}

module.exports = {
  fileStorage,
  fileFilter
}