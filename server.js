import express from 'express'
import 'dotenv/config'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const museumApiUrl =
  'https://collectionapi.metmuseum.org/public/collection/v1/'
const port = process.env.PORT ?? 3000
const app = express()

app.use(express.static(__dirname + '/public'))

app.set('view engine', 'ejs')

app.get('/', async (req, res) => {
  res.render(path.join(__dirname, '/views/index'))
})

app.get('/pictures', async (req, res) => {
  fetch(
    museumApiUrl + '/search?isOnView=true&title=true&hasImages=true&q=portrait'
  )
    .then((response) => response.json())
    .then((pictures) => res.json(pictures))
    .catch((error) => console.error('Error on fetching pictures', error))
})

app.get('/render/:id', async (req, res) => {
  const id = req.params.id
  fetch(museumApiUrl + `/objects/${id}`)
    .then((response) => response.json())
    .then((response) => {
      return {
        id: response.objectID,
        pictureUrl: response.primaryImageSmall,
        department: response.department,
        title: response.title
      }
    })
    .then(picture => {
      const invalid = !picture.title || !picture.department || !picture.pictureUrl
      if (invalid) throw new Error(`Invalid Object fetched with id: ${id}.`)
      else res.render(__dirname + '/views/partials/card', picture)
    })
    .catch(error => {
      console.log(error.message)
      res.status(500).json({ message: `error on fetching objects with id: ${id}` })
    })
})

app.listen(port, () => {
  console.log(`Server running on port: ${port}`)
})
