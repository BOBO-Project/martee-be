const fs = require('fs');

const removeImage = (files) => {
  if (files.length) {
    files.forEach(file => {
      fs.unlink(file.path, (err) => {
        console.log(err, "ERROR WHEN REMOVE FILE")
        return
      })
    });
  }
}

module.exports = { removeImage }