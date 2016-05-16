'use strict'
let buddyRouter = require('express').Router();
let buddyControllers = require('../controllers/buddy.js');

buddyRouter.route('/')
.post(buddyControllers.requestBuddy);

buddyRouter.route('/:id')
.get(buddyControllers.getBuddy)
.put(buddyControllers.updateBuddy);

module.exports = buddyRouter;