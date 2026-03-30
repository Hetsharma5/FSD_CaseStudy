const API_URL = 'http://localhost:5000/api';

document.addEventListener('DOMContentLoaded', () => {
    // Check if already logged in
    if (localStorage.getItem('student')) {
        window.location.href = 'dashboard.html';
        return;
    }

    const loginTab = document.getElementById('loginTab');
    const registerTab = document.getElementById('registerTab');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    const loginError = document.getElementById('loginError');
    const registerError = document.getElementById('registerError');

    const switchToRegister = document.getElementById('switchToRegister');
    const switchToLogin = document.getElementById('switchToLogin');
    const formTitle = document.getElementById('formTitle');

    // Tab Switching via Links
    function showLoginForm(e) {
        if(e) e.preventDefault();
        loginForm.classList.add('active');
        registerForm.classList.remove('active');
        formTitle.textContent = 'Log In';
        loginError.textContent = '';
    }

    function showRegisterForm(e) {
        if(e) e.preventDefault();
        registerForm.classList.add('active');
        loginForm.classList.remove('active');
        formTitle.textContent = 'Registration';
        registerError.textContent = '';
    }

    switchToRegister.addEventListener('click', showRegisterForm);
    switchToLogin.addEventListener('click', showLoginForm);

    // Initial state based on DOM active classes
    if (registerForm.classList.contains('active')) {
        formTitle.textContent = 'Registration';
    } else {
        formTitle.textContent = 'Log In';
    }

    // Login Submission
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        loginError.textContent = '';
        const btn = loginForm.querySelector('button');
        btn.textContent = 'Logging in...';
        btn.disabled = true;

        try {
            const res = await fetch(`${API_URL}/students/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Login failed');

            localStorage.setItem('student', JSON.stringify(data));
            window.location.href = 'dashboard.html';
        } catch (err) {
            loginError.textContent = err.message;
        } finally {
            btn.textContent = 'Log In';
            btn.disabled = false;
        }
    });

    // Register Submission
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;

        if (password.length < 6) {
            registerError.textContent = 'Password must be at least 6 characters';
            return;
        }

        registerError.textContent = '';
        const btn = registerForm.querySelector('button');
        btn.textContent = 'Creating account...';
        btn.disabled = true;

        try {
            const res = await fetch(`${API_URL}/students/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Registration failed');

            localStorage.setItem('student', JSON.stringify(data));
            window.location.href = 'dashboard.html';
        } catch (err) {
            registerError.textContent = err.message;
        } finally {
            btn.textContent = 'Sign Up';
            btn.disabled = false;
        }
    });
});
