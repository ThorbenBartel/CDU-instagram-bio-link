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

document.addEventListener('DOMContentLoaded', function() {
  const playButton = document.querySelector('.play-button');
  const video = document.querySelector('video');

  // Example of how to handle the play button and video (add your logic here)
  // playButton.addEventListener('click', function() {
  //   video.play();
  // });

}); // <-- This closing brace was missing

// Konfiguration – ersetze durch deine Daten
const accessToken = "YOUR_INSTAGRAM_ACCESS_TOKEN"; // z.B. aus der Basic Display API
const userId = "YOUR_USER_ID"; // deine Instagram User-ID
const numPosts = 6; // Anzahl der anzuzeigenden Beiträge

function fetchInstagramFeed() {
    // API Endpoint gemäß Instagram Basic Display API
    const endpoint = `https://graph.instagram.com/${userId}/media?fields=id,media_type,media_url,permalink,thumbnail_url&access_token=${accessToken}&limit=${numPosts}`;

    fetch(endpoint)
        .then(response => response.json())
        .then(data => {
            const feedContainer = document.getElementById("instagram-feed");
            // Sicherstellen, dass Daten vorliegen
            if (data.data && Array.isArray(data.data)) {
                data.data.forEach(post => {
                    // Für Videos kann ggf. thumbnail_url verwendet werden
                    const imageUrl = post.media_type === "VIDEO" ? post.thumbnail_url : post.media_url;
                    const postLink = post.permalink;
                    
                    // Erstelle ein Link-Element um das Bild
                    const a = document.createElement("a");
                    a.href = postLink;
                    a.target = "_blank";
                    a.rel = "noopener noreferrer";
                    
                    const img = document.createElement("img");
                    img.src = imageUrl;
                    img.alt = "Instagram Post";
                    
                    a.appendChild(img);
                    feedContainer.appendChild(a);
                });
            } else {
                feedContainer.innerHTML = "<p>Keine Beiträge gefunden.</p>";
            }
        })
        .catch(error => {
            console.error("Error fetching Instagram feed:", error);
            document.getElementById("instagram-feed").innerHTML = "<p>Fehler beim Laden des Feeds.</p>";
        });
}

document.addEventListener("DOMContentLoaded", function() {
    // Andere Funktionen...
    fetchInstagramFeed();
});