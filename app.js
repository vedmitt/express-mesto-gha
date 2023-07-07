const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const { PORT = 3000 } = process.env;

const app = express();

app.use(express.json());

// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  //   useCreateIndex: true,
  //   useFindAndModify: false
});

// подключаем мидлвары, роуты и всё остальное...
app.use((req, res, next) => {
  req.user = {
    _id: '64a80ccb8a22ffacc8a90d39',
  };

  next();
});

app.use(express.static(path.join(__dirname, 'public')));
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use((req, res) => {
  res.status(404).json({
    message: 'Страница не найдена :)',
  });
});

app.listen(PORT);
