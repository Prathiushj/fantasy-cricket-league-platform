import mongoose from "mongoose";

const teamSchema = new mongoose.Schema({

 matchId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Match",
  required: true
},
  teamName: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  userName: {
    type: String,
    required: true,
    trim: true
  },
  selectedPlayers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Player"
    }
  ],
  captain: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Player",
    required: true
  },
  viceCaptain: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Player",
    required: true
  },
  totalPoints: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

const Team = mongoose.model("Team", teamSchema);
export default Team;