function toggleLocationMenu() {
  document
    .getElementById("locationOptions")
    .classList.toggle("hidden");
}

function switchLocation(city) {
  if (city === "pickering") {
    window.location.href = "https://badmintonleague.github.io/pickering/leaderboard.html";
  }
}
