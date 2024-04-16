import { Client } from '@elastic/elasticsearch'
import EducationLevel from '../models/educationLevel.js'
import IndiciesOfDeprivation from '../models/indiciesOfDeprivation.js'
import { EventEmitter } from 'events'

const client = new Client({ node: 'http://localhost:9200' })
const syncEvents = new EventEmitter()
syncEvents.setMaxListeners(20)
console.log('SyncEvents max listeners:', syncEvents.getMaxListeners())

async function indexDataToElasticsearch() {
  console.log('Starting the indexing process.')
  try {
    console.log('Fetching EducationLevel data...')
    const educationLevels = await EducationLevel.findAll({
      attributes: { exclude: ['id', 'createdAt', 'updatedAt'] },
    })
    console.log(
      `Found ${educationLevels.length} education level records to index.`
    )

    console.log('Indexing EducationLevel data...')
    await Promise.all(
      educationLevels.map(async (educationLevel) => {
        await client.index({
          index: 'education_levels_index',
          body: educationLevel.toJSON(),
        })
        console.log(
          `Indexed EducationLevel record for ID: ${educationLevel.id}`
        )
      })
    )
    console.log('EducationLevel data indexed successfully.')

    console.log('Fetching IndiciesOfDeprivation data...')
    const indiciesOfDeprivationData = await IndiciesOfDeprivation.findAll()
    console.log(
      `Found ${indiciesOfDeprivationData.length} indices of deprivation records to index.`
    )

    console.log('All data indexed into Elasticsearch successfully')
    syncEvents.emit('indexSuccess')
  } catch (error) {
    console.error('Error indexing data into Elasticsearch:', error)
    syncEvents.emit('indexError', error)
    throw error
  }
}

export { indexDataToElasticsearch, syncEvents }
