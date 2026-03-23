/**
 * Système d'authentification simple basé sur un stockage en mémoire.
 * Map associant un email utilisateur à un token actif.
 * @type {Map<String, String>}
 */
const tokens = new Map(); // email → token

/**
 * Middleware d'authentification.
 * Vérifie la présence d'un token Bearer dans les headers,
 * puis valide ce token en le recherchant dans la Map `tokens`.
 *
 * @function auth
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 * @param {Function} next - Fonction permettant de passer au middleware suivant
 * @returns {void}
 */
function auth(req, res, next) {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ error: "Token manquant" });

  const email = [...tokens.entries()].find(([_, t]) => t === token)?.[0];
  if (!email) return res.status(401).json({ error: "Token invalide" });

  req.userEmail = email;
  next();
}

module.exports = { auth, tokens };