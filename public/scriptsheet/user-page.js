// Retrieve logged-in user details from localStorage
const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

if (!loggedInUser) {
    alert("No user is logged in. Redirecting to login page.");
    window.location.href = "login.html";
} else {
    // Populate user profile
    document.getElementById("username").textContent = loggedInUser.name;
    document.getElementById("email").textContent = loggedInUser.email;
}

// Dashboard Navigation
document.getElementById("dashboard-link").addEventListener("click", () => {
    showSection("dashboard-section");
});
document.getElementById("initiate-shipment-link").addEventListener("click", () => {
    showSection("initiate-shipment-section");
});
document.getElementById("manage-profile-link").addEventListener("click", () => {
    showSection("manage-profile-section");
});

function showSection(sectionId) {
    const sections = document.querySelectorAll("div[id$='-section']");
    sections.forEach(section => section.style.display = "none");
    document.getElementById(sectionId).style.display = "block";
}

// Handle shipment form submission
document.getElementById("shipmentForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const shipmentDetails = {
        location: document.getElementById("location").value,
        dateTime: document.getElementById("dateTime").value,
        goodsDescription: document.getElementById("goodsDescription").value,
        vehicleType: document.getElementById("vehicleType").value,
        user: loggedInUser.email,
    };

    // Save shipment request to localStorage
    const shipmentRequests = JSON.parse(localStorage.getItem("shipmentRequests")) || [];
    shipmentRequests.push(shipmentDetails);
    localStorage.setItem("shipmentRequests", JSON.stringify(shipmentRequests));

    alert("Your shipment request has been submitted successfully!");
    document.getElementById("shipmentForm").reset();
});
