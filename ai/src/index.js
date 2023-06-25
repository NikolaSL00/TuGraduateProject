const app = require("./app");
const RecognizerModel = require("./model/model.js");

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
  }

  await RecognizerModel.getInstance();

  app.listen(3000, () => {
    console.log("Listening on port 3000!!!!!!!!");
  });
};

start();
