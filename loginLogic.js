// Select the username and password input fields
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const adminForm = document.getElementById('admin-form');
const errorMessage = document.getElementById('error-message');

// Add event listeners for input validation
usernameInput.addEventListener('input', () => {
    if (usernameInput.value.trim() === '') {
        console.log('Username cannot be empty');
    } else if (usernameInput.value.trim() === 'MOSS'){
        console.log('Username is valid');
    }else{
        console.log('Username is invalid');
    }
});

passwordInput.addEventListener('input', () => {
    if (passwordInput.value.length < 6) {
        console.log('Password must be at least 6 characters long');
    } else if(passwordInput === '123456') {
        console.log('Password is valid');
    }else {
        console.log('Password is invalid');
    }
});

// Add event listener to the form submission
adminForm.addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent the form from submitting normally

    const username = usernameInput.value.trim();
    const password = passwordInput.value;

    // Validate credentials
    if (username === 'MOSS' && password === '123456') {
        // Store a session token in sessionStorage
        sessionStorage.setItem('authToken', 'loggedIn');

        // Store the login timestamp
        sessionStorage.setItem('loginTime', Date.now());

        // Redirect to the control panel
        window.location.href = 'controlpanel.html';
    } else {
        // Display an error message if credentials are incorrect
        errorMessage.textContent = 'Invalid username or password. Please try again.';
        errorMessage.style.color = 'red';
    }
});