// express router //
const { Router } = require("express");
const router = Router();

// user controller logic //
const userController = require("../controllers/userController.js");

// authMiddleware for protected routes //
const protect = require("../middlewares/authMiddleware.js");

// public routes //
router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
router.post("/logout", userController.logoutUser);

// private routes //
router.get("/auth", protect, userController.authUser);
router.get("/profile", protect, userController.getUserProfile);
router.put("/update", protect, userController.updateUserPassword);

module.exports = router;
