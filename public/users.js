/**
 * Charge la liste des utilisateurs.
 * Requête : GET /users
 */
async function loadUsers() {
    const res = await fetch("/users", {
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        }
    });

    const users = await res.json();
    const container = document.getElementById("users-list");
    container.innerHTML = "";

    users.forEach(u => {
        const div = document.createElement("div");
        div.innerHTML = `
            <strong>${u.name || "(Sans nom)"}</strong><br>
            Email : ${u.email}<br>
            <button onclick="editUser('${u._id}')">Modifier</button>
            <button onclick="deleteUser('${u._id}')">Supprimer</button>
            <hr>
        `;
        container.appendChild(div);
    });
}

/**
 * Affiche le formulaire d'ajout d'utilisateur.
 */
function showAddUserForm() {
    document.getElementById("add-user-form").classList.toggle("hidden");
}

/**
 * Crée un utilisateur.
 * Requête : POST /users/register
 */
async function createUser() {
    const newUser = {
        name: document.getElementById("user-name").value,
        email: document.getElementById("user-email").value,
        password: document.getElementById("user-password").value
    };

    await fetch("/users/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
        body: JSON.stringify(newUser)
    });

    loadUsers();
}

/**
 * Charge un utilisateur pour édition.
 * Requête : GET /users/:id
 */
async function editUser(id) {
    const res = await fetch(`/users/${id}`, {
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        }
    });

    const user = await res.json();

    document.getElementById("edit-user-id").value = user._id;
    document.getElementById("edit-user-name").value = user.name;
    document.getElementById("edit-user-email").value = user.email;

    document.getElementById("edit-user-form").classList.remove("hidden");
}

/**
 * Met à jour un utilisateur.
 * Requête : PUT /users/:id
 */
async function updateUser() {
    const id = document.getElementById("edit-user-id").value;

    const updated = {
        name: document.getElementById("edit-user-name").value,
        email: document.getElementById("edit-user-email").value
    };

    await fetch(`/users/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
        body: JSON.stringify(updated)
    });

    loadUsers();
}

/**
 * Supprime un utilisateur.
 * Requête : DELETE /users/:id
 */
async function deleteUser(id) {
    await fetch(`/users/${id}`, {
        method: "DELETE",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        }
    });

    loadUsers();
}