import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import { ManipulationController } from './controllers/manipulationController.js'

const app = express()
const PORT = 3000
const manipulationController = new ManipulationController()

app.use(cors())
app.use(bodyParser.json())
app.use(express.static('public'))

// TODO: Extract into router folder, just for testing now
app.post('/manipulate-geo-code-data', async (req, res) => {manipulationController.manipulateGeoCodeData(req, res)})
app.post('/manipulate-area-data', async (req, res) => {manipulationController.manipulateAreaData(req, res)})
app.post('/manipulate-average-decile-education', async (req, res) => {manipulationController.manipulateAverageDecileEducation(req, res)})


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
