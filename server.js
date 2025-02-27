const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const emergencyRoutes = require("./routes/emergencyRoutes");

dotenv.config();

const app = express();
app.use(express.json());

connectDB();

app.use("/auth", authRoutes);
app.use("/emergency", emergencyRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
