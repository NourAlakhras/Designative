const bcrypt = require("bcrypt");
const User = require("../models/user");

exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) console.log(err);
    res.redirect("/");
  });
};

exports.getSignup = (req, res) => {
  if (req.session.user) {
    return res.redirect("/");
  }
  res.render("signup", { path: "/signup", error: "" });
};

exports.getLogin = (req, res) => {
  if (req.session.user) {
    return res.redirect("/");
  }
  res.render("login", { path: "/login", error: "" });
};

exports.postSignup = async (req, res) => {
  const { firstname, lastname, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({
      firstname,
      lastname,
      email,
      password: hashedPassword,
    });
    res.redirect("/login");
  } catch (error) {
    console.log(error);
    res.render("signup", { path: "/signup", error: "Email already exists" });
  }
};

exports.postLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.render("login", { path: "/login", error: "Invalid email or password" });
    }
    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched) {
      return res.render("login", { path: "/login", error: "Invalid email or password" });
    }
    req.session.isLoggedIn = true;
    req.session.user = user;
    req.session.role = user.type;
    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
};
