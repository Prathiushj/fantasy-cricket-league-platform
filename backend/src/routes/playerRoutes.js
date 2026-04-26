import express from "express";
import {
  addPlayer,
  getPlayers,
  updatePlayerScore,
  getPlayerById
} from "../controllers/playerController.js";

const router = express.Router();

router.post("/add", addPlayer);
router.get("/", getPlayers);
router.put("/:id", updatePlayerScore);
router.get("/:id", getPlayerById);
export default router;