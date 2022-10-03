const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

const { getMovie, createMovie, deleteMovie } = require('../controllers/movies');

router.get('/', getMovie);
router.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      country: Joi.string().required().min(2).max(500),
      director: Joi.string().required().min(2).max(500),
      duration: Joi.number().required(),
      year: Joi.string().required(),
      description: Joi.string().required(),
      image: Joi.string()
        .required()
        .custom((value, helpers) => {
          if (validator.isURL(value)) {
            return value;
          }
          return helpers.message('Ссылка на image некорректна');
        }),
      trailerLink: Joi.string()
        .required()
        .custom((value, helpers) => {
          if (validator.isURL(value)) {
            return value;
          }
          return helpers.message('Ссылка на image некорректна');
        }),
      thumbnail: Joi.string()
        .required()
        .custom((value, helpers) => {
          if (validator.isURL(value)) {
            return value;
          }
          return helpers.message('Ссылка на image некорректна');
        }),
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
