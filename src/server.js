import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'

const app = express()
const PORT = 3000
app.use(cors())
app.use(bodyParser.json())
app.use(express.static('public'))

// Then we need to set up routes etc here

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
