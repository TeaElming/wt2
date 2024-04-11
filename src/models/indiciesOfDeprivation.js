import { DataTypes } from 'sequelize'
import sequelize from '../config/mySql.config.js'

const IndiciesOfDeprivation = sequelize.define(
  'IndiciesOfDeprivation',
  {
    IMD_Decile: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    Income_Score: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    Income_Rank: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    Income_Decile: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    Employment_Score: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    Employment_Rank: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    Employment_Decile: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    Education_Skills_Training_Score: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    Education_Skills_Training_Rank: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    Education_Skills_Training_Decile: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    Health_Deprivation_Disability_Score: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    Health_Deprivation_Disability_Rank: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    Health_Deprivation_Disability_Decile: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    Crime_Score: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    Crime_Rank: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    Crime_Decile: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    Barriers_to_Housing_Services_Score: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    Barriers_to_Housing_Services_Rank: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    Barriers_to_Housing_Services_Decile: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    Living_Environment_Score: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    Living_Environment_Rank: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    Living_Environment_Decile: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    IDACI_Score: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    IDACI_Rank: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    IDACI_Decile: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    IDAOPI_Score: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    IDAOPI_Rank: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    IDAOPI_Decile: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    Children_Young_People_Sub_domain_Score: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    Children_Young_People_Sub_domain_Rank: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    Children_Young_People_Sub_domain_Decile: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    Adult_Skills_Sub_domain_Score: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    Adult_Skills_Sub_domain_Rank: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    Adult_Skills_Sub_domain_Decile: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    Geographical_Barriers_Sub_domain_Score: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    Geographical_Barriers_Sub_domain_Rank: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    Geographical_Barriers_Sub_domain_Decile: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    Wider_Barriers_Sub_domain_Score: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    Wider_Barriers_Sub_domain_Rank: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    Wider_Barriers_Sub_domain_Decile: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    Indoors_Sub_domain_Score: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    Indoors_Sub_domain_Rank: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    Indoors_Sub_domain_Decile: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    Outdoors_Sub_domain_Score: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    Outdoors_Sub_domain_Rank: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    Outdoors_Sub_domain_Decile: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    Total_population_2015: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    Dependent_Children_0_15_2015: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    Population_16_59_2015: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    Older_population_60_over_2015: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    Working_age_population_18_59_64_2015: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: 'census_2019_iod_lsoa',
  }
)

export default IndiciesOfDeprivation
