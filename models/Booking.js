const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
  bankName: {
    type: String,
    required: true,
  },
  participants: {
    type: Number,
   
  },
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  jobTitle: {
    type: String,
    required: true,
  },
  course: {
    type: String,
    required: true,
  },
  dateSubmitted: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Booking", BookingSchema);
