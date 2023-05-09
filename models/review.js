const mongoose = require("mongoose");

// Define a schema for your data model
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
// Create a model from the schema
const Review = mongoose.model("Review", reviewSchema);

// Export the model
module.exports = Review;
