const jwt = require('jsonwebtoken');
const SECRET = "PORT_RUSSELL_SECRET";

module.exports = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token)
    return res.status(401).json({ message: "missing_token" });

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "invalid_token" });
  }
};