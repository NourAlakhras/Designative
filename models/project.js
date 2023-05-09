const mongoose = require("mongoose");

// Define a schema for your data model
const projectSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    min_length: 10,
    required: true,
  },
  category: {
    type: [String],
    enum: [
      "Animator",
      "Filmmaker",
      "Web Designer",
      "Brand Designer",
      "Video Game Designer",
    ],
    required: true,
  },
  images: {
    type: [String],
    required: true,
  },
  additionalInfo: {
    type: String,
  },
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending",
  },
});
// Create a model from the schema
const Project = mongoose.model("Project", projectSchema);

// Export the model
module.exports = Project;
