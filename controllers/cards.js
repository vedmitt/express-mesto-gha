const Card = require('../models/card');
const { ValidationError, NotExistError, DefaultError } = require('./errors');

const VALIDATION_ERROR = new ValidationError('Переданы некорректные данные');
const NOT_EXIST_ERROR = new NotExistError('Карточка с указанным _id не найдена');
const DEFAULT_ERROR = new DefaultError();

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(DEFAULT_ERROR.statusCode).send({ message: DEFAULT_ERROR.message }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === VALIDATION_ERROR.name) {
        res.status(VALIDATION_ERROR.statusCode).send({ message: VALIDATION_ERROR.message });
        return;
      }
      res.status(DEFAULT_ERROR.statusCode).send({ message: DEFAULT_ERROR.message });
    });
};

module.exports.removeCardById = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        res.status(NOT_EXIST_ERROR.statusCode).send({ message: NOT_EXIST_ERROR.message });
        return;
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(VALIDATION_ERROR.statusCode).send({ message: VALIDATION_ERROR.message });
        return;
      }
      res.status(DEFAULT_ERROR.statusCode).send({ message: DEFAULT_ERROR.message });
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(NOT_EXIST_ERROR.statusCode).send({ message: NOT_EXIST_ERROR.message });
        return;
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(VALIDATION_ERROR.statusCode).send({ message: VALIDATION_ERROR.message });
        return;
      }
      res.status(DEFAULT_ERROR.statusCode).send({ message: DEFAULT_ERROR.message });
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(NOT_EXIST_ERROR.statusCode).send({ message: NOT_EXIST_ERROR.message });
        return;
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(VALIDATION_ERROR.statusCode).send({ message: VALIDATION_ERROR.message });
        return;
      }
      res.status(DEFAULT_ERROR.statusCode).send({ message: DEFAULT_ERROR.message });
    });
};
