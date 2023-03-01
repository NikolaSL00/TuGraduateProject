const express = require("express");
const router = express.Router();

const userController = require("./controllers/userController");
const serverController = require("./controllers/serverController");
// const topicController = require("./controllers/topicController");
// const profileController = require("./controllers/profileController");
// const quizController = require("./controllers/quizController");

router.use("/auth", userController);
router.use("/server", serverController);

module.exports = router;
