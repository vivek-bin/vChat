var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var localStrategy = require('passport-local').strategy;
var session = require('express-session');
var io = require('socket.io');
var bcrypt = require('bcrypt');
var mongoose = require('mongoose');
var models = require('./models/models.js');
mongoose.connect('mongodb://user:password@ds147681.mlab.com:47681/vchat');

var index = require('./routes/index');
var users = require('./routes/users')(passport);
var api = require('./routes/api');
var viewRender = require('./routes/view-render');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(session({ secret: 'hmmmm' , cookie: { expires: 14*24*60*60*1000 }}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport-config.js')(passport);

app.use('/', index);
app.use('/users', users);
app.use('/api',api);
app.use('/views',viewRender);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

var server = io(app.listen(8081));
require('./config/socket-config.js')(server);

module.exports = app;
