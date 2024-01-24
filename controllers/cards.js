const mongoose = require('mongoose');
const {
  StatusCodes,
} = require('http-status-codes');
const cardModel = require('../models/card');

const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');

const getCards = (req, res, next) => {
  cardModel
    .find({})
    .populate(['owner', 'likes'])
    .then((cards) => {
      res.status(StatusCodes.OK).send(cards);
    })
    .catch(next);
};

const createCard = (req, res, next) => {
  cardModel
    .create({
      owner: req.user._id,
      ...req.body,
    })
    .then((card) => {
      // Используйте findById для поиска созданной карточки и затем выполните populate
      cardModel
        .findById(card._id)
        .orFail()
        .populate('owner')
        .then((data) => {
          res.status(StatusCodes.CREATED).send(data);
        })
        .catch((err) => {
          if (err instanceof mongoose.Error.DocumentNotFoundError) {
            next(new NotFoundError('Карточка по указанному id не найдена'));
          } else {
            next(err);
          }
        });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError(`Отправлены некорректные данные при создании карточки: ${err.name}`));
      } else {
        next(err);
      }
    });
};

// eslint-disable-next-line consistent-return
const delCardById = (req, res, next) => {
  const { cardId } = req.params;
  cardModel
    .findByIdAndDelete(cardId)
    .orFail()
    .then(() => {
      res.status(StatusCodes.OK).send({
        message: 'Карточка успешно удалена',
      });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new BadRequestError('Неверный формат id карточки'));
      } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
        next(new NotFoundError('Карточка по указанному id не найдена'));
      } else {
        next(err);
      }
    });
};

// eslint-disable-next-line consistent-return
const likeCard = (req, res, next) => {
  const { cardId } = req.params;
  cardModel
    .findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
      { new: true },
    )
    .orFail()
    .populate(['owner', 'likes'])
    .then((card) => {
      res.status(StatusCodes.OK).send({ card, message: 'Лайк поставлен' });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new BadRequestError('Неверный формат id карточки'));
      } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
        next(new NotFoundError('Карточка по указанному id не найдена'));
      } else {
        next(err);
      }
    });
};

// eslint-disable-next-line consistent-return
const dislikeCard = (req, res, next) => {
  const { cardId } = req.params;
  cardModel
    .findByIdAndUpdate(
      cardId,
      { $pull: { likes: req.user._id } }, // убрать _id из массива
      { new: true },
    )
    .orFail()
    .populate(['owner', 'likes'])
    .then((card) => {
      res.status(StatusCodes.OK).send({ card, message: 'Лайк удален' });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new BadRequestError('Неверный формат id карточки'));
      } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
        next(new NotFoundError('Карточка по указанному id не найдена'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getCards,
  createCard,
  delCardById,
  likeCard,
  dislikeCard,

};
