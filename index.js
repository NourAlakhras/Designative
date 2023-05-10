// Import required modules
const express = require("express"); // library for building web applications
const mongoose = require("mongoose"); // library for MongoDB interactions
const dotenv = require("dotenv"); // library to load environment variables
const port = process.env.PORT || 5000; // Port to listen on
const session = require("express-session"); // library for session handling

// Library for storing session information in MongoDB
const MongoDBStore = require("connect-mongodb-session")(session);

// Import routers
const indexRouter = require("./routes/index");
const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");
const adminRouter = require("./routes/admin");

// Import middleware functions
const upload = require("./uploadImages");
const isAuth = require("./middleware/isAuth");
const isAdmin = require("./middleware/isAdmin");

// Import the User model
const User = require("./models/user");

// Create an Express app
const app = express();

// Load environment variables from the .env file
dotenv.config();

// Set the view engine to EJS
app.set("view engine", "ejs");
app.set("views", "views");

// Serve static files from the 'public' folder
app.use(express.static(__dirname + "/public"));

// Parse request bodies using the 'urlencoded' method
app.use(express.urlencoded({ extended: true }));

// Parse request bodies using the 'json' method
app.use(express.json());

// Create a new MongoDBStore instance for storing sessions
const store = new MongoDBStore({
  uri: process.env.MONGO_URL,
  collection: "sessions",
});

// Use the session middleware to handle user sessions
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store,
  }),
);

// Import the Notification model
const Notification = require("./models/notification");

// Middleware function to check if user is authenticated and load their data
app.use(async (req, res, next) => {
  // Set 'isAuthenticated' to true if the user is logged in
  res.locals.isAuthenticated = req.session.isLoggedIn;
  if (req.session.user) {
    // Load the user data from the database
    req.session.user = await User.findById(req.session.user._id);
    // Set 'role', 'name', 'image', and 'notifications' for the views
    res.locals.role = req.session.user?.type;
    res.locals.name = req.session.user?.firstname + " " + req.session.user?.lastname;
    res.locals.image = req.session.user?.image;
    const notifications = await Notification.find({ userId: req.session.user?._id });
    res.locals.notifications = notifications.reverse();
  }
  next();
});

// Mount routers
app.use(authRouter);
app.use(indexRouter);
app.use(isAuth, userRouter);
app.use("/admin", isAdmin, adminRouter);

// Handle 404 errors
app.use(function (req, res, next) {
  res.status(404);
  res.render("404", {
    path: "/404",
  });
});

// Connect to the database and start the server
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
