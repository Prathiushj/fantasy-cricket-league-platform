import mongoose from "mongoose";

const playerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  team: { type: String, required: true },
  role: {
    type: String,
    required: true,
    enum: ["Batsman", "Bowler", "All-Rounder", "Wicket-Keeper"]
  },
  credits: { type: Number, default: 8 }, // add this
  runs:    { type: Number, default: 0 },
  wickets: { type: Number, default: 0 },
  points:  { type: Number, default: 0 }
}, { timestamps: true });

const Player = mongoose.model("Player", playerSchema);
export default Player;