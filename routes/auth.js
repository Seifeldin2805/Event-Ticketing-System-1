const express = require("express");
const router = express.Router();

const userController = require("../Controllers/userController.js");

// * login
router.post("/api/v1/login",userController.login );
// * register
router.post("/api/v1/register",userController.register);

module.exports = router;