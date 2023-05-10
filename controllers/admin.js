const Project = require("../models/project"); // import the project model
const User = require("../models/user"); // import the user model
const Notification = require("../models/notification"); // import the notification model
const Review = require("../models/review"); // import the review model

exports.index = async (req, res) => {
  const searchQuery = req.query.search; // get the search query from the request query parameters
  let query = { type: "user" }; // initialize the query object with a filter to retrieve only users
  if (searchQuery) { // if there's a search query parameter
    const regex = new RegExp(searchQuery, "i"); // create a regex object to perform case-insensitive search
    query = {
      $or: [ // use the $or operator to search for the query in multiple fields
        { firstname: { $regex: regex } },
        { lastname: { $regex: regex } },
        { email: { $regex: regex } },
      ],
    };
  }

  const projectCount = await Project.countDocuments({}); // count the number of projects
  const userCount = await User.countDocuments({}); // count the number of users
  const reviewCount = await Review.countDocuments({}); // count the number of reviews
  User.aggregate( // use the aggregate function to get the number of projects and reviews for each user
    [
      { $match: query }, // apply the filter based on the search query
      {
        $lookup: { // perform a left outer join with the projects collection
          from: "projects",
          localField: "_id",
          foreignField: "userId",
          as: "projects",
        },
      },
      {
        $lookup: { // perform a left outer join with the reviews collection
          from: "reviews",
          localField: "_id",
          foreignField: "toId",
          as: "reviews",
        },
      },
      {
        $project: { // project only the required fields
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
    function (err, users) { // handle the response from the aggregate function
      if (err) {
        console.error(err);
        return;
      }
      res.render("admin/index", { users, projectCount, userCount, reviewCount }); // render the admin dashboard view with the retrieved data
    },
  );
};

exports.getProjects = async (req, res) => {
  const pendingProjects = await Project.find({ status: "Pending" }).populate("userId"); // retrieve all pending projects and populate the user object

  res.render("admin/projects", { pendingProjects }); // render the admin projects view with the retrieved data
};

exports.deleteAccount = async (req, res) => {
  try {
    // find the user by ID and delete it
    const user = await User.findByIdAndDelete(req.params.id);

    // delete all projects that have the same userId
    await Project.deleteMany({ userId: user._id });

    // delete all notifications that have the same userId
    await Notification.deleteMany({ userId: user._id });

    // delete all reviews that have the same toId or userId
    await Review.deleteMany({ toId: user._id });
    await Review.deleteMany({ userId: user._id });

    // redirect to the admin dashboard
    res.redirect("/admin/");
  } catch (error) {
    console.log(error.message);
  }
};

exports.approveProject = async (req, res) => {
  try {
    // find the project by ID and update its status to "Approved"
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { status: "Approved" },
      { new: true },
    );

    // create a notification to inform the project owner that their project has been approved
    const notification = await Notification.create({
      userId: project.userId,
      message: `Your project "${project.name}" has been approved!`,
    });

    // redirect to the admin projects page
    res.redirect("/admin/projects");
  } catch (error) {
    console.log(error.message);
  }
};

exports.rejectProject = async (req, res) => {
  try {
    // find the project by ID and update its status to "Rejected"
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { status: "Rejected" },
      { new: true },
    );

    // create a notification to inform the project owner that their project has been rejected
    const notification = await Notification.create({
      userId: req.session.user._id, // the user who rejected the project
      toId: project.userId, // the project owner
      message: `Your project "${project.name}" has been rejected!`,
    });

    // redirect to the admin projects page
    res.redirect("/admin/projects");
  } catch (error) {
    console.log(error.message);
  }
};
