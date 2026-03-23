/**
 * Envoie les identifiants à l'API Render pour authentification.
 *
 * @async
 * @function handleLogin
 * @param {Event} e - L'événement de soumission du formulaire.
 */
async function handleLogin(e) {
    e.preventDefault();

    /** @type {string} */
    const email = document.getElementById("email").value;

    /** @type {string} */
    const password = document.getElementById("password").value;

    try {
        const res = await fetch("https://port-russell-api-3c24.onrender.com/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (!res.ok) {
            document.getElementById("error-message").textContent =
                data.error || "Email ou mot de passe incorrect";
            return;
        }

        /** @type {string} */
        const token = data.token;

        // Stockage du token JWT
        localStorage.setItem("token", token);

        // Redirection vers le dashboard
        window.location.href = "/dashboard.html";

    } catch (error) {
        console.error("Erreur lors de la connexion :", error);
        document.getElementById("error-message").textContent =
            "Impossible de contacter le serveur.";
    }
}

/**
 * Initialise l'écouteur d'événement sur le formulaire de connexion.
 */
function initLoginForm() {
    const form = document.getElementById("login-form");

    if (!form) {
        console.error("Formulaire de connexion introuvable.");
        return;
    }

    form.addEventListener("submit", handleLogin);
}

// Initialisation du script
initLoginForm();