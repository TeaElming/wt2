function manipulateGeoCodeData() {
  console.log('You have attempted to trigger: manipulateGeoCodeData')
  const geoCode = document.getElementById('geoCodeInput').value
  fetch('/manipulate-geo-code-data', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ geoCode }),
  })
    .then((response) => response.json())
    .then((data) => {
      document.getElementById('geoCodeResult').innerText = JSON.stringify(
        data,
        null,
        2
      )
      updateGraph(data.percentages) // Assuming 'percentages' is an object with numeric values
    })
    .catch((error) => {
      console.error('Error:', error)
      document.getElementById('geoCodeResult').innerText =
        'Error: ' + error.toString()
    })
}

function manipulateAreaData() {
  console.log('You have attempted to trigger: manipulateAreaData')
  const partialAreaName = document.getElementById('areaInput').value
  fetch('/manipulate-area-data', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ partialAreaName }),
  })
    .then((response) => response.json())
    .then((data) => {
      document.getElementById('areaResult').innerText = JSON.stringify(
        data,
        null,
        2
      )
    })
    .catch((error) => {
      console.error('Error:', error)
      document.getElementById('areaResult').innerText =
        'Error: ' + error.toString()
    })
}

function manipulateDecileData() {
  console.log('You have attempted to trigger: manipulateDecileData')
  const decile_number = document.getElementById('decileInput').value
  fetch('/manipulate-average-decile-education', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ decile_number }),
  })
    .then((response) => response.json())
    .then((data) => {
      document.getElementById('decileResult').innerText = JSON.stringify(
        data,
        null,
        2
      )
    })
    .catch((error) => {
      console.error('Error:', error)
      document.getElementById('decileResult').innerText =
        'Error: ' + error.toString()
    })
}

function updateGraph(data) {
  // Extracting the parts needed for the title and graph data
  const graphTitle = `${data.geography} (${data.geography_code}), Date: ${data.date}, Decile: ${data.IMD_Decile}`
  const educationLevels = [
    { name: 'No Qualifications', value: data.no_qualifications },
    { name: 'Level 1 Entry', value: data.level_1_entry_qualifications },
    { name: 'Level 2', value: data.level_2_qualifications },
    { name: 'Apprenticeship', value: data.apprenticeship },
    { name: 'Level 3', value: data.level_3_qualifications },
    { name: 'Level 4 and Above', value: data.level_4_above_qualifications },
    { name: 'Other Qualifications', value: data.other_qualifications },
  ]

  // Set the dimensions and margins of the graph
  const margin = { top: 40, right: 30, bottom: 70, left: 60 },
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom

  // Set the title
  document.getElementById('graphTitle').innerText = graphTitle

  // Remove any previous SVG
  d3.select('#graph').selectAll('svg').remove()

  // Append the SVG object to the div
  const svg = d3
    .select('#graph')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

  // X axis
  const x = d3
    .scaleBand()
    .range([0, width])
    .domain(educationLevels.map((d) => d.name))
    .padding(0.1)
  svg
    .append('g')
    .attr('transform', 'translate(0,' + height + ')')
    .call(d3.axisBottom(x))
    .selectAll('text')
    .attr('transform', 'translate(-10,0)rotate(-45)')
    .style('text-anchor', 'end')

  // Add Y axis
  const y = d3
    .scaleLinear()
    .domain([0, d3.max(educationLevels, (d) => d.value)])
    .range([height, 0])
  svg.append('g').call(d3.axisLeft(y))

  // Bars
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
}
