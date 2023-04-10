const router = require("express").Router();
const { decrypt } = require("../middlewares/decryptMiddlware");
const storeService = require("../services/storeService");
const productService = require("../services/productService");

const { getErrorMessage } = require("../../mainServer/utils/errorHelpers");

router.post("/", decrypt, async (req, res) => {});

module.exports = router;
