import { GraphingFunctionality } from './graphingFunctionality.js'

// ComparisonGraph.js
export class ComparisonGraph {
  constructor(graphingFunctionality) {
    this.graphingFunc = new GraphingFunctionality()
  }

  async compareWithMeanValues(currentDecile, currentData) {
    if (!currentDecile || !currentData) {
      console.error('No current decile or data available for comparison.')
      return
    }

    try {
      const response = await fetch('/manipulate-average-decile-education', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ decile_number: currentDecile }),
      })

      if (!response.ok) {
        throw new Error('Failed to fetch mean decile data')
      }

      const meanData = await response.json()

      if (meanData) {
        const formattedOgData =
          this.graphingFunc.formatComparisonGraphData(currentData)
        const formattedComparisonData =
          this.graphingFunc.formatComparisonGraphData(meanData)
        this.graphingFunc.graphComparedData(
          formattedOgData,
          formattedComparisonData
        )
      } else {
        console.error('No mean data received for comparison.')
      }
    } catch (error) {
      console.error('Error fetching mean decile data:', error)
    }
  }
}
