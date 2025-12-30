let PLAYERS = {};
let STATS = [];
let ALL_TOURNAMENTS = [];

const leaderboardEl = document.getElementById("leaderboard");
const menuBtn = document.getElementById("menuBtn");
const menu = document.getElementById("menu");

menuBtn.onclick = () => menu.classList.toggle("hidden");

(async function () {
  PLAYERS = await loadPlayers();
  STATS = await apiGet("getRankings");
  ALL_TOURNAMENTS = await apiGet("getTournaments");

  leaderboardEl.innerHTML = "";

  STATS
    .sort((a, b) => b.winPct - a.winPct)
    .forEach((p, i) => {
      const player = PLAYERS[p.playerId];
      const name =
        typeof player === "string"
          ? player
          : player?.name || `Player ${p.playerId}`;

      const card = document.createElement("div");
      card.className = "card";
      card.style.cursor = "pointer";

      if (i === 0) card.classList.add("rank-1");
      if (i === 1) card.classList.add("rank-2");
      if (i === 2) card.classList.add("rank-3");

      card.innerHTML = `
        <strong>#${i + 1} ${name}</strong><br>
        Win PCT: ${(p.winPct * 100).toFixed(1)}%<br>
        GP: ${p.gamesPlayed}
      `;

      card.onclick = () => openPlayerModal(p);
      leaderboardEl.appendChild(card);
    });
})();

/********************
 * PLAYER MODAL
 ********************/

function openPlayerModal(playerStat) {
  const player = PLAYERS[playerStat.playerId];
  if (!player) return;

  const gender = typeof player === "string" ? null : player.gender;
  const name = typeof player === "string" ? player : player.name;

  document.getElementById("playerName").innerText = name;
  document.getElementById("playerEmoji").innerText =
    gender === "M" ? "♂️" : gender === "F" ? "♀️" : "";

  // Tabs
  const tabStats = document.getElementById("tabStats");
  const tabPartners = document.getElementById("tabPartners");
  const statsEl = document.getElementById("playerStats");
  const partnersEl = document.getElementById("playerPartners");

  // Default tab
  tabStats.classList.add("active");
  tabPartners.classList.remove("active");
  statsEl.classList.remove("hidden");
  partnersEl.classList.add("hidden");

  // Stats content (existing)
  statsEl.innerHTML = `
    <div class="player-stat"><span>Games Played</span><span>${playerStat.gamesPlayed}</span></div>
    <div class="player-stat"><span>Wins</span><span>${playerStat.wins}</span></div>
    <div class="player-stat"><span>Losses</span><span>${playerStat.losses}</span></div>
    <div class="player-stat"><span>Win %</span><span>${(playerStat.winPct * 100).toFixed(1)}%</span></div>
    <div class="player-stat"><span>Points For</span><span>${playerStat.pf}</span></div>
    <div class="player-stat"><span>Points Against</span><span>${playerStat.pa}</span></div>
  `;

  // Partners content
  partnersEl.innerHTML = renderPartnerStats(playerStat.playerId);

  // Tab handlers
  tabStats.onclick = () => {
    tabStats.classList.add("active");
    tabPartners.classList.remove("active");
    statsEl.classList.remove("hidden");
    partnersEl.classList.add("hidden");
  };

  tabPartners.onclick = () => {
    tabPartners.classList.add("active");
    tabStats.classList.remove("active");
    partnersEl.classList.remove("hidden");
    statsEl.classList.add("hidden");
  };

  document.getElementById("playerBackdrop").classList.remove("hidden");
  document.getElementById("playerModal").classList.remove("hidden");
}

function closePlayerModal() {
  document.getElementById("playerBackdrop").classList.add("hidden");
  document.getElementById("playerModal").classList.add("hidden");
}

/********************
 * PARTNER STATS
 ********************/

function renderPartnerStats(playerId) {
  const partners = {};

  ALL_TOURNAMENTS.forEach(t => {
    t.games.forEach(g => {
      const teams = [
        { team: g.team1, score: g.scoreTeam1, opp: g.scoreTeam2 },
        { team: g.team2, score: g.scoreTeam2, opp: g.scoreTeam1 }
      ];

      teams.forEach(({ team, score, opp }) => {
        if (!team.includes(playerId) || score == null || opp == null) return;

        const partnerId = team.find(p => p !== playerId);
        if (!partnerId) return;

        if (!partners[partnerId]) {
          partners[partnerId] = { gp: 0, w: 0, l: 0 };
        }

        partners[partnerId].gp++;
        score > opp ? partners[partnerId].w++ : partners[partnerId].l++;
      });
    });
  });

  const topPartners = Object.entries(partners)
    .filter(([_, s]) => s.gp >= 2)
    .map(([pid, s]) => ({
      name: PLAYERS[pid],
      ...s,
      winPct: s.w / s.gp
    }))
    .sort((a, b) => b.winPct - a.winPct)
    .slice(0, 3);

  if (topPartners.length === 0) {
    return `<p style="color:#777; text-align:center;">No partner data yet.</p>`;
  }

  return topPartners
    .map(p => `
      <div class="player-stat">
        <span><strong>${p.name}</strong></span>
        <span>${p.w}–${p.l} (${(p.winPct * 100).toFixed(0)}%)</span>
      </div>
    `)
    .join("");
}
