const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const {
  NotFoundError,
  ConflictError,
} = require('../errors/errors');

const CREATED_CODE = 201;

module.exports.createUser = (req, res, next) => {
  const {
    email,
    password,
    name,
    about,
    avatar,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
      about,
      avatar,
    }))
    .then((user) => {
      res.status(CREATED_CODE).send(user);
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError('Данный email уже зарегистрирован'));
      }
      next();
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      res
        .cookie('jwt', jwt.sign({ _id: user._id }, 'super-strong-secret', { expiresIn: '7d' }), {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
        })
        .end(); // если у ответа нет тела, можно использовать метод end
    })
    .catch(next);
};

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(new NotFoundError('Пользователь по указанному id не найден'))
    .then((user) => {
      res.send({ data: user });
    })
    .catch(next);
};

module.exports.updateUserInfo = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(new NotFoundError('Пользователь по указанному id не найден'))
    .then((user) => {
      res.send({ data: user });
    })
    .catch(next);
};

module.exports.updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(new NotFoundError('Пользователь по указанному id не найден'))
    .then((user) => {
      res.send({ data: user });
    })
    .catch(next);
};
