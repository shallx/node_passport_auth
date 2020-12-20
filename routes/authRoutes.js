const Router = require('express').Router();
const userController = require('../Controller/userController');
const {loginMiddleware, isAuth} = require('../middleware/auth');

const User = require('../Model/User');

Router.get('/login', loginMiddleware, userController.getLogin);
Router.get('/signup', loginMiddleware, userController.getRegister);
Router.get('/register',loginMiddleware, userController.getRegister);
Router.get('/logout', isAuth, userController.getLogout);

// Register handle
Router.post('/register', userController.postRegister);
Router.post('/login', userController.postLogin);

module.exports = Router;    