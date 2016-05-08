'use strict'
let url = require('url');
let eventRouter = require('express').Router();
let controllers = require('../controllers/controller.js');
let Donor = controllers.Donor;
let Hospital = controllers.Hospital;
let Event = controllers.Event;
let Sequelize = require('sequelize');

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

eventRouter.route('/geo')
.get((req, res) => {
  let queries = url.parse(req.url, true).query;
  let minLat = queries.minLat || -1000;
  let minLong = queries.minLong || -1000;
  let maxLat = queries.maxLat || 1000;
  let maxLong = queries.maxLong || 1000;
  Event.findAll({
    where: {
      time: {
        $gt: Sequelize.fn('NOW')
      }
    },
    include: [{
      model: Hospital,
      where: {
        latitude: {
        $gt: minLat,
        $lt: maxLat
      },
      longitude: {
        $gt: minLong,
        $lt: maxLong
      }}}]
  })
  .then(events => res.send(events));
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
    let eventTime = new Date(event.time);
    let lastAppointmentTime = new Date(donor.latestappointment);
    let offset = eventTime.getTime() - lastAppointmentTime.getTime();
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
