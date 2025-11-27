const wrapper = document.querySelector(".wrapper");
const loginLink = document.querySelector(".login-link");
const registerLink = document.querySelector(".register-link");
const btnPopup = document.querySelector(".btnLogin-popup");
const iconClose = document.querySelector(".icon-close");

// Initialization: Check if the user is already logged in (optional)
document.addEventListener('DOMContentLoaded', () => {
    if (sessionStorage.getItem('loggedIn') === 'true') {
        // Optional: Kung gusto mong i-redirect agad ang user kung naka-login na sila.
        // window.location.href = "tourist-form.html"; 
    }
});


// ---------------- UI/POPUP CONTROLS ----------------

// Switch to Register form view
registerLink.addEventListener("click", () => {
    wrapper.classList.add("active");
});

// Switch to Login form view
loginLink.addEventListener("click", () => {
    wrapper.classList.remove("active");
});

// Open popup (show the wrapper)
btnPopup.addEventListener("click", () => {
    wrapper.classList.add("active-popup");
});

// Close popup (hide the wrapper)
iconClose.addEventListener("click", () => {
    wrapper.classList.remove("active-popup");
    wrapper.classList.remove("active"); // Ensure it defaults to login view when closed
});


// ---------------- REGISTER FORM LOGIC ----------------
const registerForm = document.querySelector('.form-box.register form');

registerForm.addEventListener('submit', function(e){
    e.preventDefault();

    const username = registerForm.querySelector('input[type="text"]').value;
    const email = registerForm.querySelector('input[type="email"]').value;
    const password = registerForm.querySelector('input[type="password"]').value;
    const termsChecked = registerForm.querySelector('input[type="checkbox"]').checked;

    if(username && email && password && termsChecked){
        // Save user to localStorage
        const user = { username, email, password };
        localStorage.setItem('registeredUser', JSON.stringify(user));

        alert("Registration successful! You can now log in.");
        // Switch to login view after successful registration
        wrapper.classList.remove("active"); 

        // Clear the registration form fields (optional but good practice)
        registerForm.reset(); 
    } else {
        alert("Please fill all fields and agree to the terms.");
    }
});


// ---------------- LOGIN FORM LOGIC ----------------
const loginForm = document.querySelector('.form-box.login form');

loginForm.addEventListener('submit', function(e){
    e.preventDefault();

    const email = loginForm.querySelector('input[type="email"]').value;
    const password = loginForm.querySelector('input[type="password"]').value;

    // Retrieve registered user from localStorage
    const savedUser = JSON.parse(localStorage.getItem('registeredUser'));

    // Check if user exists and credentials match
    if(savedUser && email === savedUser.email && password === savedUser.password){
        
        sessionStorage.setItem('loggedIn', 'true'); // Save login status
        alert("Login successful! Redirecting to Tourist Form.");
        
        // ** ITO ANG NAG-II-LINK SA TOURIST FORM! **
        window.location.href = "tourist_form.html"; 

    } else {
        alert("Invalid email or password. Please try again or Register.");
    }
});