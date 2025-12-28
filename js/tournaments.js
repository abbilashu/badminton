const container = document.getElementById("tournaments");

apiGet("getTournaments").then(data => {
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
      gamesHtml += `
        <div style="margin-bottom:8px; ${isCurrent ? 'font-weight:bold;' : ''}">
          Game ${g.gameNumber}: 
          ${g.team1.join(" + ")} vs ${g.team2.join(" + ")}
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
});
