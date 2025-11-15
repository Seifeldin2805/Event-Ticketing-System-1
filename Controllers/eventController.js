const eventModel = require("../models/eventModel");

const eventController = {
  createEvent: async (req, res) => {
    try {
      const { title, description, date, location, price, totalTickets, category, image } = req.body;
      
      console.log("Creating event with data:", { title, description, date, location, price, totalTickets, category, image });

      const event = new eventModel({
        title,
        description,
        date,
        location,
        price,
        totalTickets,
        remainingTickets: totalTickets, // Set remainingTickets equal to totalTickets
        organizer: req.user.userId, // Set the organizer to the logged-in user's ID
        status: "approved", // Auto-approve for now (change back to "pending" if you want admin approval)
        category: category ? category.toLowerCase() : category, // Normalize category to lowercase
        image: image || '', // Save image URL (ensure it's always a string)
      });

      await event.save();
      console.log("Event created successfully:", event);
      res.status(201).json(event);
    } catch (error) {
      console.error("Error creating event:", error);
      res.status(500).json({ message: "Server error", error: error.message });
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
      const event = await eventModel.findById(req.params.id).populate('organizer', 'name');
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
      // Normalize category to lowercase if provided
      if (req.body.category) {
        req.body.category = req.body.category.toLowerCase();
      }
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
      // Always return all approved events, sorted by date (newest first)
      const approvedEvents = await eventModel.find({ status: "approved" }).sort({ date: 1 });
      console.log(`Found ${approvedEvents.length} approved events`);
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
      const { title, description, date, location, price, totalTickets, status, category, image } = req.body;

      // Find the event by ID
      const event = await eventModel.findById(req.params.id);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }

      // Check if the logged-in user is the organizer of the event or an admin
      const isOrganizer = req.user.role !== "admin" && req.user.userId === event.organizer.toString();
      const isAdmin = req.user.role === "admin";
      if (!isAdmin && !isOrganizer) {
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
      if (category !== undefined) event.category = category ? category.toLowerCase() : category;
      if (image !== undefined) event.image = image;

      // Only admins can update the status
      if (status && isAdmin) {
        event.status = status;
      } else if (status && !isAdmin) {
        // Organizers cannot update status
        return res.status(403).json({ message: "Only admins can update the event status" });
      }

      // If organizer edits an approved event, set status back to pending
      if (isOrganizer && event.status === "approved") {
        event.status = "pending";
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
      // Fetch events created by the logged-in organizer and populate organizer name
      const events = await eventModel.find({ organizer: req.user.userId }).populate('organizer', 'name');

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