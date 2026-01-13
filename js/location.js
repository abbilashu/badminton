function toggleLocationMenu() {
  document
    .getElementById("locationOptions")
    .classList.toggle("hidden");
}

function switchLocation(city) {
  if (city === "scarborough") {
    window.location.href = "https://badmintonleague.github.io/scarborough/leaderboard.html";
  }
}
