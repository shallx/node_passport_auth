const express = require("express");
const Router = express.Router();
const videoController = require('../Controller/videoController');
const {ensureAuthenticated} = require('../config/auth');


Router.get('/video/:link', ensureAuthenticated, videoController.getWatchPage)

Router.get("/watch/:link", ensureAuthenticated, videoController.videoSource);

Router.get('/categories', videoController.getCategories);
Router.get(/^\/categories(\/\d\d?){1,6}\/?$/, videoController.getCategoriesChildren);


module.exports = Router;