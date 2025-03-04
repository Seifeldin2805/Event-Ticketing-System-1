# Online Event Ticketing System - Database Schema

## Overview
This project is a full-stack web application for an **Online Event Ticketing System** that allows users to browse, search, and purchase tickets for various events such as concerts, sports games, and theater shows. This repository contains the **Mongoose schemas** for the database models used in the system.

## Project Features
- **User Management:** Users can register, log in, and have different roles (Standard User, Organizer, Admin).
- **Event Management:** Organizers can create and manage events.
- **Ticket Booking System:** Standard users can book tickets for events.
- **Admin Panel:** Admins have full control over the platform.
- **Search & Filter:** Users can search for events based on category, date, or location.

## Database Schemas
The database is structured using **MongoDB** and **Mongoose** ORM. The key schemas include:

### 1. User Schema (`models/User.js`)
Represents the users of the system.
- **Fields:** `name`, `email`, `password`, `profilePicture`, `role`.
- **Roles:** `Standard` (can book tickets), `Organizer` (can create events), `Admin` (manages the platform).
- **Timestamps:** Stores the creation and update times.

### 2. Event Schema (`models/Event.js`)
Stores details about each event.
- **Fields:** `title`, `description`, `date`, `location`, `category`, `image`, `ticketPrice`, `totalTickets`, `remainingTickets`, `organizer` (reference to `User`).
- **Timestamps:** Stores event creation time.

### 3. Booking Schema (`models/Booking.js`)
Handles ticket bookings.
- **Fields:** `user` (reference to `User`), `event` (reference to `Event`), `ticketsBooked`, `totalPrice`, `status` (`Pending`, `Confirmed`, `Canceled`).
- **Timestamps:** Stores booking creation time.

## Setup Instructions
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd online-event-ticketing-system
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up MongoDB connection (use **.env** file for database URL).
4. Run the server:
   ```bash
   npm start
   ```

## Contribution Guidelines
- Follow the **branching strategy** (`feature-branch` -> `main` via Pull Requests).
- Commit meaningful changes and write clear commit messages.
- Ensure proper code reviews before merging.

## License
This project is licensed under the **MIT License**.

## Contact
For any questions, feel free to reach out to the project maintainers.

---
**Deadline:** Task 1 submission is due on **Friday, 7th March, 11:59 PM.**

