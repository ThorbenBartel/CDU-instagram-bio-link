// home.js

// 1) Leaflet map initialisation
var map = L.map('map').setView([51.455, 7.015], 12);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

var searchMarker = null;
var addressInput = document.getElementById('address-input');
var suggestionsList = document.getElementById('suggestions-list');
var searchContainer = document.querySelector('.search-container');

function searchAddress() {
  var query = addressInput.value;
  if (!query) return;
  fetch(NOMINATIM_BASE + encodeURIComponent(query + ', Essen'))
    .then(resp => resp.json())
    .then(results => {
      if (results && results.length > 0) {
        var lat = parseFloat(results[0].lat);
        var lon = parseFloat(results[0].lon);
        map.setView([lat, lon], 14);
        if (searchMarker) {
          searchMarker.setLatLng([lat, lon]);
        } else {
          searchMarker = L.marker([lat, lon]).addTo(map);
        }
      } else {
        alert('Adresse muss in Essen, Deutschland liegen');
      }
    })
    .catch(() => {
      alert('Fehler bei der Adresssuche');
    });
}

document.getElementById('address-search-btn').addEventListener('click', searchAddress);
addressInput.addEventListener('keypress', function(e){
  if (e.key === 'Enter') searchAddress();
});

addressInput.addEventListener('input', function() {
  var query = addressInput.value;
  if (query.length < 3) { suggestionsList.innerHTML = ''; return; }
  fetch('https://nominatim.openstreetmap.org/search?format=json&limit=5&q=' + encodeURIComponent(query))
    .then(resp => resp.json())
    .then(results => {
      suggestionsList.innerHTML = '';
      results.forEach(function(result) {
        var li = document.createElement('li');
        li.textContent = res.display_name;
        li.className   = 'suggestion-item';
        li.addEventListener('click', function(){
          addressInput.value       = res.display_name;
          suggestionsList.innerHTML = '';
          searchAddress();
        });
        suggestionsList.appendChild(li);
      });
    });
});
document.addEventListener('click', function(e){
  if (!searchContainer.contains(e.target)) {
    suggestionsList.innerHTML = '';
  }
});

// 4) GeoJSON laden und Stadtteile als dunkel umrandete Polygone hinzufügen
fetch('data/Essen-Stadtteile-map.geojson')
  .then(resp => resp.json())
  .then(data => {
    L.geoJSON(data, {
      style: {
        color:      '#2d3c4b',  // dunkler Rahmen
        weight:      2,
        fillColor:  '#ffa600',  // Füllfarbe (kann angepasst werden)
        fillOpacity: 0.3
      },
      onEachFeature: function(feature, layer) {
        var p = feature.properties || {};
        var name       = p.name       || '–';
        var kandidaten = p.kandidaten || 'keine Angabe';
        var link       = p.link       || '#';

        // Popup-Inhalt aufbauen
        var html = ''
          + '<div class="popup-wrapper">'
          +   '<h3>' + name + '</h3>'
          +   '<p>' + kandidaten + '</p>'
          +   '<a class="map-btn" href="' + link + '" target="_blank">Mehr erfahren</a>'
          + '</div>';

        // Popup binden (öffnet automatisch auf Click)
        layer.bindPopup(html, popupOptions);
      }
    }).addTo(map);
  })
  .catch(err => {
    console.error('Fehler beim Laden der GeoJSON:', err);
  });
