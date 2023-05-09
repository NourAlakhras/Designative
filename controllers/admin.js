const Project = require("../models/project");
const User = require("../models/user");
const Notification = require("../models/notification");
const Review = require("../models/review");

exports.index = async (req, res) => {
  const searchQuery = req.query.search; // get the search query from req.query
  // if searchQuery is present, use it to search the name and description fields
  let query = { type: "user" };
  if (searchQuery) {
    const regex = new RegExp(searchQuery, "i");
    query = {
      $or: [
        { firstname: { $regex: regex } },
        { lastname: { $regex: regex } },
        { email: { $regex: regex } },
      ],
    };
  }

  const projectCount = await Project.countDocuments({});
  const userCount = await User.countDocuments({});
  const reviewCount = await Review.countDocuments({});
  // Query to get number of projects and reviews for each user
  User.aggregate(
    [
      { $match: query },
      {
        $lookup: {
          from: "projects",
          localField: "_id",
          foreignField: "userId",
          as: "projects",
        },
      },
      {
        $lookup: {
          from: "reviews",
          localField: "_id",
          foreignField: "toId",
          as: "reviews",
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          firstname: 1,
          lastname: 1,
          email: 1,
          numProjects: { $size: "$projects" },
          numReviews: { $size: "$reviews" },
        },
      },
    ],
    function (err, users) {
      if (err) {
        console.error(err);
        return;
      }
      res.render("admin/index", { users, projectCount, userCount, reviewCount });
    },
  );
};

exports.getProjects = async (req, res) => {
  const pendingProjects = await Project.find({ status: "Pending" }).populate("userId");

  res.render("admin/projects", { pendingProjects });
};

exports.deleteAccount = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    // delete all notifications that has the same userId and all reviews that has the same toId
    await Project.deleteMany({ userId: user._id });
    await Notification.deleteMany({ userId: user._id });
    await Review.deleteMany({ toId: user._id });
    await Review.deleteMany({ userId: user._id });

    res.redirect("/admin/");
  } catch (error) {
    console.log(error.message);
  }
};

exports.approveProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { status: "Approved" },
      { new: true },
    );
    const notification = await Notification.create({
      userId: project.userId,
      message: `Your project "${project.name}" has been approved!`,
    });
    res.redirect("/admin/projects");
  } catch (error) {
    console.log(error.message);
  }
};

exports.rejectProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { status: "Rejected" },
      { new: true },
    );
    const notification = await Notification.create({
      userId: req.session.user._id,
      toId: project.userId,
      message: `Your project "${project.name}" has been rejected!`,
    });
    res.redirect("/admin/projects");
  } catch (error) {
    console.log(error.message);
  }
};
