/**
 * Point d'entrée principal de l'API Port Russell.
 * Démarre le serveur Express défini dans app.js.
 */

const app = require('./app');

/**
 * Lance le serveur sur le port 3000
 * @function
 * @returns {void}
 */
app.listen(3000, () => {
  console.log('API Port Russell en écoute sur http://localhost:3000');
});