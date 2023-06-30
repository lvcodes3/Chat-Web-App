const sendMessage = `INSERT INTO messages (message, sender, receiver)
    VALUES ($1, $2, $3)
    RETURNING id, message, sender, receiver, sent_at;`;

module.exports = {
  sendMessage,
};
