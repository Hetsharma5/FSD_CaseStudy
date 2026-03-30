const API_URL = 'http://localhost:5000/api';

document.addEventListener('DOMContentLoaded', () => {
    const studentData = localStorage.getItem('student');
    if (!studentData) {
        window.location.href = 'index.html';
        return;
    }

    const student = JSON.parse(studentData);
    document.getElementById('studentNameDisplay').textContent = `Welcome, ${student.name.split(' ')[0]}`;

    const logoutBtn = document.getElementById('logoutBtn');
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('student');
        window.location.href = 'index.html';
    });

    let availableCourses = [];
    let myEnrollments = [];

    async function fetchData() {
        try {
            const [coursesRes, enrollSRes] = await Promise.all([
                fetch(`${API_URL}/courses`),
                fetch(`${API_URL}/enrollments/${student._id}`)
            ]);

            availableCourses = await coursesRes.json();
            myEnrollments = await enrollSRes.json();
            
            renderDashboard();
        } catch (error) {
            console.error('Error fetching data:', error);
            document.getElementById('availableCourses').innerHTML = '<div class="error-message">Failed to load data</div>';
            document.getElementById('myEnrollments').innerHTML = '<div class="error-message">Failed to load data</div>';
        }
    }

    function renderDashboard() {
        renderMyEnrollments();
        renderAvailableCourses();
    }

    function renderMyEnrollments() {
        const container = document.getElementById('myEnrollments');
        container.innerHTML = '';

        if (myEnrollments.length === 0) {
            container.innerHTML = '<div class="empty-state">No enrolled courses yet.</div>';
            return;
        }

        myEnrollments.forEach(enrollment => {
            const course = enrollment.course;
            if (!course) return; // defensive check

            const item = document.createElement('div');
            item.className = 'course-item';
            item.innerHTML = `
                <div class="course-header">
                    <span class="course-title">${course.title}</span>
                    <span class="course-credits">${course.credits} Credits</span>
                </div>
                <div class="course-instructor">Instructor: ${course.instructor}</div>
                <div class="enrolled-badge">Enrolled on ${new Date(enrollment.enrollmentDate).toLocaleDateString()}</div>
            `;
            container.appendChild(item);
        });
    }

    function renderAvailableCourses() {
        const container = document.getElementById('availableCourses');
        container.innerHTML = '';

        if (availableCourses.length === 0) {
            container.innerHTML = '<div class="empty-state">No courses available.</div>';
            return;
        }

        const enrolledCourseIds = myEnrollments.map(e => e.course ? e.course._id : null).filter(Boolean);

        availableCourses.forEach(course => {
            const isEnrolled = enrolledCourseIds.includes(course._id);
            const item = document.createElement('div');
            item.className = 'course-item';
            
            item.innerHTML = `
                <div class="course-header">
                    <span class="course-title">${course.title}</span>
                    <span class="course-credits">${course.credits} Credits</span>
                </div>
                <div class="course-desc">${course.description}</div>
                <div class="course-instructor">Instructor: ${course.instructor}</div>
            `;

            if (isEnrolled) {
                const badge = document.createElement('div');
                badge.className = 'enrolled-badge';
                badge.textContent = 'Already Enrolled';
                badge.style.background = '#6B7280';
                item.appendChild(badge);
            } else {
                const btn = document.createElement('button');
                btn.className = 'enroll-btn';
                btn.textContent = 'Enroll Now';
                btn.onclick = () => enrollCourse(course._id, btn);
                item.appendChild(btn);
            }

            container.appendChild(item);
        });
    }

    async function enrollCourse(courseId, btnElement) {
        btnElement.textContent = 'Enrolling...';
        btnElement.disabled = true;

        try {
            const res = await fetch(`${API_URL}/enrollments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    studentId: student._id,
                    courseId: courseId
                })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Enrollment failed');

            // Add successfully to local state
            myEnrollments.unshift(data);
            renderDashboard();
        } catch (err) {
            alert(err.message);
            btnElement.textContent = 'Enroll Now';
            btnElement.disabled = false;
        }
    }

    fetchData();
});
