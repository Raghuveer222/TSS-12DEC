// Retrieve logged-in transporter details
const loggedInTransporter = JSON.parse(localStorage.getItem("loggedInUser"));

if (!loggedInTransporter) {
    alert("No transporter is logged in. Redirecting to login page.");
    window.location.href = "login.html";
} else {
    // Populate transporter profile
    document.getElementById("username").textContent = loggedInTransporter.name;
    document.getElementById("email").textContent = loggedInTransporter.email;
}

// Dashboard Navigation
document.getElementById("dashboard-link").addEventListener("click", () => {
    showSection("dashboard-section");
});
document.getElementById("manage-shipments-link").addEventListener("click", () => {
    showSection("manage-shipments-section");
    loadShipmentRequests();
});
document.getElementById("manage-profile-link").addEventListener("click", () => {
    showSection("manage-profile-section");
});

function showSection(sectionId) {
    const sections = document.querySelectorAll("div[id$='-section']");
    sections.forEach(section => section.style.display = "none");
    document.getElementById(sectionId).style.display = "block";
}

// Load Shipment Requests
function loadShipmentRequests() {
    const requests = JSON.parse(localStorage.getItem("shipmentRequests")) || [];
    const container = document.getElementById("requests-container");
    container.innerHTML = "";

    if (requests.length === 0) {
        container.innerHTML = "<p>No shipment requests available.</p>";
        return;
    }

    requests.forEach((request, index) => {
        const requestCard = document.createElement("div");
        requestCard.className = "card";
        requestCard.innerHTML = `
            <p><strong>Drop-off Location:</strong> ${request.location}</p>
            <p><strong>Date & Time:</strong> ${request.dateTime}</p>
            <p><strong>Goods:</strong> ${request.goodsDescription}</p>
            <p><strong>Vehicle Type:</strong> ${request.vehicleType}</p>
            <p><strong>Requested by:</strong> ${request.user}</p>
            <button onclick="approveRequest(${index})">Approve</button>
            <button onclick="rejectRequest(${index})">Reject</button>
        `;
        container.appendChild(requestCard);
    });
}

function approveRequest(index) {
    handleRequest(index, "approved");
}

function rejectRequest(index) {
    handleRequest(index, "rejected");
}

function handleRequest(index, status) {
    const requests = JSON.parse(localStorage.getItem("shipmentRequests")) || [];
    requests.splice(index, 1); // Remove the request
   
}