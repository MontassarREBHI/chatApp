const mongoose = require("mongoose");
// Define the user schema

const messageSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  socketId: {
    type: String,
    required: true,
  },
  socketReceiver: {
    type: String,
    required: true,
  },
  receiverName: {
    type: String,
    required: true,
  },
});

// Create and export the user model
module.exports = mongoose.model("Message", messageSchema);
