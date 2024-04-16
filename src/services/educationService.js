import sequelize from '../config/mySql.config.js'

export class EducationService {
  async fetchGeoCodeData(geoCode) {
    try {
      console.log('Try to fetch LSOA data through mysql query')
      const result = await sequelize.query(
        `SELECT c.IMD_Decile, e.*
       FROM census_2019_iod_lsoa c
       JOIN uk_lsoa_data.census_2021_education_levels_lsoa e
       ON c.LSOA21CD = e.geography_code
       WHERE c.LSOA21CD = :geoCode;`,
        {
          replacements: { geoCode },
          type: sequelize.QueryTypes.SELECT,
        }
      )

      const fetchedData = result.length > 0 ? result[0] : null

      return fetchedData
    } catch (error) {
      console.error('Error fetching data:', error)
      throw error
    }
  }

  async fetchAreaData(partialAreaName) {
    try {
      console.log('Fetching area data...')
      console.log('Try to fetch LSOA data through mysql query')
      const result = await sequelize.query(
        `SELECT c.IMD_Decile, e.*
         FROM census_2019_iod_lsoa c
         JOIN uk_lsoa_data.census_2021_education_levels_lsoa e
         ON c.LSOA21CD = e.geography_code
         WHERE e.geography LIKE :partialName;`,
        {
          replacements: { partialName: `%${partialAreaName}%` },
          type: sequelize.QueryTypes.SELECT,
        }
      )

      return result
    } catch (error) {
      console.error('Error fetching data:', error)
      throw error
    }
  }

  async fetchDecileData(decile_number) {
    try {
      console.log('Try to fetch IMD decile data through mysql query')
      const result = await sequelize.query(
        `SELECT c.IMD_Decile, e.*
         FROM census_2019_iod_lsoa c
         JOIN uk_lsoa_data.census_2021_education_levels_lsoa e
         ON c.LSOA21CD = e.geography_code
         WHERE c.IMD_Decile = :decile_number;`,
        {
          replacements: { decile_number },
          type: sequelize.QueryTypes.SELECT,
        }
      )

      return result
    } catch (error) {
      console.error('Error fetching data:', error)
      throw error
    }
  }

  // Doing the summarising straight from the database to minimise computation time
  async fetchSumDecileData(decile_number) {
    try {
      console.log('Try to fetch and sum IMD decile data through mysql query')

      const result = await sequelize.query(
        `SELECT c.IMD_Decile,
        SUM(e.no_qualifications) AS sum_no_qualifications,
        SUM(e.level_1_entry_qualifications) AS sum_level_1_entry_qualifications,
        SUM(e.level_2_qualifications) AS sum_level_2_qualifications,
        SUM(e.apprenticeship) AS sum_apprenticeship,
        SUM(e.level_3_qualifications) AS sum_level_3_qualifications,
        SUM(e.level_4_above_qualifications) AS sum_level_4_above_qualifications,
        SUM(e.other_qualifications) AS sum_other_qualifications,
        SUM(e.total_population) AS sum_total_population
          FROM census_2019_iod_lsoa c
          JOIN uk_lsoa_data.census_2021_education_levels_lsoa e
          ON c.LSOA21CD = e.geography_code
          WHERE c.IMD_Decile = :decile_number
          GROUP BY c.IMD_Decile;
          `,
        {
          replacements: { decile_number },
          type: sequelize.QueryTypes.SELECT,
        }
      )

      return result.length > 0 ? result[0] : null
    } catch (error) {
      console.error('Error fetching and summing data:', error)
      throw error
    }
  }
}
