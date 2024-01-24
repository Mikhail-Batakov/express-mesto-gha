const mongoose = require('mongoose');
const {
  StatusCodes,
} = require('http-status-codes');
const userModel = require('../models/user');

const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');

const getUsers = (req, res, next) => {
  userModel
    .find({})
    .then((users) => {
      res.status(StatusCodes.OK).send(users);
    })
    .catch(next);
};

const getUserById = (req, res, next) => {
  const { userId } = req.params;

  userModel
    .findById(userId)
    .orFail()
    .then((user) => {
      res.status(StatusCodes.OK).send(user);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new BadRequestError('Неверный формат id пользователя'));
      } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
        next(new NotFoundError('Пользователь по указанному id не найден'));
      } else {
        next(err);
      }
    });
};

const createUser = (req, res, next) => {
  const { name, about, avatar } = req.body;
  userModel
    .create({ name, about, avatar })
    .then((user) => {
      res.status(StatusCodes.CREATED).send(user);
    })
    .catch((err) => {
      // eslint-disable-next-line max-len
      if (err instanceof mongoose.Error.CastError || err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError(`Отправлены некорректные данные при создании пользователя: ${err.name}`));
      } else {
        next(err);
      }
    });
};

const updateProfile = (req, res, next) => {
  const { name, about } = req.body;

  userModel
    .findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail()
    .then((user) => {
      res.status(StatusCodes.OK).send(user);
    })
    .catch((err) => {
      // eslint-disable-next-line max-len
      if (err instanceof mongoose.Error.CastError || err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError(`Переданы некорректные данные при обновлении профиля: ${err.name}`));
      } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
        next(new NotFoundError('Пользователь по указанному id не найден'));
      } else {
        next(err);
      }
    });
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;

  userModel
    .findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail()
    .then((user) => {
      res.status(StatusCodes.OK).send(user);
    })
    .catch((err) => {
      // eslint-disable-next-line max-len
      if (err instanceof mongoose.Error.CastError || err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError(`Переданы некорректные данные при обновлении аватара: ${err.name}`));
      } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
        next(new NotFoundError('Пользователь по указанному id не найден'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateProfile,
  updateAvatar,

};
