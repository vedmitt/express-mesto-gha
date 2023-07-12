const jwt = require('jsonwebtoken');

const UnauthorizedError = require('../errors/unauthorized-err');

const handleAuthError = (next) => {
  next(new UnauthorizedError('Необходима авторизация'));
};

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    return handleAuthError(next);
  }
  let payload;
  try {
    payload = jwt.verify(token, 'super-strong-secret');
  } catch (err) {
    return handleAuthError();
  }
  req.user = payload;
  next();
  return null;
};
