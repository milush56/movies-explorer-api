const router = require('express').Router();
const NotFoundError = require('../errors/not-found-err');
const auth = require('../middlewares/auth');

router.use('/', require('./registration'));

router.use(auth);

router.use('/users', require('./users'));
router.use('/movies', require('./movies'));

router.use('*', () => {
  throw new NotFoundError('Страница не найдена');
});

module.exports = router;
