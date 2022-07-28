require('dotenv').config();
const express = require('express');

const { PORT = 3000, BASE_PATH } = process.env;
const mongoose = require('mongoose');

const app = express();
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
/* const apiRequestLimiter = require('./middlewares/limit'); */
const rateLimit = require('express-rate-limit');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const router = require('./routes');

const apiRequestLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 5,
});
app.use(apiRequestLimiter);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/moviesdb', {
  useNewUrlParser: true,
});

app.use(requestLogger);

app.use(router);

app.use(errorLogger);

app.use(errors());

app.use((err, req, res) => {
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({
    message: statusCode === 500 ? 'На сервере произошла ошибка' : message,
  });
});

app.listen(PORT, () => {
  console.log('Ссылка на сервер');
  console.log(BASE_PATH);
});
