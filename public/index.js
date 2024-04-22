import { LsoaGraph } from './js/lsoaGraph.js'
import { ListOfLsoas } from './js/listOfLsoas.js'
import { DecileRepresentations } from './js/decileRepresentations.js'


const lsoaGraph = new LsoaGraph()
const listOfLsoas = new ListOfLsoas()
const decileRepresentations = new DecileRepresentations()

document.addEventListener('DOMContentLoaded', () => {
  listOfLsoas.fetchData()
  listOfLsoas.setupListeners()
  lsoaGraph.setupEventListeners()
  decileRepresentations.setupEventListeners()
})

