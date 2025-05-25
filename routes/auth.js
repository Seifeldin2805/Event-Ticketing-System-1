const express = require("express");
const router = express.Router();

const userController = require("../Controllers/userController.js");

// * login
router.post("/login",userController.login );
// * register
router.post("/register",userController.register);

// * logout
router.post("/logout", (req, res) => {
  res.status(200).json({ message: "Logout successful" });
});

module.exports = router;