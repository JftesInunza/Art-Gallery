import express from 'express'
import 'dotenv/config'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const museumApiUrl = 'https://collectionapi.metmuseum.org/public/collection/v1/'
const port = process.env.PORT ?? 3000
const app = express()

app.use(express.static(__dirname + '/public'))

app.set('view engine', 'ejs')

app.get('/', async (req, res) => {
  res.render(path.join(__dirname, '/views/index'))
})

app.get('/pictures', async (req, res) => {
  fetch(museumApiUrl + '/search?isOnView=true&title=true&hasImages=true&q=portrait')
    .then(response => response.json())
    .then(pictures => res.json(pictures))
    .catch(error => console.error('Error on fetching pictures', error))
})

app.get('/pictures/:id', async (req, res) => {
  const id = req.params.id
  fetch(museumApiUrl + `/objects/${id}`)
    .then(response => response.json())
    .then(response => {
      return {
        id: response.objectID,
        pictureUrl: response.primaryImageSmall,
        department: response.department,
        title: response.title
      }
    })
    .then(picture => res.json(picture))
    .catch(error => console.error('Error on fetching pictures', error))
})

app.get('/render', async (req, res) => {
  if (
    !req.query.title ||
    !req.query.department ||
    !req.query.pictureUrl
  ) {
    res.json({ error: 'Not valid input' })
  }
  res.render(__dirname + '/views/partials/card', req.query)
})

app.listen(port, () => {
  console.log(`Server running on port: ${port}`)
})
