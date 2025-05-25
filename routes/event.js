const express = require("express");
const eventController = require("../Controllers/eventController");
const authMiddleware = require("../middleware/authenticationMiddleware");
const authorizationMiddleware = require("../middleware/authorizationMiddleware");

const router = express.Router();

// Route to get current user's events (Organizer only)
router.get(
  "/my-events",
  authMiddleware,
  authorizationMiddleware(["organizer"]),
  eventController.getUserEvents
);

// Public route for approved events
router.get("/", eventController.getApprovedEvents);

// Admin route for all events
router.get(
  "/all",
  authMiddleware,
  authorizationMiddleware(["admin"]),
  eventController.getAllEventsAdmin
);

// Public route to get details of a single event
router.get("/:id", eventController.getEvent);

// Organizer route to create an event
router.post(
  "/",
  authMiddleware,
  authorizationMiddleware(["organizer"]),
  eventController.createEvent
);

// Route to update an event with status
router.put(
  "/:id",
  authMiddleware,
  authorizationMiddleware(["organizer", "admin"]),
  eventController.updateEventWithStatus
);

// Route to delete an event
router.delete(
  "/:id",
  authMiddleware,
  authorizationMiddleware(["organizer", "admin"]),
  eventController.deleteEvent
);

module.exports = router;