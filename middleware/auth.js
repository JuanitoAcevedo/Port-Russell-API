const jwt = require('jsonwebtoken');
const SECRET = "PORT_RUSSELL_SECRET";

module.exports = (req, res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "missing_or_invalid_token" });
  }

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded; 
    next();
  } catch (err) {
    return res.status(401).json({ message: "invalid_token" });
  }
};