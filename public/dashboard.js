/**
 * Affiche une section du tableau de bord et charge les données associées.
 * @param {String} sectionId - ID de la section à afficher
 */
function showSection(sectionId) {
    document.querySelectorAll(".section").forEach(sec => sec.classList.add("hidden"));
    document.getElementById(sectionId).classList.remove("hidden");

    if (sectionId === "catways") loadCatways();
    if (sectionId === "reservations") loadReservations();
    if (sectionId === "profile") loadProfile();
}

/**
 * Déconnecte l'utilisateur en supprimant le token local
 * puis redirige vers la page de login.
 */
function logout() {
    localStorage.removeItem("token");
    window.location.href = "/login.html";
}

/* ============================
   PROFIL UTILISATEUR
   ============================ */

/**
 * Charge les informations du profil utilisateur connecté.
 * Requête : GET /users/me
 */
async function loadProfile() {
    const res = await fetch("/users/me", {
        headers: { "Authorization": "Bearer " + localStorage.getItem("token") }
    });
    const user = await res.json();

    document.getElementById("profile-info").innerHTML = `
        <p><strong>Nom :</strong> ${user.name || user.username}</p>
        <p><strong>Email :</strong> ${user.email}</p>
    `;
}

/* ============================
   CATWAYS
   ============================ */

/**
 * Affiche ou masque le formulaire d'ajout de catway.
 */
function showAddCatwayForm() {
    document.getElementById("add-catway-form").classList.toggle("hidden");
}

/**
 * Charge la liste des catways.
 * Requête : GET /catways
 */
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

/**
 * Crée un nouveau catway.
 * Requête : POST /catways
 */
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

/**
 * Charge un catway pour édition.
 * Requête : GET /catways/:number
 * @param {Number} number - Numéro du catway
 */
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

/**
 * Met à jour un catway.
 * Requête : PUT /catways/:number
 */
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

/**
 * Supprime un catway.
 * Requête : DELETE /catways/:number
 * @param {Number} number - Numéro du catway
 */
async function deleteCatway(number) {
    await fetch(`/catways/${number}`, {
        method: "DELETE",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        }
    });

    loadCatways();
}

/* ============================
   RÉSERVATIONS
   ============================ */

/**
 * Charge toutes les réservations.
 * Requête : GET /reservations
 */
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

/**
 * Charge une réservation pour édition.
 * Requête : GET /reservations/:id
 * @param {String} id - ID de la réservation
 */
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

/**
 * Soumission du formulaire d'édition de réservation.
 * Requête : PUT /reservations/:id
 */
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

/**
 * Supprime une réservation.
 * Requête : DELETE /reservations/:id
 * @param {String} id - ID de la réservation
 */
async function deleteReservation(id) {
    await fetch(`/reservations/${id}`, {
        method: "DELETE",
        headers: { "Authorization": "Bearer " + localStorage.getItem("token") }
    });

    loadReservations();
}
/**
 * Charge et affiche les réservations en cours aujourd’hui.
 * Une réservation est considérée active si :
 *  - startDate <= aujourd’hui
 *  - endDate >= aujourd’hui
 * Requête : GET /reservations
 */
function loadActiveReservations() {
    fetch("/reservations", {
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        }
    })
    .then(res => res.json())
    .then(reservations => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const active = reservations.filter(r => {
            const start = new Date(r.startDate);
            const end = new Date(r.endDate);

            start.setHours(0, 0, 0, 0);
            end.setHours(0, 0, 0, 0);

            return start <= today && end >= today;
        });

        const container = document.getElementById("active-reservations-list");
        container.innerHTML = "";

        if (active.length === 0) {
            container.innerHTML = "<p>Aucune réservation en cours aujourd’hui.</p>";
            return;
        }

        active.forEach(r => {
            const div = document.createElement("div");
            div.classList.add("reservation-item");

            div.innerHTML = `
                <strong>${r.boatName}</strong> – ${r.clientName}<br>
                Du ${new Date(r.startDate).toLocaleDateString("fr-FR")}
                au ${new Date(r.endDate).toLocaleDateString("fr-FR")}<br>
                Catway : ${r.catwayNumber}
                <hr>
            `;

            container.appendChild(div);
        });
    });
}

/**
 * Affiche la date du jour dans le tableau de bord,
 * au format français (ex : "Lundi 23 mars 2026").
 */
function displayTodayDate() {
    const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
    const today = new Date().toLocaleDateString("fr-FR", options);

    const dateElement = document.getElementById("today-date");
    if (dateElement) {
        dateElement.textContent = "📅 " + today.charAt(0).toUpperCase() + today.slice(1);
    }
}