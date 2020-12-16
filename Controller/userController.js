const User = require("../Model/User");
const errorHandler = require("./errors");
const bcrypt = require("bcryptjs");
const flash = require("connect-flash");
const session = require("express-session");
const chalk = require("chalk");

exports.getLogin = (req, res, next) => {
  res.render("login");
};

exports.getRegister = (req, res, next) => {
  res.render("register");
};

exports.getLogout = (req, res, next) => {
  res.render("logout");
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
        return res.json(user);
      })
      .catch(err => {
        err = errorHandler.handleErrors(err);
        console.log("Its on TOP");
        console.log(err);
        
        return res.render("register", {
          errors: err,
          name,
          email,
        });
      });
  } catch (error) {
    // console.log(error);
    let err = errorHandler.handleErrors(error);
    console.log("Its on BOTTOM");
    console.log(err);

    // console.log(err);
    res.render("register", {
      errors: err,
      name,
      email,
    });
  }
};
