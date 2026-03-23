
// Gestion des sections

function showSection(sectionId) {
    document.querySelectorAll(".section").forEach(sec => sec.classList.add("hidden"));
    document.getElementById(sectionId).classList.remove("hidden");

    if (sectionId === "catways") loadCatways();
    if (sectionId === "reservations") loadReservations();
    if (sectionId === "profile") loadProfile();
}


// Déconnexion

function logout() {
    localStorage.removeItem("token");
    window.location.href = "/login.html";
}


// PROFIL

async function loadProfile() {
    const res = await fetch("/users/me", {
        headers: { "Authorization": "Bearer " + localStorage.getItem("token") }
    });
    const user = await res.json();

    document.getElementById("profile-info").innerHTML = `
        <p><strong>Nom :</strong> ${user.name}</p>
        <p><strong>Email :</strong> ${user.email}</p>
    `;
}


// CATWAYS

function showAddCatwayForm() {
    document.getElementById("add-catway-form").classList.toggle("hidden");
}

async function loadCatways() {
    const res = await fetch("/catways", {
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        }
    });

    const catways = await res.json();

    const container = document.getElementById("catways-list");
    container.innerHTML = "";

    catways.forEach(c => {
        const div = document.createElement("div");
        div.innerHTML = `
            <strong>Catway ${c.catwayNumber}</strong><br>
            Type : ${c.catwayType}<br>
            État : ${c.catwayState}<br>
            <button onclick="editCatway(${c.catwayNumber})">Modifier</button>
             <button onclick="deleteCatway(${c.catwayNumber})">Supprimer</button>
            <hr>
        `;
        container.appendChild(div);
    });
}

async function createCatway() {
    const newCatway = {
        catwayNumber: document.getElementById("catway-number").value,
        catwayType: document.getElementById("catway-type").value,
        catwayState: "OK"
    };

    await fetch("/catways", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
        body: JSON.stringify(newCatway)
    });

    loadCatways();
}

async function editCatway(number) {
    const res = await fetch(`/catways/${number}`, {
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        }
    });

    const catway = await res.json();

    document.getElementById("edit-catway-number").value = catway.catwayNumber;
    document.getElementById("edit-catway-type").value = catway.catwayType;
    document.getElementById("edit-catway-state").value = catway.catwayState;

    document.getElementById("edit-catway-form").classList.remove("hidden");
}

async function updateCatway() {
    const number = document.getElementById("edit-catway-number").value;

    const updated = {
        catwayNumber: number,
        catwayType: document.getElementById("edit-catway-type").value,
        catwayState: document.getElementById("edit-catway-state").value
    };

    await fetch(`/catways/${number}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
        body: JSON.stringify(updated)
    });

    loadCatways();
}

async function deleteCatway(number) {
    await fetch(`/catways/${number}`, {
        method: "DELETE",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        }
    });

    loadCatways();
}

// RÉSERVATIONS

async function loadReservations() {
    const res = await fetch("/reservations", {
    headers: {
        "Authorization": "Bearer " + localStorage.getItem("token")
    }
});
    const reservations = await res.json();

    const container = document.getElementById("reservations-list");
    container.innerHTML = "";

    reservations.forEach(r => {
        const div = document.createElement("div");
        div.innerHTML = `
            <strong>${r.boatName}</strong><br>
            Client : ${r.clientName}<br>
            Du ${new Date(r.startDate).toLocaleDateString("fr-FR")}
            au ${new Date(r.endDate).toLocaleDateString("fr-FR")}<br>
            Catway : ${r.catwayNumber}<br>
            <button onclick="editReservation('${r._id}')">Modifier</button>
            <button onclick="deleteReservation('${r._id}')">Supprimer</button>
            <hr>
        `;
        container.appendChild(div);
    });
}

async function editReservation(id) {
    const res = await fetch(`/reservations/${id}`, {
    headers: {
        "Authorization": "Bearer " + localStorage.getItem("token")
    }
});
    const r = await res.json();

    document.getElementById("edit-id").value = r._id;
    document.getElementById("edit-boatName").value = r.boatName;
    document.getElementById("edit-clientName").value = r.clientName;
    document.getElementById("edit-startDate").value = r.startDate.slice(0, 10);
    document.getElementById("edit-endDate").value = r.endDate.slice(0, 10);
    document.getElementById("edit-catwayNumber").value = r.catwayNumber;

    showSection("edit-reservation");
}

document.getElementById("edit-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = document.getElementById("edit-id").value;

    const updated = {
        boatName: document.getElementById("edit-boatName").value,
        clientName: document.getElementById("edit-clientName").value,
        startDate: document.getElementById("edit-startDate").value,
        endDate: document.getElementById("edit-endDate").value,
        catwayNumber: document.getElementById("edit-catwayNumber").value
    };

    await fetch(`/reservations/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
        body: JSON.stringify(updated)
    });

    showSection("reservations");
});

async function deleteReservation(id) {
    await fetch(`/reservations/${id}`, {
        method: "DELETE",
        headers: { "Authorization": "Bearer " + localStorage.getItem("token") }
    });

    loadReservations();
}