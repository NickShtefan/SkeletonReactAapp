var _ = require( 'lodash');
var fs = require('fs');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var React = require('react');
//var routes = require('./routes/index');
//var users = require('./routes/users');

var Dispatcher = require( './dispatcher/Dispatcher');
var ActionTypes = require( './constants/ActionTypes');
var AppStore = require( './stores/AppStore');


var server = express();
server.use(express.static(path.join(__dirname)));

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
server.use(logger('dev'));
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: false }));
server.use(cookieParser());


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
var templateFile = path.join(__dirname, 'templates/index.html');
var template = _.template(fs.readFileSync(templateFile, 'utf8'));

//server.set('view engine', 'jade');



server.get('*', function(req, res) {
    var data = {description: ''};
    var app = new App({
        path: req.path,
        onSetTitle: function(title) { data.title = title; },
        onSetMeta: function(name, content) { data[name] = content; },
        onPageNotFound: function() { res.status(404); }
    });

    data.body = React.renderToString(app);
    var html = template(data);

    res.send(html);

});


// Load pages from the `/src/content/` folder into the AppStore
(function() {
    var assign = require('react/lib/Object.assign');
    var fm = require('front-matter');
    var jade = require('jade');
    var sourceDir = path.join(__dirname, './content');
    var getFiles = function(dir) {
        var pages = [];
        fs.readdirSync(dir).forEach(function(file) {
            var stat = fs.statSync(path.join(dir, file));
            if (stat && stat.isDirectory()) {
                pages = pages.concat(getFiles(file));
            } else {
                // Convert the file to a Page object
                var filename = path.join(dir, file);
                var url = filename.
                    substr(sourceDir.length, filename.length - sourceDir.length - 5)
                    .replace('\\', '/');
                if (url.indexOf('/index', url.length - 6) !== -1) {
                    url = url.substr(0, url.length - (url.length > 6 ? 6 : 5));
                }
                var source = fs.readFileSync(filename, 'utf8');


                var content = fm(source);

                var html = jade.render(content.body, null, '  ');
                var page = assign({}, {path: url, body: html}, content.attributes);
                Dispatcher.handleServerAction({
                    actionType: ActionTypes.LOAD_PAGE,
                    path: url,
                    page: page
                });

            }
        });
        return pages;
    };
    return getFiles(sourceDir);
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
