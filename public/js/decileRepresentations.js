import { GraphingFunctionality } from './graphingFunctionality.js'

export class DecileRepresentations {
  constructor() {
    this.graphingFunc = new GraphingFunctionality()
    this.setupEventListeners()
    this.hideControls()
  }

  setupEventListeners() {
    console.log('Setting up event listeners for decileRepresentations')
    const slider = document.getElementById('decileSlider')
    const output = document.getElementById('decileValue')
    slider.oninput = function () {
      output.value = this.value // Update the output value display
    }
    slider.addEventListener('change', () =>
      this.manipulateDecileData(slider.value)
    ) // Change triggers on mouse release
  }

  manipulateDecileData(decile_number) {
    console.log(
      'You have attempted to trigger: manipulateDecileData for Decile Number:',
      decile_number
    )
    this.hideControls()
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
          const enhancedData = {
            ...data, // Spread existing data to maintain other properties
            LSOAinfo: {
              LSOA_name: `Mean data for: `, // Custom LSOA_name
              LSOA_code: ' ', // Maintain original LSOA_code if exists
              IMD_Decile: decile_number, // Use input decile_number as IMD_Decile
            },
          }
          document.getElementById('graph').innerHTML = ''
          this.graphingFunc.updateGraph(
            this.graphingFunc.formatGraphData(enhancedData)
          ) // Pass the enhanced data to the graphing functionality
        }
      })
      .catch((error) => {
        console.error('Error:', error)
        document.getElementById('decileResult').innerText =
          'Error: ' + error.toString()
      })
  }

  hideControls() {
    const controlsDiv = document.getElementById('graph-controls')
    controlsDiv.classList.add('hidden') // Hide the controls initially
  }
}
