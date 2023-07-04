// express router //
const { Router } = require("express");
const router = Router();

// friend controller logic //
const friendController = require("../controllers/friendController.js");

// authMiddleware for protected routes //
const protect = require("../middlewares/authMiddleware.js");

// public routes //

// private routes //
router.get("/", protect, friendController.getFriends);
router.post("/sendFriendRequest", protect, friendController.sendFriendRequest);

module.exports = router;
