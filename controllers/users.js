const User = require('../models/user');
const { ValidationError, NotExistError, DefaultError } = require('../errors/errors');

const CREATED_CODE = 201;
const VALIDATION_ERROR = new ValidationError('Переданы некорректные данные'); // 400
const NOT_EXIST_ERROR = new NotExistError('Пользователь по указанному _id не найден'); // 404
const DEFAULT_ERROR = new DefaultError(); // 500

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(DEFAULT_ERROR.statusCode).send({ message: DEFAULT_ERROR.message }));
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .orFail(NOT_EXIST_ERROR)
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'NotExistError') {
        res.status(NOT_EXIST_ERROR.statusCode).send({ message: NOT_EXIST_ERROR.message });
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
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.status(CREATED_CODE).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(VALIDATION_ERROR.statusCode).send({ message: VALIDATION_ERROR.message });
        return;
      }
      res.status(DEFAULT_ERROR.statusCode).send({ message: DEFAULT_ERROR.message });
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
    .orFail(NOT_EXIST_ERROR)
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'NotExistError') {
        res.status(NOT_EXIST_ERROR.statusCode).send({ message: NOT_EXIST_ERROR.message });
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
    .orFail(NOT_EXIST_ERROR)
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'NotExistError') {
        res.status(NOT_EXIST_ERROR.statusCode).send({ message: NOT_EXIST_ERROR.message });
        return;
      }
      if (err.name === 'ValidationError') {
        res.status(VALIDATION_ERROR.statusCode).send({ message: VALIDATION_ERROR.message });
        return;
      }
      res.status(DEFAULT_ERROR.statusCode).send({ message: DEFAULT_ERROR.message });
    });
};
