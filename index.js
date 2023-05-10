const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const port = process.env.PORT || 5000;
const session = require("express-session");

const MongoDBStore = require("connect-mongodb-session")(session);

const indexRouter = require("./routes/index");
const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");
const adminRouter = require("./routes/admin");

const upload = require("./uploadImages");
const isAuth = require("./middleware/isAuth");
const isAdmin = require("./middleware/isAdmin");

const User = require("./models/user");
const app = express();
// configuring the dotenv file
dotenv.config();

//register view engine
app.set("view engine", "ejs");
app.set("views", "views");

//middleware
app.use(express.static(__dirname + "/public"));
// Add body-parser middleware to handle http requests
app.use(express.urlencoded({ extended: true }));
// app.use(bodyParser.json());
app.use(express.json());

const store = new MongoDBStore({
  uri: process.env.MONGO_URL,
  collection: "sessions",
});

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store,
  }),
);
const Notification = require("./models/notification");
// Notification.create({ message: "hello", userId: "645100368e32a6223e2c6e64" });
//middleware to check is user is authenticated
app.use(async (req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  if (req.session.user) {
    req.session.user = await User.findById(req.session.user._id);
    res.locals.role = req.session.user?.type;
    res.locals.name = req.session.user?.firstname + " " + req.session.user?.lastname;
    res.locals.image = req.session.user?.image;
    const notifications = await Notification.find({ userId: req.session.user?._id });
    res.locals.notifications = notifications.reverse();
  }
  next();
});

app.use(authRouter);
app.use(indexRouter);
app.use(isAuth, userRouter);
app.use("/admin", isAdmin, adminRouter);

app.use(function (req, res, next) {
  res.status(404);
  res.render("404", {
    path: "/404",
  });
});

//to connect to the db
const dbURL = process.env.MONGO_URL;
mongoose.set("strictQuery", false);
mongoose
  .connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) =>
    app.listen(port, () => {
      console.log(`backend server is running at http://localhost:${port}`);
    }),
  )
  .catch((err) => console.log(err));
