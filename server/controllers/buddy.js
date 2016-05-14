'use strict'

let db = require('../controllers/controller.js');
let Donor = db.Donor;
let Hospital = db.Hospital;
let Buddy = db.Buddy;

let requestBuddy = (req, res) => {
  let donorId = req.user.type === 'donor' ? req.user.id : null;
  //let hospitalId = req.user.type === 'hospital' ? req.user.id : null;
  Donor.findOne({where: {id: req.user.id}})
  .then(donor => {
    Buddy.create({
      time: req.body.time,
      found: false,
      donorId: donorId,
      hospitalId: req.body.hospitalid})
    .then(buddy => res.send(buddy));
  });
};

// let getBuddy = (req, res) => {
//   Buddy.findOne({where: {donorId: req.user.id}})
//   .then(buddy => res.send(buddy));

// };

let getBuddy = (req, res) => {
  console.log(req.params.id);
  Buddy.findOne({where: {id: req.params.id},
  include: [Donor, Hospital]})
  .then(buddy => res.send(buddy));

};

module.exports.getBuddy = getBuddy;
module.exports.requestBuddy = requestBuddy;