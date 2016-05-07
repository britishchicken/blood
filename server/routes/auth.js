'use strict'
let _ = require('lodash');
let mysql = require('mysql');
let bcrypt = require('bcrypt');
let passport = require('passport');
let FacebookStrategy = require('passport-facebook').Strategy;
let LocalStrategy = require('passport-local').Strategy;
let authRouter = require('express').Router();

let controllers = require('../controllers/controller.js');
let Donor = controllers.Donor;
let Hospital = controllers.Hospital;

let config = require('../../serverconfig.js');

passport.serializeUser(function(user, done) {
  let type = user instanceof Donor.Instance ? 'donor' : 'hospital';
  let oldUser = Object.assign({}, user.dataValues);
  let extendedUser = _.assign(oldUser, {type: type});
  done(null, extendedUser);
});
passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

// start of google auth requirements
const GOOGLE_ID = config.calendarid;
const GOOGLE_SECRET = config.calendarsecret;
const GOOGLE_REDIRECT = config.calendarurl;

let google = require('googleapis');
let OAuth2 = google.auth.OAuth2;
let oauth2Client = new OAuth2(GOOGLE_ID, GOOGLE_SECRET, GOOGLE_REDIRECT);

const URL = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: 'https://www.googleapis.com/auth/calendar'
});
// end of google auth requirements

// start of google auth routes
authRouter.route('/url')
  .get((req, res) => {
    res.send(URL)
  });

authRouter.route('/googleToken')
  .get((req, res) => {
    let code = req.query.code;
    oauth2Client.getToken(code, (err, tokens) => {
      if (err) {
        return console.error('an error has occured in setting the token: ' + err);
      }
      oauth2Client.setCredentials(tokens);
      google.options({ auth: oauth2Client }); // set auth as a global default
      res.send('authenticated!');
    });
});
// end of google auth routes

passport.use(new FacebookStrategy({
  clientID: config.fbapikey,
  clientSecret: config.fbapisecret,
  callbackURL: 'https://bloodshare.io/auth/facebook/callback',
  profileFields: ['id', 'displayName', 'picture.type(large)', 'email']
},
function(accessToken, refreshToken, profile, done) {
  process.nextTick(() => {
      //Check whether the User exists or not using profile.id
      //Further DB code.
      Donor.findOrCreate({where: {fbid: profile.id}, defaults: {name: profile.displayName, email: profile.email, photo: profile._json.picture.data.url}})
      .spread(function(user, created) {
        done(null, user);
      });
    });
}
));

passport.use('hospital-signup', new LocalStrategy(function(username, password, done) {
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

passport.use('hospital-login', new LocalStrategy(function(username, password, done) {
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


authRouter.route('/facebook')
.get(passport.authenticate('facebook'));

authRouter.route('/facebook/callback')
.get(passport.authenticate('facebook', {
   successRedirect : '/',
   failureRedirect: '/login'
 }),
  (req, res) => {
    res.redirect('/');
  });

authRouter.route('/hospital/login')
.post(passport.authenticate('hospital-login'),
  (req, res) => {
    res.send(req.user);
  });

authRouter.route('/hospital/signup')
.post(passport.authenticate('hospital-signup'),
  (req, res) => {
    res.send(req.user);
  });

authRouter.route('/donor/login')
.post(passport.authenticate('donor-login'),
  (req, res) => {
    res.send(req.user);
  });

authRouter.route('/donor/signup')
.post(passport.authenticate('donor-signup'),
  (req, res) => {
    res.send(req.user);
  });

authRouter.route('/logout')
.get((req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports.passport = passport;
module.exports.authRouter = authRouter;
