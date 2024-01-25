const router = require('express').Router();
const {
  getCards, createCard, delCardById, likeCard, dislikeCard,
} = require('../controllers/cards');
const { validateCreateCard, validategetCardById } = require('../middlewares/validate');

router.get('/', getCards);

router.post('/', validateCreateCard, createCard);

router.delete('/:cardId', validategetCardById, delCardById);
router.put('/:cardId/likes', validategetCardById, likeCard);
router.delete('/:cardId/likes', validategetCardById, dislikeCard);

module.exports = router;
