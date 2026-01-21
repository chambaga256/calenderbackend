const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const bookingRoutes = require("./routes/booking");
const  regionalbookingRoutes = require("./routes/retionalbooking");
const regionaltrainingRoutes = require("./routes/rationalTraing");
const applicationRoutes =require("./routes/Application")

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB connection
mongoose
  .connect("mongodb+srv://chambagaabdulmurs:chambaga256@cluster0.xetqawq.mongodb.net/coursecalender", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/calenderbooking", bookingRoutes);
app.use("/esg", regionalbookingRoutes);
app.use("/regionaltraining", regionaltrainingRoutes);
// app.use("/api/application", applicationRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
