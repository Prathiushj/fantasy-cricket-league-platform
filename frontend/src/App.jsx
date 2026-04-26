import { useEffect, useState } from "react";
import axios from "axios";

const API = "https://fantasy-backend-71we.onrender.com/api";

const ROLE_CONFIG = {
  "Wicket-Keeper": { emoji: "🧤", badge: "Min 1", color: "#a78bfa", bg: "rgba(139,92,246,0.2)" },
  "Batsman":       { emoji: "🏏", badge: "Min 3", color: "#fbbf24", bg: "rgba(244,160,34,0.2)" },
  "All-Rounder":   { emoji: "⭐", badge: "Min 2", color: "#4ade80", bg: "rgba(34,197,94,0.2)" },
  "Bowler":        { emoji: "🎯", badge: "Min 3", color: "#60a5fa", bg: "rgba(59,130,246,0.2)" },
};

function App() {
  const [players, setPlayers] = useState([]);
  const [teamName, setTeamName] = useState("");
  const [userName, setUserName] = useState("");
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [captain, setCaptain] = useState(null);
  const [viceCaptain, setViceCaptain] = useState(null);
  const [teams, setTeams] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [checkboxKey, setCheckboxKey] = useState(0);
  const [selectedPlayerId, setSelectedPlayerId] = useState("");
  const [scoreForm, setScoreForm] = useState({ runs: "", wickets: "" });
  const [teamLoading, setTeamLoading] = useState(false);
  const [scoreLoading, setScoreLoading] = useState(false);

  const fetchPlayers = () =>
    axios.get(`${API}/players`).then((r) => setPlayers(r.data)).catch(console.error);

  const fetchTeams = () =>
    axios.get(`${API}/teams`).then((r) => setTeams(r.data)).catch(console.error);

  useEffect(() => {
    fetchPlayers();
    fetchTeams();
  }, []);
  useEffect(() => {
    if (!error && !success) return;
    const timer = setTimeout(() => {
      setError("");
      setSuccess("");
    }, 4000);
    return () => clearTimeout(timer);
}, [error, success]);

  const selectedObjs = players.filter((p) => selectedPlayers.includes(p._id));
  const totalCredits = selectedObjs.reduce((s, p) => s + p.credits, 0);

  const handleSelect = (id) => {
    if (selectedPlayers.includes(id)) {
      setSelectedPlayers(selectedPlayers.filter((pid) => pid !== id));
      if (captain === id) setCaptain(null);
      if (viceCaptain === id) setViceCaptain(null);
    } else {
      if (selectedPlayers.length >= 11) return;
      setSelectedPlayers([...selectedPlayers, id]);
    }
  };

  const handleCaptain = (id) => {
    if (viceCaptain === id) setViceCaptain(null);
    setCaptain(id);
  };

  const handleViceCaptain = (id) => {
    if (captain === id) setCaptain(null);
    setViceCaptain(id);
  };

 const createTeam = () => {
  setError(""); setSuccess("");
  if (!userName.trim()) return setError("Please enter your name.");
  if (!teamName.trim()) return setError("Please enter a team name.");
  if (selectedPlayers.length !== 11) return setError(`Select exactly 11 players. Currently: ${selectedPlayers.length}`);
  if (!captain) return setError("Please select a Captain.");
  if (!viceCaptain) return setError("Please select a Vice-Captain.");

  setTeamLoading(true);
  axios.post(`${API}/teams/create`, { teamName, userName, selectedPlayers, captain, viceCaptain })
    .then((res) => {
      setSuccess(`Team "${res.data.teamName}" created successfully!`);
      setTeamName(""); setUserName("");
      setSelectedPlayers([]); setCaptain(null); setViceCaptain(null);
      setCheckboxKey((p) => p + 1);
      fetchTeams();
    })
    .catch((err) => setError(err.response?.data?.message || "Something went wrong."))
    .finally(() => setTeamLoading(false));
};

  const updateScore = () => {
  setError(""); setSuccess("");
  if (!selectedPlayerId) return setError("Please select a player.");
  if (scoreForm.runs === "" || scoreForm.wickets === "") return setError("Enter both runs and wickets.");
  if (Number(scoreForm.runs) < 0 || Number(scoreForm.wickets) < 0) return setError("Values cannot be negative.");

  setScoreLoading(true);
  axios.put(`${API}/players/${selectedPlayerId}`, {
    runs: Number(scoreForm.runs),
    wickets: Number(scoreForm.wickets)
  })
    .then((res) => {
      setSuccess(`✅ ${res.data.name}'s score updated — ${res.data.runs} runs, ${res.data.wickets} wickets, ${res.data.points} pts`);
      setScoreForm({ runs: "", wickets: "" });
      setSelectedPlayerId("");
      fetchPlayers(); fetchTeams();
    })
    .catch((err) => setError(err.response?.data?.message || "Score update failed."))
    .finally(() => setScoreLoading(false));
};

  const captainName = captain ? players.find((p) => p._id === captain)?.name : null;
  const vcName = viceCaptain ? players.find((p) => p._id === viceCaptain)?.name : null;

  return (
    <div style={s.page}>
      {/* Google Fonts */}
      <link href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;600;700&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={s.header}>
        <h1 style={s.h1}>🏏 Fantasy Cricket League</h1>
        <p style={s.tagline}>Pick your squad · Build your legacy</p>
      </div>

      <div style={s.container}>
        {/* Toast Messages */}
        {error && (
          <div style={{ ...s.toast, ...s.toastError }}>❌ {error}</div>
        )}
        {success && (
          <div style={{ ...s.toast, ...s.toastSuccess }}>{success}</div>
        )}

        {/* Create Team Card */}
        <div style={s.card}>
          <div style={s.cardTitle}>
            <div style={{ ...s.icon, background: "rgba(34,197,94,0.15)" }}>🛡️</div>
            Create Your Team
          </div>
          <div style={s.inputRow}>
            <input
              style={s.input}
              type="text"
              placeholder="Enter Your Name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
            <input
              style={s.input}
              type="text"
              placeholder="Enter Team Name"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
            />
            <button style={s.btnGreen} onClick={createTeam}>Create Team</button>
          </div>

          {/* Stats Bar */}
          <div style={s.statsBar}>
            <StatPill label="Players" value={`${selectedPlayers.length}/11`} color={selectedPlayers.length === 11 ? "#22c55e" : "#6b7280"} />
            <StatPill label="Credits" value={`${totalCredits}/100`} color={totalCredits > 90 ? "#f4a022" : "#6b7280"} />
            <StatPill label="Captain" value={captainName || "None"} color={captainName ? "#f4a022" : "#6b7280"} />
            <StatPill label="Vice-Captain" value={vcName || "None"} color={vcName ? "#9ca3af" : "#6b7280"} />
          </div>
        </div>

        {/* Players List Card */}
        <div style={s.card}>
          <div style={s.cardTitle}>
            <div style={{ ...s.icon, background: "rgba(244,160,34,0.15)" }}>📋</div>
            Players List
          </div>

          {["Wicket-Keeper", "Batsman", "All-Rounder", "Bowler"].map((role) => {
            const cfg = ROLE_CONFIG[role];
            return (
              <div key={role}>
                {/* Role Header */}
                <div style={s.roleHeader}>
                  <span style={s.roleLabel}>{cfg.emoji} {role}s</span>
                  <span style={{ ...s.roleBadge, color: cfg.color, background: cfg.bg }}>
                    {cfg.badge}
                  </span>
                </div>

                {/* Player Grid */}
                <div style={s.playerGrid}>
                  {players.filter((p) => p.role === role).map((player) => {
                    const isSel = selectedPlayers.includes(player._id);
                    const overBudget = !isSel && totalCredits + player.credits > 100;
                    const maxed = !isSel && selectedPlayers.length >= 11;
                    const disabled = overBudget || maxed;
                    const isCap = captain === player._id;
                    const isVC = viceCaptain === player._id;

                    return (
                      <div
                        key={player._id}
                        style={{
                          ...s.playerCard,
                          ...(isSel ? s.playerCardSelected : {}),
                          ...(disabled ? s.playerCardDisabled : {}),
                        }}
                        onClick={() => !disabled && handleSelect(player._id)}
                      >
                        <input
                          key={checkboxKey}
                          type="checkbox"
                          checked={isSel}
                          disabled={disabled}
                          onChange={() => handleSelect(player._id)}
                          onClick={(e) => e.stopPropagation()}
                          style={{ accentColor: "#22c55e", width: 16, height: 16, flexShrink: 0, cursor: "pointer" }}
                        />
                        <div style={s.playerInfo}>
                          <div style={s.playerName}>{player.name}</div>
                          <div style={s.playerMeta}>{player.team} · {player.credits} cr</div>
                        </div>
                        <div style={s.playerPts}>{player.points}</div>
                        {isSel && (
                          <div style={s.vcBtns}>
                            <button
                              style={{ ...s.vcBtn, ...(isCap ? s.capActive : s.capInactive) }}
                              onClick={(e) => { e.stopPropagation(); handleCaptain(player._id); }}
                            >C</button>
                            <button
                              style={{ ...s.vcBtn, ...(isVC ? s.vcActive : s.vcInactive) }}
                              onClick={(e) => { e.stopPropagation(); handleViceCaptain(player._id); }}
                            >VC</button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Admin Panel */}
        <div style={s.card}>
          <div style={s.cardTitle}>
            <div style={{ ...s.icon, background: "rgba(59,130,246,0.15)" }}>⚙️</div>
            Admin — Update Score
          </div>
          <select
            value={selectedPlayerId}
            onChange={(e) => setSelectedPlayerId(e.target.value)}
            style={s.select}
          >
            <option value="">-- Select Player --</option>
            {["Wicket-Keeper", "Batsman", "All-Rounder", "Bowler"].map((role) => (
              <optgroup key={role} label={role}>
                {players.filter((p) => p.role === role).map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name} ({p.team}) — {p.points} pts
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          <div style={{ ...s.inputRow, marginBottom: 12 }}>
            <input
              style={s.input}
              type="number"
              placeholder="Runs"
              min="0"
              value={scoreForm.runs}
              onChange={(e) => setScoreForm({ ...scoreForm, runs: e.target.value })}
            />
            <input
              style={s.input}
              type="number"
              placeholder="Wickets"
              min="0"
              value={scoreForm.wickets}
              onChange={(e) => setScoreForm({ ...scoreForm, wickets: e.target.value })}
            />
          </div>
          <button style={s.btnBlue} onClick={updateScore}>Update Score</button>
        </div>

        {/* Leaderboard */}
        <div style={s.card}>
          <div style={s.cardTitle}>
            <div style={{ ...s.icon, background: "rgba(232,82,58,0.15)" }}>🏆</div>
            Leaderboard
          </div>
          {teams.length === 0 ? (
            <p style={{ color: "#6b7280", textAlign: "center", padding: "20px 0" }}>
              No teams yet. Create one above!
            </p>
          ) : (
            teams.map((team, i) => (
              <div key={team._id} style={{
                ...s.lbRow,
                ...(i === 0 ? s.lbFirst : i === 1 ? s.lbSecond : i === 2 ? s.lbThird : {})
              }}>
                <div style={{ ...s.lbRank, color: i === 0 ? "#f4a022" : i === 1 ? "#9ca3af" : i === 2 ? "#b4783c" : "#6b7280" }}>
                  {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i + 1}`}
                </div>
                <div style={s.lbInfo}>
                  <div style={s.lbTeam}>{team.teamName}</div>
                  <div style={s.lbUser}>{team.userName}</div>
                </div>
                <div style={s.lbPicks}>
                  {team.captain?.name && (
                    <span style={s.lbPickC}>C: {team.captain.name}</span>
                  )}
                  {team.viceCaptain?.name && (
                    <span style={s.lbPickVC}>VC: {team.viceCaptain.name}</span>
                  )}
                </div>
                <div style={s.lbPts}>{team.totalPoints}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// Stat Pill Component
function StatPill({ label, value, color }) {
  return (
    <div style={{
      flex: 1, minWidth: 80,
      background: "#13161e",
      border: "1px solid #252a38",
      borderRadius: 10, padding: "10px 14px", textAlign: "center"
    }}>
      <div style={{ fontSize: 10, color: "#6b7280", textTransform: "uppercase", letterSpacing: 1 }}>{label}</div>
      <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "1.2rem", fontWeight: 700, color, marginTop: 2 }}>{value}</div>
    </div>
  );
}

// Styles object
const s = {
  page: {
    background: "#0d0f14",
    minHeight: "100vh",
    color: "#f0f2f7",
    fontFamily: "'DM Sans', sans-serif",
    backgroundImage: "radial-gradient(ellipse at 20% 0%,rgba(244,160,34,0.06) 0%,transparent 50%),radial-gradient(ellipse at 80% 100%,rgba(232,82,58,0.06) 0%,transparent 50%)"
  },
  header: { textAlign: "center", padding: "36px 20px 24px", borderBottom: "1px solid #1a1e2a" },
  h1: {
        fontFamily: "'Rajdhani', sans-serif",
    fontSize: "clamp(2rem,5vw,3rem)",
    fontWeight: 700,
    letterSpacing: 2,
    background: "linear-gradient(135deg,#fff 40%,#f4a022)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    padding: "0 4px",        // add this — prevents edge clipping
    lineHeight: 1.2,         // add this — prevents top/bottom clipping
    display: "inline-block", // add this — critical for clip to work correctly
  },
  tagline: { color: "#6b7280", fontSize: 12, marginTop: 6, letterSpacing: 1, textTransform: "uppercase" },
  container: { maxWidth: 900, margin: "0 auto", padding: "16px 16px 60px" },
  toast: { padding: "12px 18px", borderRadius: 10, fontSize: 14, fontWeight: 500, marginBottom: 16, display: "flex", alignItems: "center", gap: 10 },
  toastError: { background: "rgba(232,82,58,0.12)", border: "1px solid rgba(232,82,58,0.3)", color: "#f87171" },
  toastSuccess: { background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.25)", color: "#4ade80" },
  card: { background: "#13161e", border: "1px solid #252a38", borderRadius: 16, padding: 24, marginBottom: 20 },
  cardTitle: { fontFamily: "'Rajdhani', sans-serif", fontSize: "1.2rem", fontWeight: 700, letterSpacing: 1, marginBottom: 18, display: "flex", alignItems: "center", gap: 10 },
  icon: { width: 32, height: 32, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 },
  inputRow: { display: "flex", gap: 10, flexWrap: "wrap" },
  input: { flex: 1, minWidth: 140, padding: "12px 16px", background: "#1a1e2a", border: "1px solid #252a38", borderRadius: 10, color: "#f0f2f7", fontFamily: "'DM Sans', sans-serif", fontSize: 14, outline: "none" },
  btnGreen: { padding: "12px 24px", border: "none", borderRadius: 10, fontFamily: "'Rajdhani', sans-serif", fontSize: 15, fontWeight: 700, letterSpacing: 1, cursor: "pointer", background: "linear-gradient(135deg,#16a34a,#22c55e)", color: "#fff", whiteSpace: "nowrap" },
  btnBlue: { padding: "12px 24px", border: "none", borderRadius: 10, fontFamily: "'Rajdhani', sans-serif", fontSize: 15, fontWeight: 700, letterSpacing: 1, cursor: "pointer", background: "linear-gradient(135deg,#1d4ed8,#3b82f6)", color: "#fff", width: "100%" },
  statsBar: { display: "flex", gap: 8, flexWrap: "wrap", marginTop: 16 },
  roleHeader: { display: "flex", alignItems: "center", gap: 10, margin: "24px 0 12px", paddingBottom: 8, borderBottom: "1px solid #252a38" },
  roleLabel: { fontFamily: "'Rajdhani', sans-serif", fontSize: "1rem", fontWeight: 700, letterSpacing: 1, color: "#9ca3af", textTransform: "uppercase" },
  roleBadge: { padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600 },
  playerGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 10 },
  playerCard: { background: "#1a1e2a", border: "1px solid #252a38", borderRadius: 12, padding: "12px 14px", display: "flex", alignItems: "center", gap: 10, cursor: "pointer", transition: "all .2s" },
  playerCardSelected: { borderColor: "rgba(34,197,94,0.5)", background: "rgba(34,197,94,0.07)" },
  playerCardDisabled: { opacity: 0.35, cursor: "not-allowed" },
  playerInfo: { flex: 1, minWidth: 0 },
  playerName: { fontWeight: 600, fontSize: 14, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  playerMeta: { fontSize: 11, color: "#6b7280", marginTop: 2 },
  playerPts: { fontFamily: "'Rajdhani', sans-serif", fontSize: 15, fontWeight: 700, color: "#f4a022", flexShrink: 0 },
  vcBtns: { display: "flex", gap: 4, flexShrink: 0 },
  vcBtn: { padding: "3px 7px", borderRadius: 6, fontSize: 11, fontWeight: 700, border: "1px solid", cursor: "pointer", fontFamily: "'Rajdhani', sans-serif", letterSpacing: ".5px" },
  capInactive: { borderColor: "#f4a022", background: "transparent", color: "#f4a022" },
  capActive: { borderColor: "#f4a022", background: "#f4a022", color: "#000" },
  vcInactive: { borderColor: "#9ca3af", background: "transparent", color: "#9ca3af" },
  vcActive: { borderColor: "#9ca3af", background: "#9ca3af", color: "#000" },
  select: { width: "100%", padding: "12px 16px", background: "#1a1e2a", border: "1px solid #252a38", borderRadius: 10, color: "#f0f2f7", fontFamily: "'DM Sans', sans-serif", fontSize: 14, outline: "none", marginBottom: 12, cursor: "pointer" },
  lbRow: { display: "flex", alignItems: "center", gap: 12, padding: "14px 18px", borderRadius: 12, marginBottom: 8, border: "1px solid #252a38", background: "#1a1e2a" },
  lbFirst: { background: "linear-gradient(135deg,rgba(244,160,34,0.12),rgba(244,160,34,0.04))", borderColor: "rgba(244,160,34,0.4)" },
  lbSecond: { borderColor: "rgba(156,163,175,0.35)" },
  lbThird: { borderColor: "rgba(180,120,60,0.3)" },
  lbRank: { fontFamily: "'Rajdhani', sans-serif", fontSize: "1.5rem", fontWeight: 700, width: 36, textAlign: "center", flexShrink: 0 },
  lbInfo: { flex: 1, minWidth: 0 },
  lbTeam: { fontFamily: "'Rajdhani', sans-serif", fontSize: "1.1rem", fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  lbUser: { fontSize: 12, color: "#6b7280" },
  lbPicks: { display: "flex", gap: 8, flexWrap: "wrap" },
  lbPickC: { fontSize: 11, padding: "2px 8px", borderRadius: 20, background: "rgba(244,160,34,0.15)", color: "#f4a022" },
  lbPickVC: { fontSize: 11, padding: "2px 8px", borderRadius: 20, background: "rgba(156,163,175,0.15)", color: "#9ca3af" },
  lbPts: { fontFamily: "'Rajdhani', sans-serif", fontSize: "1.6rem", fontWeight: 700, color: "#22c55e", flexShrink: 0 },
};

export default App;