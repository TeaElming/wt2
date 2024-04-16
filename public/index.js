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
      if (data && data.percentages) {
        // Validate data structure
        updateGraph(formatGraphData(data))
      }
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
      if (data && data.length > 0) {
        // Check if data array is not empty
        updateGraph(formatGraphData(data[0])) // Format and validate data
      }
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
      if (data && data.length > 0) {
        // Check if data array is not empty
        updateGraph(formatGraphData(data[0])) // Format and validate data
      }
    })
    .catch((error) => {
      console.error('Error:', error)
      document.getElementById('decileResult').innerText =
        'Error: ' + error.toString()
    })
}

function formatGraphData(data) {
  return {
    LSOAinfo: data.LSOAinfo,
    no_qualifications: data.percentages.no_qualifications,
    level_1_entry_qualifications: data.percentages.level_1_entry_qualifications,
    level_2_qualifications: data.percentages.level_2_qualifications,
    apprenticeship: data.percentages.apprenticeship,
    level_3_qualifications: data.percentages.level_3_qualifications,
    level_4_above_qualifications: data.percentages.level_4_above_qualifications,
    other_qualifications: data.percentages.other_qualifications,
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

  const margin = { top: 40, right: 30, bottom: 70, left: 60 },
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
