export class EducationController {
  constructor(educationService) {
    this.educationService = educationService
  }

  async fetchGeoCodeData(req, res) {
    try {
      const { geoCode } = req.body
      const fetchedData = await this.educationService.fetchGeoCodeData(geoCode)

      res.status(200).json(fetchedData)
    } catch (error) {
      console.error('Error fetching data:', error)
      res.status(500).json({ error: 'Error fetching data' })
    }
  }

  async fetchAreaData(req, res) {
    try {
      const { partialAreaName } = req.body
      const result = await this.educationService.fetchAreaData(partialAreaName)

      res.status(200).json(result)
    } catch (error) {
      console.error('Error fetching data:', error)
      res.status(500).json({ error: 'Error fetching data' })
    }
  }

  async fetchAreaNames(req, res) {
    try {
      const results = await this.educationService.fetchAreaNames()
      res.status(200).json(results)
    } catch (error) {
      console.error('Error fetching data:', error)
      res.status(500).json({ error: 'Error fetching data' })
    }
  }

  async fetchDecileData(req, res) {
    try {
      const { decile_number } = req.body
      const result = await this.educationService.fetchDecileData(decile_number)

      res.status(200).json(result)
    } catch (error) {
      console.error('Error fetching data:', error)
      res.status(500).json({ error: 'Error fetching data' })
    }
  }

  async fetchSumDecileData(req, res) {
    try {
      const { decile_number } = req.body //
      const result = await this.educationService.fetchSumDecileData(
        decile_number
      )

      res.status(200).json(result)
    } catch (error) {
      console.error('Error fetching data:', error)
      res.status(500).json({ error: 'Error fetching data' })
    }
  }
}
