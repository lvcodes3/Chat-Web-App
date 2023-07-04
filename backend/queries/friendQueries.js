const getFriends = `SELECT * FROM friends WHERE sender = $1 OR receiver = $1;`;

const sendFriendRequest = `INSERT INTO friends (sender, receiver, status)
  VALUES ($1, $2, 'pending')
  RETURNING *;`;

const checkIfFriendRequestExists = `SELECT id FROM friends
  WHERE (sender = $1 AND receiver = $2) OR (sender = $2 AND receiver = $1);`;

module.exports = {
  getFriends,
  sendFriendRequest,
  checkIfFriendRequestExists,
};
