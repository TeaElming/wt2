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
        //updateGraph(formatGraphData(data[0])) // Format and validate data
        //displayDataAsOneBar(formatGraphData(data[0]))
        compareDataSets(data)
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
      if (data && data.percentages) {
        // Validate data structure
        updateGraph(formatGraphData(data))
      }
    })
    .catch((error) => {
      console.error('Error:', error)
      document.getElementById('decileResult').innerText =
        'Error: ' + error.toString()
    })
}

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

function displayDataAsOneBar(data) {
  const graphTitle = `${data.LSOAinfo.LSOA_name} (${data.LSOAinfo.LSOA_code}), Decile: ${data.LSOAinfo.IMD_Decile}`
  const educationLevels = [
    {
      name: 'No Qualifications',
      value: parseFloat(data.no_qualifications),
      color: '#ffcccc',
    },
    {
      name: 'Level 1 Entry',
      value: parseFloat(data.level_1_entry_qualifications),
      color: '#ff9999',
    },
    {
      name: 'Level 2',
      value: parseFloat(data.level_2_qualifications),
      color: '#ff6666',
    },
    {
      name: 'Apprenticeship',
      value: parseFloat(data.apprenticeship),
      color: '#ff3333',
    },
    {
      name: 'Level 3',
      value: parseFloat(data.level_3_qualifications),
      color: '#ff0000',
    },
    {
      name: 'Level 4 and Above',
      value: parseFloat(data.level_4_above_qualifications),
      color: '#cc0000',
    },
    {
      name: 'Other Qualifications',
      value: parseFloat(data.other_qualifications),
      color: '#990000',
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

  let yStack = 0 // Initial value for y-axis stack

  const x = d3.scaleBand().range([0, width]).domain([graphTitle]).padding(0.1)
  svg
    .append('g')
    .attr('transform', `translate(0,${height})`)
    .call(d3.axisBottom(x))

  const y = d3.scaleLinear().domain([0, 1]).range([height, 0])
  svg.append('g').call(d3.axisLeft(y).tickFormat(d3.format('.0%')))

  svg
    .selectAll('myStackedBar')
    .data(educationLevels)
    .enter()
    .append('rect')
    .attr('x', x(graphTitle))
    .attr('y', (d) => {
      let yPos = y(yStack + d.value) // Calculate the top position
      yStack += d.value // Increase the stack
      return yPos
    })
    .attr('width', x.bandwidth())
    .attr('height', (d) => height - y(d.value))
    .attr('fill', (d) => d.color) // Use assigned color for each segment

  // Reset yStack for adding labels
  yStack = 0

  // Adding percentage labels inside bars
  //svg
  //.selectAll('.text')
  //.data(educationLevels)
  //.enter()
  //.append('text')
  //.attr('class', 'label')
  //.attr('x', x(graphTitle) + x.bandwidth() / 2)
  //.attr('y', (d) => {
  //let yPos = y(yStack + d.value / 2) // Position label in the middle of each segment
  //yStack += d.value // Increase the stack
  //return yPos
  //})
  //.attr('text-anchor', 'middle')
  //.text((d) => d3.format('.0%')(d.value))
  //.attr('fill', 'white') // White text for better readability
}

function compareDataSets(dataArray) {
  const maxBarsVisible = 10 // Maximum bars to display without scrolling
  const barWidth = 100 // Width for each bar, including padding

  // Calculate the full width based on the number of data points
  const fullWidth = dataArray.length * barWidth

  // Get the width of the parent div element
  const parentDivWidth = document.getElementById('graph').clientWidth

  // Determine whether to enable scrolling based on the number of bars
  const enableScrolling = fullWidth > parentDivWidth

  // Calculate the final width considering whether scrolling is needed
  const width = enableScrolling ? fullWidth : parentDivWidth

  const margin = { top: 40, right: 30, bottom: 200, left: 60 },
    height = 500 - margin.top - margin.bottom

  const graphTitle = `Comparison of ${dataArray.length} LSOAs`
  document.getElementById('graphTitle').innerText = graphTitle

  // Set the width of the parent div element to accommodate scrolling if needed
  document.getElementById('graphDiv').style.overflowX = enableScrolling
    ? 'auto'
    : 'hidden'

  // Clear the previous graph
  d3.select('#graph svg').remove()

  // Append the SVG element with dynamic width
  const svg = d3
    .select('#graph')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`)

  // Rest of the function remains unchanged...

  const x = d3
    .scaleBand()
    .range([0, fullWidth]) // Use full width for the scale range
    .domain(
      dataArray.map(
        (data, index) =>
          `Bar ${index + 1}: ${data.LSOAinfo.LSOA_name} (${
            data.LSOAinfo.LSOA_code
          }) - Decile ${data.LSOAinfo.IMD_Decile}`
      )
    )
    .padding(0.1)

  svg
    .append('g')
    .attr('transform', `translate(0,${height})`)
    .call(d3.axisBottom(x))
    .selectAll('text')
    .attr('transform', 'translate(-10,0)rotate(-45)')
    .style('text-anchor', 'end')

  const y = d3.scaleLinear().domain([0, 1]).range([height, 0])
  svg.append('g').call(d3.axisLeft(y).tickFormat(d3.format('.0%')))

  dataArray.forEach((data, index) => {
    let yStack = 0
    const formattedData = formatGraphData(data)

    // Create a group for each bar to avoid overlap
    const barGroup = svg.append('g').attr('class', `barGroup-${index}`)
    const educationLevels = [
      {
        name: 'No Qualifications',
        value: parseFloat(formattedData.no_qualifications),
        color: '#ffcccc',
      },
      {
        name: 'Level 1 Entry',
        value: parseFloat(formattedData.level_1_entry_qualifications),
        color: '#ff9999',
      },
      {
        name: 'Level 2',
        value: parseFloat(formattedData.level_2_qualifications),
        color: '#ff6666',
      },
      {
        name: 'Apprenticeship',
        value: parseFloat(formattedData.apprenticeship),
        color: '#ff3333',
      },
      {
        name: 'Level 3',
        value: parseFloat(formattedData.level_3_qualifications),
        color: '#ff0000',
      },
      {
        name: 'Level 4 and Above',
        value: parseFloat(formattedData.level_4_above_qualifications),
        color: '#cc0000',
      },
      {
        name: 'Other Qualifications',
        value: parseFloat(formattedData.other_qualifications),
        color: '#990000',
      },
    ]

    barGroup
      .selectAll(`rect.bar-${index}`)
      .data(educationLevels)
      .enter()
      .append('rect')
      .attr(
        'x',
        x(
          `Bar ${index + 1}: ${data.LSOAinfo.LSOA_name} (${
            data.LSOAinfo.LSOA_code
          }) - Decile ${data.LSOAinfo.IMD_Decile}`
        )
      )
      .attr('y', (d) => {
        const yPos = y(yStack + d.value)
        yStack += d.value
        return yPos
      })
      .attr('width', x.bandwidth())
      .attr('height', (d) => height - y(d.value))
      .attr('fill', (d) => d.color)
  })
}
