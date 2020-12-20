const User = require("../Model/User");
const errorHandler = require("./errors");
const bcrypt = require("bcryptjs");
const flash = require("connect-flash");
const session = require("express-session");
const chalk = require("chalk");
const passport = require('passport');

exports.getLogin = (req, res, next) => {
  res.render('login', { layout: 'layouts/auth_layout'});
};

exports.getRegister = (req, res, next) => {
  res.render('register', { layout: 'layouts/auth_layout'});
};

exports.getLogout = (req, res, next) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/login');
};

exports.postRegister = async (req, res, next) => {
  let errors = [];
  const { name, email, password, password2 } = req.body;
  try {
    if (password != password2) throw { code: 9001 };
    bcrypt
      .genSalt(10)
      .then(salt => {
        return bcrypt.hash(password, salt);
      })
      .then(hash => {
        return User.create({
          name,
          email,
          password: hash
        });
      })
      .then(user => {
        req.flash('success_msg', 'You are now registered and can log in');
        // return res.json(user);
        res.redirect('/login');
      })
      .catch(err => {
        err = errorHandler.handleErrors(err);
        
        return res.render("register", {
          errors: err,
          name,
          email,
        });
      });
  } catch (error) {
    // console.log(error);
    let err = errorHandler.handleErrors(error);

    // console.log(err);
    res.render("register", {
      errors: err,
      name,
      email,
    })(req,res,next);
  }
};

exports.postLogin = (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
    failureFlash: true
  })(req,res,next);
}