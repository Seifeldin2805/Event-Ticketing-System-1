const express = require("express");
const bookingController = require("../controllers/bookingController");
const authMiddleware = require("../middleware/authenticationMiddleware");
const authorizationMiddleware = require("../middleware/authorizationMiddleware");

const router = express.Router();

router.post("/", authMiddleware, authorizationMiddleware(["user"]), bookingController.bookTickets);
router.get('/organizer', authMiddleware, authorizationMiddleware(["organizer"]), bookingController.getOrganizerBookings);
router.get("/", authMiddleware, authorizationMiddleware(["user", "organizer"]), bookingController.getUserBookings);
router.get("/:id", authMiddleware, authorizationMiddleware(["user", "organizer"]), bookingController.getBookingById);
router.delete("/:id", authMiddleware, bookingController.cancelBooking);

module.exports = router;