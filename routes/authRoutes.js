const Router = require('express').Router();
const userController = require('../Controller/userController');

const User = require('../Model/User');

// const handleErrors = (err) => {
//   let errors = {errors : []};
//   console.log(err);
//   if(err.message.includes('validation failed')){
//     errors.errors = Object.values(err.errors).map(({properties}) => {
//       return {
//         message : properties.message,
//         path  : properties.path,
//         value : properties.value
//       }
//     });
//   }
//   if(err.code == 11000) {
//     errors.errors.push({
//       message : "Email is already registered",
//       path  : 'email',
//       value : 'sdfsf'
//     })
//   }
//   return errors;
// }

Router.get('/login', (req,res,next) => res.render('login'));
Router.get('/signup', (req,res,next) => res.render('register'));
Router.get('/register', (req,res,next) => res.redirect('/signup'));
Router.get('/logout', (req,res,next) => userController.getLogout);

// Register handle
Router.post('/register', userController.postRegister);

module.exports = Router;    