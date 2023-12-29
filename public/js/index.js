const btnLoadMore = document.getElementById('btn-load-more')
const gallery = document.getElementById('gallery')

const nextImages = 20
let lastPictureIdx = 0
let pictures = null

const APIResponseError = new Error('API Response Error')

const fetchPictures = async () => {
  try {
    const response = await fetch('/pictures')
    const pictures = await response.json()
    return pictures
  } catch (error) {
    throw APIResponseError
  }
}

const fetchPicture = async (id) => {
  try {
    const response = await fetch(`/pictures/${id}`)
    const picture = await response.json()
    return picture
  } catch (error) {
    throw APIResponseError
  }
}

const renderCard = async (picture) => {
  try {
    const request = '/render?' + new URLSearchParams(picture)
    const response = await fetch(request)
    const htmlStr = await response.text()
    const node = document.createElement('div')
    node.innerHTML = htmlStr
    return node
  } catch (error) {
    throw APIResponseError
  }
}

const appendNextImages = async ({ total, objectIDs }) => {
  const cards = []
  for (let i = lastPictureIdx; i < lastPictureIdx + nextImages && i < total; i++) {
    const picture = await fetchPicture(objectIDs[i])
    if (!picture.title || !picture.department || !picture.pictureUrl) {
      lastPictureIdx++
      continue
    }

    const card = await renderCard(picture)
    cards.push(card)
  }
  for (const card of cards) { gallery.appendChild(card) }
  lastPictureIdx += nextImages
}

window.addEventListener('load', async () => {
  pictures = await fetchPictures()
  btnLoadMore.addEventListener('click', async () => {
    appendNextImages(pictures)
  })

  appendNextImages(pictures)
})
