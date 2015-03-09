var _ = require( 'lodash');
var fs = require('fs');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var React = require('react');
var routes = require('./routes/index');
var users = require('./routes/users');

var Dispatcher = require( './dispatcher/Dispatcher');
var ActionTypes = require( './constants/ActionTypes');
var AppStore = require( './stores/AppStore');


var server = express();
server.use(express.static(path.join(__dirname)));

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
server.use(logger('dev'));
//server.use(bodyParser.json());
//server.use(bodyParser.urlencoded({ extended: false }));
//server.use(cookieParser());


//server.use('/', routes);
//server.use('/users', users);

// catch 404 and forward to error handler

server.get('/api/page/*', function(req, res) {
    var urlPath = req.path.substr(9);
    var page = AppStore.getPage(urlPath);
    res.send(page);
});

//
// Server-side rendering
// -----------------------------------------------------------------------------

// The top-level React component + HTML template for it
var App = React.createFactory(require('./components/App'));
//var App = React.createFactory(require('./routes/reactRoute'));
var templateFile = path.join(__dirname, 'templates/index.html');
var template = _.template(fs.readFileSync(templateFile, 'utf8'));



server.get('*', function(req, res) {
    var data = {description: ''};
    var app = new App({
        path: req.path,
        onSetTitle: function(title) { data.title = title;},
        onSetMeta: function(name, content) { data[name] = content; },
        onPageNotFound: function() { res.status(404); }
    });

    data.body = React.renderToString(app);
    var html = template(data);
    res.send(html);

});


// Load pages from the `/fakeDB/pages` folder into the AppStore
(function() {
    var assign = require('react/lib/Object.assign');
    var sourcePages = require('./fakeDB/pages');
    var getPages = function() {
        var pages = [];
        for(var i in sourcePages) {
            var attr = sourcePages[i];
            var page = assign({}, {path: attr.path, body: attr.body}, attr.attributes);
            Dispatcher.handleServerAction({
                actionType: ActionTypes.LOAD_PAGE,
                path: attr.path,
                page: page
            });
        }
        return pages;
    };
    return getPages(sourcePages);
})();


// error handlers

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


module.exports = server;
