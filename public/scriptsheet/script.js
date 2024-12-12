// Event Listeners for Forms
document.getElementById("signup-form").addEventListener("submit", handleSignup);
document.getElementById("login-form").addEventListener("submit", handleLogin);

// Handle Signup
function handleSignup(event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("signup-email").value;
    const password = document.getElementById("signup-password").value;
    const role = document.getElementById("role-signup").value;

    // Basic Validation
    if (password.length < 6) {
        alert("Password must be at least 6 characters long.");
        return;
    }

    // Save User Data to localStorage
    const userData = { name, email, password, role };
    localStorage.setItem(email, JSON.stringify(userData));

    alert("Signup successful! You can now log in.");
    document.getElementById("signup-form").reset();
    openTab(null, "login"); // Redirect to Login tab
}

// Handle Login
function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const role = document.getElementById("role").value;

    // Retrieve User Data
    const userData = JSON.parse(localStorage.getItem(email));

    if (!userData || userData.password !== password || userData.role !== role) {
        alert("Invalid credentials or role mismatch.");
        return;
    }

    // Store Logged-in User Info in localStorage
    localStorage.setItem("loggedInUser", JSON.stringify(userData));
    alert("Login successful!");

    // Redirect based on Role
    if (role === "user") {
        window.location.href = "user-page.html";
    } else if (role === "transporter") {
        window.location.href = "transporter-page.html";
    }
}

// Tab Switching Logic
function openTab(event, tabName) {
    const tabs = document.getElementsByClassName("tab-content");
    const tabLinks = document.getElementsByClassName("tablink");

    // Hide all tabs and deactivate links
    for (let tab of tabs) tab.style.display = "none";
    for (let link of tabLinks) link.classList.remove("active");

    // Show the selected tab and activate link
    document.getElementById(tabName).style.display = "block";
    if (event) event.currentTarget.classList.add("active");
}
