import sequelize from '../config/mySql.config.js';

async function fetchEducationData(geoCode) {
  try {
    console.log('Try to do mysql query');
    const result = await sequelize.query(
      `SELECT c.IMD_Decile, e.*
       FROM census_2019_iod_lsoa c
       JOIN uk_lsoa_data.census_2021_education_levels_lsoa e
       ON c.LSOA21CD = e.geography_code
       WHERE c.LSOA21CD = :geoCode;`,
      {
        replacements: { geoCode },
        type: sequelize.QueryTypes.SELECT
      }
    );

    console.log("Fetched data:", result);
    return result;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}

fetchEducationData('E01000001');
