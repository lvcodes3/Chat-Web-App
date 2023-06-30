const asyncHandler = require("express-async-handler");
const db = require("../db");
const messageQueries = require("../queries/messageQueries.js");

// @desc    Send Message
// @route   POST http://localhost:5000/api/v1/messages/send
// @access  Private
const sendMessage = asyncHandler(async (req, res) => {
  // get the data //
  const { message, receiver } = req.body;

  // send the message //
  const sentMessageResponse = await db.query(messageQueries.sendMessage, [
    message,
    req.user.id,
    receiver,
  ]);
  if (sentMessageResponse.rowCount === 0) {
    res.status(400);
    throw new Error("Error sending message.");
  }

  // return the message data //
  const sentMessage = sentMessageResponse.rows[0];

  res.status(201).json({
    id: sentMessage["id"],
    message: sentMessage["message"],
    sender: sentMessage["sender"],
    receiver: sentMessage["receiver"],
    sent_at: sentMessage["sent_at"],
  });
});

module.exports = {
  sendMessage,
};
