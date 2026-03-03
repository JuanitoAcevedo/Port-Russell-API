const token = localStorage.getItem("token");
if (!token) {
  window.location.href = "/";
}

function showSection(name) {
  document.querySelectorAll(".section").forEach(sec => sec.classList.add("hidden"));
  document.getElementById(name).classList.remove("hidden");
}

function logout() {
  localStorage.removeItem("token");
  window.location.href = "/";
}

function showSection(name) {
  document.querySelectorAll(".section").forEach(sec => sec.classList.add("hidden"));
  document.getElementById(name).classList.remove("hidden");

  if (name === "catways") loadCatways();
  if (name === "reservations") loadReservations();
}

async function loadCatways() {
  const res = await fetch("/catways", {
    headers: {
      "Authorization": "Bearer " + token
    }
  });

  const data = await res.json();

  const container = document.getElementById("catways-list");
  container.innerHTML = "";

  if (!Array.isArray(data)) {
    container.innerHTML = "<p>Erreur lors du chargement des catways.</p>";
    return;
  }

  data.forEach(catway => {
    const div = document.createElement("div");
    div.className = "catway-card";
    div.innerHTML = `
      <h4>Catway #${catway.catwayNumber}</h4>
      <p><strong>Type :</strong> ${catway.catwayType}</p>
      <p><strong>État :</strong> ${catway.catwayState}</p>

     <button onclick='editCatway(
      "${catway._id}",
      ${catway.catwayNumber},
      "${catway.catwayType}",
      "${catway.catwayState}"
      )'>Modifier</button>
      <button onclick="deleteCatway('${catway._id}')">Supprimer</button>
    `;
    container.appendChild(div);
  });
}

function showAddCatwayForm() {
  document.getElementById("add-catway-form").classList.toggle("hidden");
}

async function createCatway() {
  const catwayNumber = document.getElementById("catway-number").value;
  const catwayType = document.getElementById("catway-type").value;

  const res = await fetch("/catways", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token
    },
    body: JSON.stringify({
      catwayNumber,
      catwayType,
      catwayState: "OK"
    })
  });

  const data = await res.json();

  if (res.ok) {
    alert("Catway créé !");
    loadCatways();
    showAddCatwayForm();
  } else {
    alert("Erreur : " + data.error);
  }
}

let editingCatwayId = null;

function editCatway(id, number, type, state) {
  editingCatwayId = id;

  document.getElementById("edit-catway-number").value = number;
  document.getElementById("edit-catway-type").value = type;
  document.getElementById("edit-catway-state").value = state;

  document.getElementById("edit-catway-form").classList.remove("hidden");
}

async function updateCatway() {
  const catwayNumber = document.getElementById("edit-catway-number").value;
  const catwayType = document.getElementById("edit-catway-type").value;
  const catwayState = document.getElementById("edit-catway-state").value;

  const res = await fetch(`/catways/${editingCatwayId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token
    },
    body: JSON.stringify({
      catwayNumber,
      catwayType,
      catwayState
    })
  });

  if (res.ok) {
    alert("Catway modifié !");
    loadCatways();
    document.getElementById("edit-catway-form").classList.add("hidden");
  } else {
    const data = await res.json();
    alert("Erreur : " + data.error);
  }
}

async function deleteCatway(id) {
  if (!confirm("Supprimer ce Catway ?")) return;

  const res = await fetch(`/catways/${id}`, {
    method: "DELETE",
    headers: {
      "Authorization": "Bearer " + token
    }
  });

  if (res.ok) {
    alert("Catway supprimé !");
    loadCatways();
  } else {
    const data = await res.json();
    alert("Erreur : " + data.error);
  }
}

async function loadReservations() {
    try {
        const res = await fetch('/reservations', {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        });

        const data = await res.json();
        const reservations = data.reservations;

        const container = document.getElementById("reservations-list");

        if (!Array.isArray(reservations) || reservations.length === 0) {
            container.innerHTML = "<p>Aucune réservation trouvée.</p>";
            return;
        }

        container.innerHTML = reservations.map(r => `
            <div class="reservation-card">
                <p><strong>Bateau :</strong> ${r.boatName}</p>
                <p><strong>Client :</strong> ${r.clientName}</p>
                <p><strong>Arrivée :</strong> ${new Date(r.startDate).toLocaleDateString()}</p>
                <p><strong>Départ :</strong> ${new Date(r.endDate).toLocaleDateString()}</p>
                <p><strong>Catway :</strong> ${r.catwayNumber}</p>

                <button onclick="editReservation('${r._id}')">Modifier</button>
                <button onclick="deleteReservation('${r._id}')">Supprimer</button>
            </div>
        `).join('');
    } catch (err) {
        console.error("Erreur lors du chargement des réservations :", err);
        alert(err);
    }
}