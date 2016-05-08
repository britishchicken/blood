'use strict'
let db = require('../controllers/controller.js');
let Donor = db.Donor;

let getCurrentDonor = (req, res) => {
  Donor.findOne({where: {id: req.user.id}})
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

module.exports.getCurrentDonor = getCurrentDonor;
module.exports.updateCurrentDonor = updateCurrentDonor;
module.exports.getDonorById = getDonorById;
