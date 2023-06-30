const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const db = require("../db");
const userQueries = require("../queries/userQueries.js");
const generateJWT = require("../utils/generateJWT.js");

// @desc    Authenticate User
// @route   POST http://localhost:5000/api/v1/users/auth
// @access  Private
const authUser = asyncHandler(async (req, res) => {
  return res.status(200).json(req.user);
});

// @desc    Register User
// @route   POST http://localhost:5000/api/v1/users/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  // get the data //
  const { username, email, password, picture } = req.body;

  // check if the user exists based on the username //
  let existingUserResult = await db.query(userQueries.getUserByUsername, [
    username,
  ]);
  if (existingUserResult.rowCount !== 0) {
    res.status(400);
    throw new Error("User already exists based on the username.");
  }

  // check if the user exists based on the email //
  existingUserResult = await db.query(userQueries.getUserByEmail, [email]);
  if (existingUserResult.rowCount !== 0) {
    res.status(400);
    throw new Error("User already exists based on the email.");
  }

  // hash the password //
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  const hashedPassword = await bcrypt.hash(password, salt);

  // create the user //
  const createdUserResult = await db.query(userQueries.registerUser, [
    username,
    email,
    hashedPassword,
    picture,
  ]);
  if (createdUserResult.rowCount === 0) {
    res.status(400);
    throw new Error("Error creating user.");
  }

  // return user data and generate JWT //
  const createdUser = createdUserResult.rows[0];

  generateJWT(res, createdUser["id"]);

  res.status(201).json({
    id: createdUser["id"],
    username: createdUser["username"],
    email: createdUser["email"],
    picture: createdUser["picture"],
    created_at: createdUser["created_at"],
    updated_at: createdUser["updated_at"],
    last_signed_in: createdUser["last_signed_in"],
  });
});

// @desc    Login User
// @route   POST http://localhost:5000/api/v1/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  // get the data //
  const { email, password } = req.body;

  // check if the user exists //
  const existingUserResult = await db.query(userQueries.getUserByEmailAll, [
    email,
  ]);
  if (existingUserResult.rowCount === 0) {
    res.status(401);
    throw new Error("Invalid email or password.");
  }

  // check if the password is correct //
  const existingUser = existingUserResult.rows[0];

  const isValidPassword = await bcrypt.compare(
    password,
    existingUser["password"]
  );
  if (!isValidPassword) {
    res.status(401);
    throw new Error("Invalid email or password.");
  }

  // update the user in the db //
  const updatedUserResult = await db.query(userQueries.loginUser, [
    existingUser["id"],
  ]);
  if (updatedUserResult.rowCount === 0) {
    res.status(400);
    throw new Error("Error logging in user.");
  }

  // return updated user data and generate JWT //
  const updatedUser = updatedUserResult.rows[0];

  generateJWT(res, updatedUser["id"]);

  res.status(200).json({
    id: updatedUser["id"],
    username: updatedUser["username"],
    email: updatedUser["email"],
    picture: updatedUser["picture"],
    created_at: updatedUser["created_at"],
    updated_at: updatedUser["updated_at"],
    last_signed_in: updatedUser["last_signed_in"],
  });
});

// @desc    Logout User
// @route   POST http://localhost:5000/api/v1/users/logout
// @access  Public
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "User logged out." });
});

// @desc    Get User Profile
// @route   GET http://localhost:5000/api/v1/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  // send back req.user data based on authMiddleware //
  const user = {
    id: req.user.id,
    username: req.user.username,
    email: req.user.email,
    picture: req.user.picture,
    created_at: req.user.created_at,
    updated_at: req.user.updated_at,
    last_signed_in: req.user.last_signed_in,
  };
  res.status(200).json(user);
});

// @desc    Update User Password
// @route   PUT http://localhost:5000/api/v1/users/update
// @access  Private
const updateUserPassword = asyncHandler(async (req, res) => {
  // get the user from the db //
  const userResult = await db.query(userQueries.getUserById, [req.user.id]);
  if (userResult.rowCount === 0) {
    res.status(404);
    throw new Error("User not found.");
  }

  // hash the new password //
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  // update the new password //
  const updatedUserResult = await db.query(userQueries.updateUserPassword, [
    hashedPassword,
    req.user.id,
  ]);
  if (updatedUserResult.rowCount === 0) {
    res.status(400);
    throw new Error("Error updating user's password.");
  }

  // return updated user data //
  const updatedUser = updatedUserResult.rows[0];

  res.status(200).json({
    id: updatedUser["id"],
    username: updatedUser["username"],
    email: updatedUser["email"],
    picture: updatedUser["picture"],
    created_at: updatedUser["created_at"],
    updated_at: updatedUser["updated_at"],
    last_signed_in: updatedUser["last_signed_in"],
  });
});

module.exports = {
  authUser,
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
  updateUserPassword,
};
