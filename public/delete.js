
function compareDataSets(dataArray) {
  console.log(
    'Starting dataset comparison with dataArray length:',
    dataArray.length
  )

  const fullWidth = dataArray.length * 100
  const parentDivWidth = document.getElementById('graph').clientWidth
  const enableScrolling = fullWidth > parentDivWidth
  const width = enableScrolling ? fullWidth : parentDivWidth

  document.getElementById('graphDiv').style.overflowX = enableScrolling
    ? 'auto'
    : 'hidden'

  const margin = { top: 40, right: 30, bottom: 200, left: 60 },
    height = 500 - margin.top - margin.bottom

  document.getElementById(
    'graphTitle'
  ).innerText = `Comparison of ${dataArray.length} LSOAs`

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
    .range([0, fullWidth])
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

  console.log('Axes prepared, starting batch processing...')
  loadDataInBatches(0, 20) // Start with the first 20 items

  function loadDataInBatches(startIndex, batchSize) {
    const endIndex = Math.min(startIndex + batchSize, dataArray.length)
    console.log(`Processing batch from index ${startIndex} to ${endIndex - 1}`)

    dataArray.slice(startIndex, endIndex).forEach((data, index) => {
      const localIndex = startIndex + index // Calculate the actual index in the overall array
      const formattedData = formatGraphData(data)
      console.log(`Formatted data for index ${localIndex}:`, formattedData)

      let yStack = 0
      formattedData.forEach((level) => {
        const yPos = y(1) - yStack - y(level.value) // Adjust y position based on stacked height
        const barHeight = y(level.value)

        svg
          .append('rect')
          .attr(
            'x',
            x(
              `Bar ${localIndex + 1}: ${data.LSOAinfo.LSOA_name} (${
                data.LSOAinfo.LSOA_code
              }) - Decile ${data.LSOAinfo.IMD_Decile}`
            )
          )
          .attr('y', yPos)
          .attr('width', x.bandwidth())
          .attr('height', barHeight)
          .attr('fill', level.color)

        yStack += level.value // Increase stack height by the value of the current level
      })
    })

    if (endIndex < dataArray.length) {
      setTimeout(() => loadDataInBatches(endIndex, batchSize), 100) // Delay to visually see batch processing
    } else {
      console.log('All data processed.')
    }
  }
}



function formatGraphData(data) {
  // Return formatted data as percentage values instead of decimals
  if (!data || !data.percentages) {
    console.error('Invalid or incomplete data:', data)
    return [] // Return an empty array to prevent errors
  }

  return [
    {
      name: 'No Qualifications',
      value: (data.percentages.no_qualifications || 0) * 100,
      color: '#00FFFF', // Baby blue
    },
    {
      name: 'Level 1 Entry',
      value: (data.percentages.level_1_entry_qualifications || 0) * 100,
      color: ' #C70039', // Red
    },
    {
      name: 'Level 2',
      value: (data.percentages.level_2_qualifications || 0) * 100,
      color: ' #DAF7A6', // Green
    },
    {
      name: 'Apprenticeship',
      value: (data.percentages.apprenticeship || 0) * 100,
      color: ' #FFC300', // Yellow
    },
    {
      name: 'Level 3',
      value: (data.percentages.level_3_qualifications || 0) * 100,
      color: '#0818A8', // Dark blue
    },
    {
      name: 'Level 4 and Above',
      value: (data.percentages.level_4_above_qualifications || 0) * 100,
      color: '#CCCCFF', // Light purple
    },
    {
      name: 'Other Qualifications',
      value: (data.percentages.other_qualifications || 0) * 100,
      color: '#CCCCFF', // Turquoise
    },
  ]
}

function compareDataSets(dataArray) {
  console.log(
    'Starting dataset comparison with dataArray length:',
    dataArray.length
  )

  const fullWidth = dataArray.length * 100
  const parentDivWidth = document.getElementById('graph').clientWidth
  const enableScrolling = fullWidth > parentDivWidth
  const width = enableScrolling ? fullWidth : parentDivWidth

  document.getElementById('graphDiv').style.overflowX = enableScrolling
    ? 'auto'
    : 'hidden'

  const margin = { top: 40, right: 30, bottom: 200, left: 60 },
    height = 500 - margin.top - margin.bottom

  document.getElementById(
    'graphTitle'
  ).innerText = `Comparison of ${dataArray.length} LSOAs`

  // Ensure all previous SVGs are removed
  d3.select('#graph').selectAll('svg').remove()

  const svg = d3
    .select('#graph')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`)

  const x = d3
    .scaleBand()
    .range([0, fullWidth])
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

  const y = d3.scaleLinear().domain([0, 100]).range([height, 0]) // Adjust domain for percentage
  svg.append('g').call(d3.axisLeft(y).tickFormat((d) => `${d}%`)) // Format y-axis as percentages

  console.log('Axes prepared, starting batch processing...')
  loadDataInBatches(0, 20) // Start with the first 20 items

  function loadDataInBatches(startIndex, batchSize) {
    const endIndex = Math.min(startIndex + batchSize, dataArray.length)
    console.log(`Processing batch from index ${startIndex} to ${endIndex - 1}`)

    dataArray.slice(startIndex, endIndex).forEach((data, index) => {
      const localIndex = startIndex + index
      const formattedData = formatGraphData(data)
      console.log(`Formatted data for index ${localIndex}:`, formattedData)

      let yStack = 0
      formattedData.forEach((level) => {
        const yPos = y(yStack) // Set initial y position to the current stack height
        const barHeight = y(level.value) - y(0) // Calculate bar height relative to 0

        svg
          .append('rect')
          .attr(
            'x',
            x(
              `Bar ${localIndex + 1}: ${data.LSOAinfo.LSOA_name} (${
                data.LSOAinfo.LSOA_code
              }) - Decile ${data.LSOAinfo.IMD_Decile}`
            )
          )
          .attr('y', yPos)
          .attr('width', x.bandwidth())
          .attr('height', barHeight)
          .attr('fill', level.color)

        yStack += level.value // Increase stack height by the value of the current level
      })
    })

    if (endIndex < dataArray.length) {
      setTimeout(() => loadDataInBatches(endIndex, batchSize), 100) // Delay to visually see batch processing
    } else {
      console.log('All data processed.')
    }
  }
}
