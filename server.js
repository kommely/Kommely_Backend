const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const seniorRoutes = require("./routes/seniorRoutes");
const caregiverRoutes = require("./routes/caregiverRoutes");
const emergencyRoutes = require("./routes/emergencyRoutes");
const messageRoutes = require("./routes/messageRoutes");

dotenv.config();

const app = express();
app.use(express.json());

connectDB();

app.use("/senior", seniorRoutes);
app.use("/caregiver", caregiverRoutes);
app.use("/emergency", emergencyRoutes);
app.use("/messages", messageRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
