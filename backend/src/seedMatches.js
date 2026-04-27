import mongoose from "mongoose";
import dotenv from "dotenv";
import Match from "./models/matchModel.js";

dotenv.config({ path: "./.env" });

const matches = [
  {
    title: "RCB vs MI",
    team1: "RCB",
    team2: "MI",
    venue: "M. Chinnaswamy Stadium, Bengaluru",
    matchDate: new Date("2026-05-01T19:30:00"),
    status: "upcoming"
  },
  {
    title: "CSK vs GT",
    team1: "CSK",
    team2: "GT",
    venue: "MA Chidambaram Stadium, Chennai",
    matchDate: new Date("2026-05-03T15:30:00"),
    status: "upcoming"
  },
  {
    title: "MI vs DC",
    team1: "MI",
    team2: "DC",
    venue: "Wankhede Stadium, Mumbai",
    matchDate: new Date("2026-05-05T19:30:00"),
    status: "upcoming"
  },
  {
    title: "RR vs PBKS",
    team1: "RR",
    team2: "PBKS",
    venue: "Sawai Mansingh Stadium, Jaipur",
    matchDate: new Date("2026-05-07T19:30:00"),
    status: "upcoming"
  },
  {
    title: "GT vs LSG",
    team1: "GT",
    team2: "LSG",
    venue: "Narendra Modi Stadium, Ahmedabad",
    matchDate: new Date("2026-05-09T19:30:00"),
    status: "live"
  },
  {
    title: "CSK vs RCB",
    team1: "CSK",
    team2: "RCB",
    venue: "MA Chidambaram Stadium, Chennai",
    matchDate: new Date("2026-04-20T19:30:00"),
    status: "completed"
  },
];

const seedMatches = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
    await Match.deleteMany();
    await Match.insertMany(matches);
    console.log(`✅ Seeded ${matches.length} matches successfully`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error.message);
    process.exit(1);
  }
};

seedMatches();