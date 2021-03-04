const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

// dictates routes for the app
const booksRouter = require('./routes/books');

const app = express();

// Import sequelize instance from models/index.js
const { sequelize } = require('./models');

(async () => {

  // Sync model with database
  await sequelize.sync({ force: true });

  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', booksRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  error.message = "Whoops, page not found.";
  console.log(`${error.message} Error status: ${error.status}`);
  next(error);
  // next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // // set locals, only providing error in development
  // res.locals.message = err.message;
  // res.locals.error = req.app.get('env') === 'development' ? err : {};

  // // render the error page
  // res.status(err.status || 500);
  // res.render('error');
  res.locals.error = err;
  res.status(err.status);

  if (err.status === 404) {
    res.status(404).render("page-not-found", { err });
  } else {
    err.status = 500;
    err.message = err.message || "Whoops, internal server error.";
    res.status(500).render("error", err);
    console.log(`${err.message} Error status: ${err.status}`);
  }
});

module.exports = app;
