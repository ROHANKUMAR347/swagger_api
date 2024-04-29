const jwt = require("jsonwebtoken");
require("dotenv").config();

const auth = (req, res, next) => {
  const authorizationHeader = req.headers.authorization;
  if (!authorizationHeader) {
    return res.status(400).send({ error: "Authorization header missing" });
  }

  const token = authorizationHeader.split(" ")[1];
  if (!token) {
    return res.status(400).send({ error: "Token not found" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(400).send({ error: "Invalid token" });
    }
    req.userId = decoded.userId;
    req.username = decoded.username;
    next();
  });
};

module.exports = {
  auth,
};
