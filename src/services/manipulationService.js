import { EducationService } from './educationService.js'

export class DataManipulationService {
  constructor() {
    this.educationService = new EducationService()
  }

  /**
   * This turns each education level into a percentage of the total population for more accessible manipulation.
   *
   * @param {string} geoCode - E.g. 'E01000001'
   * @returns {Object} - An object containing the percentage of the total population for each education level.
   */
  async manipulateGeoCodeData(geoCode) {
    try {
      // Fetch data for the specified geoCode
      const fetchedData = await this.educationService.fetchGeoCodeData(geoCode)

      // Calculate total population
      const totalPopulation = fetchedData.total_population

      // Calculate percentage for each education level
      const percentages = {
        no_qualifications: fetchedData.no_qualifications / totalPopulation,
        level_1_entry_qualifications:
          fetchedData.level_1_entry_qualifications / totalPopulation,
        level_2_qualifications:
          fetchedData.level_2_qualifications / totalPopulation,
        apprenticeship: fetchedData.apprenticeship / totalPopulation,
        level_3_qualifications:
          fetchedData.level_3_qualifications / totalPopulation,
        level_4_above_qualifications:
          fetchedData.level_4_above_qualifications / totalPopulation,
        other_qualifications:
          fetchedData.other_qualifications / totalPopulation,
      }

      // Round each percentage to 4 decimal places
      for (const level in percentages) {
        percentages[level] = Number.parseFloat(percentages[level]).toFixed(4)
      }

      // Ensure that the rounded percentages sum up to 1
      const sum = Object.values(percentages).reduce(
        (acc, val) => acc + parseFloat(val),
        0
      )
      if (sum !== 1) {
        // Adjust the last percentage to ensure the sum is 1
        const keys = Object.keys(percentages)
        const lastKey = keys[keys.length - 1]
        percentages[lastKey] = (
          1 -
          (sum - parseFloat(percentages[lastKey]))
        ).toFixed(4)
      }

      return percentages
    } catch (error) {
      console.error('Error manipulating data:', error)
      throw error
    }
  }
}
