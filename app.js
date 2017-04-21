const env = require('dotenv').config()
const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const moongose = require('mongoose');
const winston = require('winston');
const passport = require('passport');
const fileUpload = require('express-fileupload');
const flash = require('connect-flash');
const session = require('express-session');
const expressHandlebars = require('express-handlebars');
const handlebars = expressHandlebars.create({
  layoutsDir: __dirname + '/views/layouts',
  partialsDir: __dirname + '/views/partials',
  defaultLayout: 'main.handlebars'
});

var index = require('./routes/index');
var logs = require('./routes/logs');
var users = require('./routes/users');
var logsApi = require('./routes/logs-api');

var app = express();

// db setup
moongose.connect(process.env.MONGODB_URI);

// winston setup
winston.level = process.env.LOG_LEVEL || 'error';

// view engine setup
app.engine('handlebars', handlebars.engine);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(morgan('dev'));
app.use(fileUpload());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({limit: '20mb', extended: true}));
app.use(cookieParser());
app.use('/public', express.static('public'));

// auth
app.use(session({resave: false, saveUninitialized: false, secret: process.env.PASSPORT_SECRET || 'publicKey'}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// routes
app.use('/', index);
app.use('/users', users);
app.use('/logs', logs);
app.use('/api/logs', logsApi);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
