const bcrypt = require("bcryptjs")

module.exports = {
    hashPassword: (pwd) => bcrypt.hashSync(pwd, bcrypt.genSaltSync(10)),
    verifyPassword: (pwd, hash) => bcrypt.compareSync(pwd, hash)
}