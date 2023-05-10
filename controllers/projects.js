const Project = require("../models/project"); // import the Project model

exports.projects = async (req, res) => { // define an asynchronous function that handles requests to the /projects route
  const searchQuery = req.query.search; // extract the value of the 'search' query parameter from the request object
  const category = req.query.category; // extract the value of the 'category' query parameter from the request object
  let query = { status: "Approved" }; // define an object that will be used as the search query, initially set to only include projects with 'Approved' status

  if (searchQuery) { // if a search query parameter was provided
    const regex = new RegExp(searchQuery, "i"); // create a regular expression from the search query, with case insensitivity
    query = { // set the search query object to include projects that have a name or description that matches the search query, and also satisfies the previous 'Approved' status condition
      $or: [
        { name: { $regex: regex } },
        { description: { $regex: regex } }
      ],
      ...query // Use the spread operator to append the previous query object, so it does not show any other status projects in the search
    };
  }

  if (category) { // if a category parameter was provided
    query.category = category; // add it to the search query object
  }

  try {
    const projects = await Project.find(query).populate("userId", "username"); // find projects that match the search query, and populate the 'userId' field of each project with the corresponding user's 'username'
    res.render("category1", { // render the 'category1' view with the 'projects' data and other variables
      path: "/projects",
      projects,
      category: req.query.category,
    });
  } catch (error) {
    console.error(error); // log any errors that occur
    res.status(500).json({ message: "Server error" }); // send a JSON response with an error message and a 500 status code
  }
};

exports.category = (req, res) => { // define a function to handle requests to the /category route
  res.render("Category-Page", { // render the 'Category-Page' view with the 'path' variable
    path: "/category",
  });
};
