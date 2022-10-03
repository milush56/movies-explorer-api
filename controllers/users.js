const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
require('dotenv').config();
const NotFoundError = require('../errors/not-found-err');
const ConflictError = require('../errors/conflict');
const BadRequestError = require('../errors/badrequest');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден.');
      }
      res.send(user);
    })
    .catch(next);
};

module.exports.newUser = (req, res, next) => {
  const { name, email } = req.body;

  User.findOne({ email })
    .then(() => {
      User.findByIdAndUpdate(
        req.user._id,
        { name, email },
        { new: true, runValidators: true, upsert: false },
      );
    })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по указанному _id не найден.');
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(
          new BadRequestError(
            'Переданы некорректные данные при создании пользователя',
          ),
        );
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден.');
      }
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );

      res.send({ token });
    })
    .catch(() => {
      throw new BadRequestError('Неправильные почта или пароль');
    });
};

module.exports.createUser = (req, res, next) => {
  const { name, email, password } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    })
      .then((user) => {
        const newUser = user.toObject();
        delete newUser.password;
        res.send(newUser);
      })
      .catch((err) => {
        if (err.name === 'ValidationError') {
          throw new BadRequestError(
            'Переданы некорректные данные при создании пользователя',
          );
        }
        if (err.code === 11000) {
          throw new ConflictError(
            'Пользователь с указанным email уже существует',
          );
        }
        return next(err);
      }))
    .catch(next);
};
