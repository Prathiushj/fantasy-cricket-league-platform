import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API = "https://fantasy-backend-71we.onrender.com/api";

const STATUS_CONFIG = {
  live:      { label: "LIVE",      color: "#22c55e", bg: "rgba(34,197,94,0.15)",  dot: "#22c55e" },
  upcoming:  { label: "UPCOMING",  color: "#f4a022", bg: "rgba(244,160,34,0.15)", dot: "#f4a022" },
  completed: { label: "COMPLETED", color: "#6b7280", bg: "rgba(107,114,128,0.15)", dot: "#6b7280" },
};

function MatchesPage() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${API}/matches`)
      .then((r) => setMatches(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-IN", {
      weekday: "short", day: "numeric", month: "short", year: "numeric"
    });
  };

  const formatTime = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
  };

  const live      = matches.filter(m => m.status === "live");
  const upcoming  = matches.filter(m => m.status === "upcoming");
  const completed = matches.filter(m => m.status === "completed");

  return (
    <div style={s.page}>
      <link href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;600;700&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={s.header}>
        <h1 style={s.h1}>🏏 Fantasy Cricket League</h1>
        <p style={s.tagline}>Select a match · Pick your squad · Build your legacy</p>
      </div>

      <div style={s.container}>
        {loading ? (
          <p style={{ textAlign: "center", color: "#6b7280", padding: 40 }}>Loading matches...</p>
        ) : (
          <>
            {/* Live Matches */}
            {live.length > 0 && (
              <>
                <div style={s.sectionHeader}>
                  <span style={s.liveDot} />
                  <span style={s.sectionTitle}>Live Now</span>
                </div>
                {live.map(m => (
                  <MatchCard key={m._id} match={m} onSelect={() => navigate(`/match/${m._id}`)} formatDate={formatDate} formatTime={formatTime} />
                ))}
              </>
            )}

            {/* Upcoming Matches */}
            {upcoming.length > 0 && (
              <>
                <div style={s.sectionHeader}>
                  <span style={s.sectionTitle}>Upcoming Matches</span>
                </div>
                {upcoming.map(m => (
                  <MatchCard key={m._id} match={m} onSelect={() => navigate(`/match/${m._id}`)} formatDate={formatDate} formatTime={formatTime} />
                ))}
              </>
            )}

            {/* Completed Matches */}
            {completed.length > 0 && (
              <>
                <div style={s.sectionHeader}>
                  <span style={s.sectionTitle}>Completed</span>
                </div>
                {completed.map(m => (
                  <MatchCard key={m._id} match={m} onSelect={null} formatDate={formatDate} formatTime={formatTime} />
                ))}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function MatchCard({ match, onSelect, formatDate, formatTime }) {
  const cfg = STATUS_CONFIG[match.status];
  const isClickable = match.status !== "completed";

  return (
    <div
      style={{
        ...s.card,
        cursor: isClickable ? "pointer" : "default",
        opacity: match.status === "completed" ? 0.6 : 1,
      }}
      onClick={() => isClickable && onSelect && onSelect()}
    >
      {/* Status Badge */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <span style={{ ...s.statusBadge, color: cfg.color, background: cfg.bg }}>
          {match.status === "live" && <span style={{ ...s.dot, background: cfg.dot }} />}
          {cfg.label}
        </span>
        {isClickable && (
          <span style={s.createBtn}>Create Team →</span>
        )}
      </div>

      {/* Teams */}
      <div style={s.teamsRow}>
        <div style={s.teamBlock}>
          <div style={s.teamEmoji}>{getTeamEmoji(match.team1)}</div>
          <div style={s.teamName}>{match.team1}</div>
        </div>
        <div style={s.vsBlock}>
          <div style={s.vs}>VS</div>
        </div>
        <div style={s.teamBlock}>
          <div style={s.teamEmoji}>{getTeamEmoji(match.team2)}</div>
          <div style={s.teamName}>{match.team2}</div>
        </div>
      </div>

      {/* Meta */}
      <div style={s.matchMeta}>
        <span>📅 {formatDate(match.matchDate)}</span>
        <span>🕐 {formatTime(match.matchDate)}</span>
        <span>📍 {match.venue.split(",")[0]}</span>
      </div>
    </div>
  );
}

function getTeamEmoji(team) {
  const map = {
    RCB: "🔴", MI: "🔵", CSK: "🟡", GT: "🔵", RR: "🩷",
    DC: "🔵", PBKS: "🔴", LSG: "🟢", KKR: "🟣", SRH: "🟠"
  };
  return map[team] || "🏏";
}

const s = {
  page: {
    background: "#0d0f14", minHeight: "100vh", color: "#f0f2f7",
    fontFamily: "'DM Sans', sans-serif",
    backgroundImage: "radial-gradient(ellipse at 20% 0%,rgba(244,160,34,0.06) 0%,transparent 50%),radial-gradient(ellipse at 80% 100%,rgba(232,82,58,0.06) 0%,transparent 50%)"
  },
  header: { textAlign: "center", padding: "36px 20px 24px", borderBottom: "1px solid #1a1e2a" },
  h1: {
    fontFamily: "'Rajdhani', sans-serif", fontSize: "clamp(2rem,5vw,3rem)", fontWeight: 700,
    letterSpacing: 2, background: "linear-gradient(135deg,#fff 40%,#f4a022)",
    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
    padding: "0 4px", lineHeight: 1.2, display: "inline-block"
  },
  tagline: { color: "#6b7280", fontSize: 12, marginTop: 6, letterSpacing: 1, textTransform: "uppercase" },
  container: { maxWidth: 700, margin: "0 auto", padding: "24px 16px 60px" },
  sectionHeader: {
    display: "flex", alignItems: "center", gap: 10,
    margin: "24px 0 12px", paddingBottom: 8,
    borderBottom: "1px solid #1a1e2a"
  },
  sectionTitle: { fontFamily: "'Rajdhani', sans-serif", fontSize: "1rem", fontWeight: 700, letterSpacing: 1, color: "#9ca3af", textTransform: "uppercase" },
  liveDot: { width: 8, height: 8, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 6px #22c55e", display: "inline-block" },
  card: {
    background: "#13161e", border: "1px solid #252a38", borderRadius: 16,
    padding: 24, marginBottom: 12, transition: "all .2s",
  },
  statusBadge: {
    display: "inline-flex", alignItems: "center", gap: 6,
    padding: "4px 12px", borderRadius: 20, fontSize: 11, fontWeight: 700, letterSpacing: 1
  },
  dot: { width: 6, height: 6, borderRadius: "50%", display: "inline-block" },
  createBtn: {
    fontSize: 13, fontWeight: 600, color: "#f4a022",
    fontFamily: "'Rajdhani', sans-serif", letterSpacing: 1
  },
  teamsRow: { display: "flex", alignItems: "center", justifyContent: "space-between", margin: "16px 0" },
  teamBlock: { flex: 1, textAlign: "center" },
  teamEmoji: { fontSize: 32, marginBottom: 6 },
  teamName: { fontFamily: "'Rajdhani', sans-serif", fontSize: "1.4rem", fontWeight: 700, letterSpacing: 1 },
  vsBlock: { flex: "0 0 60px", textAlign: "center" },
  vs: {
    fontFamily: "'Rajdhani', sans-serif", fontSize: "1.1rem", fontWeight: 700,
    color: "#6b7280", background: "#1a1e2a", border: "1px solid #252a38",
    borderRadius: 8, padding: "6px 12px", display: "inline-block"
  },
  matchMeta: { display: "flex", gap: 16, flexWrap: "wrap", fontSize: 12, color: "#6b7280", marginTop: 8 },
};

export default MatchesPage;