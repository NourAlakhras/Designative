// This middleware function is used to check if the user is authenticated as an admin.
module.exports = (req, res, next) => {

  // Check if the user's session has the role set as "admin".
  if (req.session.role == "admin") {

    // If the user is authenticated as an admin, continue with the next command.
    next();

  } else {

    // If the user is not authenticated as an admin, set an error message in the session and redirect to the home page.
    req.session.error = "You are not authorized to access this page";
    res.redirect("/");
  }
};
