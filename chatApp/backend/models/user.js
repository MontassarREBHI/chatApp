const mongoose = require('mongoose');

// Define the user schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  socketId: {
    type: String,
    required: true,
    unique: true
  },
  connected:{
    type:Boolean,
    default: false, 
  }
});

// Create and export the user model
module.exports = mongoose.model('User', userSchema);