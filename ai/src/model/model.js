const path = require("path");
const fs = require("fs");
const tf = require("@tensorflow/tfjs-node");

const modelPath = path.resolve(__dirname, "./model.json");
const labelsPath = path.resolve(__dirname, "./labels.json");

class RecongizerModel {
  static instance;
  model;
  labels;

  constructor() {
    if (RecongizerModel.instance) {
      throw new Error(
        "SingletonClass already has an instance. Use getInstance() to get the existing instance."
      );
    }
  }

  async init() {
    if (!this.model) {
      this.model = await tf.loadLayersModel(`file://${modelPath}`);
      console.log("model loaded");
    }
    if (!this.labels) {
      this.labels = JSON.parse(fs.readFileSync(labelsPath, "utf8"));
      console.log("labels loaded");
    }
  }

  async predict(base64StringImg) {
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
    const predictions = this.model.predict(preprocessedImageTensor);

    // Get the index of the predicted label with the highest probability
    const topLabelIndex = tf.argMax(predictions, 1).dataSync()[0];
    const topLabelName = this.labels[topLabelIndex];

    return topLabelName;
  }

  // Public static method to get the instance of the class
  static async getInstance() {
    if (!RecongizerModel.instance) {
      RecongizerModel.instance = new RecongizerModel();
      await RecongizerModel.instance.init();
    }
    return RecongizerModel.instance;
  }
}

module.exports = RecongizerModel;
