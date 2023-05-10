// Import the Mongoose library
const mongoose = require("mongoose");

// Define a schema for the Review model
const reviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  toId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  message: {
    type: String,
    required: true,
  },
});

// Create a model from the schema using the Mongoose model function
const Review = mongoose.model("Review", reviewSchema);

// Export the model so that it can be used in other parts of the application
module.exports = Review;