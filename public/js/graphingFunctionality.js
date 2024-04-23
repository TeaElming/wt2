export class GraphingFunctionality {
  /**
   * Formats the retrieved data in a structured manner that can be read by various functions and allows for easier overview of how the response is structured.
   *
   * @param {Object} data - The data retrieved from the server.
   * @return {Object} - The formatted data.
   * @memberof GraphingFunctionality
   */
  formatGraphData(data) {
    // Provide default values if certain properties are missing
    const LSOAinfo = {
      LSOA_name: data.LSOAinfo?.LSOA_name || '',
      LSOA_code: data.LSOAinfo?.LSOA_code || '',
      IMD_Decile: data.LSOAinfo?.IMD_Decile || '',
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

  formatComparisonGraphData(data) {
    // Provide default values if certain properties are missing
    const LSOAinfo = {
      LSOA_name: data.LSOAinfo?.LSOA_name || '',
      LSOA_code: data.LSOAinfo?.LSOA_code || '',
      IMD_Decile: data.LSOAinfo?.IMD_Decile || '',
    };

    return {
      LSOAinfo: LSOAinfo,
      percentages: [
        { name: 'No Qualifications', value: parseFloat(data.percentages?.no_qualifications) || 0 },
        { name: 'Level 1 Entry', value: parseFloat(data.percentages?.level_1_entry_qualifications) || 0 },
        { name: 'Level 2', value: parseFloat(data.percentages?.level_2_qualifications) || 0 },
        { name: 'Apprenticeship', value: parseFloat(data.percentages?.apprenticeship) || 0 },
        { name: 'Level 3', value: parseFloat(data.percentages?.level_3_qualifications) || 0 },
        { name: 'Level 4 and Above', value: parseFloat(data.percentages?.level_4_above_qualifications) || 0 },
        { name: 'Other Qualifications', value: parseFloat(data.percentages?.other_qualifications) || 0 },
    ]
    };
  }

  /**
   * Contains the layout for the graph used to display the data.
   *
   * @param {Object} data - The data, can be passed as the formatted data.
   * @memberof GraphingFunctionality
   */
  updateGraph(data) {
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

    const margin = { top: 40, right: 30, bottom: 150, left: 60 }
    const width =
      document.getElementById('graphDiv').offsetWidth -
      margin.left -
      margin.right // Dynamically get parent div width
    const height = 500 - margin.top - margin.bottom

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

    const y = d3.scaleLinear().domain([0, 1]).range([height, 0])
    svg.append('g').call(d3.axisLeft(y).tickFormat(d3.format('.0%')))

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

    // Adding text labels above bars
    svg
      .selectAll('.text')
      .data(educationLevels)
      .enter()
      .append('text')
      .attr('class', 'label')
      .attr('x', (d) => x(d.name) + x.bandwidth() / 2) // Center text within bars
      .attr('y', (d) => y(d.value) - 5) // Position above the bar
      .attr('text-anchor', 'middle')
      .text((d) => d3.format('.0%')(d.value)) // Format the value as percentage without decimals
      .attr('fill', 'black') // Choose the color for the text
  }

  /**
   * Graphs the comparison between original and comparison data sets side by side for each category.
   * @param {Object} ogData - The original data formatted by formatGraphData.
   * @param {Object} comparisonData - The comparison data formatted by formatGraphData.
   */
  graphComparedData(ogData, comparisonData) {

    console.log(JSON.stringify(ogData, null, 2));


    const graphTitle = `${ogData.LSOAinfo.LSOA_name} (${ogData.LSOAinfo.LSOA_code}), Decile: ${ogData.LSOAinfo.IMD_Decile}`
    document.getElementById('graphTitle').innerText = graphTitle

    const margin = { top: 40, right: 30, bottom: 150, left: 60 }
    const width =
      document.getElementById('graphDiv').offsetWidth -
      margin.left -
      margin.right
    const height = 500 - margin.top - margin.bottom

    d3.select('#graph svg').remove()

    const svg = d3
      .select('#graph')
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`)

    const x0 = d3
      .scaleBand()
      .rangeRound([0, width])
      .paddingInner(0.1)
      .domain(ogData.percentages.map((d) => d.name))

    const x1 = d3
      .scaleBand()
      .domain(['og', 'comparison'])
      .rangeRound([0, x0.bandwidth()])
      .padding(0.05)

    const y = d3.scaleLinear().domain([0, 1]).range([height, 0])

    svg
      .append('g')
      .attr('class', 'x axis')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x0))
      .selectAll('text')
      .attr('transform', 'translate(-10,0)rotate(-45)')
      .style('text-anchor', 'end')

    svg
      .append('g')
      .attr('class', 'y axis')
      .call(d3.axisLeft(y).tickFormat(d3.format('.0%')))

    ogData.percentages.forEach((d, i) => {
      const group = svg
        .append('g')
        .attr('transform', `translate(${x0(d.name)}, 0)`)

      // Original data bar (green)
      group
        .append('rect')
        .attr('x', x1('og'))
        .attr('width', x1.bandwidth())
        .attr('y', y(d.value))
        .attr('height', height - y(d.value))
        .attr('fill', '#69b3a2')

      // Comparison data bar (red)
      group
        .append('rect')
        .attr('x', x1('comparison'))
        .attr('width', x1.bandwidth())
        .attr('y', y(comparisonData.percentages[i].value))
        .attr('height', height - y(comparisonData.percentages[i].value))
        .attr('fill', '#d95f02')

      // Labels for bars
      group
        .append('text')
        .attr('x', x1('og') + x1.bandwidth() / 2)
        .attr('y', y(d.value) - 5)
        .attr('text-anchor', 'middle')
        .text(d3.format('.0%')(d.value))
        .attr('fill', 'black')

      group
        .append('text')
        .attr('x', x1('comparison') + x1.bandwidth() / 2)
        .attr('y', y(comparisonData.percentages[i].value) - 5)
        .attr('text-anchor', 'middle')
        .text(d3.format('.0%')(comparisonData.percentages[i].value))
        .attr('fill', 'black')
    })
  }
}
