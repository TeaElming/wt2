import { LsoaGraph } from './lsoaGraph.js'

const lsoaGraph = new LsoaGraph()
// Initialize the map
const map = L.map('map').setView([52.461279, -1.826189], 6) // Set to England and Wales

// Add a tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '© OpenStreetMap contributors',
}).addTo(map)

// Sample URL for your GeoJSON data (adjust according to your actual data source)
const geoJsonUrl =
  'https://services1.arcgis.com/ESMARspQHYMw9BZ9/arcgis/rest/services/Lower_layer_Super_Output_Areas_2021_EW_BGC_V3/FeatureServer/0/query?where=1%3D1&outFields=*&outSR=4326&f=geojson'

// Initialize the GeoJSON layer without adding it to the map yet
const geoJsonLayer = L.geoJSON(null, {
  onEachFeature: function (feature, layer) {
    // Create the popup content with a button to display education levels
    const popupContent = `<h4>LSOA Code: ${feature.properties.LSOA21CD}</h4>
    <button class="education-button" data-geocode="${feature.properties.LSOA21CD}">Display education levels</button>`

    // Bind the popup content to the layer
    layer.bindPopup(popupContent)
  },
})

// Function to update visibility of GeoJSON layer based on zoom level
function updateLayerVisibility() {
  const zoomLevel = map.getZoom()
  const zoomThreshold = 13 // Set the zoom level threshold

  if (zoomLevel >= zoomThreshold) {
    if (!map.hasLayer(geoJsonLayer)) {
      map.addLayer(geoJsonLayer)
    }
    document.getElementById('zoom-banner').style.display = 'none' // Hide banner
  } else {
    if (map.hasLayer(geoJsonLayer)) {
      map.removeLayer(geoJsonLayer)
    }
    document.getElementById('zoom-banner').style.display = 'block' // Show banner
  }
}

// Add this right after creating the map object to ensure it's positioned correctly
const zoomBanner = document.createElement('div')
zoomBanner.id = 'zoom-banner'
zoomBanner.textContent = 'Zoom in to view LSOAs'
document.getElementById('map').appendChild(zoomBanner) // Append it as a child of the map container

// Listen to zoom events to update layer visibility
map.on('zoomend', updateLayerVisibility)

// Load GeoJSON data
fetch(geoJsonUrl)
  .then((response) => response.json())
  .then((data) => {
    geoJsonLayer.addData(data)
    updateLayerVisibility() // Ensure correct visibility at start
  })
  .catch((error) => console.error('Error loading the GeoJSON data: ', error))

function mapGeoCode(event) {
  const geocode = event.target.getAttribute('data-geocode') // Correct way to access data attribute
  console.log(
    'You are displaying data from the mapScript w. geocode: ',
    geocode
  )

  lsoaGraph.manipulateGeoCodeData(geocode)
}

document.addEventListener('click', function (event) {
  if (event.target.classList.contains('education-button')) {
    mapGeoCode(event)
  }
})
