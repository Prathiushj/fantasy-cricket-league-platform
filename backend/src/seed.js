import mongoose from "mongoose";
import dotenv from "dotenv";
import Player from "./models/playerModel.js";

dotenv.config({ path: "./.env" });

const players = [
  // Batsmen
  { name: "Virat Kohli",         team: "RCB",  role: "Batsman",       credits: 10, runs: 0, wickets: 0, points: 0 },
  { name: "Faf du Plessis",      team: "RCB",  role: "Batsman",       credits: 8,  runs: 0, wickets: 0, points: 0 },
  { name: "Rajat Patidar",       team: "RCB",  role: "Batsman",       credits: 8,  runs: 0, wickets: 0, points: 0 },
  { name: "Rohit Sharma",        team: "MI",   role: "Batsman",       credits: 9,  runs: 0, wickets: 0, points: 0 },
  { name: "Suryakumar Yadav",    team: "MI",   role: "Batsman",       credits: 9,  runs: 0, wickets: 0, points: 0 },
  { name: "Tilak Varma",         team: "MI",   role: "Batsman",       credits: 8,  runs: 0, wickets: 0, points: 0 },
  { name: "Ruturaj Gaikwad",     team: "CSK",  role: "Batsman",       credits: 9,  runs: 0, wickets: 0, points: 0 },
  { name: "Devon Conway",        team: "CSK",  role: "Batsman",       credits: 8,  runs: 0, wickets: 0, points: 0 },
  { name: "Ajinkya Rahane",      team: "CSK",  role: "Batsman",       credits: 7,  runs: 0, wickets: 0, points: 0 },
  { name: "Shubman Gill",        team: "GT",   role: "Batsman",       credits: 9,  runs: 0, wickets: 0, points: 0 },
  { name: "Sai Sudharsan",       team: "GT",   role: "Batsman",       credits: 8,  runs: 0, wickets: 0, points: 0 },
  { name: "David Miller",        team: "GT",   role: "Batsman",       credits: 8,  runs: 0, wickets: 0, points: 0 },
  { name: "Yashasvi Jaiswal",    team: "RR",   role: "Batsman",       credits: 9,  runs: 0, wickets: 0, points: 0 },
  { name: "Shimron Hetmyer",     team: "RR",   role: "Batsman",       credits: 8,  runs: 0, wickets: 0, points: 0 },
  { name: "KL Rahul",            team: "LSG",  role: "Batsman",       credits: 9,  runs: 0, wickets: 0, points: 0 },
  { name: "Quinton de Kock",     team: "LSG",  role: "Batsman",       credits: 8,  runs: 0, wickets: 0, points: 0 },
  { name: "Deepak Hooda",        team: "LSG",  role: "Batsman",       credits: 7,  runs: 0, wickets: 0, points: 0 },
  { name: "David Warner",        team: "DC",   role: "Batsman",       credits: 9,  runs: 0, wickets: 0, points: 0 },
  { name: "Prithvi Shaw",        team: "DC",   role: "Batsman",       credits: 8,  runs: 0, wickets: 0, points: 0 },
  { name: "Shikhar Dhawan",      team: "PBKS", role: "Batsman",       credits: 8,  runs: 0, wickets: 0, points: 0 },
  { name: "Bhanuka Rajapaksa",   team: "PBKS", role: "Batsman",       credits: 7,  runs: 0, wickets: 0, points: 0 },
  { name: "Venkatesh Iyer",      team: "KKR",  role: "Batsman",       credits: 8,  runs: 0, wickets: 0, points: 0 },
  { name: "Nitish Rana",         team: "KKR",  role: "Batsman",       credits: 8,  runs: 0, wickets: 0, points: 0 },
  { name: "Jason Roy",           team: "KKR",  role: "Batsman",       credits: 7,  runs: 0, wickets: 0, points: 0 },
  { name: "Abhishek Sharma",     team: "SRH",  role: "Batsman",       credits: 8,  runs: 0, wickets: 0, points: 0 },
  { name: "Mayank Agarwal",      team: "SRH",  role: "Batsman",       credits: 7,  runs: 0, wickets: 0, points: 0 },
  { name: "Harry Brook",         team: "SRH",  role: "Batsman",       credits: 8,  runs: 0, wickets: 0, points: 0 },

  // Bowlers
  { name: "Mohammed Siraj",      team: "RCB",  role: "Bowler",        credits: 8,  runs: 0, wickets: 0, points: 0 },
  { name: "Josh Hazlewood",      team: "RCB",  role: "Bowler",        credits: 8,  runs: 0, wickets: 0, points: 0 },
  { name: "Karn Sharma",         team: "RCB",  role: "Bowler",        credits: 7,  runs: 0, wickets: 0, points: 0 },
  { name: "Reece Topley",        team: "RCB",  role: "Bowler",        credits: 7,  runs: 0, wickets: 0, points: 0 },
  { name: "Jasprit Bumrah",      team: "MI",   role: "Bowler",        credits: 10, runs: 0, wickets: 0, points: 0 },
  { name: "Gerald Coetzee",      team: "MI",   role: "Bowler",        credits: 8,  runs: 0, wickets: 0, points: 0 },
  { name: "Piyush Chawla",       team: "MI",   role: "Bowler",        credits: 7,  runs: 0, wickets: 0, points: 0 },
  { name: "Akash Madhwal",       team: "MI",   role: "Bowler",        credits: 7,  runs: 0, wickets: 0, points: 0 },
  { name: "Deepak Chahar",       team: "CSK",  role: "Bowler",        credits: 8,  runs: 0, wickets: 0, points: 0 },
  { name: "Tushar Deshpande",    team: "CSK",  role: "Bowler",        credits: 7,  runs: 0, wickets: 0, points: 0 },
  { name: "Matheesha Pathirana", team: "CSK",  role: "Bowler",        credits: 8,  runs: 0, wickets: 0, points: 0 },
  { name: "Maheesh Theekshana",  team: "CSK",  role: "Bowler",        credits: 7,  runs: 0, wickets: 0, points: 0 },
  { name: "Rashid Khan",         team: "GT",   role: "Bowler",        credits: 9,  runs: 0, wickets: 0, points: 0 },
  { name: "Mohammed Shami",      team: "GT",   role: "Bowler",        credits: 9,  runs: 0, wickets: 0, points: 0 },
  { name: "Noor Ahmad",          team: "GT",   role: "Bowler",        credits: 7,  runs: 0, wickets: 0, points: 0 },
  { name: "Spencer Johnson",     team: "GT",   role: "Bowler",        credits: 7,  runs: 0, wickets: 0, points: 0 },
  { name: "Yuzvendra Chahal",    team: "RR",   role: "Bowler",        credits: 8,  runs: 0, wickets: 0, points: 0 },
  { name: "Trent Boult",         team: "RR",   role: "Bowler",        credits: 8,  runs: 0, wickets: 0, points: 0 },
  { name: "Sandeep Sharma",      team: "RR",   role: "Bowler",        credits: 7,  runs: 0, wickets: 0, points: 0 },
  { name: "Avesh Khan",          team: "RR",   role: "Bowler",        credits: 7,  runs: 0, wickets: 0, points: 0 },
  { name: "Ravi Bishnoi",        team: "LSG",  role: "Bowler",        credits: 8,  runs: 0, wickets: 0, points: 0 },
  { name: "Mark Wood",           team: "LSG",  role: "Bowler",        credits: 8,  runs: 0, wickets: 0, points: 0 },
  { name: "Mohsin Khan",         team: "LSG",  role: "Bowler",        credits: 7,  runs: 0, wickets: 0, points: 0 },
  { name: "Yash Thakur",         team: "LSG",  role: "Bowler",        credits: 7,  runs: 0, wickets: 0, points: 0 },
  { name: "Anrich Nortje",       team: "DC",   role: "Bowler",        credits: 8,  runs: 0, wickets: 0, points: 0 },
  { name: "Kuldeep Yadav",       team: "DC",   role: "Bowler",        credits: 8,  runs: 0, wickets: 0, points: 0 },
  { name: "Mukesh Kumar",        team: "DC",   role: "Bowler",        credits: 7,  runs: 0, wickets: 0, points: 0 },
  { name: "Ishant Sharma",       team: "DC",   role: "Bowler",        credits: 7,  runs: 0, wickets: 0, points: 0 },
  { name: "Arshdeep Singh",      team: "PBKS", role: "Bowler",        credits: 8,  runs: 0, wickets: 0, points: 0 },
  { name: "Kagiso Rabada",       team: "PBKS", role: "Bowler",        credits: 9,  runs: 0, wickets: 0, points: 0 },
  { name: "Rahul Chahar",        team: "PBKS", role: "Bowler",        credits: 7,  runs: 0, wickets: 0, points: 0 },
  { name: "Nathan Ellis",        team: "PBKS", role: "Bowler",        credits: 7,  runs: 0, wickets: 0, points: 0 },
  { name: "Varun Chakravarthy",  team: "KKR",  role: "Bowler",        credits: 8,  runs: 0, wickets: 0, points: 0 },
  { name: "Sunil Narine",        team: "KKR",  role: "Bowler",        credits: 8,  runs: 0, wickets: 0, points: 0 },
  { name: "Shardul Thakur",      team: "KKR",  role: "Bowler",        credits: 7,  runs: 0, wickets: 0, points: 0 },
  { name: "Harshit Rana",        team: "KKR",  role: "Bowler",        credits: 7,  runs: 0, wickets: 0, points: 0 },
  { name: "Bhuvneshwar Kumar",   team: "SRH",  role: "Bowler",        credits: 8,  runs: 0, wickets: 0, points: 0 },
  { name: "T Natarajan",         team: "SRH",  role: "Bowler",        credits: 7,  runs: 0, wickets: 0, points: 0 },
  { name: "Shahbaz Ahmed",       team: "SRH",  role: "Bowler",        credits: 7,  runs: 0, wickets: 0, points: 0 },
  { name: "Umran Malik",         team: "SRH",  role: "Bowler",        credits: 7,  runs: 0, wickets: 0, points: 0 },

  // All-Rounders
  { name: "Glenn Maxwell",       team: "RCB",  role: "All-Rounder",   credits: 9,  runs: 0, wickets: 0, points: 0 },
  { name: "Cameron Green",       team: "RCB",  role: "All-Rounder",   credits: 8,  runs: 0, wickets: 0, points: 0 },
  { name: "Mahipal Lomror",      team: "RCB",  role: "All-Rounder",   credits: 7,  runs: 0, wickets: 0, points: 0 },
  { name: "Hardik Pandya",       team: "MI",   role: "All-Rounder",   credits: 10, runs: 0, wickets: 0, points: 0 },
  { name: "Romario Shepherd",    team: "MI",   role: "All-Rounder",   credits: 7,  runs: 0, wickets: 0, points: 0 },
  { name: "Naman Dhir",          team: "MI",   role: "All-Rounder",   credits: 7,  runs: 0, wickets: 0, points: 0 },
  { name: "Ravindra Jadeja",     team: "CSK",  role: "All-Rounder",   credits: 9,  runs: 0, wickets: 0, points: 0 },
  { name: "Moeen Ali",           team: "CSK",  role: "All-Rounder",   credits: 8,  runs: 0, wickets: 0, points: 0 },
  { name: "Shivam Dube",         team: "CSK",  role: "All-Rounder",   credits: 8,  runs: 0, wickets: 0, points: 0 },
  { name: "Rahul Tewatia",       team: "GT",   role: "All-Rounder",   credits: 8,  runs: 0, wickets: 0, points: 0 },
  { name: "Vijay Shankar",       team: "GT",   role: "All-Rounder",   credits: 7,  runs: 0, wickets: 0, points: 0 },
  { name: "Abhinav Manohar",     team: "GT",   role: "All-Rounder",   credits: 7,  runs: 0, wickets: 0, points: 0 },
  { name: "Riyan Parag",         team: "RR",   role: "All-Rounder",   credits: 8,  runs: 0, wickets: 0, points: 0 },
  { name: "Rovman Powell",       team: "RR",   role: "All-Rounder",   credits: 7,  runs: 0, wickets: 0, points: 0 },
  { name: "Jason Holder",        team: "RR",   role: "All-Rounder",   credits: 7,  runs: 0, wickets: 0, points: 0 },
  { name: "Krunal Pandya",       team: "LSG",  role: "All-Rounder",   credits: 8,  runs: 0, wickets: 0, points: 0 },
  { name: "Marcus Stoinis",      team: "LSG",  role: "All-Rounder",   credits: 8,  runs: 0, wickets: 0, points: 0 },
  { name: "Kyle Mayers",         team: "LSG",  role: "All-Rounder",   credits: 7,  runs: 0, wickets: 0, points: 0 },
  { name: "Axar Patel",          team: "DC",   role: "All-Rounder",   credits: 8,  runs: 0, wickets: 0, points: 0 },
  { name: "Lalit Yadav",         team: "DC",   role: "All-Rounder",   credits: 7,  runs: 0, wickets: 0, points: 0 },
  { name: "Tristan Stubbs",      team: "DC",   role: "All-Rounder",   credits: 7,  runs: 0, wickets: 0, points: 0 },
  { name: "Liam Livingstone",    team: "PBKS", role: "All-Rounder",   credits: 8,  runs: 0, wickets: 0, points: 0 },
  { name: "Sam Curran",          team: "PBKS", role: "All-Rounder",   credits: 8,  runs: 0, wickets: 0, points: 0 },
  { name: "Rishi Dhawan",        team: "PBKS", role: "All-Rounder",   credits: 7,  runs: 0, wickets: 0, points: 0 },
  { name: "Andre Russell",       team: "KKR",  role: "All-Rounder",   credits: 10, runs: 0, wickets: 0, points: 0 },
  { name: "Shakib Al Hasan",     team: "KKR",  role: "All-Rounder",   credits: 8,  runs: 0, wickets: 0, points: 0 },
  { name: "Rinku Singh",         team: "KKR",  role: "All-Rounder",   credits: 8,  runs: 0, wickets: 0, points: 0 },
  { name: "Washington Sundar",   team: "SRH",  role: "All-Rounder",   credits: 8,  runs: 0, wickets: 0, points: 0 },
  { name: "Aiden Markram",       team: "SRH",  role: "All-Rounder",   credits: 8,  runs: 0, wickets: 0, points: 0 },
  { name: "Glenn Phillips",      team: "SRH",  role: "All-Rounder",   credits: 7,  runs: 0, wickets: 0, points: 0 },

  // Wicket-Keepers
  { name: "Dinesh Karthik",      team: "RCB",  role: "Wicket-Keeper", credits: 8,  runs: 0, wickets: 0, points: 0 },
  { name: "Anuj Rawat",          team: "RCB",  role: "Wicket-Keeper", credits: 7,  runs: 0, wickets: 0, points: 0 },
  { name: "Ishan Kishan",        team: "MI",   role: "Wicket-Keeper", credits: 8,  runs: 0, wickets: 0, points: 0 },
  { name: "MS Dhoni",            team: "CSK",  role: "Wicket-Keeper", credits: 9,  runs: 0, wickets: 0, points: 0 },
  { name: "Wriddhiman Saha",     team: "GT",   role: "Wicket-Keeper", credits: 7,  runs: 0, wickets: 0, points: 0 },
  { name: "Jos Buttler",         team: "RR",   role: "Wicket-Keeper", credits: 10, runs: 0, wickets: 0, points: 0 },
  { name: "Sanju Samson",        team: "RR",   role: "Wicket-Keeper", credits: 8,  runs: 0, wickets: 0, points: 0 },
  { name: "Dhruv Jurel",         team: "RR",   role: "Wicket-Keeper", credits: 7,  runs: 0, wickets: 0, points: 0 },
  { name: "Rishabh Pant",        team: "DC",   role: "Wicket-Keeper", credits: 9,  runs: 0, wickets: 0, points: 0 },
  { name: "Jonny Bairstow",      team: "PBKS", role: "Wicket-Keeper", credits: 8,  runs: 0, wickets: 0, points: 0 },
  { name: "Prabhsimran Singh",   team: "PBKS", role: "Wicket-Keeper", credits: 7,  runs: 0, wickets: 0, points: 0 },
  { name: "Rahmanullah Gurbaz",  team: "KKR",  role: "Wicket-Keeper", credits: 8,  runs: 0, wickets: 0, points: 0 },
  { name: "Phil Salt",           team: "KKR",  role: "Wicket-Keeper", credits: 8,  runs: 0, wickets: 0, points: 0 },
  { name: "Heinrich Klaasen",    team: "SRH",  role: "Wicket-Keeper", credits: 9,  runs: 0, wickets: 0, points: 0 },
  { name: "KL Rahul",            team: "LSG",  role: "Wicket-Keeper", credits: 9,  runs: 0, wickets: 0, points: 0 },
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