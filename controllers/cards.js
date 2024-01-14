const mongoose = require('mongoose');
const cardModel = require('../models/card');

const getCards = (req, res) => {
  cardModel
    .find({})
    .populate(['owner', 'likes'])
    .then((cards) => {
      res.send(cards);
    })
    .catch((err) => {
      res.status(500).send({
        message: 'На сервере произошла ошибка',
        err: err.message,
        stack: err.stack,
      });
    });
};

const createCard = (req, res) => {
  cardModel
    .create({
      owner: req.user._id,
      ...req.body,
    })
    .then((card) => {
      // Используйте findById для поиска созданной карточки и затем выполните populate
      cardModel
        .findById(card._id)
        .populate('owner')
        .then((data) => {
          res.status(201).send(data);
        })
        .catch(() => {
          // Если карточка с указанным id не найдена, отправьте статус 404
          res.status(404).send({
            message: 'Карточка по данному id не найдена',
          });
        });
    })
    .catch((err) => {
      // Обработка ошибок при создании карточки
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: err.message });
      } else {
        res.status(500).send({
          message: 'На сервере произошла ошибка',
          err: err.message,
          stack: err.stack,
        });
      }
    });
};

// eslint-disable-next-line consistent-return
const delCardById = (req, res) => {
  const { cardId } = req.params;
  // Проверка на корректность формата идентификатора карточки
  if (!mongoose.isValidObjectId(cardId)) {
    return res.status(400).send({
      message: 'Неверный формат id карточки',
    });
  }
  cardModel
    .findByIdAndDelete(cardId)
    .then((card) => {
      if (!card) {
        // Если карточка с заданным идентификатором не найдена
        return res.status(404).send({
          message: 'Карточка по данному id не найдена',
        });
      }

      // Возвращаем сообщение об успешном удалении
      return res.send({
        message: 'Карточка успешно удалена',
      });
    })
    .catch((err) => {
      // Обработка ошибок
      res.status(500).send({
        message: 'На сервере произошла ошибка',
        err: err.message,
        stack: err.stack,
      });
    });
};

// eslint-disable-next-line consistent-return
const likeCard = (req, res) => {
  const { cardId } = req.params;
  // Проверка на корректность формата идентификатора карточки
  if (!mongoose.isValidObjectId(cardId)) {
    return res.status(400).send({
      message: 'Неверный формат id карточки',
    });
  }
  cardModel
    .findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
      { new: true },
    )
    .populate(['owner', 'likes'])
    .then((card) => {
      if (!card) {
        // Если карточка с заданным идентификатором не найдена
        return res.status(404).send({
          message: 'Карточка по данному id не найдена',
        });
      }

      return res.send({ card, message: 'Лайк поставлен' });
    })
    .catch(() => {
      res.status(404).send({
        message: 'Карточка по данному id не найдена',
      });
    });
};

// eslint-disable-next-line consistent-return
const dislikeCard = (req, res) => {
  const { cardId } = req.params;
  // Проверка на корректность формата идентификатора карточки
  if (!mongoose.isValidObjectId(cardId)) {
    return res.status(400).send({
      message: 'Неверный формат id карточки',
    });
  }
  cardModel
    .findByIdAndUpdate(
      cardId,
      { $pull: { likes: req.user._id } }, // убрать _id из массива
      { new: true },
    )
    .populate(['owner', 'likes'])
    .then((card) => {
      if (!card) {
        // Если карточка с заданным идентификатором не найдена
        return res.status(404).send({
          message: 'Карточка по данному id не найдена',
        });
      }

      return res.send({ card, message: 'Лайк удален' });
    })
    .catch(() => {
      res.status(404).send({
        message: 'Карточка по данному id не найдена',
      });
    });
};

module.exports = {
  getCards,
  createCard,
  delCardById,
  likeCard,
  dislikeCard,

};
