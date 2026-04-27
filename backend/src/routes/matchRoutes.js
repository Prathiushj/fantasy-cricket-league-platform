import express from "express";
import { getMatches, getMatchById, createMatch } from "../controllers/matchController.js";

const router = express.Router();

router.get("/", getMatches);
router.get("/:id", getMatchById);
router.post("/create", createMatch);

export default router;