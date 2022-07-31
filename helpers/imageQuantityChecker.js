const { removeImage } = require("./removeImage");

const imageQuantityChecker = (storedFiles, incomingFiles, quantity) => {
  try {
    if(incomingFiles.length > quantity) throw {message: `Cannot upload images more than ${quantity}`}
    if(storedFiles.length === quantity) throw {message: `Maximum images excedeed, please remove current images and reupload.`}
    
    const remainingSlot = quantity - storedFiles.length;
    if(incomingFiles.length > remainingSlot || remainingSlot <= 0) throw {message: `Maximum images is ${quantity}. You are uploading ${incomingFiles.length}. Please decrease your images or remove existing images before upload`}

    return [true]
  } catch (error) {
    //log error
    console.log("Error when checking image quantity", error)
    
    //remove incoming files
    removeImage(incomingFiles)

    //return response
    return [false, error.message || "Error when checking image quantity"];
  }
}

module.exports = { imageQuantityChecker }