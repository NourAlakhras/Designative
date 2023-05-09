// if you are authenticated go to the next command, if you are not authenticated then you are directed to sign up page to create a new account
module.exports = (req, res, next) => {
  if (req.session.role == "admin") {
    next();
  } else {
    req.session.error = "You are not authorized to access this page";
    res.redirect("/");
  }
};
