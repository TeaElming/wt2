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

  fetch('/manipulate-geo-code-data', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ geoCode: geocode }), // Correct variable name
  })
    .then((response) => response.json())
    .then((data) => {
      if (data && data.percentages) {
        // Validate data structure
        console.log('Making it into the response bit? ')
        updateGraph(formatGraphData(data))
      }
    })
    .catch((error) => {
      console.error('Error:', error)
      document.getElementById('geoCodeResult').innerText =
        'Error: ' + error.toString()
    })
}

document.addEventListener('click', function (event) {
  if (event.target.classList.contains('education-button')) {
    mapGeoCode(event)
  }
})

function formatGraphData(data) {
  // Provide default values if certain properties are missing
  const LSOAinfo = {
    LSOA_name: data.LSOAinfo?.LSOA_name || '',
    LSOA_code: data.LSOAinfo?.LSOA_code || '',
    IMD_Decile: data.LSOAinfo?.IMD_Decile || 'N/A', // Assuming IMD_Decile might also be optional
  }

  return {
    LSOAinfo: LSOAinfo,
    no_qualifications: data.percentages?.no_qualifications || 0,
    level_1_entry_qualifications:
      data.percentages?.level_1_entry_qualifications || 0,
    level_2_qualifications: data.percentages?.level_2_qualifications || 0,
    apprenticeship: data.percentages?.apprenticeship || 0,
    level_3_qualifications: data.percentages?.level_3_qualifications || 0,
    level_4_above_qualifications:
      data.percentages?.level_4_above_qualifications || 0,
    other_qualifications: data.percentages?.other_qualifications || 0,
  }
}

function updateGraph(data) {
  const graphTitle = `${data.LSOAinfo.LSOA_name} (${data.LSOAinfo.LSOA_code}), Decile: ${data.LSOAinfo.IMD_Decile}`
  const educationLevels = [
    { name: 'No Qualifications', value: parseFloat(data.no_qualifications) },
    {
      name: 'Level 1 Entry',
      value: parseFloat(data.level_1_entry_qualifications),
    },
    { name: 'Level 2', value: parseFloat(data.level_2_qualifications) },
    { name: 'Apprenticeship', value: parseFloat(data.apprenticeship) },
    { name: 'Level 3', value: parseFloat(data.level_3_qualifications) },
    {
      name: 'Level 4 and Above',
      value: parseFloat(data.level_4_above_qualifications),
    },
    {
      name: 'Other Qualifications',
      value: parseFloat(data.other_qualifications),
    },
  ]

  const margin = { top: 40, right: 30, bottom: 150, left: 60 },
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom

  document.getElementById('graphTitle').innerText = graphTitle
  d3.select('#graph svg').remove()

  const svg = d3
    .select('#graph')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`)

  const x = d3
    .scaleBand()
    .range([0, width])
    .domain(educationLevels.map((d) => d.name))
    .padding(0.1)
  svg
    .append('g')
    .attr('transform', `translate(0,${height})`)
    .call(d3.axisBottom(x))
    .selectAll('text')
    .attr('transform', 'translate(-10,0)rotate(-45)')
    .style('text-anchor', 'end')

  const y = d3
    .scaleLinear()
    .domain([0, 1]) // This sets the scale from 0 to 1
    .range([height, 0])
  svg.append('g').call(d3.axisLeft(y).tickFormat(d3.format('.0%'))) // Format as percentage without decimals

  svg
    .selectAll('mybar')
    .data(educationLevels)
    .enter()
    .append('rect')
    .attr('x', (d) => x(d.name))
    .attr('y', (d) => y(d.value))
    .attr('width', x.bandwidth())
    .attr('height', (d) => height - y(d.value))
    .attr('fill', '#69b3a2')

  // Adding text labels inside bars
  svg
    .selectAll('.text')
    .data(educationLevels)
    .enter()
    .append('text')
    .attr('class', 'label')
    .attr('x', (d) => x(d.name) + x.bandwidth() / 2) // Center text within bars
    .attr('y', (d) => y(d.value) + 20) // Adjust positioning to be inside the bar
    .attr('text-anchor', 'middle')
    .text((d) => d3.format('.0%')(d.value)) // Format the value as percentage without decimals
    .attr('fill', 'white') // Choose a text color that contrasts with the bar color
}
