const express = require("express");
const userController = require("../Controllers/userController");
const authMiddleware = require("../middleware/authenticationMiddleware");
const authorizationMiddleware = require("../middleware/authorizationMiddleware");

const router = express.Router();

router.post("/register", userController.register);
router.post("/login", userController.login);
router.post("/logout", authMiddleware, userController.logout);
router.get("/current", authMiddleware, userController.getCurrentUser);
router.get("/profile", authMiddleware, userController.getCurrentUser);
router.put("/profile", authMiddleware, userController.updateUser);
router.get("/", authMiddleware, authorizationMiddleware(["admin"]), userController.getAllUsers);
router.get("/:id", authMiddleware, authorizationMiddleware(["admin"]), userController.getUser);
router.put("/:id", authMiddleware, authorizationMiddleware(["admin"]), userController.updateUserRole);
router.delete("/:id", authMiddleware, authorizationMiddleware(["admin"]), userController.deleteUser);
router.put("/forgetPassword", userController.forgetPassword);

module.exports = router;