const { validateBooking } = require("../middleware/validationMiddleware");
const Booking = require("../models/bookingModel");
const Resource = require("../models/resourceModel");

const createBooking = async (req, res) => {
  const { resourceId, timeSlot } = req.body;
  const userId = req.currentUser._id;

  try {
    const resource = await Resource.findOne({
      _id: resourceId,
      availableSlots: { $elemMatch: { $eq: timeSlot } },
    }).select("name availableSlots status");

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: "Resource not found or time slot not available",
      });
    }

    const booking = new Booking({
      userId,
      resourceId,
      timeSlot,
      status: "confirmed",
    });

    const [savedBooking] = await Promise.all([
      booking.save(),
      Resource.updateOne(
        { _id: resourceId },
        { $pull: { availableSlots: timeSlot } }
      ),
    ]);

   return res.status(201).json({
      success: true,
      data: savedBooking,
      message: "Booking created successfully",
    });
  } catch (error) {
    console.error("Error creating booking:", error);
    return res.status(500).json({
      success: false,
      message: "Error creating booking",
      error: error.message,
    });
  }
};

const getUserBookings = async (req, res) => {
  const userId = req.currentUser._id;

  try {
    const [bookings, totalCount] = await Promise.all([
      Booking.find({ userId })
        .populate("resourceId", "name description category")
        .sort("-createdAt")
        .lean()
        .exec(),
      Booking.countDocuments({ userId }),
    ]);

    return res.status(200).json({
      success: true,
      data: bookings,
      metadata: {
        totalCount,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error retrieving bookings",
      error: error.message,
    });
  }
};

const updateBooking = async (req, res) => {
  const { bookingId } = req.params;
  const { newTimeSlot } = req.body;
  const userId = req.currentUser._id;

  try {
    const bookingToUpdate = await Booking.findOne({
      _id: bookingId,
      userId,
    }).populate("resourceId");

    if (!bookingToUpdate) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    const [updatedBooking] = await Promise.all([
      Booking.findByIdAndUpdate(
        bookingId,
        {
          $set: {
            timeSlot: newTimeSlot,
            updatedAt: new Date(),
          },
        },
        { new: true }
      ),
      Resource.updateOne(
        { _id: bookingToUpdate.resourceId },
        {
          $pull: { availableSlots: newTimeSlot },
          $push: { availableSlots: bookingToUpdate.timeSlot },
        }
      ),
    ]);

    return res.status(200).json({
      success: true,
      data: updatedBooking,
      message: "Booking updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error updating booking",
      error: error.message,
    });
  }
};

const deleteBooking = async (req, res) => {
  const { bookingId } = req.params;
  const userId = req.currentUser._id;

  try {
    const bookingToDelete = await Booking.findOne({
      _id: bookingId,
      userId,
    });

    if (!bookingToDelete) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    await Promise.all([
      Resource.updateOne(
        { _id: bookingToDelete.resourceId },
        { $push: { availableSlots: bookingToDelete.timeSlot } }
      ),
      bookingToDelete.remove(),
    ]);

    return res.status(200).json({
      success: true,
      message: "Booking deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error deleting booking",
      error: error.message,
    });
  }
};

const allBookings = async (req,res) =>{
    try {
        const allBookings = await Booking.find()
          .populate("userId", "name email")
          .populate("resourceId", "name description")
          .sort("-createdAt");
        res.status(200).json({
          success: true,
          data: allBookings,
        });
      } catch (err) {
        res.status(500).json({
          success: false,
          message: "Failed to retrieve bookings",
          error: err.message,
        });
      }
}

module.exports = {
  createBooking,
  getUserBookings,
  updateBooking,
  deleteBooking,
  allBookings
};
