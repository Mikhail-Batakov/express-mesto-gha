const router = require('express').Router();
const {
  getUsers, getUserById, updateProfile, updateAvatar, getUserInfo,
} = require('../controllers/users');
const { validategetUserById, validateUpdateProfile, validateUpdateAvatar } = require('../middlewares/validate');

// Получение списка всех пользователей
router.get('/', getUsers);

// Получение информацию о текущем пользователе
router.get('/me', getUserInfo);

// Получение пользователя по идентификатору
router.get('/:userId', validategetUserById, getUserById);

// Создание нового пользователя
// router.post('/', createUser); перенесли в index

// Обновление профиля текущего пользователя
router.patch('/me', validateUpdateProfile, updateProfile);

// Обновление аватара текущего пользователя
router.patch('/me/avatar', validateUpdateAvatar, updateAvatar);

module.exports = router;
