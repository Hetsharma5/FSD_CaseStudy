const mongoose = require('mongoose');
require('dotenv').config();
const Course = require('./models/Course');

mongoose.connect('mongodb://127.0.0.1:27017/studentRegistration', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(async () => {
    console.log('Connected to MongoDB');

    const sampleCourses = [
        {
            title: 'Full Stack Web Development',
            description: 'Learn modern full-stack web development using HTML, CSS, JS, React, and Node.js.',
            credits: 4,
            instructor: "Prof. Minal Ma'am"
        },
        {
            title: 'Data Structures and Algorithms',
            description: 'Master the core concepts of software engineering to ace your interviews.',
            credits: 3,
            instructor: 'Dr. Puneet Sir'
        },
        {
            title: 'Database Management Systems',
            description: 'An advanced course on SQL and NoSQL database management and architecture.',
            credits: 3,
            instructor: 'Prof. Jatin Sir'
        },
        {
            title: 'Machine Learning Basics',
            description: 'Introduction to Artificial Intelligence and Machine Learning concepts.',
            credits: 4,
            instructor: 'Dr. Manivel Sir'
        }
    ];

    try {
        await Course.deleteMany({}); // clear existing
        await Course.insertMany(sampleCourses);
        console.log('Sample courses inserted successfully');
    } catch (err) {
        console.error('Error seeding courses:', err);
    } finally {
        mongoose.connection.close();
    }
}).catch(err => {
    console.error('Connection error:', err);
});
