import { EducationService } from './educationService.js'
import { DataManipulationService } from './manipulationService.js'

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

async function testGeoCodeManipulation() {
  console.log('Testing geoCode manipulation...')
  try {
    const manipulationService = new DataManipulationService()
    const manipulatedData = await manipulationService.manipulateGeoCodeData('E01000001')
    const decile = manipulatedData.IMD_Decile
    const percentages = manipulatedData.percentages
    console.log('All data: ' + JSON.stringify(manipulatedData))
  } catch (error) {
    console.error('Error:', error)
  }
}

async function testAreaManipulation() {
  console.log('Testing area manipulation...')
  try {
    const manipulationService = new DataManipulationService()
    const manipulatedData = await manipulationService.manipulateAreaData('London')
    console.log('All data: ' + JSON.stringify(manipulatedData))
  } catch (error) {
    console.error('Error:', error)
  }
}

async function fetchSumOfDecileData() {
  console.log('Fetching sum of decile data...')
  try {
    const educationService = new EducationService()
    const fetchedData = await educationService.fetchSumDecileData('5')
    console.log('All data: ' + JSON.stringify(fetchedData))
  } catch (error) {
    console.error('Error:', error)
  }
}

async function testAverageDecileSumManipulation() {
  console.log('Testing decile sum manipulation...')
  try {
    const manipulationService = new DataManipulationService()
    const manipulatedData = await manipulationService.averageDecileEducation('5')
    console.log('All data: ' + JSON.stringify(manipulatedData))
  } catch (error) {
    console.error('Error:', error)
  }
}


// await fetchLSOAData()
// await fetchDecileData()
// await fetchAreaData()
// await testGeoCodeManipulation()
// await testAreaManipulation()
// await fetchSumOfDecileData()
await testAverageDecileSumManipulation()