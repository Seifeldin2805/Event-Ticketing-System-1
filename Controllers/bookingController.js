const bookingModel = require("../models/bookingModel");
const eventModel = require("../models/eventModel");

const bookingController = {
  bookTickets: async (req, res) => {
    try {
      const { eventId, quantity } = req.body;
      const tickets = quantity;

      // Find the event
      const event = await eventModel.findById(eventId);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }

      // Check if enough tickets are available
      if (event.remainingTickets < tickets) {
        return res.status(400).json({ message: "Not enough tickets available" });
      }

      // Calculate total price
      const totalPrice = tickets * event.price;

      // Create a new booking
      const booking = new bookingModel({
        event: eventId,
        user: req.user.userId, // User ID from the token
        tickets,
        totalPrice,
      });

      // Save the booking
      await booking.save();

      // Update the remaining tickets for the event
      event.remainingTickets -= tickets;
      await event.save();

      res.status(201).json({ message: "Booking successful", booking });
    } catch (error) {
      console.error("Error booking tickets:", error);
      res.status(500).json({ message: "Server error" });
    }
  },
  getUserBookings: async (req, res) => {
    try {
      // Fetch bookings for the logged-in user
      const bookings = await bookingModel
        .find({ user: req.user.userId }) // Filter by the logged-in user's ID
        .populate("event", "title date location price"); // Populate event details

      if (!bookings || bookings.length === 0) {
        return res.status(404).json({ message: "No bookings found for this user" });
      }

      res.status(200).json(bookings);
    } catch (error) {
      console.error("Error fetching user bookings:", error);
      res.status(500).json({ message: "Server error" });
    }
  },
  getBookingById: async (req, res) => {
    try {
      console.log("Booking ID from URL:", req.params.id);

      const booking = await bookingModel
        .findById(req.params.id)
        .populate("event", "title date location price")
        .populate("user", "name email");

      if (!booking) {
        console.log("Booking not found in the database.");
        return res.status(404).json({ message: "Booking not found" });
      }

      console.log("Logged-in user ID:", req.user.userId);
      console.log("Booking user ID:", booking.user.toString());
      console.log("Logged-in user role:", req.user.role);

      // Allow access if the user is the owner, has an admin role, or has an organizer role
      if (req.user.userId !== booking.user.toString() && req.user.role !== "admin" && req.user.role !== "organizer") {
        return res.status(403).json({ message: "You do not have access to this booking" });
      }

      res.status(200).json(booking);
    } catch (error) {
      console.error("Error fetching booking by ID:", error);
      res.status(500).json({ message: "Server error" });
    }
  },
  cancelBooking: async (req, res) => {
    try {
      const bookingId = req.params.id;

      // Find the booking by ID
      const booking = await bookingModel.findById(bookingId);

      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }

      // Check if the logged-in user is the owner of the booking
      if (req.user.userId !== booking.user.toString()) {
        return res.status(403).json({ message: "You do not have permission to cancel this booking" });
      }

      // Increase the event's remaining tickets
      await eventModel.findByIdAndUpdate(
        booking.event,
        { $inc: { remainingTickets: booking.tickets } }
      );

      // Delete the booking
      await bookingModel.findByIdAndDelete(bookingId);

      res.status(200).json({ message: "Booking canceled successfully" });
    } catch (error) {
      console.error("Error canceling booking:", error);
      res.status(500).json({ message: "Server error" });
    }
  },
  getOrganizerBookings: async (req, res) => {
    console.log('getOrganizerBookings called. req.user:', req.user);
    try {
      // Find all events created by this organizer
      const events = await eventModel.find({ organizer: req.user.userId });
      const eventIds = events.map(event => event._id);
      // Find all bookings for these events
      const bookings = await bookingModel.find({ event: { $in: eventIds } })
        .populate('event', 'title totalTickets date');
      res.status(200).json(bookings);
    } catch (error) {
      console.error('Error fetching organizer bookings:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },
};

module.exports = bookingController;