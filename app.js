/**
 * Application Express principale du Port Russell.
 * Configure la connexion MongoDB, les middlewares globaux
 * et le montage des différentes routes de l'API.
 */

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const catwaysRoutes = require("./routes/catways");
const reservationsRoutes = require("./routes/reservations");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const catwayReservationsRoutes = require("./routes/catwayReservations");

const app = express();

/**
 * Connexion à MongoDB
 */
mongoose.connect("mongodb://127.0.0.1:27017/port_russell")
  .then(() => console.log("MongoDB connecté"))
  .catch(err => console.error("Erreur MongoDB :", err));

/**
 * Middlewares globaux
 */
app.use(express.json());
app.use(cors());

/**
 * Fichiers statiques (frontend)
 */
app.use(express.static("public"));

/**
 * Routes principales de l'API
 */
app.use("/catways", catwaysRoutes);
app.use("/reservations", reservationsRoutes);

/**
 * Authentification (login / logout)
 */
app.use("/", authRoutes);

/**
 * Gestion des utilisateurs
 */
app.use("/users", userRoutes);

/**
 * Sous-routes : réservations d’un catway spécifique
 */
app.use("/catways/:id/reservations", catwayReservationsRoutes);

/**
 * Route d'accueil
 */
app.get("/", (req, res) => {
  res.send("Bienvenue sur l’API du Port Russell");
});

module.exports = app;