'use strict'
let db = require('../controllers/controller.js');
let Donor = db.Donor;
let Event = db.Event;
let Hospital = db.Hospital;
let Appointment = db.Appointment;

let getCurrentDonor = (req, res) => {
  Donor.findOne({
    where: {
      id: req.user.id
    },
    include: [{
      model: Event,
      include: [Hospital]
    }, {
      model: Donor,
      as: 'friends',
      through: 'friends'
    }, {
      model: Appointment,
      include: [Hospital]
    }]})
  .then(user => {
    res.send(user);
  });
};

let updateCurrentDonor = (req, res) => {
  Donor.findOne({where: {id: req.user.id}})
  .then(user => {
    user.update(req.body)
    .then(() => res.send(user));
  });
};

let getDonorById = (req, res) => {
  Donor.findOne({where: {id: req.params.id}})
  .then(user => {
    res.send(user);
  });
};

let getDonorsByLocation = (req, res) => {
  let queries = req.query;
  Donor.findAll({where: {
    latitude: {$gt: queries.minLat, $lt: queries.maxLat},
    longitude: {$gt: queries.minLong, $lt: queries.maxLong}
  },
  include:[Appointment],
  })
  .then(donors => {
    donors.sort(function(a,b){
      if (a.appointments.length > b.appointments.length) {
        return -1;
      }
      if (a.appointments.length < b.appointments.length) {
        return 1;
      }
      return 0;
    }),
    res.send(donors.slice(0,5));
  });
};


module.exports.getCurrentDonor = getCurrentDonor;
module.exports.updateCurrentDonor = updateCurrentDonor;
module.exports.getDonorById = getDonorById;
module.exports.getDonorsByLocation = getDonorsByLocation;
