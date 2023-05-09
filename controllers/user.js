const Project = require("../models/project");
const User = require("../models/user");
const Notification = require("../models/notification");
const Review = require("../models/review");
const mongoose = require("mongoose");

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

data = {
  filmmaker: "Filmmaker",
  webdes: "Web Designer",
  branddes: "Brand Designer",
  vidgame: "Video Game Designer",
  animator: "Animator",
};

exports.addProject = async (req, res) => {
  const { filmmaker, webdes, branddes, vidgame, animator } = req.body;
  try {
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
    const images = req.files.images;

    if (images.length > 5) {
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

exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    res.status(200).json(project);
  } catch (err) {
    console.log(err.message);
  }
};

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

exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.body.id, req.body);
    res.redirect("/profile");
  } catch (err) {
    console.log(err.message);
  }
};
