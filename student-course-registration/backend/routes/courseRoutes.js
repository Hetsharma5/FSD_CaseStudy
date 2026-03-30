const express = require('express');
const router = express.Router();
const Course = require('../models/Course');

// @route   GET /api/courses
// @desc    Get all available courses
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    res.json(courses);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/courses
// @desc    Admin: Create a new course (Utility route to populate db)
router.post('/', async (req, res) => {
  try {
    const { title, description, credits, instructor } = req.body;
    
    const newCourse = new Course({
      title,
      description,
      credits,
      instructor
    });

    const course = await newCourse.save();
    res.status(201).json(course);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
