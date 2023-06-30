// express router //
const { Router } = require("express");
const router = Router();

// message controller logic //
const messageController = require("../controllers/messageController.js");

// authMiddleware for protected routes //
const protect = require("../middlewares/authMiddleware.js");

// private routes //
router.post("/send", protect, messageController.sendMessage);

module.exports = router;
