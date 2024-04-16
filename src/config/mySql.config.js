/** @format */
import { config } from 'dotenv'
import { Sequelize } from 'sequelize'

config()
// Create a new instance of Sequelize using environment variables
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    port: process.env.DB_PORT,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    logging: false, // Set to true to see SQL queries in the console
  }
)

export default sequelize
