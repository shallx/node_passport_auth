const loginMiddleware = (req, res, next) => {
  if(req.isAuthenticated()){
    return res.redirect('/dashboard');
  }
  next();
}

const isAuth = (req,res,next) => {
  if(req.isAuthenticated()){
    return next();
  }
  req.flash('error_msg', 'Please log in to view this resource');
  res.redirect('/login');
}

module.exports = {
  loginMiddleware,
  isAuth,
}