const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const authRoutes = require("./routes/auth");
const interviewRoutes = require("./routes/interview");

const app = express();

app.use(cors());
app.use(express.json({ limit: "2mb" }));

app.get("/", (req, res) => {
  res.json({ status: "AI Interview Coach API" });
});

app.use("/api/auth", authRoutes);
app.use("/api/interview", interviewRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found." });
});

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      autoIndex: true,
    });
    console.log("✅ Connected to MongoDB");

    const port = process.env.PORT || 4000;
    app.listen(port, "0.0.0.0", () => {
      console.log(`🚀 Server running on port ${port}`);
    });
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    process.exit(1);
  }
};

startServer();
