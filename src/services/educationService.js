import sequelize from '../config/mySql.config.js'

async function fetchEducationData(geoCode) {
  try {
    console.log('Try to do mysql query')
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

    console.log('Fetched data:', fetchedData)
    // Assuming fetchedData is the object you retrieved from the database
    console.log('IMD Decile:', fetchedData.IMD_Decile)
    console.log('Date:', fetchedData.date)
    console.log('Geography:', fetchedData.geography)
    console.log('Geography Code:', fetchedData.geography_code)
    console.log('No Qualifications:', fetchedData.no_qualifications)
    console.log(
      'Level 1 Entry Qualifications:',
      fetchedData.level_1_entry_qualifications
    )
    console.log('Level 2 Qualifications:', fetchedData.level_2_qualifications)
    console.log('Apprenticeship:', fetchedData.apprenticeship)
    console.log('Level 3 Qualifications:', fetchedData.level_3_qualifications)
    console.log(
      'Level 4 and Above Qualifications:',
      fetchedData.level_4_above_qualifications
    )
    console.log('Other Qualifications:', fetchedData.other_qualifications)
    console.log('Total Population:', fetchedData.total_population)
    return fetchedData
  } catch (error) {
    console.error('Error fetching data:', error)
    throw error
  }
}

fetchEducationData('E01000001')
