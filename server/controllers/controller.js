'use strict'

let config = require('../../serverconfig.js');

let Sequelize = require('sequelize');
let sequelize = new Sequelize('blood', config.sqluid, config.sqlpw, {logging: false});

let Donor = sequelize.define('donor', {
  username: Sequelize.STRING,
  password: Sequelize.STRING,
  fbid: Sequelize.STRING,
  name: Sequelize.STRING,
  email: Sequelize.STRING,
  address: Sequelize.STRING,
  photo: Sequelize.STRING,
  latitude: Sequelize.FLOAT,
  longitude: Sequelize.FLOAT,
  bloodtype: Sequelize.STRING,
  lastcontacted: Sequelize.DATE,
});

let Hospital = sequelize.define('hospital', {
  username: Sequelize.STRING,
  password: Sequelize.STRING,
  name: Sequelize.STRING,
  address: Sequelize.STRING,
  email: Sequelize.STRING,
  photo: Sequelize.STRING,
  phonenum:Sequelize.INTEGER,
  hospitalurl:Sequelize.STRING,
  latitude: Sequelize.FLOAT,
  longitude: Sequelize.FLOAT,
  opos: {type: Sequelize.INTEGER, defaultValue: 20},
  oneg: {type: Sequelize.INTEGER, defaultValue: 20},
  apos: {type: Sequelize.INTEGER, defaultValue: 20},
  aneg: {type: Sequelize.INTEGER, defaultValue: 20},
  bpos: {type: Sequelize.INTEGER, defaultValue: 20},
  bneg: {type: Sequelize.INTEGER, defaultValue: 20},
  abpos: {type: Sequelize.INTEGER, defaultValue: 20},
  abneg: {type: Sequelize.INTEGER, defaultValue: 20},
});

let Review = sequelize.define('review', {
  content: Sequelize.TEXT('long'),
  rating: Sequelize.INTEGER
});

Review.belongsTo(Donor);
Review.belongsTo(Hospital);

let Schedule = sequelize.define('schedule', {
  day: Sequelize.INTEGER,
  openhours: Sequelize.INTEGER,
  closehours: Sequelize.INTEGER
});

let Post = sequelize.define('post', {
  content: Sequelize.TEXT('medium'),
  latitude: Sequelize.FLOAT,
  longitude: Sequelize.FLOAT
});

Post.belongsTo(Donor);
Post.belongsTo(Hospital);
Hospital.hasMany(Schedule);
Schedule.belongsTo(Hospital);

let Event = sequelize.define('event', {
  time: Sequelize.DATE,
});

Event.belongsTo(Hospital);
Event.belongsToMany(Donor, {through: 'donorsevents'});

Post.belongsTo(Hospital);

sequelize.sync();

module.exports.Donor = Donor;
module.exports.Hospital = Hospital;
module.exports.Post = Post;
module.exports.Review = Review;
module.exports.Schedule = Schedule;
module.exports.Event = Event;
