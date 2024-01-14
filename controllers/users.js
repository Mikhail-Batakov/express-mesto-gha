const mongoose = require('mongoose');
const userModel = require('../models/user');

const getUsers = (req, res) => {
  userModel
    .find({})
    .then((users) => {
      res.send(users);
    })
    .catch((err) => {
      res.status(500).send({
        message: 'На сервере произошла ошибка',
        err: err.message,
        stack: err.stack,
      });
    });
};

// eslint-disable-next-line consistent-return
const getUserById = (req, res) => {
  const { userId } = req.params;

  // Проверка на корректность формата идентификатора пользователя
  if (!mongoose.isValidObjectId(userId)) {
    return res.status(400).send({
      message: 'Неверный формат id пользователя',
    });
  }

  userModel
    .findById(userId)
    .then((user) => {
      if (!user) {
        // Если пользователь с заданным идентификатором не найден
        return res.status(404).send({
          message: 'Пользователь по данному id не найден',
        });
      }

      return res.send(user); // Явно возвращаем res.send(user)
    })
    .catch((err) => {
      res.status(500).send({
        message: 'На сервере произошла ошибка',
        err: err.message,
        stack: err.stack,
      });
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  userModel
    .create({ name, about, avatar })
    .then((user) => {
      res.status(201).send(user);
    })
    .catch((err) => {
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

const updateProfile = (req, res) => {
  const { name, about } = req.body;
  if (req.user._id) {
    userModel
      .findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
      .then((user) => {
        res.send(user);
      })
      .catch((err) => {
        if (err.name === 'ValidationError') {
          res.status(400).send({ message: err.message });
        } else {
          res.status(404).send({
            message: 'Пользователь по данному id не найден',
          });
        }
      });
  } else {
    res.status(500).send({
      message: 'На сервере произошла ошибка',
    });
  }
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  if (req.user._id) {
    userModel
      .findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
      .then((user) => {
        res.send(user);
      })
      .catch((err) => {
        if (err.name === 'ValidationError') {
          res.status(400).send({ message: err.message });
        } else {
          res.status(404).send({
            message: 'Пользователь по данному id не найден',
          });
        }
      });
  } else {
    res.status(500).send({
      message: 'На сервере произошла ошибка',
    });
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateProfile,
  updateAvatar,

};
