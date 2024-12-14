// Check if the transporter is logged in
const loggedInTransporter = JSON.parse(localStorage.getItem("loggedInUser"));

if (!loggedInTransporter) {
    alert("No transporter is logged in. Redirecting to login page.");
    window.location.href = "/login"; // Adjust path as needed
} else {
    // Populate transporter profile details dynamically
    document.getElementById("transporter-name").textContent = loggedInTransporter.name;
    document.getElementById("transporter-email").textContent = loggedInTransporter.email;
    if (loggedInTransporter.vehicleTypes && loggedInTransporter.vehicleTypes.length > 0) {
        document.getElementById("transporter-vehicles").textContent = loggedInTransporter.vehicleTypes.join(", ");
    } else {
        document.getElementById("transporter-vehicles").textContent = "No vehicles listed.";
    }
}

// Navigation links functionality
document.getElementById("dashboard-link").addEventListener("click", () => {
    showSection("dashboard-section");
});
document.getElementById("view-shipments-link").addEventListener("click", () => {
    showSection("view-shipments-section");
    loadShipments();
});
document.getElementById("manage-profile-link").addEventListener("click", () => {
    showSection("manage-profile-section");
});

// Function to show a specific section and hide others
function showSection(sectionId) {
    const sections = document.querySelectorAll("div[id$='-section']");
    sections.forEach(section => section.style.display = "none");
    document.getElementById(sectionId).style.display = "block";
}

// Load shipments dynamically
function loadShipments() {
    const shipmentTableBody = document.getElementById("shipmentTableBody");

    // Assuming shipments are fetched from localStorage or an API
    const shipments = JSON.parse(localStorage.getItem("shipments")) || [];
    shipmentTableBody.innerHTML = "";

    if (shipments.length === 0) {
        shipmentTableBody.innerHTML = `<tr><td colspan="7">No shipments available</td></tr>`;
        return;
    }

    shipments.forEach(shipment => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${shipment._id}</td>
            <td>${shipment.location}</td>
            <td>${shipment.dateTime}</td>
            <td>${shipment.goodsDescription}</td>
            <td>${shipment.vehicleType}</td>
            <td>${shipment.status}</td>
            <td>
                ${shipment.status === 'Pending' ? 
                    `<button class="accept-btn" data-id="${shipment._id}">Accept</button>` : 
                    `<button class="update-status-btn" data-id="${shipment._id}">Update Status</button>`
                }
            </td>
        `;

        // Add event listeners to buttons
        const acceptBtn = row.querySelector(".accept-btn");
        const updateStatusBtn = row.querySelector(".update-status-btn");

        if (acceptBtn) {
            acceptBtn.addEventListener("click", () => handleShipmentAction(shipment._id, "Accepted"));
        }
        if (updateStatusBtn) {
            updateStatusBtn.addEventListener("click", () => handleShipmentAction(shipment._id, "In Progress"));
        }

        shipmentTableBody.appendChild(row);
    });
}

// Handle shipment actions
function handleShipmentAction(shipmentId, newStatus) {
    let shipments = JSON.parse(localStorage.getItem("shipments")) || [];

    shipments = shipments.map(shipment => {
        if (shipment._id === shipmentId) {
            shipment.status = newStatus;
        }
        return shipment;
    });

    localStorage.setItem("shipments", JSON.stringify(shipments));
    loadShipments(); // Refresh the shipment table
}

// Additional utility functions can be added if required
