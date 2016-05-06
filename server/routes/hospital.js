'use strict'
let hospitalRouter = require('express').Router();
let controllers = require('../controllers/controller.js');
let Hospital = controllers.Hospital;
let Donor = controllers.Donor;
let Review = controllers.Review;
let Schedule = controllers.Schedule;
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
  Hospital.findOne({where: {id: req.params.id}, include: [Schedule]})
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
  }, include: [Schedule]})

  .then(hospitals => {
    res.send(hospitals);
  });
});

hospitalRouter.route('/:id/reviews')
.get((req, res) => {
  Review.findAll({
    where: {hospitalId: req.params.id},
    include: [Donor],
    order: 'createdAt DESC'
  })
  .then(reviews => res.send(reviews));
})
.post((req, res) => {
  Review.create({
    hospitalId: req.params.id,
    donorId: req.user.id,
    content: req.body.content,
    stars: req.body.stars
  })
  .then(review => res.send(review));
});

module.exports = hospitalRouter;
