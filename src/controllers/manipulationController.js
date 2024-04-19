export class ManipulationController {
  constructor(manipulationService) {
    this.manipulationService = manipulationService
  }
  async manipulateGeoCodeData(req, res) {
    try {
      const { geoCode } = req.body // Extract geoCode from request body
      console.log('Made it to the controller with geo code: ' + geoCode)
      const data = await this.manipulationService.manipulateGeoCodeData(geoCode)
      res.status(200).json(data)
    } catch (error) {
      console.error('Error manipulating GeoCode data:', error)
      res.status(500).json({ error: 'Error manipulating GeoCode data' })
    }
  }

  async manipulateAreaData(req, res) {
    try {
      const { partialAreaName } = req.body // Extract partialAreaName from request body
      const data = await this.manipulationService.manipulateAreaData(
        partialAreaName
      )
      res.status(200).json(data)
    } catch (error) {
      console.error('Error manipulating area data:', error)
      res.status(500).json({ error: 'Error manipulating area data' })
    }
  }

  async manipulateAverageDecileEducation(req, res) {
    try {
      const { decile_number } = req.body // Extract decile_number from request body
      const data = await this.manipulationService.averageDecileEducation(
        decile_number
      )
      res.status(200).json(data)
    } catch (error) {
      console.error('Error averaging decile education data:', error)
      res.status(500).json({ error: 'Error averaging decile education data' })
    }
  }
}
