const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const catwaysRoutes = require("./routes/catways");
const reservationsRoutes = require("./routes/reservations");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");

const app = express();

mongoose.connect("mongodb://127.0.0.1:27017/port_russell")
  .then(() => console.log("MongoDB connecté"))
  .catch(err => console.error("Erreur MongoDB :", err));
  
app.use(express.json());
app.use(cors());

app.use(express.static("public"));

app.use("/catways", catwaysRoutes);
app.use("/reservations", reservationsRoutes);

// Auth
app.use("/", authRoutes);        

// Users
app.use("/users", userRoutes); 

app.get("/", (req, res) => {
  res.send("Bienvenue sur l’API du Port Russell");
});

const catwayReservationsRoutes = require("./routes/catwayReservations");

app.use("/catways/:id/reservations", catwayReservationsRoutes);

module.exports = app;