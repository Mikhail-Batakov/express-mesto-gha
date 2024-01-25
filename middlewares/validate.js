const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

// Объект с функциями валидации для использования с Joi
const validationFunctions = {
  // Функция валидации URL
  isUrl: (value, helpers) => {
    if (!validator.isURL(value)) {
      return helpers.message('Некорректный формат URL');
    }
    return value;
  },

  // Функция валидации email
  isEmail: (value, helpers) => {
    if (!validator.isEmail(value)) {
      return helpers.message('Некорректный формат email адреса');
    }
    return value;
  },
};

const {
  isUrl,
  isEmail,
} = validationFunctions;

// Схема валидации для регистрации
const validateSignUp = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().custom(isUrl),
    email: Joi.string().required().custom(isEmail),
    password: Joi.string().min(4).required(),
  }),
});

// Схема валидации для входа
const validateSignIn = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().custom(isEmail),
    password: Joi.string().min(4).required(),
  }),
});

// Схема валидации для обновления профиля
const validateUpdateProfile = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
});

// Схема валидации для обновления аватара
const validateUpdateAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().custom(isUrl),
  }),
});

// Схема валидации для получения пользователя по ID
const validategetUserById = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex().required(),
  }),
});

// Схема валидации для создания карточки
const validateCreateCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().custom(isUrl),
  }),
});

// Схема валидации для удаления карточки по ID, постановки / снятия лайка
const validategetCardById = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required(),
  }),
});

// Экспорт схем валидации
module.exports = {
  validateSignUp,
  validateSignIn,
  validategetUserById,
  validateUpdateProfile,
  validateUpdateAvatar,
  validateCreateCard,
  validategetCardById,
};
