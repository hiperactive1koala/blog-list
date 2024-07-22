/* eslint-disable no-underscore-dangle */
/* eslint-disable import/no-extraneous-dependencies */
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const loginRouter = require('express').Router();
const User = require('../models/user');

// eslint-disable-next-line consistent-return
loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body;

  const user = await User.findOne({ username });

  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash);

  if (!(user && passwordCorrect)) {
    return response
      .status(401)
      .json({ error: 'Invalid username or password ' });
  }

  const userToken = {
    username: user.username,
    id: user._id,
  };
  const token = jwt.sign(userToken, process.env.SECRET);
  response
    .status(200)
    .send({
      token, username: user.username, name: user.name, id: user.id,
    });
});

module.exports = loginRouter;
