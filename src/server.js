import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import container from './config/inversify.config.js'
import IDENTIFIERS from './config/identifiers.js'
import { config } from 'dotenv'

const app = express()

const manipulationController = container.get(IDENTIFIERS.ManipulationController)
const educationController = container.get(IDENTIFIERS.EducationController)
config()
const baseURL = process.env.BASE_URL
console.log(baseURL)
const PORT = process.env.PORT || 3000


app.use(cors())
app.use(bodyParser.json())
app.use(express.static('public'))

// TODO: Extract into router folder, just for testing now
app.post('/manipulate-geo-code-data', async (req, res) => {manipulationController.manipulateGeoCodeData(req, res)})
app.post('/manipulate-area-data', async (req, res) => {manipulationController.manipulateAreaData(req, res)})
app.post('/manipulate-average-decile-education', async (req, res) => {manipulationController.manipulateAverageDecileEducation(req, res)})
app.get('/fetch-geo-code-names', async (req, res) => {educationController.fetchAreaNames(req, res)})






app.listen(PORT, () => {
  console.log(`Server running on ${baseURL}${PORT}`)
})
