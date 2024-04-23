import { GraphingFunctionality } from './graphingFunctionality.js'
/**
 * This class contains the front end manipulations for the graphs representing education levels for individual LSOAs.
 *
 * @export
 * @class lsoaGraph
 */
export class LsoaGraph {
  constructor() {
    this.graphingFunc = new GraphingFunctionality()
    this.setupEventListeners() // Does it automatically when created
  }

  setupEventListeners() {
    const submitButton = document.getElementById('submitGeoCodeButton')
    submitButton.addEventListener('click', () => {
      const geoCode = document.getElementById('geoCodeInput').value
      this.manipulateGeoCodeData(geoCode)
    })
  }

  /** POSTs the geo code to the server to retrieve the education data for the LSOA.
   *
   * @memberof lsoaGraph
   */
  manipulateGeoCodeData(geoCode) {
    console.log('You have attempted to trigger: manipulateGeoCodeData')
    const errorDiv = document.getElementById('geoCodeError') // Get the error message div

    if (!geoCode.trim()) {
      errorDiv.innerText = 'Please enter a valid code' // Update the error message
      return // Exit the function if the code is invalid
    } else {
      errorDiv.innerText = '' // Clear any previous error messages
    }

    console.log('For geo code: ' + geoCode)

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
        if (data && data.percentages) {
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
}
