import mongoose from "mongoose";
import Player from "../models/playerModel.js";
import Team from "../models/teamModel.js";

// Helper — validate MongoDB ID format
const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// Add Player
export const addPlayer = async (req, res) => {
  try {
    const { name, team, role } = req.body;

    if (!name || !team || !role) {
      return res.status(400).json({ message: "Name, team and role are required." });
    }

    const validRoles = ["Batsman", "Bowler", "All-Rounder", "Wicket-Keeper"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: `Role must be one of: ${validRoles.join(", ")}` });
    }

    const player = await Player.create(req.body);
    res.status(201).json(player);
  } catch (error) {
    // Handle duplicate name
    if (error.code === 11000) {
      return res.status(400).json({ message: "A player with this name already exists." });
    }
    res.status(500).json({ message: "Server error. Please try again." });
  }
};

// Get All Players
export const getPlayers = async (req, res) => {
  try {
    const players = await Player.find().sort({ points: -1 });
    res.status(200).json(players);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch players." });
  }
};

// Get Player By ID
export const getPlayerById = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ message: "Invalid player ID format." });
    }

    const player = await Player.findById(req.params.id);
    if (!player) {
      return res.status(404).json({ message: "Player not found." });
    }

    res.status(200).json(player);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch player." });
  }
};

// Update Player Score
export const updatePlayerScore = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ message: "Invalid player ID format." });
    }

    const { runs, wickets } = req.body;

    if (runs === undefined || wickets === undefined) {
      return res.status(400).json({ message: "Runs and wickets are required." });
    }
    if (typeof runs !== "number" || typeof wickets !== "number") {
      return res.status(400).json({ message: "Runs and wickets must be numbers." });
    }
    if (runs < 0 || wickets < 0) {
      return res.status(400).json({ message: "Runs and wickets cannot be negative." });
    }
    if (wickets > 10) {
      return res.status(400).json({ message: "Wickets cannot exceed 10." });
    }

    // Points formula
    let points = 0;
    points += runs;
    points += wickets * 25;
    if (runs >= 50 && runs < 100) points += 10;
    if (runs >= 100) points += 25;
    if (wickets >= 3 && wickets < 5) points += 10;
    if (wickets >= 5) points += 25;

    const updatedPlayer = await Player.findByIdAndUpdate(
      req.params.id,
      { runs, wickets, points },
      { new: true }
    );

    if (!updatedPlayer) {
      return res.status(404).json({ message: "Player not found." });
    }

    // Recalculate affected team points
    const affectedTeams = await Team.find({ selectedPlayers: req.params.id })
      .populate("selectedPlayers")
      .populate("captain")
      .populate("viceCaptain");

    for (const team of affectedTeams) {
      const newTotal = team.selectedPlayers.reduce((sum, p) => {
        let pts = p.points;
        if (p._id.toString() === team.captain._id.toString()) pts *= 2;
        if (p._id.toString() === team.viceCaptain._id.toString()) pts *= 1.5;
        return sum + pts;
      }, 0);
      await Team.findByIdAndUpdate(team._id, { totalPoints: newTotal });
    }

    res.status(200).json(updatedPlayer);
  } catch (error) {
    res.status(500).json({ message: "Failed to update player score." });
  }
};