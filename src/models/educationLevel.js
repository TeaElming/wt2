import { DataTypes } from 'sequelize'
import sequelize from '../config/mySql.config.js'

const EducationLevel = sequelize.define(
  'EducationLevel',
  {
    date: {
      type: DataTypes.INTEGER.UNSIGNED, // Assuming 'YEAR' in MySQL corresponds to 'UNSIGNED INTEGER' in Sequelize
      allowNull: false
    },
    geography: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    geography_code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    no_qualifications: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    level_1_entry_qualifications: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    level_2_qualifications: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    apprenticeship: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    level_3_qualifications: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    level_4_above_qualifications: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    other_qualifications: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    total_population: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: 'census_2021_education_levels_lsoa',
    primaryKey: false,
  }
)

export default EducationLevel
