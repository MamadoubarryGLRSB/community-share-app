// Initialize the map
const map = L.map('map', {
  zoomControl: true,
  dragging: true, // Assurer que le glissement est activé
  scrollWheelZoom: true
}).setView([46.227638, 2.213749], 5); // France center

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Variables to store current marker position
let currentMarker = null;
let currentLat = null;
let currentLng = null;

// Reference to form fields
const placeLat = document.getElementById('place-lat');
const placeLng = document.getElementById('place-lng');
const alertLat = document.getElementById('alert-lat');
const alertLng = document.getElementById('alert-lng');
const coordDisplay = document.getElementById('coordinates');

// Format date function
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR');
}

// Créer des icônes personnalisées pour les marqueurs
function createCustomIcon(category) {
  let color;
  switch (category) {
    case 'restaurant':
      color = '#e67e22';
      break;
    case 'bar':
      color = '#9b59b6';
      break;
    case 'magasin':
      color = '#2ecc71';
      break;
    case 'service':
      color = '#1abc9c';
      break;
    default:
      color = '#3498db';
  }

  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="background-color: ${color}; width: 100%; height: 100%; border-radius: 50%; border: 2px solid white;"></div>`,
    iconSize: [25, 25],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12]
  });
}

// Load existing places
fetch('/api/places')
  .then((res) => res.json())
  .then((data) => {
    data.forEach((place) => {
      const lat = place.location ? place.location.coordinates[1] : place.lat;
      const lng = place.location ? place.location.coordinates[0] : place.lng;

      const icon = createCustomIcon(place.category);

      const marker = L.marker([lat, lng], { icon: icon }).addTo(map).bindPopup(`
          <div class="popup-content">
            <h3>${place.name}</h3>
            <p>${place.description}</p>
            <p><strong>Adresse:</strong> ${place.address}</p>
            <button class="delete-btn" onclick="deletePlace('${place._id}')">Supprimer</button>
          </div>
        `);
    });
  })
  .catch((err) => console.error('Erreur chargement places:', err));

// Load existing alerts
fetch('/api/alerts')
  .then((res) => res.json())
  .then((data) => {
    data.forEach((alert) => {
      const lat = alert.location ? alert.location.coordinates[1] : alert.lat;
      const lng = alert.location ? alert.location.coordinates[0] : alert.lng;

      let alertColor;
      switch (alert.type) {
        case 'danger':
          alertColor = '#e74c3c';
          break;
        case 'travaux':
          alertColor = '#f39c12';
          break;
        default:
          alertColor = '#3498db';
      }

      const circle = L.circle([lat, lng], {
        radius: 50000,
        color: alertColor,
        fillColor: alertColor,
        fillOpacity: 0.3
      }).addTo(map).bindPopup(`
          <div class="popup-content">
            <h3>${alert.title}</h3>
            <p>${alert.description}</p>
            <p><small>Expire le ${formatDate(alert.expiresAt)}</small></p>
            <button class="delete-btn" onclick="deleteAlert('${alert._id}')">Supprimer</button>
          </div>
        `);
    });
  })
  .catch((err) => console.error('Erreur chargement alertes:', err));

// Delete a place
function deletePlace(id) {
  if (confirm('Êtes-vous sûr de vouloir supprimer ce lieu ?')) {
    fetch(`/api/places/${id}`, { method: 'DELETE' })
      .then((res) => {
        if (!res.ok) throw new Error('Erreur lors de la suppression');
        alert('Lieu supprimé avec succès');
        location.reload();
      })
      .catch((err) => alert('Erreur : ' + err));
  }
}

// Delete an alert
function deleteAlert(id) {
  if (confirm('Êtes-vous sûr de vouloir supprimer cette alerte ?')) {
    fetch(`/api/alerts/${id}`, { method: 'DELETE' })
      .then((res) => {
        if (!res.ok) throw new Error('Erreur lors de la suppression');
        alert('Alerte supprimée avec succès');
        location.reload();
      })
      .catch((err) => alert('Erreur : ' + err));
  }
}

// Déclarer handleMapClick globalement pour pouvoir l'ajouter et le supprimer
function handleMapClick(e) {
  // Get coordinates
  currentLat = e.latlng.lat;
  currentLng = e.latlng.lng;

  // Update form fields
  placeLat.value = currentLat;
  placeLng.value = currentLng;
  alertLat.value = currentLat;
  alertLng.value = currentLng;

  // Update coordinates display
  coordDisplay.innerHTML = `
    <i class="fas fa-location-arrow"></i> Position sélectionnée : 
    Latitude ${currentLat.toFixed(6)}, Longitude ${currentLng.toFixed(6)}
  `;

  // Remove existing temp marker if any
  if (currentMarker) {
    map.removeLayer(currentMarker);
  }

  // Add new temp marker
  currentMarker = L.marker([currentLat, currentLng], {
    draggable: true // Rendre le marqueur déplaçable
  }).addTo(map);

  currentMarker.on('dragend', function (e) {
    const position = e.target.getLatLng();
    currentLat = position.lat;
    currentLng = position.lng;

    // Update form fields
    placeLat.value = currentLat;
    placeLng.value = currentLng;
    alertLat.value = currentLat;
    alertLng.value = currentLng;

    // Update coordinates display
    coordDisplay.innerHTML = `
      <i class="fas fa-location-arrow"></i> Position sélectionnée : 
      Latitude ${currentLat.toFixed(6)}, Longitude ${currentLng.toFixed(6)}
    `;
  });

  currentMarker.bindPopup('Position sélectionnée').openPopup();
}

// Handle map clicks
map.on('click', handleMapClick);

// Form submission with fetch API - Places
document.getElementById('placeForm').addEventListener('submit', function (e) {
  e.preventDefault();

  if (!placeLat.value || !placeLng.value) {
    alert("Veuillez d'abord sélectionner une position sur la carte");
    return;
  }

  const name = this.querySelector('[name="name"]').value;
  const description = this.querySelector('[name="description"]').value;
  const address = this.querySelector('[name="address"]').value;
  const lat = parseFloat(placeLat.value);
  const lng = parseFloat(placeLng.value);
  const category = this.querySelector('[name="category"]').value;

  if (!category) {
    alert('Veuillez sélectionner une catégorie');
    return;
  }

  const data = {
    name,
    description,
    address,
    location: {
      type: 'Point',
      coordinates: [lng, lat] // GeoJSON format: [longitude, latitude]
    },
    category
  };

  fetch('/api/places', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Erreur réseau');
      }
      return response.json();
    })
    .then((data) => {
      alert('Lieu ajouté avec succès!');
      location.reload();
    })
    .catch((error) => {
      console.error('Erreur:', error);
      alert("Erreur lors de l'ajout du lieu");
    });
});

// Form submission with fetch API - Alerts
document.getElementById('alertForm').addEventListener('submit', function (e) {
  e.preventDefault();

  if (!alertLat.value || !alertLng.value) {
    alert("Veuillez d'abord sélectionner une position sur la carte");
    return;
  }

  const title = this.querySelector('[name="title"]').value;
  const description = this.querySelector('[name="description"]').value;
  const lat = parseFloat(alertLat.value);
  const lng = parseFloat(alertLng.value);
  const type = this.querySelector('[name="type"]').value;

  if (!type) {
    alert("Veuillez sélectionner un type d'alerte");
    return;
  }

  const duration = parseInt(this.querySelector('[name="duration"]').value);

  // Calcule la date d'expiration
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + duration);

  const data = {
    title,
    description,
    location: {
      type: 'Point',
      coordinates: [lng, lat] // GeoJSON format: [longitude, latitude]
    },
    type,
    expiresAt
  };

  fetch('/api/alerts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Erreur réseau');
      }
      return response.json();
    })
    .then((data) => {
      alert('Alerte signalée avec succès! Elle expirera le ' + formatDate(data.expiresAt));
      location.reload();
    })
    .catch((error) => {
      console.error('Erreur:', error);
      alert("Erreur lors du signalement de l'alerte");
    });
});

// Améliorer l'expérience sur mobile
if (window.innerWidth < 768) {
  map.setZoom(4);
}

// Assurez-vous que le drag fonctionne correctement
map.dragging.enable();
