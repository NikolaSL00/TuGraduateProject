const express = require("express");
const { BadRequestError, requireAuth } = require("@shopsmart/common");
const router = express.Router();
const multer = require("multer");
const RecognizerModel = require("../model/model");

// Set up multer to handle multipart/form-data
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

//, requireAuth ,
router.post("/recognize", upload.single("image"), async (req, res) => {
  try {
    // Access the base64 img string
    const base64StringImg = req.body.blob;

    console.log("hi");
    const model = await RecognizerModel.getInstance();
    const prediction = await model.predict(base64StringImg);
    console.log(prediction);

    res.status(200).send({ prediction });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
