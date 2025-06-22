// Leaflet map initialisation
var map = L.map('map').setView([51.455, 7.015], 12);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

fetch('data/essen_wahlbezirke_2020.geojson')
  .then(resp => resp.json())
  .then(data => {
    L.geoJSON(data, {
      style: {
        color: '#2d3c4b',
        weight: 2,
        fillColor: '#ffa600',
        fillOpacity: 0.3
      },
      onEachFeature: function (feature, layer) {
        layer.on('click', function () {
          var link = feature.properties.link || '#';
          layer.bindPopup('<strong>' + feature.properties.name + '</strong><br><a class="map-btn" href="' + link + '">Mehr erfahren</a>').openPopup();
        });
      }
    }).addTo(map);
  });
