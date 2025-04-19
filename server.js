require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const homeRoutes = require("./routes/homeRouer");
const userRouter = require('./routes/userRouter');
const renterRouter = require('./routes/renterRouter');
const commitRoute = require('./routes/commitRoute');
const app = express();

// Middleware
app.use(
  cors({
    origin: "easyhomes.vercel.app",
    credentials: true,
  })
);
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/homes", homeRoutes);
app.use("/renter", renterRouter);
app.use("/user", userRouter);
app.use("/commit", commitRoute);

// DB Connection using environment variable
const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/homes";
mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
