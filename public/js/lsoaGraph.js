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
    submitButton.addEventListener('submit', () => {
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
    if (!geoCode) {
      geoCode = document.getElementById('geoCodeInput').value
    }

    console.log('For geo code: ' + geoCode)

    fetch('/manipulate-geo-code-data', {
      // This is the route that the server is listening for
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ geoCode }), // Ensuring we are sending the geoCode as a JSON object.
    })
      .then((response) => response.json())
      .then((data) => {
        if (data && data.percentages) {
          // Validate data structure
          console.log('Making it into the response bit? ')
          this.graphingFunc.updateGraph(this.graphingFunc.formatGraphData(data))
        }
      })
      .catch((error) => {
        console.error('Error:', error)
        document.getElementById('geoCodeResult').innerText =
          'Error: ' + error.toString()
      })
  }
}
