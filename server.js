'use strict';
const pkg = require('./package.json');
const {URL} = require('url');
const path = require('path');


const nconf = require('nconf');
nconf
  .argv()
  .env('__')
  .defaults({'NODE_ENV': 'development'});

const NODE_ENV = nconf.get('NODE_ENV');
const isDev = NODE_ENV === 'development';
nconf
  .defaults({'conf': path.join(__dirname, `${NODE_ENV}.config.json`)})
  .file(nconf.get('conf'));

const serviceUrl = new URL(nconf.get('serviceUrl'));
const servicePort =
    serviceUrl.port || (serviceUrl.protocol === 'https:' ? 443 : 80);









const express = require('express');
const morgan = require('morgan');


const webpack = require('webpack');
const webpackMiddleware = require('webpack-dev-middleware');
const webpackConfig = require('./webpack.config.js');

const app = express();

const expressSession = require('express-session');
if (isDev) {
  
  const FileStore = require('session-file-store')(expressSession);
  app.use(expressSession({
    resave: false,
    saveUninitialized: true,
    secret: 'Set_____',
    store: new FileStore(),
  }));
} else {
 

    
    
    
    
    
    
    
    
    
    

const passport = require('passport')
passport.serializeUser((profile, done) => done(null, {
  id: profile.id,
  provider: profile.provider,
  displayName: profile.displayName,
}));
passport.deserializeUser((user, done) => done(null, user));
app.use(passport.initialize());
app.use(passport.session());



const GoogleStrategy = require('passport-google-oauth20').Strategy;
passport.use(new GoogleStrategy({
  clientID: nconf.get('auth:google:clientID'),
  clientSecret: nconf.get('auth:google:clientSecret'),
  callbackURL: new URL('/auth/google/callback', serviceUrl).href,
  scope: 'https://www.googleapis.com/auth/plus.login',
}, (accessToken, refreshToken, profile, done) => done(null, profile)));

app.get('/auth/google',
    passport.authenticate('google', {scope: ['email', 'profile']}));
app.get('/auth/google/callback', passport.authenticate('google', {
  successRedirect: '/',
  failureRedirect: '/',
}));

    
    
    
    
    
    
    
    
    
    
    
    
app.use(morgan('dev'));

app.get('/api/version', (req, res) => res.status(200).json(pkg.version));

app.get('/auth/signout', (req, res) => {
  req.logout();
  res.redirect('/');
});

app.get('/api/session', (req, res) => {
  const session = {auth: req.isAuthenticated()};
  if (session.auth && req.user && req.user.profile) {
    session.user = {
      id: req.user.profile.id,
      provider: req.user.profile.provider,
      displayName: req.user.profile.displayName,
    };
  }
  res.status(200).json(session);
});


app.use('/api', require('./lib/book.js')(nconf.get('es')));
app.use('/api', require('./lib/bundle.js')(nconf.get('es')));

if (NODE_ENV === 'development') {
  app.use(webpackMiddleware(webpack(webpackConfig), {
    publicPath: '/',
    stats: {
      colors: true,
    },
  }));
} else {
  app.use(express.static('dist'));
}

    
    
    
    
    
    
    
    
    
app.listen(servicePort, () => console.log('server starting now'));
