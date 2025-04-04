const express = require("express");
const Booking = require("../models/Booking");
const XLSX = require("xlsx");
const router = express.Router();

// Route to submit a booking
router.post("/", async (req, res) => {
  const { bankName, participants, phone, email, jobTitle, course } = req.body;

  if (!bankName  || !phone || !email || !jobTitle || !course) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const newBooking = new Booking({
      bankName,
      participants,
      phone,
      email,
      jobTitle,
      course,
    });

    await newBooking.save();
    res.status(201).json({ message: "Booking saved successfully" });
  } catch (error) {
    console.error("Error saving booking:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Route to retrieve all bookings
// router.get("/", async (req, res) => {
//   try {
//     const bookings = await Booking.find();
//     res.status(200).json(bookings);
//   } catch (error) {
//     console.error("Error fetching bookings:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// });



router.get("/download-booking", async (req, res) => {
    try {
      const bookings = await Booking.find();
  
      if (!bookings.length) return res.status(404).json({ error: "No bookings found" });
  
      // Convert MongoDB data to JSON for the Excel sheet
      const bookingData = bookings.map((booking) => ({
        bankName: booking.bankName,
        participants: booking.participants,
        phone: booking.phone,
        email: booking.email,
        jobTitle: booking.jobTitle,
        course: booking.course
      }));
  
      // Create a new workbook and worksheet
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(bookingData);
  
      // Append the worksheet to the workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, "CourseBookingsheet");
  
      // Write the workbook to a buffer
      const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
  
      // Set headers to prompt download
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=CourseBookingsheet.xlsx"
      );
      res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
  
      // Send the buffer as a response
      res.send(buffer);
    } catch (error) {
      console.error("Error generating Excel:", error.message);
      res.status(500).json({ error: "Error generating Excel file." });
    }
  });
  

module.exports = router;
