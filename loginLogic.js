// Select the username and password input fields
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const adminForm = document.getElementById('admin-form');
const errorMessage = document.getElementById('error-message');

/*
// Add event listeners for input validation
usernameInput.addEventListener('input', () => {
    const username = usernameInput.value.trim();
    if (username === '') {
        console.warn('Username cannot be empty');
    } else if (username === 'MOSS') {
        console.info('Username is valid');
    } else {
        console.warn('Username is invalid');
    }
});

passwordInput.addEventListener('input', () => {
    const password = passwordInput.value;
    if (password.length < 6) {
        console.warn('Password must be at least 6 characters long');
    } else if (password === '123456') {
        console.info('Password is valid');
    } else {
        console.warn('Password is invalid');
    }
});
*/

// Add event listener to the form submission
adminForm.addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent the form from submitting normally

    const username = usernameInput.value.trim();
    const password = passwordInput.value;

    try {
        // Validate credentials
        if (username === 'MOSS' && password === '123456') {
            console.info('Login successful. Redirecting to control panel...');
            
            // Store a session token in sessionStorage
            sessionStorage.setItem('authToken', 'loggedIn');

            // Store the login timestamp
            sessionStorage.setItem('loginTime', Date.now());

            // Redirect to the control panel
            window.location.href = 'controlpanel.html';
        } else {
            console.error('Invalid username or password');

        }
    } catch (error) {
        console.error('An error occurred during login:', error);

    }
});