'use strict'
let eventRouter = require('express').Router();
let controllers = require('../controllers/controller.js');
let Donor = controllers.Donor;
let Hospital = controllers.Hospital;
let Event = controllers.Event;

const FIFTYSIXDAYS = 5E9;

eventRouter.route('/')
.post((req, res) => {
  Promise.all([
    Event.create({time: req.body.time}),
    Donor.findOne({where: {id: req.user.id}})
    ]).then(results => {
      let event = results[0];
      let donor = results[1];
      event.addDonor(donor);
    });
});

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
})
.post((req, res) => {

  Promise.all([
    Event.findOne({
      where: {
        id: req.params.id
      }
    }),
    Donor.findOne({
      where: {
        id: req.user.id
      }
    })]).then((results) => {
    let event = results[0];
    let donor = results[1];
      // event.addDonor(donor);
      let eventTime = new Date(event.time);
      let lastAppointmentTime = new Date(donor.latestappointment);
      console.log('event time: ', eventTime);
      console.log('last appointment: ', lastAppointmentTime);
      let offset = eventTime.getTime() - lastAppointmentTime.getTime();
      console.log('offset: ', offset);
      if (eventTime.getTime() - lastAppointmentTime.getTime() > FIFTYSIXDAYS) {
        donor.update({latestappointment: event.time});
        event.addDonor(donor)
        .then(() => res.end());
      } else {
        res.writeHead(409);
        res.end();
      }
    });
  });

module.exports = eventRouter;
