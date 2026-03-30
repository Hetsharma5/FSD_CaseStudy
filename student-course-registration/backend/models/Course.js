const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  credits: {
    type: Number,
    required: true,
    min: 1
  },
  instructor: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);
