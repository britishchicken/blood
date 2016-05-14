'use strict'
let buddyRouter = require('express').Router();
let buddyControllers = require('../controllers/buddy.js');

buddyRouter.route('/')
//.get(buddyControllers.getBuddy)
.post(buddyControllers.requestBuddy);

buddyRouter.route('/:id')
.get(buddyControllers.getBuddy);

module.exports = buddyRouter;