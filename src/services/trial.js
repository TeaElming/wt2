import EducationService from './educationService.js';
import { indexDataToElasticsearch, syncEvents } from './syncService.js'

// const eduService = EducationService.getInstance();
// await eduService.getEducationLevelForArea('E01000001');
// console.log('Education level data retrieved successfully');

import sequelize from '../config/mySql.config.js'

async function countEducationData() {
  try {
    console.log('Try to do mysql query')
    const result = await sequelize.query(
      "SELECT COUNT(*) AS total_rows FROM uk_lsoa_data.census_2021_education_levels_lsoa;",
      { type: sequelize.QueryTypes.SELECT }
    );
    console.log("Total rows in census_2021_education_levels_lsoa:", result[0].total_rows);
    return result[0].total_rows;
  } catch (error) {
    console.error("Error fetching row count:", error);
    throw error;
  }
}

countEducationData();
