const jwt = require("jsonwebtoken");

const generateJWT = (res, id) => {
  const jsonwebtoken = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  // create cookie containing jwt
  res.cookie("jwt", jsonwebtoken, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development", // secure will be false if in dev mode, true if not in dev mode
    sameSite: "strict", // to prevent CSRF attacks
    maxAge: 24 * 60 * 60 * 1000, // when cookie expires (1 day set in milliseconds)
  });
};

module.exports = generateJWT;
