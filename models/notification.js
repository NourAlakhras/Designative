const mongoose = require("mongoose");

// Define a schema for your data model
const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  reviewId: {
    type: String,
    ref: "Review",
  },
});
// Create a model from the schema
const Notification = mongoose.model("Notification", notificationSchema);

// Export the model
module.exports = Notification;
