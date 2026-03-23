/**
 * Point d'entrée principal de l'API Port Russell.
 * Démarre le serveur Express défini dans app.js.
 */

const app = require('./app');

/**
 * Render impose un port via process.env.PORT.
 * En local, on utilise 3000 par défaut.
 */
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`API Port Russell en écoute sur le port ${port}`);
});