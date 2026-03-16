const tokens = new Map(); // email → token

function auth(req, res, next) {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ error: "Token manquant" });

  const email = [...tokens.entries()].find(([_, t]) => t === token)?.[0];
  if (!email) return res.status(401).json({ error: "Token invalide" });

  req.userEmail = email;
  next();
}

module.exports = { auth, tokens };