import mongoose from "mongoose";
import dotenv from "dotenv";
import Player from "./models/playerModel.js";

dotenv.config({ path: "./.env" });

const players = [
  // Batsmen
  { name: "Virat Kohli",      team: "RCB",  role: "Batsman",       credits: 10, runs: 0, wickets: 0, points: 0 },
  { name: "Rohit Sharma",     team: "MI",   role: "Batsman",       credits: 9,  runs: 0, wickets: 0, points: 0 },
  { name: "Shubman Gill",     team: "GT",   role: "Batsman",       credits: 9,  runs: 0, wickets: 0, points: 0 },
  { name: "KL Rahul",         team: "LSG",  role: "Batsman",       credits: 9,  runs: 0, wickets: 0, points: 0 },
  { name: "Faf du Plessis",   team: "RCB",  role: "Batsman",       credits: 8,  runs: 0, wickets: 0, points: 0 },

  // Bowlers
  { name: "Jasprit Bumrah",   team: "MI",   role: "Bowler",        credits: 10, runs: 0, wickets: 0, points: 0 },
  { name: "Yuzvendra Chahal", team: "RR",   role: "Bowler",        credits: 8,  runs: 0, wickets: 0, points: 0 },
  { name: "Mohammed Shami",   team: "GT",   role: "Bowler",        credits: 9,  runs: 0, wickets: 0, points: 0 },
  { name: "Rashid Khan",      team: "GT",   role: "Bowler",        credits: 9,  runs: 0, wickets: 0, points: 0 },
  { name: "Arshdeep Singh",   team: "PBKS", role: "Bowler",        credits: 8,  runs: 0, wickets: 0, points: 0 },

  // All-Rounders
  { name: "Hardik Pandya",    team: "MI",   role: "All-Rounder",   credits: 10, runs: 0, wickets: 0, points: 0 },
  { name: "Ravindra Jadeja",  team: "CSK",  role: "All-Rounder",   credits: 9,  runs: 0, wickets: 0, points: 0 },
  { name: "Axar Patel",       team: "DC",   role: "All-Rounder",   credits: 8,  runs: 0, wickets: 0, points: 0 },
  { name: "Suryakumar Yadav", team: "MI",   role: "All-Rounder",   credits: 9,  runs: 0, wickets: 0, points: 0 },

  // Wicket-Keepers
  { name: "MS Dhoni",         team: "CSK",  role: "Wicket-Keeper", credits: 9,  runs: 0, wickets: 0, points: 0 },
  { name: "Rishabh Pant",     team: "DC",   role: "Wicket-Keeper", credits: 9,  runs: 0, wickets: 0, points: 0 },
  { name: "Sanju Samson",     team: "RR",   role: "Wicket-Keeper", credits: 8,  runs: 0, wickets: 0, points: 0 },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    await Player.deleteMany(); // clear old players
    await Player.insertMany(players);

    console.log(`✅ Seeded ${players.length} players successfully`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error.message);
    process.exit(1);
  }
};

seedDB();