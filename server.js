const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const http = require('http');
const cookieParser = require('cookie-parser');
const validator = require('express-validator');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');
const flash = require('connect-flash');
const passport = require('passport');
const socketIO = require('socket.io');
const {Users} = require('./helpers/usersClass');


const container = require('./container');

container.resolve(function(users, _, groupchat) {

    mongoose.Promise = global.Promise;
    mongoose.connect('mongodb://localhost/bsa18App', {useMongoClient: true});

  const app = setupExpress();
  
  function setupExpress() {
    const app = express();
    const server = http.createServer(app);
    const io = socketIO(server);
    server.listen(3000, function() {
        console.log("Listen on port 3000");
    });

    configureExpress(app);

    require('./socket/groupchat')(io, Users);

    // Set up the router
    const router = require('express-promise-router')();
    users.setRouting(router);
    groupchat.setRouting(router);

    app.use(router);
  }

  function configureExpress(app) {
    require('./passport/passport-local');

    app.use(express.static('public'));
    app.use(cookieParser());
    app.set('view engine', 'ejs');
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));

    app.use(validator());
    app.use(session({
    	secret: 'thisisasecretkey',
    	resave: true,
    	saveInitialize: true,
    	store: new MongoStore({mongooseConnection: mongoose.connection})
    }));
    app.use(flash());

    app.use(passport.initialize());
    app.use(passport.session());

    app.locals._ = _;
  }
});