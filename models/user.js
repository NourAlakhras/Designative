const mongoose = require("mongoose");

// Define a schema for your data model
const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: [true, "please enter an email"],
    unique: true,
  },
  password: {
    type: String,
    required: true,
    // validators right now arent doing anything
    minlength: [6, "Minimum password length is 6 characters"],
  },
  address: {
    type: String,
  },
  phoneNumber: {
    type: String,
  },
  image: {
    type: String,
  },
  type: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
});

// Create a model from the schema
const User = mongoose.model("User", userSchema);

// Export the model
module.exports = User;
