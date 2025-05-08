const express = require("express");
// const verifyAccess = require("../middleware/authMiddleware");
// const { validateBooking } = require("../middleware/validationMiddleware");
const {
  createBooking,
  getUserBookings,
  updateBooking,
  deleteBooking,
  allBookings
} = require("../controllers/bookingController");

const router = express.Router();

// Create new booking
router.post("/new", createBooking);

// Get user's bookings
router.get("/history",  getUserBookings);

// Update existing booking
router.put( "/modify/:bookingId",  updateBooking);

// Cancel booking
router.delete("/cancel/:bookingId",deleteBooking);

// Admin route: View all bookings
router.get( "/all",allBookings);

module.exports = router;
