'use strict'

let db = require('../controllers/controller.js');
let Donor = db.Donor;
let Hospital = db.Hospital;
let Appointment = db.Appointment;

let makeAppointment = (req, res) => {
  Donor.findOne({where: {id: req.user.id}})
  .then(donor => {
    Appointment.create({time: req.body.time, donorId: donor.id, hospitalId: req.body.hospitalId})
    .then(appointment => res.send(appointment));
  });
};

let showAppointments = (req, res) => {
  if (!req.session.passport || (req.session.passport.user.type !== 'hospital')) {
    return res.send(401);
  }

  Appointment.findAll({where: {hospitalId: req.session.passport.user.id}, include: [Donor]})
    .then(appointments => {
      res.send(appointments);
    });

}

module.exports.makeAppointment = makeAppointment;
module.exports.showAppointments = showAppointments;
