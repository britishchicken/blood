'use strict'
let eventRouter = require('express').Router();
let controllers = require('../controllers/controller.js');
let Donor = controllers.Donor;
let Hospital = controllers.Hospital;
let Event = controllers.event;

eventRouter.route('/:id')
.get((req, res) => {
  Event.findOne({
    where: {
      id: req.params.id
    },
    include: [Donor, Hospital]
  })
  .then(event => {
    res.send(event);
  });
});

module.exports = eventRouter;
