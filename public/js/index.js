const btnLoadMore = document.getElementById('btn-load-more')
const gallery = [
  document.getElementById('gl-col-1'),
  document.getElementById('gl-col-2'),
  document.getElementById('gl-col-3')
]

const nextImages = 18
let lastPictureIdx = 0
let galleryCounter = 0
let pictures = null

const APIResponseError = new Error('API Response Error. Try again later.')
const InvalidObjectFetched = new Error('Invalid Object ID')

const fetchPictures = async () => {
  try {
    const response = await fetch('/pictures')
    const pictures = await response.json()
    return pictures
  } catch (error) {
    throw APIResponseError
  }
}

const renderCard = async (id) => {
  return new Promise((resolve, reject) => {
    fetch(`/render/${id}`)
      .then(response => {
        if (!response.ok) reject(InvalidObjectFetched)
        return response.text()
      })
      .then(html => {
        const card = document.createElement('div')
        card.innerHTML = html
        resolve(card)
      })
  })
}

const appendCards = async (n, { total, objectIDs }) => {
  for (let i = lastPictureIdx; i < lastPictureIdx + n && i < total; i++) {
    renderCard(objectIDs[i])
      .then(card => {
        const index = galleryCounter++ % gallery.length
        gallery[index].appendChild(card)
      })
      .catch(() => {
        lastPictureIdx++
        appendCards(1, { total, objectIDs })
      })
  }
  lastPictureIdx += n
  if (lastPictureIdx >= total) btnLoadMore.style.display = 'none'
}

window.addEventListener('load', async () => {
  try {
    pictures = await fetchPictures()
  } catch (error) {
    alert(error.message)
  }
  btnLoadMore.addEventListener('click', async () => {
    appendCards(nextImages, pictures)
  })

  appendCards(nextImages, pictures)
})
