const jwt = require('jsonwebtoken');

const handleAuthError = (res) => {
  res
    .status(401)
    .send({ message: 'Необходима авторизация' });
};

// const extractBearerToken = (header) => header.replace('Bearer ', '');

module.exports = (req, res, next) => {
  // const { authorization } = req.headers;
  // console.log(authorization);
  // console.log(req.cookies.jwt); // достаём токен

  // if (!authorization || !authorization.startsWith('Bearer ')) {
  //   return handleAuthError(res);
  // }

  // const token = extractBearerToken(authorization);
  const token = req.cookies.jwt;
  let payload;

  try {
    payload = jwt.verify(token, 'super-strong-secret');
  } catch (err) {
    return handleAuthError(res);
  }
  console.log(payload);
  req.user = payload;

  next();
};
