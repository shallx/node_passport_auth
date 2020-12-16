const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const validator = require("validator");
const {check, body} = require('express-validator');

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, "Name field is required"],
    set: (val) => {
      return val.trim();
    },
  },
  email: {
    type: String,
    required: [true, "Email field is required"],
    set: (val) => {
      return val.trim();
    },
    unique: true,
    validate: [validator.isEmail, "Not a valid email!!"]
  },
  password: {
    type: String,
    required: [true, "Password field is required"],
    set: (val) => {
      return val.trim();
    },
    validate: [(val) => {
      return validator.isStrongPassword(val,
        {minLength: 6, minUppercase: 1})
    }, "Password not strong enough"]
  },
  date: {
    type: Date,
    default: Date.now,
  },

});

module.exports = mongoose.model("User", userSchema);