const express = require("express");
const file = require("./file");
const router = express.Router();
const sharp = require('sharp')
router.use("/file",file);

module.exports = router;