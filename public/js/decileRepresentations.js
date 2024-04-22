import { GraphingFunctionality } from './graphingFunctionality.js'

export class DecileRepresentations {
  constructor() {
    this.graphingFunc = new GraphingFunctionality()
    this.setupEventListeners()
  }

  setupEventListeners() {
    console.log('Setting up event listeners for decileRepresentations')
    const submitButton = document.getElementById('decileSubmitButton')
    submitButton.addEventListener('click', () => this.manipulateDecileData())
  }

  manipulateDecileData() {
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
          this.graphingFunc.updateGraph(this.graphingFunc.formatGraphData(data))
        }
      })
      .catch((error) => {
        console.error('Error:', error)
        document.getElementById('decileResult').innerText =
          'Error: ' + error.toString()
      })
  }
}
