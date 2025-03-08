document.getElementById('search-input').addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    searchActivities();
  }
});

document.getElementById('search-btn').addEventListener('click', function() {
  searchActivities();
});

function searchActivities() {
  const searchQuery = document.getElementById('search-input').value;
  const distance = document.getElementById('distance').value;

  if (!searchQuery) {
    alert('Inserisci un comune!');
    return;
  }

  // Mostra la barra di caricamento
  const loadingBar = document.getElementById('loading-bar');
  const loadingBarContainer = document.getElementById('loading-bar-container');
  loadingBarContainer.style.display = 'block'; // Rende visibile la barra di caricamento
  loadingBar.classList.add('visible'); // Avvia l'animazione della barra

  // Nascondi i risultati precedenti
  document.getElementById('results-container').innerHTML = '';

  // Dopo 2 secondi, avvia la ricerca
  setTimeout(() => {
    // Geocodifica per ottenere latitudine e longitudine
    geocode(searchQuery, distance);
  }, 2000); // La ricerca inizia dopo 2 secondi
}

function geocode(city, distance) {
  fetch(`https://nominatim.openstreetmap.org/search?q=${city}&format=json&addressdetails=1`)
    .then(response => response.json())
    .then(data => {
      if (data && data.length > 0) {
        const lat = data[0].lat;
        const lon = data[0].lon;
        console.log(`Coordinate di ${city}: Lat: ${lat}, Lon: ${lon}`);
        // Dopo aver ottenuto le coordinate, filtra le palestre
        filterPalestre(lat, lon, distance);
      } else {
        console.log('Città non trovata!');
        alert('Città non trovata!');
      }
    })
    .catch(error => console.error('Errore nella geocodifica:', error));
}

function filterPalestre(cityLat, cityLon, distanceLimit) {
  // Aggiungi qui le palestre con le loro coordinate (lat, lon)
  const palestre = [
    { nome: 'Palestra di Mestre, pallavolo e altre attività', lat: 45.4758, lon: 12.2289 },
    { nome: 'Palestra di Dueville. Vieni a scoprire i nostri fantastici corsi', lat: 45.6347, lon: 11.5557 },
    { nome: 'Palestra C', lat: 45.4900, lon: 12.3200 }
  ];

  // Filtra le palestre entro il raggio specificato
  const results = palestre.filter(palestra => {
    const dist = calculateDistance(cityLat, cityLon, palestra.lat, palestra.lon);
    return dist <= distanceLimit;
  });

  displayResults(results);
}

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Raggio della Terra in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distanza in km
  return distance;
}

function displayResults(results) {
  const resultsContainer = document.getElementById('results-container');
  resultsContainer.innerHTML = ''; // Pulisce i risultati precedenti

  // Nasconde la barra di caricamento
  const loadingBarContainer = document.getElementById('loading-bar-container');
  loadingBarContainer.style.display = 'none'; // Nasconde la barra

  if (results.length === 0) {
    resultsContainer.innerHTML = `<p class="no-results">Al momento non ci sono risultati in questa zona</p>`;
  } else {
    results.forEach(palestra => {
      const resultItem = document.createElement('div');
      resultItem.classList.add('result-item');
      resultItem.innerHTML = `<b>${palestra.nome}</b>`;
      resultsContainer.appendChild(resultItem);
    });
  }
}
