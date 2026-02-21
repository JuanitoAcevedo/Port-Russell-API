const jwt = require('jsonwebtoken');
const User = require('../models/users');
const SECRET = "PORT_RUSSELL_SECRET";

module.exports = async (req, res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "missing_or_invalid_token" });
  }

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, SECRET);

    
    const user = await User.findOne({ email: decoded.email });

    if (!user) {
      return res.status(401).json({ message: "user_not_found" });
    }

    req.user = user; 
    next();

  } catch (err) {
    return res.status(401).json({ message: "invalid_token" });
  }
};