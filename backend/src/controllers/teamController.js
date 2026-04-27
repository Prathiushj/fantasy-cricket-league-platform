import mongoose from "mongoose";
import Team from "../models/teamModel.js";
import Player from "../models/playerModel.js";

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

const calculateTotalPoints = (players, captainId, viceCaptainId) => {
  return players.reduce((sum, p) => {
    const id = p._id.toString();
    let pts = p.points;

    if (id === captainId.toString()) pts *= 2;
    if (id === viceCaptainId.toString()) pts *= 1.5;

    return sum + pts;
  }, 0);
};

export const createTeam = async (req, res) => {
  try {
    const {
      matchId,
      teamName,
      userName,
      selectedPlayers,
      captain,
      viceCaptain
    } = req.body;

    // 1. Basic validation
    if (!matchId || !isValidId(matchId)) {
      return res.status(400).json({
        message: "Valid matchId is required."
      });
    }

    if (!userName?.trim() || !teamName?.trim()) {
      return res.status(400).json({
        message: "Username and team name are required."
      });
    }

    // 2. Duplicate team name check
    const existingTeam = await Team.findOne({
      teamName: teamName.trim()
    });

    if (existingTeam) {
      return res.status(400).json({
        message: "Team name already exists. Choose a different name."
      });
    }

    // 3. Player count check
    if (!Array.isArray(selectedPlayers) || selectedPlayers.length !== 11) {
      return res.status(400).json({
        message: `Select exactly 11 players. You selected ${
          selectedPlayers?.length || 0
        }.`
      });
    }

    // 4. Validate all player IDs
    const allValidIds = selectedPlayers.every((id) => isValidId(id));

    if (!allValidIds) {
      return res.status(400).json({
        message: "One or more player IDs are invalid."
      });
    }

    // 5. Captain / Vice-Captain validation
    if (!captain || !isValidId(captain)) {
      return res.status(400).json({
        message: "Please select a valid Captain."
      });
    }

    if (!viceCaptain || !isValidId(viceCaptain)) {
      return res.status(400).json({
        message: "Please select a valid Vice-Captain."
      });
    }

    if (captain === viceCaptain) {
      return res.status(400).json({
        message: "Captain and Vice-Captain must be different players."
      });
    }

    if (!selectedPlayers.includes(captain)) {
      return res.status(400).json({
        message: "Captain must be one of your selected players."
      });
    }

    if (!selectedPlayers.includes(viceCaptain)) {
      return res.status(400).json({
        message: "Vice-Captain must be one of your selected players."
      });
    }

    // 6. Fetch players
    const players = await Player.find({
      _id: { $in: selectedPlayers }
    });

    if (players.length !== 11) {
      return res.status(400).json({
        message: "One or more selected players do not exist."
      });
    }

    // 7. Budget check
    const totalCredits = players.reduce(
      (sum, p) => sum + p.credits,
      0
    );

    if (totalCredits > 100) {
      return res.status(400).json({
        message: `Team exceeds budget. Your team costs ${totalCredits}/100 credits.`
      });
    }

    // 8. Role composition check
    const roleCounts = {
      Batsman: 0,
      Bowler: 0,
      "All-Rounder": 0,
      "Wicket-Keeper": 0
    };

    players.forEach((p) => {
      roleCounts[p.role]++;
    });

    if (roleCounts["Wicket-Keeper"] < 1) {
      return res.status(400).json({
        message: "Team must have at least 1 Wicket-Keeper."
      });
    }

    if (roleCounts["Batsman"] < 3) {
      return res.status(400).json({
        message: "Team must have at least 3 Batsmen."
      });
    }

    if (roleCounts["Bowler"] < 3) {
      return res.status(400).json({
        message: "Team must have at least 3 Bowlers."
      });
    }

    if (roleCounts["All-Rounder"] < 2) {
      return res.status(400).json({
        message: "Team must have at least 2 All-Rounders."
      });
    }

    // 9. Calculate points
    const totalPoints = calculateTotalPoints(
      players,
      captain,
      viceCaptain
    );

    // 10. Create Team
    const team = await Team.create({
      matchId,
      teamName: teamName.trim(),
      userName: userName.trim(),
      selectedPlayers,
      captain,
      viceCaptain,
      totalPoints
    });

    res.status(201).json(team);

  } catch (error) {
    console.error("Create Team Error:", error);

    if (error.code === 11000) {
      return res.status(400).json({
        message: "Team name already exists. Choose a different name."
      });
    }

    res.status(500).json({
      message: error.message || "Server error. Please try again."
    });
  }
};

export const getTeams = async (req, res) => {
  try {
    const teams = await Team.find()
      .sort({ totalPoints: -1 })
      .populate("captain", "name")
      .populate("viceCaptain", "name")

    res.status(200).json(teams);

  } catch (error) {
    console.error("Get Teams Error:", error);

    res.status(500).json({
      message: "Failed to fetch teams."
    });
  }
};