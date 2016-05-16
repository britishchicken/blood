'use strict'

let db = require('../controllers/controller.js');
let Donor = db.Donor;
let Hospital = db.Hospital;
let Buddy = db.Buddy;
let Appointment = db.Appointment;

let requestBuddy = (req, res) => {
  let donorId = req.user.type === 'donor' ? req.user.id : null;
  //let hospitalId = req.user.type === 'hospital' ? req.user.id : null;
  Donor.findOne({where: {id: req.user.id}})
  .then(donor => {
    Buddy.create({
      time: req.body.time,
      buddyId: null,
      donorId: donorId,
      hospitalId: req.body.hospitalid})
    .then(buddy => res.send(buddy));
  });
};


let getBuddy = (req, res) => {
  Buddy.findOne({where: {id: req.params.id},
    include: [Donor, Hospital]})
  .then(buddy => res.send(buddy));

};

let updateBuddy = (req, res) => {
  Buddy.findOne({where: {id: req.params.id},
    include: [Donor, Hospital]})
  .then(buddy => {
    Promise.all([
    Appointment.create({time: buddy.time, donorId: buddy.donorId, hospitalId: buddy.hospitalId, type: 3}),
    Appointment.create({time: buddy.time, donorId: req.user.id, hospitalId: buddy.hospitalId, type: 3}),
    Buddy.update({
      buddyId: req.user.id
    } ,{where: {id: req.params.id}})
    ])
    .then((buddy) =>res.send(buddy));
    });
};

module.exports.getBuddy = getBuddy;
module.exports.requestBuddy = requestBuddy;
module.exports.updateBuddy = updateBuddy;