var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var session = require('express-session');
var flash = require('connect-flash');

var Connection = require('tedious').Connection;
var config = {
  userName: '<username>',
  password: '<password>',
  server: '<Azure SQL Server>.database.windows.net',
  options: {encrypt: true, database: 'AdventureWorksSampleDB', rowCollectionOnRequestCompletion: true}
};

var connection = new Connection(config);
connection.on('connect', function(err){
  if(err)
  {
    console.log('Error while connecting to SQL DB! Error Details: '+err);
  }
  else{
    console.log('Connected to SQL Server: '+config.server);
  }
  
});

var app = express();

var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;

passport.use('local-login',new LocalStrategy({
      usernameField: 'username',
      passwordField: 'password',
      passReqToCallback: true,
      session: true
  },
  function(req, username, password, done){
    request = new Request("SELECT c.FirstName, c.LastName, c.CompanyName, c.EmailAddress AS username, c.PasswordHash, c.PasswordSalt FROM SalesLT.Customer AS c WHERE c.EmailAddress=@user_name;", function(err, rowCount, rows){
      if(err){
        return done(err);
      }
      if(rowCount===0){
         return done(null, false, {message: 'Invalid Username or Password'});
      }
      return done(null, rows[0]);
          });
          request.addParameter('user_name', TYPES.NVarChar, username);
          connection.execSql(request);
           //Not checking for password correction since this is a sample. You can extend this application to check for password as well. The SQL query returns the password.
}));



passport.serializeUser(function(user, done) {
  done(null, user[3].value);
});

passport.deserializeUser(function(username, done) {
  request = new Request("SELECT c.FirstName, c.LastName, c.CompanyName, c.EmailAddress AS username, c.PasswordHash, c.PasswordSalt FROM SalesLT.Customer AS c WHERE c.EmailAddress=@user_name;", function(err, rowCount, rows){
           if(err){
             return done(err);
           }
          if(rowCount===0){
            return done(null, false, {message:'User not found'});
           }
           done(null, rows[0]);
          });
          request.addParameter('user_name', TYPES.NVarChar, username);
          connection.execSql(request);
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));


app.use(session({
  secret: 'pbiesampleappsecret',
  key: 'sid',
  cookie: { secure: false },
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use('/', index);

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

module.exports = app;
