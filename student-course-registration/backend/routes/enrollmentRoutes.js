const express = require('express');
const router = express.Router();
const Enrollment = require('../models/Enrollment');

// @route   POST /api/enrollments
// @desc    Enroll a student in a course
router.post('/', async (req, res) => {
  try {
    const { studentId, courseId } = req.body;

    // Check for existing enrollment
    const existing = await Enrollment.findOne({ student: studentId, course: courseId });
    if (existing) {
      return res.status(400).json({ message: 'Student is already enrolled in this course' });
    }

    const enrollment = new Enrollment({
      student: studentId,
      course: courseId
    });

    await enrollment.save();
    
    // Populate course details to return
    const populated = await Enrollment.findById(enrollment._id).populate('course');
    res.status(201).json(populated);
  } catch (err) {
    if (err.code === 11000) {
        return res.status(400).json({ message: 'Student is already enrolled in this course' });
    }
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/enrollments/:studentId
// @desc    Get all enrollments for a specific student
router.get('/:studentId', async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ student: req.params.studentId })
      .populate('course')
      .sort({ createdAt: -1 });
      
    res.json(enrollments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
