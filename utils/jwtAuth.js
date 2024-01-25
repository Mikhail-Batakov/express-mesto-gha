const jwt = require('jsonwebtoken');

const SECRET_KEY = 'super_secret';

const chekToken = (token) => jwt.verify(token, SECRET_KEY);

const signToken = (user) => jwt.sign({ _id: user._id }, SECRET_KEY, { expiresIn: '7d' });

module.exports = {
  chekToken,
  signToken,
};
