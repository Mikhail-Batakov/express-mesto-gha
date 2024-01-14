const router = require('express').Router();
const {
  getUsers, getUserById, createUser, updateProfile, updateAvatar,
} = require('../controllers/users');

// Получение списка всех пользователей
router.get('/', getUsers);

// Получение пользователя по идентификатору
router.get('/:userId', getUserById);

// Создание нового пользователя
router.post('/', createUser);

// Обновление профиля текущего пользователя
router.patch('/me', updateProfile);

// Обновление аватара текущего пользователя
router.patch('/me/avatar', updateAvatar);

module.exports = router;
