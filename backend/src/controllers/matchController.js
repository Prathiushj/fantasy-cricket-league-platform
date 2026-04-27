import Match from "../models/matchModel.js";

// Get all matches
export const getMatches = async (req, res) => {
  try {
    const matches = await Match.find().sort({ matchDate: 1 });
    res.status(200).json(matches);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch matches." });
  }
};

// Get single match by ID
export const getMatchById = async (req, res) => {
  try {
    const match = await Match.findById(req.params.id);
    if (!match) {
      return res.status(404).json({ message: "Match not found." });
    }
    res.status(200).json(match);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch match." });
  }
};

// Create a match (admin)
export const createMatch = async (req, res) => {
  try {
    const { title, team1, team2, venue, matchDate, status } = req.body;
    if (!title || !team1 || !team2 || !venue || !matchDate) {
      return res.status(400).json({ message: "All fields are required." });
    }
    const match = await Match.create({ title, team1, team2, venue, matchDate, status });
    res.status(201).json(match);
  } catch (error) {
    res.status(500).json({ message: "Failed to create match." });
  }
};