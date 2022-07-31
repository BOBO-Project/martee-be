const jwt = require('jsonwebtoken')

module.exports = {
    encodeToken: (email, id, role) => jwt.sign({email, id, role}, process.env.JWT_SECRET || "donttellanyone"),
    verifyToken: (token) => jwt.verify(token, process.env.JWT_SECRET || "donttellanyone")
}