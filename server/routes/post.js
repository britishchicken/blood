'use strict'
let postRouter = require('express').Router();
let postControllers = require('../controllers/post.js');

postRouter.route('/')
.get(postControllers.getPostsByLocation)
.post(postControllers.postPost);

module.exports = postRouter;
