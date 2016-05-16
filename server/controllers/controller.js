'use strict'

let config = require('../../serverconfig.js');

let Sequelize = require('sequelize');
let sequelize = new Sequelize('blood', config.sqluid || 'root', config.sqlpw || '', {logging: false});

let Donor = sequelize.define('donor', {
  password: Sequelize.STRING,
  fbid: Sequelize.STRING,
  name: Sequelize.STRING,
  email: Sequelize.STRING,
  address: Sequelize.STRING,
  photo: {type: Sequelize.STRING, defaultValue: 'https://lh3.googleusercontent.com/-P7G0ockiph0/AAAAAAAAAAI/AAAAAAAAAAA/66TL_VrQR80/photo.jpg'},
  latitude: Sequelize.FLOAT,
  longitude: Sequelize.FLOAT,
  bloodtype: Sequelize.STRING,
  lastcontacted: Sequelize.DATE,
  latestappointment: Sequelize.DATE
});

Donor.belongsToMany(Donor, {as: 'friends', through: 'friends'});

let Hospital = sequelize.define('hospital', {
  password: Sequelize.STRING,
  name: Sequelize.STRING,
  address: Sequelize.STRING,
  email: Sequelize.STRING,
  photo: {type: Sequelize.STRING, defaultValue: 'https://lh3.googleusercontent.com/-P7G0ockiph0/AAAAAAAAAAI/AAAAAAAAAAA/66TL_VrQR80/photo.jpg'},
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
Donor.hasMany(Review);
Hospital.hasMany(Review);

let Schedule = sequelize.define('schedule', {
  day: Sequelize.INTEGER,
  openhours: Sequelize.INTEGER,
  closehours: Sequelize.INTEGER
});

Hospital.hasMany(Schedule);
Schedule.belongsTo(Hospital);

let Post = sequelize.define('post', {
  content: Sequelize.TEXT('medium'),
  latitude: Sequelize.FLOAT,
  longitude: Sequelize.FLOAT
});

Post.belongsTo(Donor);
Post.belongsTo(Hospital);

let Event = sequelize.define('event', {
  time: Sequelize.DATE,
});

Event.belongsTo(Hospital);
Hospital.hasMany(Event);
Event.belongsToMany(Donor, {through: 'donorsevents'});
Donor.belongsToMany(Event, {through: 'donorsevents'});

let Appointment = sequelize.define('appointment', {
  time: Sequelize.DATE,
  /* appointment type options */
  /* 1: normal appointment */
  /* 2: event appointment */
  /* 3: appointment with bloodbuddy */
  type: Sequelize.INTEGER
});

Appointment.belongsTo(Hospital);
Appointment.belongsTo(Donor);
Hospital.hasMany(Appointment);
Donor.hasMany(Appointment);

let Buddy = sequelize.define('buddy', {
 time: Sequelize.DATE,
 buddyId:Sequelize.INTEGER
});
Buddy.belongsTo(Hospital);
Buddy.belongsTo(Donor);
Donor.hasMany(Buddy);

sequelize.sync();

module.exports.Donor = Donor;
module.exports.Hospital = Hospital;
module.exports.Post = Post;
module.exports.Review = Review;
module.exports.Schedule = Schedule;
module.exports.Event = Event;
module.exports.Appointment = Appointment;
module.exports.Buddy = Buddy;
