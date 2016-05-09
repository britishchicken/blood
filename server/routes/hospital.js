'use strict'
let hospitalRouter = require('express').Router();
let hospitalControllers = require('../controllers/hospital.js');

hospitalRouter.route('/profile')
.get(hospitalControllers.getCurrentHospital)
.put(hospitalControllers.updateCurrentHospital);

hospitalRouter.route('/profile/:id')
.get(hospitalControllers.getHospitalById);

hospitalRouter.route('/geo')
.get(hospitalControllers.getHospitalsByLocation);

hospitalRouter.route('/:id/reviews')
.get(hospitalControllers.getHospitalReviews)
.post(hospitalControllers.postHospitalReview);

module.exports = hospitalRouter;

