const User = require('../models/user');
const { ValidationError, NotExistError, DefaultError } = require('./errors');

const VALIDATION_ERROR = new ValidationError('Переданы некорректные данные');
const NOT_EXIST_ERROR = new NotExistError('Пользователь по указанному _id не найден');
const DEFAULT_ERROR = new DefaultError();

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(DEFAULT_ERROR.statusCode).send({ message: DEFAULT_ERROR.message }));
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        res.status(NOT_EXIST_ERROR.statusCode).send({ message: NOT_EXIST_ERROR.message });
        return;
      }
      res.send({ data: user });
    })
    .catch(() => {
      res.status(DEFAULT_ERROR.statusCode).send({ message: DEFAULT_ERROR.message });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === VALIDATION_ERROR.name) {
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
      upsert: true,
    },
  )
    .then((user) => {
      if (!user) {
        res.status(NOT_EXIST_ERROR.statusCode).send({ message: NOT_EXIST_ERROR.message });
        return;
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === VALIDATION_ERROR.name) {
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
      upsert: true,
    },
  )
    .then((user) => {
      if (!user) {
        res.status(NOT_EXIST_ERROR.statusCode).send({ message: NOT_EXIST_ERROR.message });
        return;
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === VALIDATION_ERROR.name) {
        res.status(VALIDATION_ERROR.statusCode).send({ message: VALIDATION_ERROR.message });
        return;
      }
      res.status(DEFAULT_ERROR.statusCode).send({ message: DEFAULT_ERROR.message });
    });
};
