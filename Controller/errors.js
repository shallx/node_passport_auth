const chalk = require("chalk");
//Error to pass in Catchblock
exports.throw500c = (err, next) => {
  if (!err.statusCode) {
    err.statusCode = 500;
  }
  next(err);
};

exports.throw500 = err => {
  const error = new Error(err || "Internal Server Error");
  error.statusCode = 500;
  throw error;
};

exports.throw401 = err => {
  const error = new Error(err || "Not authenticated.");
  error.statusCode = 401;
  throw error;
};

exports.throw403 = err => {
  const error = new Error(err || "Not authorized.");
  error.statusCode = 403;
  throw error;
};

exports.throwError = (err, status, errorData) => {
  const error = new Error(err || "Internal Server Error");
  error.statusCode = status || 500;
  if (errorData) error.data = errorData;
  throw error;
};

//Error to pass in Catch Block
exports.throwErrorc = (err, next, status) => {
  const error = new Error(err || "Some Error Occured");
  error.statusCode = status || 520;
  next(error);
};

exports.throw404 = err => {
  const error = new Error(err || "Page not Found");
  error.statusCode = 404;
  throw error;
};

exports.handleErrors = err => {
  let errors = [];
  try{
    if(err.message){
      if (err.message.includes("validation failed")) {
        errors = Object.values(err.errors).map(({ properties }) => {
          return {
            message: properties.message,
            path: properties.path,
          };
        });
      }
    }
    if (err.code == 11000) {
      errors.push({
        message: "Email is already registered",
        path: "email",
      });
    }
  }catch(err){
    console.log(err);
  }
  if (err.code == 9001) {
    errors.push({
      message: "Password do not match",
      path: "password2",
    });
  }
  if (err.code == 9002) {
    errors.push({
      message: "Hash error",
      path: "password",
    });
  }
  if (err.code == 9003) {
    errors.push({
      message: "DB error",
      path: "server",
    });
  }
  return errors;
};
