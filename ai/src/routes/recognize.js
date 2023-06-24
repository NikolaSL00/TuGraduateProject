const express = require("express");
const tf = require("@tensorflow/tfjs-node");
const path = require("path");
const { BadRequestError, requireAuth } = require("@shopsmart/common");
const router = express.Router();
const fs = require("fs");
const multer = require("multer");

// Set up multer to handle multipart/form-data
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

//, requireAuth ,
router.post("/recognize", upload.single("image"), async (req, res) => {
  try {
    // Access the base64 img string
    const base64StringImg = req.body.blob;

    console.log("hi");

    const modelPath = path.resolve(__dirname, "../model/model.json");
    const model = await tf.loadLayersModel(`file://${modelPath}`);
    // Load the labels from a JSON file
    const labelsPath = path.resolve(__dirname, "../model/labels.json");
    const labels = JSON.parse(fs.readFileSync(labelsPath, "utf8"));

    // Read the image buffer
    const imageBuffer = Buffer.from(base64StringImg, "base64");

    // Load the image using TensorFlow.js
    const imageTensor = tf.node.decodeImage(imageBuffer);

    // Resize the image to match the target size
    const resizedImageTensor = tf.image.resizeBilinear(imageTensor, [299, 299]);

    // Convert the tensor to a float32 data type and normalize the values
    const normalizedImageTensor = resizedImageTensor.toFloat().div(255);

    // Add an extra dimension to match the model's input shape
    const preprocessedImageTensor = normalizedImageTensor.expandDims(0);

    // Preprocess and make predictions with the preprocessed image tensor
    const predictions = model.predict(preprocessedImageTensor);

    // Get the index of the predicted label with the highest probability
    const topLabelIndex = tf.argMax(predictions, 1).dataSync()[0];
    const topLabelName = labels[topLabelIndex];
    console.log(topLabelName);

    res.status(200).send({ prediction: topLabelName });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
