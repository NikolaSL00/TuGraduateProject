const router = require('express').Router();
const authService = require('../services/userService');
const { isGuest, isAuth } = require('../middlewares/authMiddleware');
const { getErrorMessage } = require('../utils/errorHelpers');
const { TOKEN_NAME } = require('../config/constants');

router.post('/login', isGuest, async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await authService.login(email, password);
    const jwUserToken = await authService.createUserToken(user);

    return res.status(200).json({ [TOKEN_NAME]: jwUserToken });
  } catch (error) {
    return res.status(400).send(getErrorMessage(error));
  }
});

router.post('/register', isGuest, async (req, res) => {
  const { password, repeatPassword, ...userData } = req.body;
  if (password !== repeatPassword) {
    return res.status(400).send({ errors: 'Passwords missmatch!' });
  }

  try {
    const createdUser = await authService.create({
      password,
      ...userData,
    });
    const jwUserToken = await authService.createUserToken(createdUser);

    return res.status(201).json({ [TOKEN_NAME]: jwUserToken });
  } catch (error) {
    // mongoose error
    return res.status(400).send(getErrorMessage(error));
  }
});

router.get('/logout', isAuth, (req, res) => {
  // res.clearCookie(COOKIE_SESSION_NAME);
  // invalidate token
  return res.status(204).send();
});

module.exports = router;
