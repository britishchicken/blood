'use strict'

/* Dependencies */
let express = require('express');
let path = require('path');
let bodyParser = require('body-parser');
let cookieParser = require('cookie-parser');
let session = require('express-session');
let app = express();
let auth = require('./routes/auth');
let passport = auth.passport;
let http = require('http');
let https = require('https');
let fs = require('fs');
let config = require('../serverconfig.js');

/* Routes */
let profileRouter = require('./routes/profile.js');
let hospitalRouter = require('./routes/hospital.js');
let postRouter = require('./routes/post.js');
let authRouter = auth.authRouter;
let calendarRouter = require('./routes/calendar.js');
let eventRouter = require('./routes/event.js');

let clientPath = path.resolve(__dirname + '/../client');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(clientPath));
app.use(session({secret: 'lolwut', key: 'sid'}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/auth/oauthcallback', express.static(__dirname + '/../oauthcallback.html'));

app.use('/api/profile', profileRouter);
app.use('/api/hospital', hospitalRouter);
app.use('/api/calendar', calendarRouter);
app.use('/api/post', postRouter);
app.use('/api/event', eventRouter);
app.use('/auth', authRouter);

if (config.production) {

  let options = {
    key: fs.readFileSync('../tls/key.pem'),
    cert: fs.readFileSync('../tls/cert.pem'),
    ca: fs.readFileSync('../tls/fullchain.pem')
  };

  let server = https.createServer(options, app);

  server.listen(8000);

  var redirectApp = express () ,
  redirectServer = http.createServer(redirectApp);

  redirectApp.use(function requireHTTPS(req, res, next) {
    if (!req.secure) {
      return res.redirect('https://' + req.headers.host + req.url);
    }
    next();
  });

  redirectServer.listen(8080);
} else {
  app.listen(8080, () => {
    console.log('Blood app listening on port 8080!');
  });
}
