// This middleware function is used to check if the user is authenticated (i.e. logged in).
module.exports = (req, res, next) => {

  // Check if the user's session has the isLoggedIn property set to true.
  if (req.session.isLoggedIn) {

    // If the user is authenticated, continue with the next command.
    next();

  } else {

    // If the user is not authenticated, set an error message in the session and redirect to the login page.
    req.session.error = "You have to sign up first";
    res.redirect("/login");
  }
};
