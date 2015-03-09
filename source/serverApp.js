var express = require('express');
var path = require('path');
var database = require('./dbMagic/dbInit.js');
var config = require('./config/config.js')();
//var favicon = require('serve-favicon');
var logger = require('morgan');
var React = require('react');
var expressSession = require('express-session');
var MongoStore = require('connect-mongo')(expressSession);

var server = express();
server.use(express.static(path.join(__dirname)));
server.use(expressSession({
    // Set up MongoDB session storage
    store: new MongoStore({url:config.mongo.host+config.mongo.port+config.mongo.dbName}),
    // Set session to expire after 21 days
    cookie: { maxAge: new Date(Date.now() + 181440000)},
    // Get session secret from config file
    secret: config.mongo.cookie_secret,
    resave: false,
    saveUninitialized: true
}));
// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
server.use(logger('dev'));

//use router

require('./routes/reactRoute')(server);
// error handlers
console.log('Connecting to database...');
database.startup(config.mongo.host+config.mongo.port+config.mongo.dbName);

// development error handler
// will print stacktrace
if (server.get('env') === 'development') {
    server.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
server.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});
console.log('React Skeleton' + ' listening on port ' + config.port + ' in mode ' + config.mode);


module.exports = server;
