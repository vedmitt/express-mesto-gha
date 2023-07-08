const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const helmet = require('helmet');

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

const app = express();

app.use(helmet());
app.disable('x-powered-by');

app.use(express.json());

// подключаемся к серверу mongo
mongoose.connect(DB_URL, {
  useNewUrlParser: true,
  //   useCreateIndex: true,
  //   useFindAndModify: false
});

// подключаем мидлвары, роуты и всё остальное...
app.use((req, res, next) => {
  req.user = {
    _id: '64a9195d1f57200ccd55800f',
  };

  next();
});

app.use(express.static(path.join(__dirname, 'public')));
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use((req, res) => {
  res.status(404).json({
    message: 'Страница не найдена :(',
  });
});

app.listen(PORT);
