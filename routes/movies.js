const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getMovie, createMovie, deleteMovie } = require('../controllers/movies');

router.get('/', getMovie);
router.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      country: Joi.string().required().min(3).max(74),
      director: Joi.string().required().min(2).max(30),
      duration: Joi.number().required(),
      year: Joi.string().required(),
      description: Joi.string().required(),
      image: Joi.string()
        .required()
        .regex(
          /^((http|https):\/\/)(www\.)?([\w\W\d]{1,})(\.)([A-Za-z]{1,10})([\w\W\d]{1,})?$/,
        ),
      trailerLink: Joi.string()
        .required()
        .regex(
          /^((http|https):\/\/)(www\.)?([\w\W\d]{1,})(\.)([A-Za-z]{1,10})([\w\W\d]{1,})?$/,
        ),
      thumbnail: Joi.string()
        .required()
        .regex(
          /^((http|https):\/\/)(www\.)?([\w\W\d]{1,})(\.)([A-Za-z]{1,10})([\w\W\d]{1,})?$/,
        ),
      movieId: Joi.number().required(),
      nameRU: Joi.string().required(),
      nameEN: Joi.string().required(),
    }),
  }),
  createMovie,
);
router.delete(
  '/:movieId',
  celebrate({
    params: Joi.object().keys({
      movieId: Joi.string().hex().length(24),
    }),
  }),
  deleteMovie,
);

module.exports = router;
