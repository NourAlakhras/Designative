// importing required models and libraries
const Project = require("../models/project");
const User = require("../models/user");
const Notification = require("../models/notification");
const Review = require("../models/review");
const mongoose = require("mongoose");

// rendering the user's profile page with their details
exports.profile = async (req, res) => {
  const user = await User.findById(req.session.user._id);
  const projects = await Project.find({ userId: user._id, status: "Approved" });
  const reviews = await Review.find({ toId: user._id }).populate("userId");
  res.render("my_profile", {
    user,
    projects,
    reviews,
    path: "/profile",
    guest: false,
    hide: "",
    error: "",
  });
};

// rendering the user's page with their details
exports.userPage = async (req, res) => {
  const id = req.params.id;
  const user = await User.findById(mongoose.Types.ObjectId(id));
  const projects = await Project.find({ userId: user._id, status: "Approved" });
  const reviews = await Review.find({ toId: user._id }).populate("userId");
  res.render("my_profile", {
    user,
    projects,
    reviews,
    path: "/profile",
    guest: true,
    hide: "disabled",
    error: "",
  });
};

// defining category data
data = {
  filmmaker: "Filmmaker",
  webdes: "Web Designer",
  branddes: "Brand Designer",
  vidgame: "Video Game Designer",
  animator: "Animator",
};

// handling adding a new project
exports.addProject = async (req, res) => {
  const { filmmaker, webdes, branddes, vidgame, animator } = req.body;
  try {
    // creating an array of project categories
    const category = [];
    if (filmmaker) {
      category.push(data.filmmaker);
    }
    if (webdes) {
      category.push(data.webdes);
    }
    if (branddes) {
      category.push(data.branddes);
    }
    if (vidgame) {
      category.push(data.vidgame);
    }
    if (animator) {
      category.push(data.animator);
    }
    
    // validating number of images uploaded
    const images = req.files.images;
    if (images.length > 5) {
      // rendering profile page with error message
      const user = await User.findById(req.session.user._id);
      const projects = await Project.find({ userId: user._id });
      const reviews = await Review.find({ toId: user._id }).populate("userId");
      return res.render("my_profile", {
        user,
        projects,
        reviews,
        path: "/profile",
        guest: false,
        hide: "",
        error: `<script>alert('Sorry, Maximum five images are allowed!'); window.location.replace("/profile")</script>`,
      });
    }
    
    // creating project with given details
    const filenames = images.map((image) => image.filename);
    const project = await Project.create({
      userId: req.session.user._id,
      name: req.body.name,
      description: req.body.description,
      images: filenames,
      additionalInfo: req.body.additionalInfo ? req.body.additionalInfo : "",
      category,
    });
    res.redirect("/profile");
  } catch (error) {
    console.log(error.message);
  }
};
// This function deletes a project by its id.
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    res.status(200).json(project);
  } catch (err) {
    console.log(err.message);
  }
};

// This function updates a user's account information.
exports.updateAccount = async (req, res) => {
  try {
    if (req.file) {
      req.body.image = req.file.filename;
    }
    const user = await User.findByIdAndUpdate(req.session.user._id, req.body);
    res.redirect("/profile");
  } catch (err) {
    console.log(err.message);
  }
};

// This function adds a new review and creates a notification for the user who receives the review.
exports.addReview = async (req, res) => {
  const review = await Review.create({ userId: req.session.user._id, ...req.body });
  const message = "A new review from " + req.session.user.email;
  const notification = await Notification.create({
    userId: req.body.toId,
    message,
    reviewId: review._id,
  });
  res.redirect(req.get("referer"));
};

// This function updates a project by its id.
exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.body.id, req.body);
    res.redirect("/profile");
  } catch (err) {
    console.log(err.message);
  }
};
