const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const { AuthError, ValidationError, NotFoundError, DefaultError } = require('../errors/errors');

const CREATED_CODE = 201;
const AUTH_ERROR = new AuthError('Необходима авторизация'); // 401
const VALIDATION_ERROR = new ValidationError('Переданы некорректные данные'); // 400
const NOT_FOUND_ERROR = new NotFoundError('Пользователь по указанному id не найден'); // 404
const DEFAULT_ERROR = new DefaultError(); // 500

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(DEFAULT_ERROR.statusCode).send({ message: DEFAULT_ERROR.message }));
};

module.exports.getUserById = (req, res) => {
  User.findById(req.body.id)
    .orFail(NOT_FOUND_ERROR)
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'NotFoundError') {
        res.status(NOT_FOUND_ERROR.statusCode).send({ message: NOT_FOUND_ERROR.message });
        return;
      }
      if (err.name === 'CastError') {
        res.status(VALIDATION_ERROR.statusCode).send({ message: VALIDATION_ERROR.message });
        return;
      }
      res.status(DEFAULT_ERROR.statusCode).send({ message: DEFAULT_ERROR.message });
    });
};

module.exports.createUser = (req, res) => {
  const { email, password, name, about, avatar } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
      about,
      avatar,
    }))
    .then((user) => {
      res.status(CREATED_CODE).send({
        _id: user._id,
        email: user.email,
      });
    })
    .catch(() => {
      res.status(VALIDATION_ERROR.statusCode).send({ message: VALIDATION_ERROR.message });
    });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      res.send({
        token: jwt.sign({ _id: user._id }, 'super-strong-secret', { expiresIn: '7d' }),
      });
    })
    .catch(() => {
      res.status(AUTH_ERROR.statusCode).send({ message: AUTH_ERROR.message });
    });
};

module.exports.updateUserInfo = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(NOT_FOUND_ERROR)
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'NotExistError') {
        res.status(NOT_FOUND_ERROR.statusCode).send({ message: NOT_FOUND_ERROR.message });
        return;
      }
      if (err.name === 'ValidationError') {
        res.status(VALIDATION_ERROR.statusCode).send({ message: VALIDATION_ERROR.message });
        return;
      }
      res.status(DEFAULT_ERROR.statusCode).send({ message: DEFAULT_ERROR.message });
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(NOT_FOUND_ERROR)
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'NotExistError') {
        res.status(NOT_FOUND_ERROR.statusCode).send({ message: NOT_FOUND_ERROR.message });
        return;
      }
      if (err.name === 'ValidationError') {
        res.status(VALIDATION_ERROR.statusCode).send({ message: VALIDATION_ERROR.message });
        return;
      }
      res.status(DEFAULT_ERROR.statusCode).send({ message: DEFAULT_ERROR.message });
    });
};
