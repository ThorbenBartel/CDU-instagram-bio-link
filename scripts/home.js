// Leaflet map initialisation
var map = L.map('map').setView([51.455, 7.015], 12);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

const NOMINATIM_BASE =
  'https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=1&q=';

function isAddressInEssen(address) {
  if (!address || address.country_code !== 'de') return false;
  const city   = (address.city || address.town || address.village || '').toLowerCase();
  const county = (address.county || '').toLowerCase();
  return city.includes('essen') || county.includes('essen');
}

// 2) Popup-Optionen für dunkles Design (CSS-Klasse „dark-popup“ in eurer styles.css definieren)
var popupOptions = {
  className: 'dark-popup',
  closeButton: true,
  maxWidth: 260
};

// 3) Address-Search / Autocomplete
var searchMarker       = null;
var addressInput       = document.getElementById('address-input');
var suggestionsList    = document.getElementById('suggestions-list');
var searchContainer    = document.querySelector('.search-container');

async function searchAddress() {
  const query = addressInput.value;
  if (!query) return;
  try {
    const resp = await fetch(NOMINATIM_BASE + encodeURIComponent(query + ', Essen, Deutschland'));
    const results = await resp.json();

    if (results && results.length) {
      const info = results[0];
      const { address } = info;

      if (isAddressInEssen(address)) {
        const lat = parseFloat(info.lat);
        const lon = parseFloat(info.lon);
        map.setView([lat, lon], 14);
        if (searchMarker) {
          searchMarker.setLatLng([lat, lon]);
        } else {
          searchMarker = L.marker([lat, lon]).addTo(map);
        }
        return;
      }
    }

    alert('Adresse muss in Essen, Deutschland liegen');
  } catch (err) {
    alert('Fehler bei der Adresssuche');
  }
}

document.getElementById('address-search-btn').addEventListener('click', searchAddress);
addressInput.addEventListener('keypress', function(e) {
  if (e.key === 'Enter') searchAddress();
});
addressInput.addEventListener('input', function(){
  var q = this.value;
  if (q.length < 3) {
    suggestionsList.innerHTML = '';
    return;
  }
  fetch('https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=5&q=' + encodeURIComponent(q + ', Essen, Deutschland'))
    .then(r => r.json())
    .then(results => {
      suggestionsList.innerHTML = '';
      results.forEach(function(res){
        var li = document.createElement('li');
        li.textContent = res.display_name;
        li.className = 'suggestion-item';
        li.addEventListener('click', function() {
          addressInput.value = res.display_name;
          suggestionsList.innerHTML = '';
          searchAddress();
        });
        suggestionsList.appendChild(li);
      });
    });
});

document.addEventListener('click', function(e) {
  if (!searchContainer.contains(e.target)) {
    suggestionsList.innerHTML = '';
  }
});

addressInput.addEventListener('change', searchAddress);

fetch('data/Essen-Stadtteile-map.geojson')
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
