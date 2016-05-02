'use strict'

/* Dependencies */
let express = require('express');
let path = require('path');
let bodyParser = require('body-parser');
let passport = require('passport');
let FacebookStrategy = require('passport-facebook').Strategy;
let LocalStrategy = require('passport-local').Strategy;
let mysql = require('mysql');
let cookieParser = require('cookie-parser');
let session = require('express-session');
let bcrypt = require('bcrypt');
let app = express();

/* Controllers */
let controllers = require('./controllers/controller.js');
let Donor = controllers.Donor;
let Hospital = controllers.Hospital;

/* Routes */
let profileRouter = require('./routes/profile.js');
let hospitalRouter = require('./routes/hospital.js');
let calendarRouter = require('./routes/calendar.js');

let clientPath = path.resolve(__dirname + '/../client');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(clientPath));
app.use(session({secret: 'lolwut', key: 'sid'}));
app.use(passport.initialize());
app.use(passport.session());

var isAuth = (req, res, next) => {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login');
};

passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(new FacebookStrategy({
  clientID: process.env.fbapikey,
  clientSecret: process.env.fbapisecret,
  callbackURL: 'http://ec2-52-36-156-213.us-west-2.compute.amazonaws.com:8080/auth/facebook/callback',
  profileFields: ['id', 'displayName', 'picture.type(large)', 'email']
},
function(accessToken, refreshToken, profile, done) {
  process.nextTick(() => {
      //Check whether the User exists or not using profile.id
      //Further DB code.
      Donor.findOrCreate({where: {uid: profile.id}, defaults: {name: profile.displayName, email: profile.email, photo: profile._json.picture.data.url}})
      .spread(function(user, created) {
        done(null, user);
      });
    });
}
));

passport.use('local-signup', new LocalStrategy(function(username, password, done) {
  process.nextTick(function() {

    Hospital.findOne({where: {username: username}})
    .then(function(hospital) {
      if (hospital) {
        return done(null, false);
      } else {
        Hospital.create({username: username, password: bcrypt.hashSync(password, bcrypt.genSaltSync(8), null)})
        .then((hospital) => {
          return done(null, hospital);
        });
      }

    });

  });
}));

passport.use('local-login', new LocalStrategy(function(username, password, done) {
  Hospital.findOne({where: {username: username}})
  .then(function(hospital) {
    if (!hospital) {
      return done(null, false);
    }

    if (!bcrypt.compareSync(password, hospital.password)) {
      return done(null, false);
    }

    return done(null, hospital);
  });
}));

passport.use('donor-signup', new LocalStrategy(function(username, password, done) {
  Donor.findOne({where: {username: username}})
  .then(function(donor) {
    if (donor) {
      return done(null,false);
    } else {
      Donor.create({username: username, password: bcrypt.hashSync(password, bcrypt.genSaltSync(9), null)})
      .then((donor) => {
        return done(null, donor);
      });
    }
  });
}));

passport.use('donor-login', new LocalStrategy(function(username, password, done){
  Donor.findOne({where: {username: username}})
  .then(function(donor) {
    if (!donor) {
      return done(null,false);
    }
    if (!bcrypt.compareSync(password, donor.password)) {
      return done(null, false);
    }
    return done(null, donor);
  });
}));

app.get('/auth/facebook', passport.authenticate('facebook'));
app.get('/auth/facebook/callback',
  passport.authenticate('facebook', {
   successRedirect : '/',
   failureRedirect: '/login'
 }),
  (req, res) => {
    res.redirect('/');
  });

app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

app.post('/auth/hospital/login', passport.authenticate('local-login'),
  (req, res) => {
    res.send(req.user);
  });

app.post('/auth/hospital/signup', passport.authenticate('local-signup'),
  (req, res) => {
    res.send(req.user);
  });

app.post('/auth/donor/login', passport.authenticate('donor-login'),
  (req, res) => {
    res.send(req.user);
  });

app.post('/auth/donor/signup', passport.authenticate('donor-signup'),
  (req, res) => {
    res.send(req.user);
  });

app.use('/api/profile', profileRouter);
app.use('/api/hospital', hospitalRouter);
app.use('/api/calendar', calendarRouter);

app.listen(8080, () => {
  console.log('Blood app listening on port 8080!');
});
