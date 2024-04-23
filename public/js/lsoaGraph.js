import { GraphingFunctionality } from './graphingFunctionality.js'

/**
 * This class contains the front-end manipulations for the graphs representing education levels for individual LSOAs.
 *
 * @export
 * @class LsoaGraph
 */
export class LsoaGraph {
  constructor() {
    this.graphingFunc = new GraphingFunctionality()
    this.currentDecile = null
    this.currentData = null // Store current data for comparison
    this.setupEventListeners() // Sets up event listeners when created
  }

  setupEventListeners() {
    const submitButton = document.getElementById('submitGeoCodeButton')
    const compareButton = document.getElementById('compareDecileButton') // Get the compare button

    submitButton.addEventListener('click', () => {
      const geoCode = document.getElementById('geoCodeInput').value
      this.manipulateGeoCodeData(geoCode)
    })

    compareButton.addEventListener('click', () => {
      this.compareWithMeanValues()
    })
  }

  manipulateGeoCodeData(geoCode) {
    console.log('You have attempted to trigger: manipulateGeoCodeData')
    const errorDiv = document.getElementById('geoCodeError') // Get the error message div

    if (!geoCode.trim()) {
      errorDiv.innerText = 'Please enter a valid code' // Update the error message
      return // Exit the function if the code is invalid
    } else {
      errorDiv.innerText = '' // Clear any previous error messages
    }

    fetch('/manipulate-geo-code-data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ geoCode }), // Ensuring we are sending the geoCode as a JSON object.
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch data') // Throw an error if response is not okay
        }
        return response.json()
      })
      .then((data) => {
        if (data && data.LSOAinfo && data.percentages) {
          this.currentDecile = data.LSOAinfo.IMD_Decile // Store the current decile when data is fetched
          this.currentData = data // Store the entire data for use in comparison
          this.graphingFunc.updateGraph(this.graphingFunc.formatGraphData(data))
        } else {
          // No valid data received, update the error message accordingly
          errorDiv.innerText =
            'Please enter a valid LSOA code or use the provided list.'
        }
      })
      .catch((error) => {
        console.error('Error:', error)
        errorDiv.innerText =
          'Please enter a valid LSOA code or use the provided list.'
      })
  }

  compareWithMeanValues() {
    if (!this.currentDecile || !this.currentData) {
      console.error('No current decile or data available for comparison.')
      return
    }

    fetch('/manipulate-average-decile-education', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ decile_number: this.currentDecile }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch mean decile data')
        }
        return response.json()
      })
      .then((meanData) => {
        if (meanData) {
          const formattedOgData = this.graphingFunc.formatComparisonGraphData(
            this.currentData
          )
          const formattedComparisonData =
            this.graphingFunc.formatComparisonGraphData(meanData)
          this.graphingFunc.graphComparedData(
            formattedOgData,
            formattedComparisonData
          )
        } else {
          console.error('No mean data received for comparison.')
        }
      })
      .catch((error) => {
        console.error('Error fetching mean decile data:', error)
      })
  }
}
