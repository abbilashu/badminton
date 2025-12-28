const container = document.getElementById("tournaments");

(async function () {
  const players = await loadPlayers();
  const data = await apiGet("getTournaments");

  container.innerHTML = "";

  const active = data.filter(t => t.status === "active");

  if (active.length === 0) {
    container.innerHTML = "<p>No active tournaments.</p>";
    return;
  }

  active.forEach(t => {
    const card = document.createElement("div");
    card.className = "card";

    let gamesHtml = "";

    t.games.forEach(g => {
      const isCurrent = g.gameNumber === t.currentGame;

      const team1 = g.team1.map(id => players[id]).join(" + ");
      const team2 = g.team2.map(id => players[id]).join(" + ");

      gamesHtml += `
        <div style="margin-bottom:8px; ${isCurrent ? 'font-weight:bold;' : ''}">
          Game ${g.gameNumber}: 
          ${team1} vs ${team2}
          ${g.scoreTeam1 ? ` — ${g.scoreTeam1}:${g.scoreTeam2}` : ""}
        </div>
      `;
    });

    card.innerHTML = `
      <strong>Tournament ${t.tournamentId}</strong><br>
      Current Game: ${t.currentGame}<br><br>
      ${gamesHtml}
    `;

    container.appendChild(card);
  });
})();
