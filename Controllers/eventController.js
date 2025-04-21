const eventModel = require("../models/eventModel");

const eventController = {
  createEvent: async (req, res) => {
    try {
      const { title, description, date, location, price, totalTickets } = req.body;

      const event = new eventModel({
        title,
        description,
        date,
        location,
        price,
        totalTickets,
        remainingTickets: totalTickets, // Set remainingTickets equal to totalTickets
        organizer: req.user.userId, // Set the organizer to the logged-in user's ID
      });

      await event.save();
      res.status(201).json(event);
    } catch (error) {
      console.error("Error creating event:", error);
      res.status(500).json({ message: "Server error" });
    }
  },

  getAllEvents: async (req, res) => {
    try {
      const events = await eventModel.find();
      res.status(200).json(events);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getEvent: async (req, res) => {
    try {
      const event = await eventModel.findById(req.params.id);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      res.status(200).json(event);
    } catch (error) {
      console.error("Error fetching event:", error);
      res.status(500).json({ message: "Server error" });
    }
  },

  updateEvent: async (req, res) => {
    try {
      const updatedEvent = await eventModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!updatedEvent) return res.status(404).json({ message: "Event not found" });
      res.status(200).json({ message: "Event updated successfully", event: updatedEvent });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  deleteEvent: async (req, res) => {
    try {
      const eventId = req.params.id;

      // Find the event by ID
      const event = await eventModel.findById(eventId);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }

      // Check if the logged-in user is the organizer of the event or an admin
      if (req.user.role !== "admin" && req.user.userId !== event.organizer.toString()) {
        return res.status(403).json({ message: "You do not have permission to delete this event" });
      }

      // Delete the event
      await eventModel.findByIdAndDelete(eventId);

      res.status(200).json({ message: "Event deleted successfully" });
    } catch (error) {
      console.error("Error deleting event:", error);
      res.status(500).json({ message: "Server error" });
    }
  },

  getEventAnalytics: async (req, res) => {
    try {
      const events = await eventModel.find({ organizer: req.user.userId });
      const analytics = events.map((event) => ({
        title: event.title,
        bookedPercentage: ((event.totalTickets - event.remainingTickets) / event.totalTickets) * 100,
      }));
      res.status(200).json(analytics);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  updateEventStatus: async (req, res) => {
    try {
      const { status } = req.body;
      const event = await eventModel.findByIdAndUpdate(req.params.id, { status }, { new: true });
      if (!event) return res.status(404).json({ message: "Event not found" });
      res.status(200).json({ message: "Event status updated successfully", event });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getApprovedEvents: async (req, res) => {
    try {
      const approvedEvents = await eventModel.find({ status: "approved" });
      res.status(200).json(approvedEvents);
    } catch (error) {
      console.error("Error fetching approved events:", error);
      res.status(500).json({ message: "Server error" });
    }
  },

  getAllEventsAdmin: async (req, res) => {
    try {
      const allEvents = await eventModel.find();
      res.status(200).json(allEvents);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  updateEventWithStatus: async (req, res) => {
    try {
      const { title, description, date, location, price, totalTickets, status } = req.body;

      // Find the event by ID
      const event = await eventModel.findById(req.params.id);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }

      // Check if the logged-in user is the organizer of the event or an admin
      if (req.user.role !== "admin" && req.user.userId !== event.organizer.toString()) {
        return res.status(403).json({ message: "You do not have permission to update this event" });
      }

      // Update the event fields
      if (title) event.title = title;
      if (description) event.description = description;
      if (date) event.date = date;
      if (location) event.location = location;
      if (price) event.price = price;
      if (totalTickets) {
        event.remainingTickets += totalTickets - event.totalTickets; // Adjust remaining tickets
        event.totalTickets = totalTickets;
      }

      // Allow both admins and organizers to update the status
      if (status) {
        if (req.user.role === "admin" || req.user.userId === event.organizer.toString()) {
          event.status = status;
        } else {
          return res.status(403).json({ message: "You do not have permission to update the status" });
        }
      }

      // Save the updated event
      const updatedEvent = await event.save();

      res.status(200).json({ message: "Event updated successfully", event: updatedEvent });
    } catch (error) {
      console.error("Error updating event:", error);
      res.status(500).json({ message: "Server error" });
    }
  },

  getUserEvents: async (req, res) => {
    try {
      // Fetch events created by the logged-in organizer
      const events = await eventModel.find({ organizer: req.user.userId });

      if (!events || events.length === 0) {
        return res.status(404).json({ message: "No events found for this organizer" });
      }

      res.status(200).json(events);
    } catch (error) {
      console.error("Error fetching organizer's events:", error);
      res.status(500).json({ message: "Server error" });
    }
  },
};

module.exports = eventController;