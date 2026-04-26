import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import playerRoutes from "./routes/playerRoutes.js";
import teamRoutes from "./routes/teamRoutes.js";

// Load environment variables
dotenv.config();

// Initialize Express App
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/players", playerRoutes);
app.use("/api/teams", teamRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("Fantasy Cricket API Running");
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


