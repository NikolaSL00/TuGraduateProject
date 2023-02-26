const router = require("express").Router();
// const { isAuth } = require("../middlewares/authMiddleware");
const storeService = require("../services/storeService");
const productService = require("../services/productService");

const { getErrorMessage } = require("../utils/errorHelpers");

router.post("/", async (req, res) => {
  const { email } = req.body;

  try {
    console.log(req.body);
  } catch (error) {
    console.log(getErrorMessage(error));
    // mongoose error
    // return res.status(400).send({ error: getErrorMessage(error) });
  }
});

module.exports = router;
