const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const db = require("../db");
const userQueries = require("../queries/userQueries.js");

const protect = asyncHandler(async (req, res, next) => {
  // get the jwt from the cookies //
  const jsonwebtoken = req.cookies.jwt;

  // check if jwt exists //
  if (jsonwebtoken) {
    try {
      // verify the jwt //
      const decoded = jwt.verify(jsonwebtoken, process.env.JWT_SECRET);

      // get the user //
      const userResult = await db.query(userQueries.getUserById, [decoded.id]);
      if (userResult.rowCount === 0) {
        res.status(400);
        throw new Error("User does not exist.");
      }

      // create req.user to send to the next route //
      req.user = userResult.rows[0];

      // go to next route //
      next();
    } catch (err) {
      res.status(401);
      throw new Error("Not Authorized, invalid JWT.");
    }
  } else {
    res.status(401);
    throw new Error("Not Authorized, no JWT.");
  }
});

module.exports = protect;
