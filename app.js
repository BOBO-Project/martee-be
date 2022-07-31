require("dotenv");
const express = require("express");
const bodyParser = require('body-parser');
const cors = require("cors");
const path = require("path");

//Routes
const routes = require("./routes");

const app = express();
const PORT = process.env.PORT || 3001;

// Uncomment this when deployment
/*
  const allowList = []
  const corsOptionsDelegate = function (req, callback) {
    let corsOptions;
    if (allowlist.indexOf(req.header('Origin')) !== -1) {
      corsOptions = { origin: true }
    } else {
      corsOptions = { origin: false } 
    }
    callback(null, corsOptions) 
  }
  app.use(cors(corsOptionsDelegate)) 
*/

app.use(cors())
app.use(bodyParser.json());
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use("/images", express.static(path.join(__dirname, "images")))
app.use(routes)

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`)
})