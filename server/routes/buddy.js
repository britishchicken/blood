'use strict'
let buddyRouter = require('express').Router();
let buddyControllers = require('../controllers/buddy.js');

buddyRouter.route('/')
.get(buddyControllers.getBuddy)
.post(buddyControllers.requestBuddy);

module.exports = buddyRouter;