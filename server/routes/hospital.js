'use strict'
let hospitalRouter = require('express').Router();
let controllers = require('../controllers/controller.js');
let Hospital = controllers.Hospital;
let url = require('url');

hospitalRouter.route('/profile')
.get((req, res) => {
  res.send(req.user);
})
.put((req, res) => {
  Hospital.findOne({where: {id: req.user.id}})
  .then(hospital => {
    hospital.update(req.body)
    .then(() => res.send(hospital));
  });
});

hospitalRouter.route('/profile/:id')
.get((req, res) => {
  Hospital.findOne({where: {id: req.params.id}})
  .then(hospital => {
    res.send(hospital);
  });
});

hospitalRouter.route('/geo')
.get((req, res) => {
  let queries = url.parse(req.url, true).query;

  Hospital.findAll({where: {
    latitude: {$gt: queries.minLat, $lt: queries.maxLat},
    longitude: {$gt: queries.minLong, $lt: queries.maxLong}
  }})
  .then(hospitals => res.send(hospitals));
});

module.exports = hospitalRouter
