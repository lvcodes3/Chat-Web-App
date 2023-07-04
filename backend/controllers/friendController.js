const asyncHandler = require("express-async-handler");
const db = require("../db");
const friendQueries = require("../queries/friendQueries.js");

// @desc    Get Friends
// @route   GET http://localhost:5000/api/v1/friends
// @access  Private
const getFriends = asyncHandler(async (req, res) => {
  // access to req.user from authMiddleware //
  const getFriendsResponse = await db.query(friendQueries.getFriends, [
    req.user.id,
  ]);
  const friends = getFriendsResponse.rows;
  res.status(200).json(friends);
});

// @desc    Send Friend Request
// @route   POST http://localhost:5000/api/v1/friends/sendFriendRequest
// @access  Private
const sendFriendRequest = asyncHandler(async (req, res) => {
  // access to req.user from authMiddleware //
  // get data //
  const { receiver } = req.body;

  // check there isn't already a friend request already between the two users //
  const result = await db.query(friendQueries.checkIfFriendRequestExists, [
    req.user.id,
    receiver,
  ]);
  if (result.rowCount !== 0) {
    res.status(400);
    throw new Error("Error, friend request already exists.");
  }

  // send the friend request //
  const friendRequestResponse = await db.query(
    friendQueries.sendFriendRequest,
    [req.user.id, receiver]
  );
  if (friendRequestResponse.rowCount === 0) {
    res.status(400);
    throw new Error("Error sending friend request.");
  }

  // return friend request data //
  const friendRequest = friendRequestResponse.rows[0];

  res.status(201).json(friendRequest);
});

module.exports = {
  getFriends,
  sendFriendRequest,
};
