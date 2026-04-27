import mongoose from "mongoose";

const matchSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  team1: {
    type: String,
    required: true
  },
  team2: {
    type: String,
    required: true
  },
  venue: {
    type: String,
    required: true
  },
  matchDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ["upcoming", "live", "completed"],
    default: "upcoming"
  }
}, { timestamps: true });

const Match = mongoose.model("Match", matchSchema);
export default Match;