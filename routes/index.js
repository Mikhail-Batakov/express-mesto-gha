const router = require('express').Router();
const userRouter = require('./users');
const cardRouter = require('./cards');
const { createUser, login } = require('../controllers/users');
const auth = require('../middlewares/auth');
const { validateSignUp, validateSignIn } = require('../middlewares/validate');
const NotFoundError = require('../errors/NotFoundError');

router.post('/signup', validateSignUp, createUser);
router.post('/signin', validateSignIn, login);

// авторизация
router.use(auth);

router.use('/users', userRouter);
router.use('/cards', cardRouter);

router.use('*', (req, res, next) => {
  next(new NotFoundError('Запрашиваемая страница не найдена'));
});

module.exports = router;
