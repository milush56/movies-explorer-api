require('dotenv').config();
const express = require('express');

const {
  NODE_ENV, PORT = 3000, BASE_PATH, MONGO_ENV,
} = process.env;
const mongoose = require('mongoose');

const app = express();
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const helmet = require('helmet');
const corps = require('./middlewares/corps');
const apiRequestLimiter = require('./middlewares/limit');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const router = require('./routes');
const mongoUrl = require('./utils/utils');

app.use(helmet());
app.use(requestLogger);
app.use(apiRequestLimiter);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(NODE_ENV === 'production' ? MONGO_ENV : mongoUrl, {
  useNewUrlParser: true,
});

app.use(corps);

app.use(router);

app.use(errorLogger);

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({
    message: statusCode === 500 ? 'На сервере произошла ошибка' : message,
  });
  next();
});

app.listen(PORT, () => {
  console.log('Ссылка на сервер');
  console.log(BASE_PATH);
});
