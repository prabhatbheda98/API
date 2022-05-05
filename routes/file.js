const express =  require("express");

const getImage = require("../controllers")
const router = express.Router();

router.get("/",getImage.getImgOld);
router.post("/generate-image",  getImage.generateImages);

module.exports = router;