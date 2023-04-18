const jwt = require("jsonwebtoken");
const User = require("../model/user");

const config = process.env;

const verifyToken = async (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);
    const user = await User.findOne({ _id: decoded._id });
    req.user = user;
    req.token = token;

    next();
  } catch (err) {
    return res.status(401).send({
      message: "Invalid Token"
    });
  }
};

module.exports = verifyToken;
