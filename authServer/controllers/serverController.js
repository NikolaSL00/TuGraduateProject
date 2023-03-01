const router = require("express").Router();

const serverService = require("../services/serverService");
const { getErrorMessage } = require("../utils/errorHelpers");
const { TOKEN_NAME } = require("../config/constants");

router.post("/login", async (req, res) => {
  const { serverName, password } = req.body;

  try {
    const server = await serverService.login(serverName, password);
    const jwServerToken = await serverService.createServerToken(server);

    return res.status(200).json({ [TOKEN_NAME]: jwServerToken });
  } catch (error) {
    return res.status(400).send({ error: getErrorMessage(error) });
  }
});

// router.post("/register", async (req, res) => {
//   console.log(req.body);
//   const { serverName, password } = req.body;

//   try {
//     const createdUser = await serverService.create({
//       serverName,
//       password,
//     });
//     // const jwUserToken = await authService.createUserToken(createdUser);

//     return res.status(201).send();
//   } catch (error) {
//     // mongoose error
//     return res.status(400).send({ error: getErrorMessage(error) });
//   }
// });

module.exports = router;
