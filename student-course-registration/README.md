# Student Course Registration 

This is a full-stack web app I built for my FSD practical. It lets students create an account, log in, view a list of available courses, and enroll in them. 

### What's Inside

* **Frontend**: Pure HTML, CSS, and vanilla JavaScript. I used a glassmorphism design for the UI and the Fetch API to connect with the backend. No frontend frameworks were used!
* **Backend**: Node.js and Express.js REST API.
* **Database**: MongoDB (via Mongoose) to store the students, courses, and enrollments.

### How to Run the Project

1. **Backend Setup**
   Make sure you have MongoDB running locally on port 27017. 
   Open a terminal in the `backend` folder and run:
   ```bash
   npm install
   node seedCourses.js # (Optional) This adds some dummy courses to the DB to test with
   npm start
   ```
   The backend should now be running on port 5000.

2. **Frontend Setup**
   Since the frontend is just static files, you don't need to run any npm commands for it. Just double-click `frontend/index.html` to open it in your browser. If you're using VS Code, opening it with the "Live Server" extension works great too.
