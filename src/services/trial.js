import { EducationService } from './educationService.js'

async function fetchLSOAData() {
  console.log('Fetching LSOA data...')
  try {
    const educationService = new EducationService()
    const fetchedData = await educationService.fetchGeoCodeData('E01000001')
    console.log('All data: ' + JSON.stringify(fetchedData))
  } catch (error) {
    console.error('Error:', error)
  }
}

async function fetchAreaData() {
  console.log('Fetching area data...')
  try {
    const educationService = new EducationService()
    const fetchedData = await educationService.fetchAreaData('London')
    console.log('All data: ' + JSON.stringify(fetchedData))
  } catch (error) {
    console.error('Error:', error)
  }
}

async function fetchDecileData() {
  console.log('Fetching decile data...')
  try {
    const educationService = new EducationService()
    const fetchedData = await educationService.fetchDecileData('5')
    console.log('All data: ' + JSON.stringify(fetchedData))
  } catch (error) {
    console.error('Error:', error)
  }
}

// await fetchLSOAData()
// await fetchDecileData()
await fetchAreaData()