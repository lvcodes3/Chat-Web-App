const getUserById = `SELECT id, username, email, picture, created_at, updated_at, last_signed_in
  FROM users 
  WHERE id = $1;`;

const getUserByUsername = `SELECT id, username, email, picture, created_at, updated_at, last_signed_in
  FROM users 
  WHERE username = $1;`;

const getUserByEmail = `SELECT id, username, email, picture, created_at, updated_at, last_signed_in
  FROM users
  WHERE email = $1;`;

const getUserByEmailAll = `SELECT * FROM users WHERE email = $1;`;

const registerUser = `INSERT INTO users (username, email, password, picture)
  VALUES ($1, $2, $3, $4)
  RETURNING id, username, email, picture, created_at, updated_at, last_signed_in;`;

const loginUser = `UPDATE users 
  SET updated_at = CURRENT_TIMESTAMP, last_signed_in = CURRENT_TIMESTAMP
  WHERE id = $1 
  RETURNING id, username, email, picture, created_at, updated_at, last_signed_in;`;

const updateUserPassword = `UPDATE users
  SET password = $1, updated_at = CURRENT_TIMESTAMP
  WHERE id = $2
  RETURNING id, username, email, picture, created_at, updated_at, last_signed_in;`;

const getAllUsers = `SELECT id, username, email, picture, created_at, updated_at, last_signed_in
  FROM users WHERE id != $1;`;

module.exports = {
  getUserById,
  getUserByUsername,
  getUserByEmail,
  getUserByEmailAll,
  registerUser,
  loginUser,
  updateUserPassword,
  getAllUsers,
};
