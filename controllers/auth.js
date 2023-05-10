// Require necessary modules
const bcrypt = require("bcrypt");
const User = require("../models/user");

// Logout function
exports.logout = (req, res) => {
  // Destroy session and redirect to homepage
  req.session.destroy((err) => {
    if (err) console.log(err);
    res.redirect("/");
  });
};

// Get signup page
exports.getSignup = (req, res) => {
  // If user is already logged in, redirect to homepage
  if (req.session.user) {
    return res.redirect("/");
  }
  // Render signup page
  res.render("signup", { path: "/signup", error: "" });
};

// Get login page
exports.getLogin = (req, res) => {
  // If user is already logged in, redirect to homepage
  if (req.session.user) {
    return res.redirect("/");
  }
  // Render login page
  res.render("login", { path: "/login", error: "" });
};

// Handle signup form submission
exports.postSignup = async (req, res) => {
  // Destructure user input fields
  const { firstname, lastname, email, password } = req.body;
  try {
    // Hash user password
    const hashedPassword = await bcrypt.hash(password, 12);
    // Create new user in database
    const user = await User.create({
      firstname,
      lastname,
      email,
      password: hashedPassword,
    });
    // Redirect to login page
    res.redirect("/login");
  } catch (error) {
    // If email already exists in database, render signup page with error message
    console.log(error);
    res.render("signup", { path: "/signup", error: "Email already exists" });
  }
};

// Handle login form submission
exports.postLogin = async (req, res) => {
  // Destructure user input fields
  const { email, password } = req.body;
  try {
    // Find user by email in database
    const user = await User.findOne({ email });
    if (!user) {
      // If user doesn't exist, render login page with error message
      return res.render("login", { path: "/login", error: "Invalid email or password" });
    }
    // Compare user input password with hashed password in database
    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched) {
      // If passwords don't match, render login page with error message
      return res.render("login", { path: "/login", error: "Invalid email or password" });
    }
    // Set session variables
    req.session.isLoggedIn = true;
    req.session.user = user;
    req.session.role = user.type;
    // Redirect to homepage
    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
};