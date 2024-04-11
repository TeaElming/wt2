// syncService.js
import { Client } from '@elastic/elasticsearch'
import EducationLevel from '../models/educationLevel.js' // Assuming this is the correct path to your EducationLevel model
import IndiciesOfDeprivation from '../models/indiciesOfDeprivation.js' // Assuming this is the correct path to your IndiciesOfDeprivation model

const client = new Client({ node: 'http://localhost:9200' })

async function indexDataToElasticsearch() {
  try {
    // Retrieve data from MySQL using Sequelize for EducationLevel
    const educationLevels = await EducationLevel.findAll()
    // Index each education level document into Elasticsearch
    await Promise.all(
      educationLevels.map(async (educationLevel) => {
        await client.index({
          index: 'education_levels_index', // Index name for EducationLevel data
          body: educationLevel.toJSON(),
        })
      })
    )

    // Retrieve data from MySQL using Sequelize for IndiciesOfDeprivation
    const indiciesOfDeprivationData = await IndiciesOfDeprivation.findAll()
    // Index each IndiciesOfDeprivation document into Elasticsearch
    await Promise.all(
      indiciesOfDeprivationData.map(async (data) => {
        await client.index({
          index: 'indicies_of_deprivation_index', // Index name for IndiciesOfDeprivation data
          body: data.toJSON(),
        })
      })
    )

    console.log('Data indexed into Elasticsearch successfully')
  } catch (error) {
    console.error('Error indexing data into Elasticsearch:', error)
    throw error
  }
}

export { indexDataToElasticsearch }
