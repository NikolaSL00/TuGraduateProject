const jwt = require("jsonwebtoken");

const key = "SuperSecretKey$!@";

exports.decrypt = (req, res, next) => {
  const data = req.body.data;

  // TODO: if error and then proceed with the data that is decrypted
  const decodedToken = jwt.verify(data, key, (err, decodedToken) => {
    if (err) {
      console.error(err);
      return res.status(401).send({ error: "Wrong or expired token" });
    }

    console.log(decodedToken);
    next();
  });
};
