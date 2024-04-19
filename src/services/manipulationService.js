import { EducationService } from './educationService.js'

export class ManipulationService {
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
      console.log('Made it into the manipulation service with geo code: ' + geoCode)
      console.log('Type of geo code: ' + typeof(geoCode))
      const fetchedData = await this.educationService.fetchGeoCodeData(geoCode)
      //console.log('Fetched data: ' + fetchedData)

      // We will want to pass this through as well
      const LSOAinfo = {
        LSOA_code: fetchedData.geography_code,
        LSOA_name: fetchedData.geography,
        IMD_Decile: fetchedData.IMD_Decile,
      }

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

      const data = { LSOAinfo, percentages }
      return data
    } catch (error) {
      console.error('Error manipulating data:', error)
      throw error
    }
  }

  async manipulateAreaData(partialAreaName) {
    try {
      // Fetch area data
      const areaData = await this.educationService.fetchAreaData(
        partialAreaName
      )

      // Manipulate data for each LSOA
      const manipulatedData = await Promise.all(
        areaData.map(async (lsoa) => {
          // Extract geography code
          const geoCode = lsoa.geography_code
          // Manipulate data for the LSOA
          const manipulated = await this.manipulateGeoCodeData(geoCode)
          return manipulated
        })
      )

      return manipulatedData
    } catch (error) {
      console.error('Error fetching data for area:', error)
      throw error
    }
  }

  async averageDecileEducation(decile_number) {
    try {
      // Fetch data for the specified geoCode
      const fetchedData = await this.educationService.fetchSumDecileData(
        decile_number
      )

      if (!fetchedData) {
        throw new Error('No data found for the specified decile number.')
      }

      // Calculate total population
      const totalPopulation = fetchedData.sum_total_population
      console.log(fetchedData.sum_no_qualifications)

      // Calculate percentage for each education level
      const percentages = {
        no_qualifications: fetchedData.sum_no_qualifications / totalPopulation,
        level_1_entry_qualifications:
          fetchedData.sum_level_1_entry_qualifications / totalPopulation,
        level_2_qualifications:
          fetchedData.sum_level_2_qualifications / totalPopulation,
        apprenticeship: fetchedData.sum_apprenticeship / totalPopulation,
        level_3_qualifications:
          fetchedData.sum_level_3_qualifications / totalPopulation,
        level_4_above_qualifications:
          fetchedData.sum_level_4_above_qualifications / totalPopulation,
        other_qualifications:
          fetchedData.sum_other_qualifications / totalPopulation,
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

      const data = { IMD_Decile: fetchedData.IMD_Decile, percentages }
      return data
    } catch (error) {
      console.error('Error manipulating data:', error)
      throw error
    }
  }
}
