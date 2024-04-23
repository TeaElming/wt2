import { GraphingFunctionality } from './graphingFunctionality.js'

export class LsoaGraph {
  constructor() {
    this.graphingFunc = new GraphingFunctionality();
    this.currentDecile = null;
    this.currentData = null;
    this.setupEventListeners();
    this.initializeVisibility(); // Set initial visibility state
  }

  setupEventListeners() {
    const submitButton = document.getElementById('submitGeoCodeButton');
    const compareButton = document.getElementById('compareDecileButton');

    submitButton.addEventListener('click', () => {
      const geoCode = document.getElementById('geoCodeInput').value;
      this.manipulateGeoCodeData(geoCode);
    });

    compareButton.addEventListener('click', () => {
      this.compareWithMeanValues();
    });
  }

  initializeVisibility() {
    // Ensure the controls are hidden by default on page load
    document.addEventListener('DOMContentLoaded', () => {
      document.getElementById('graph-controls').classList.add('hidden');
    });
  }

  manipulateGeoCodeData(geoCode) {
    console.log('You have attempted to trigger: manipulateGeoCodeData');
    const errorDiv = document.getElementById('geoCodeError');

    if (!geoCode.trim()) {
      errorDiv.innerText = 'Please enter a valid code';
      return;
    } else {
      errorDiv.innerText = '';
    }

    fetch('/manipulate-geo-code-data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ geoCode }),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      return response.json();
    })
    .then(data => {
      if (data && data.LSOAinfo && data.percentages) {
        this.currentDecile = data.LSOAinfo.IMD_Decile;
        this.currentData = data;
        this.graphingFunc.updateGraph(this.graphingFunc.formatGraphData(data));
        this.toggleControlsVisibility(true); // Show controls
      } else {
        errorDiv.innerText = 'Please enter a valid LSOA code or use the provided list.';
        this.toggleControlsVisibility(false); // Hide controls if data is invalid
      }
    })
    .catch(error => {
      console.error('Error:', error);
      errorDiv.innerText = 'Please enter a valid LSOA code or use the provided list.';
      this.toggleControlsVisibility(false);
    });
  }

  compareWithMeanValues() {
    if (!this.currentDecile || !this.currentData) {
      console.error('No current decile or data available for comparison.');
      return;
    }

    fetch('/manipulate-average-decile-education', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ decile_number: this.currentDecile }),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch mean decile data');
      }
      return response.json();
    })
    .then(meanData => {
      if (meanData) {
        const formattedOgData = this.graphingFunc.formatComparisonGraphData(this.currentData);
        const formattedComparisonData = this.graphingFunc.formatComparisonGraphData(meanData);
        this.graphingFunc.graphComparedData(formattedOgData, formattedComparisonData);
      } else {
        console.error('No mean data received for comparison.');
      }
    })
    .catch(error => {
      console.error('Error fetching mean decile data:', error);
    });
  }

  toggleControlsVisibility(visible) {
    const controlsDiv = document.getElementById('graph-controls');
    if (visible) {
      controlsDiv.classList.remove('hidden');
    } else {
      controlsDiv.classList.add('hidden');
    }
  }
}
