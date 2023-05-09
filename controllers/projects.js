const Project = require("../models/project");

exports.projects = async (req, res) => {
  const searchQuery = req.query.search; // get the search query from req.query
  const category = req.query.category; // get the category from req.query
  let query = { status: "Approved" }; // create an empty object to hold the query

  // if searchQuery is present, use it to search the name and description fields
  if (searchQuery) {
    const regex = new RegExp(searchQuery, "i");
    query = {
      $or: [{ name: { $regex: regex } }, { description: { $regex: regex } }],
      ...query //avoid showing project in search
    };
  }

  // if category is present, add it to the query object
  if (category) {
    query.category = category;
  }

  try {
    const projects = await Project.find(query).populate("userId", "username");
    res.render("category1", {
      path: "/projects",
      projects,
      category: req.query.category,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.category = (req, res) => {
  res.render("Category-Page", {
    path: "/category",
  });
};
