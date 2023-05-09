// if you are authenticated go to the next command, if you are not authenticated then you are directed to sign up page to create a new account
module.exports = (req, res, next) => {
  if (req.session.isLoggedIn) {
    next();
  } else {
    req.session.error = "You have to sign up first";
    res.redirect("/login");
  }
};
