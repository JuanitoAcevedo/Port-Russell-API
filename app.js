const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const mongodb = require('./db/mongo');

mongodb.initClientDbConnection();

const app = express();

// Log des requêtes
app.use((req, res, next) => {
  console.log(">>> REQUÊTE REÇUE :", req.method, req.url);
  next();
});

// Middlewares de base
app.use(cors({ origin: '*', exposedHeaders: ['Authorization'] }));
app.use(express.json({ strict: false }));
app.use((req, res, next) => {
  console.log(">>> BODY REÇU :", req.body);
  next();
});
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Supprimer le slash final
app.use((req, res, next) => {
  if (req.url.endsWith('/') && req.url.length > 1) {
    req.url = req.url.slice(0, -1);
  }
  next();
});

// Routes
app.use('/', indexRouter);
app.use('/users', usersRouter);

// 404
app.use((req, res, next) => {
  return res.status(404).json({ error: "not_found" });
});

// Middleware d’erreur
app.use((err, req, res, next) => {
  console.error(">>> ERREUR INTERNE :", err);

  if (!err) {
    return res.status(500).json({ error: "unknown_error" });
  }

  if (err instanceof Error) {
    return res.status(500).json({ error: err.message });
  }

  return res.status(500).json({ error: String(err) });
});

module.exports = app;