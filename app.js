/* eslint-disable no-unused-vars */
const bodyParser = require('body-parser');
const helmet = require('helmet');
const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes');
const errorHandler = require('./middlewares/errorHandler');

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/testdb' } = process.env; // поправить

mongoose.connect(DB_URL, {
  // useNewUrlParser: true,
  // useUnifiedTopology: true,
});

const app = express();
app.use(helmet());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {

    _id: '65b013385a589bb8559d8837',

  };

  next();
});

app.use(router);

app.use(errorHandler);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Приложение слушает порт: ${PORT}`);
});
