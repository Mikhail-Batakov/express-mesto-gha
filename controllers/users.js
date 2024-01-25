const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const {
  StatusCodes,
} = require('http-status-codes');

const userModel = require('../models/user');

const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');
const { signToken } = require('../utils/jwtAuth');

const SALT_ROUNDS = 10;

const getUsers = (req, res, next) => {
  userModel
    .find({})
    .then((users) => {
      res.status(StatusCodes.OK).send(users);
    })
    .catch(next);
};

const getUserInfo = (req, res, next) => {
  userModel
    .findById(req.user._id)
    .orFail()
    .then((user) => {
      res.status(StatusCodes.OK).send(user);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        next(new NotFoundError('Пользователь по указанному id не найден'));
      } else {
        next(err);
      }
    });
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
/// /////////////////////////////////////////////////
const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, SALT_ROUNDS)
    .then((hash) => {
      userModel
        .create({
          name, about, avatar, email, password: hash,
        })
        .then((user) => res.status(StatusCodes.CREATED).send({
          name: user.name,
          about: user.about,
          avatar: user.avatar,
          email: user.email,
          _id: user._id,
        }))
        .catch((err) => {
          // console.log(err);
          // eslint-disable-next-line max-len
          if (err instanceof mongoose.Error.CastError || err instanceof mongoose.Error.ValidationError) {
            next(new BadRequestError(`Отправлены некорректные данные при создании пользователя: ${err.message}`));
          } else if (err.code === 11000) {
            next(new ConflictError('Пользователь с таким email уже зарегистрирован'));
          } else {
            next(err);
          }
        });
    })
    .catch(next);
};
/// /////////////////////////////////////////////////////////////////
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

const login = (req, res, next) => {
  const { email, password } = req.body;

  return userModel.findUserByCredentials(email, password)
    .then((user) => {
      // создадим токен
      const token = signToken(user); // изменить

      // const token = jwt.sign({ _id: user._id }, 'JWT_SECRET', { expiresIn: '7d' });

      // вернём токен
      res.status(StatusCodes.OK).send({ token });
    })
    .catch((err) => {
      // console.log(err);
      next(err);
    });
};

module.exports = {
  getUsers,
  getUserInfo,
  getUserById,
  createUser,
  updateProfile,
  updateAvatar,
  login,

};
