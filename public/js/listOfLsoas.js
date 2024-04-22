import { LsoaGraph } from './lsoaGraph.js'

export class ListOfLsoas {
  constructor() {
    this.currentPage = 1
    this.totalPages = 0
    this.filteredAreas = []
    this.lsoaGraph = new LsoaGraph()
    this.setupListeners()
    this.fetchData()
  }

  /**
   * Fetches data from the server and renders the results on the page.
   *
   * @memberof listOfLsoas
   */
  async fetchData() {
    try {
      const response = await fetch('/fetch-geo-code-names', {
        method: 'GET',
      })
      if (!response.ok) {
        throw new Error('Failed to fetch data')
      }
      const data = await response.json()
      this.renderResults(data)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  /**
   * Renders the search results on the page.
   *
   * @param {Object} data - The data object containing the search results.
   * @memberof listOfLsoas
   */
  async renderResults(data) {
    const totalLSOAsElement = document.getElementById('totalLSOAs')
    totalLSOAsElement.textContent = data.count

    const searchInput = document.getElementById('searchInput')
    searchInput.addEventListener('input', () => {
      this.filterAreas(data, searchInput.value.toLowerCase())
      this.renderPage(1)
    })

    this.totalPages = Math.ceil(data.areas.length / 20)
    this.filteredAreas = data.areas
    this.renderPage(1)
  }

  /**
   * Filters the areas based on the search term.
   *
   * @param {Object} data - The data object containing the areas to filter.
   * @param {String} searchTerm - The search term to filter the areas, either code or name.
   * @memberof listOfLsoas
   */
  filterAreas(data, searchTerm) {
    this.filteredAreas = data.areas.filter(
      (area) =>
        area.geography_code.toLowerCase().includes(searchTerm) ||
        area.geography.toLowerCase().includes(searchTerm)
    )
    this.totalPages = Math.ceil(this.filteredAreas.length / 20)
  }

  /**
   * Renders a specific page of the search results.
   *
   * @param {string} pageNumber - the page number is entered as a string
   * @memberof listOfLsoas
   */
  renderPage(pageNumber) {
    const startIdx = (pageNumber - 1) * 20
    const endIdx = Math.min(startIdx + 20, this.filteredAreas.length)
    const pageItems = this.filteredAreas.slice(startIdx, endIdx)

    const resultsContainer = document.getElementById('resultsContainer')
    resultsContainer.innerHTML = ''

    pageItems.forEach((area) => {
      const row = document.createElement('div')
      row.classList.add('row')
      row.innerHTML = `
        <span class="geocode">${area.geography_code}</span>
        <span class="name">${area.geography}</span>
      `
      row.addEventListener('click', () => this.handleClick(area.geography_code))
      resultsContainer.appendChild(row)
    })

    this.currentPage = pageNumber
    this.updatePagination()
  }

  /**
   * Sets up the event listeners for the pagination buttons.
   *
   * @memberof listOfLsoas
   */
  setupListeners() {
    const prevButton = document.getElementById('prevButton')
    prevButton.addEventListener('click', () => this.goToPrevPage())

    const nextButton = document.getElementById('nextButton')
    nextButton.addEventListener('click', () => this.goToNextPage())
  }

  /**
   * Updates the pagination arrows and page info based on the current page and total pages.
   *
   * @memberof listOfLsoas
   */
  updatePagination() {
    const prevButton = document.getElementById('prevButton')
    const nextButton = document.getElementById('nextButton')
    const pageInfo = document.getElementById('pageInfo')

    prevButton.disabled = this.currentPage === 1
    nextButton.disabled = this.currentPage === this.totalPages

    pageInfo.textContent = `Page: ${this.currentPage}/${this.totalPages}`
  }

  /**
   * Goes to the previous page.
   *
   * @memberof listOfLsoas
   */
  goToPrevPage() {
    if (this.currentPage > 1) {
      this.renderPage(this.currentPage - 1)
    }
  }

  /**
   * Goes to the next page.
   *
   * @memberof listOfLsoas
   */
  goToNextPage() {
    if (this.currentPage < this.totalPages) {
      this.renderPage(this.currentPage + 1)
    }
  }

  /**
   * Triggers the manipulation of the data for the selected geocode.
   *
   * @param {*} geocode
   * @memberof listOfLsoas
   */
  handleClick(geocode) {
    console.log(`Clicked on row with geocode: ${geocode}`)
    this.lsoaGraph.manipulateGeoCodeData(geocode)
  }
}
