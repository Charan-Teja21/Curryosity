const jwt = require("jsonwebtoken");
require("dotenv").config();

function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).send({ message: "No token provided" });
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded;
    //console.log("verifyToken:", req.user); // <-- Add this line
    next();
  } catch (err) {
    return res.status(401).send({ message: "Invalid token" });
  }
}

module.exports = verifyToken;