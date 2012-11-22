
/**
 * Module dependencies.
 */

var express = require('express'), 
    http = require('http'),
    path = require('path'),
    ejs_locals = require('ejs-locals'),
    connect = require('express/node_modules/connect'),
    MemoryStore = connect.session.MemoryStore,
    config = require('./config').config,
    routes = require('./routes'),
    listener = require('./listener');

var app = express(), server,
    sessionStore = new MemoryStore({ reapInterval: 6000 * 10 });

/**
 * Config express server.
 */
app.configure(function(){
  app.set('port', process.env.PORT || config.port);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.engine('ejs', ejs_locals);
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.methodOverride());
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.session({ 
    secret: config.session_secret,  
    store: sessionStore 
  }));
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(app.router);
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.locals.config = config;
app.locals._layoutFile = '/layout.ejs';

routes(app);

server = http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

listener.register(server, sessionStore);
