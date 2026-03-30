const express = require('express');
const router = express.Router();
const Student = require('../models/Student');

// @route   POST /api/students/register
// @desc    Register a new student
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if student exists
    let student = await Student.findOne({ email });
    if (student) {
      return res.status(400).json({ message: 'Student already exists' });
    }

    // Usually hash password here, skipped for simplicity
    student = new Student({
      name,
      email,
      password
    });

    await student.save();
    
    // Send back minimal user info
    res.status(201).json({
      _id: student._id,
      name: student.name,
      email: student.email
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/students/login
// @desc    Login student
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if student exists
    let student = await Student.findOne({ email });
    if (!student) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    // Verify password (plain text comparison for simplicity, normally use bcrypt)
    if (student.password !== password) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    // Respond with user info 
    res.json({
      _id: student._id,
      name: student.name,
      email: student.email
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
