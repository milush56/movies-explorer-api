require('dotenv').config();
const jwt = require('jsonwebtoken');
const UnAuthError = require('../errors/unauthorized');
const BISSecret = require('../utils/utils');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnAuthError('Необходима авторизация');
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : BISSecret);
  } catch (err) {
    throw new UnAuthError('Необходима авторизация');
  }

  req.user = payload;
  next();
};
