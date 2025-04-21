const express = require("express");
const bookingController = require("../controllers/bookingController");
const authMiddleware = require("../middleware/authenticationMiddleware");
const authorizationMiddleware = require("../middleware/authorizationMiddleware");

const router = express.Router();

router.post("/", authMiddleware, authorizationMiddleware(["user"]), bookingController.bookTickets);
router.get("/", authMiddleware, authorizationMiddleware(["user"]), bookingController.getUserBookings);
router.get("/:id", authMiddleware, authorizationMiddleware(["user"]), bookingController.getBookingById);
router.delete("/:id", authMiddleware, bookingController.cancelBooking);

module.exports = router;