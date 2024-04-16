import { EducationService } from './educationService.js'

async function fetchData() {
  try {
    const educationService = new EducationService()
    const fetchedData = await educationService.fetchEducationData('E01000001')
    console.log('All data: ' + JSON.stringify(fetchedData))
  } catch (error) {
    console.error('Error:', error)
  }
}

await fetchData()