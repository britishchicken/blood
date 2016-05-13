'use strict'
let appointmentRouter = require('express').Router();
let appointmentControllers = require('../controllers/appointment.js');

appointmentRouter.route('/')
.get(appointmentControllers.showAppointments)
.post(appointmentControllers.makeAppointment);

module.exports = appointmentRouter;
