// Ziel-Datum für die Bundestagswahl
const targetDate = new Date("September 14, 2025 18:00:00").getTime();

// Countdown-Funktion
function updateCountdown() {
  const now = new Date().getTime();
  const difference = targetDate - now;

  // Zeit berechnen
  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((difference % (1000 * 60)) / 1000);

  // Elemente aktualisieren
  document.getElementById("days").textContent = days;
  document.getElementById("hours").textContent = hours;
  document.getElementById("minutes").textContent = minutes;
  document.getElementById("seconds").textContent = seconds;

  // Countdown stoppen, wenn das Datum erreicht ist
  if (difference < 0) {
    clearInterval(countdownInterval);
    document.querySelector(".countdown").innerHTML = "<p>Die Bundestagswahl hat begonnen!</p>";
  }
}

// Countdown jede Sekunde aktualisieren
const countdownInterval = setInterval(updateCountdown, 1000);
updateCountdown();
