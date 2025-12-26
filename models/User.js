const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['job_seeker', 'employer'],
    required: true,
  },
  // Additional profile fields can be added here
  profile: {
    bio: String,
    resume: String, // Link to resume
    companyName: String, // For employers
    companyWebsite: String, // For employers
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('User', UserSchema);
