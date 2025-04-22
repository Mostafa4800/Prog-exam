// Check if the user is logged in
const authToken = sessionStorage.getItem('authToken');
const loginTime = sessionStorage.getItem('loginTime');
const timeoutDuration = 5 * 60 * 1000; // 5 minutes in milliseconds

if (!authToken || Date.now() - loginTime > timeoutDuration) {
    // If no token or session expired, redirect to login page
    alert('Session expired. Please log in again.');
    window.location.href = 'index.html';
}

// Function to reset the session timeout
function resetTimeout() {
    sessionStorage.setItem('loginTime', Date.now());
    clearTimeout(logoutTimer);
    startLogoutTimer();
}

// Start the logout timer
let logoutTimer;
function startLogoutTimer() {
    logoutTimer = setTimeout(() => {
        alert('Session expired. Logging out...');
        sessionStorage.clear();
        window.location.href = 'index.html';
    }, timeoutDuration);
}

// Add event listeners to detect user activity
['click', 'mousemove', 'keydown', 'scroll', 'touchstart'].forEach(event => {
    document.addEventListener(event, resetTimeout);
});

// Start the initial logout timer
startLogoutTimer();

// Logout button functionality
document.getElementById('logout-button').addEventListener('click', () => {
    // Clear session storage and redirect to login page
    sessionStorage.clear();
    window.location.href = 'index.html';
});