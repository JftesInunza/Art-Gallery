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

const renderCard = async (id) => {
  return new Promise((resolve, reject) => {
    fetch(`/render/${id}`)
      .then(response => {
        if (!response.ok) reject(new Error('Invalid Object ID'))
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
      .then(card => gallery.appendChild(card))
      .catch(() => {
        lastPictureIdx++
        appendCards(1, { total, objectIDs })
      })
  }
  lastPictureIdx += nextImages
}

window.addEventListener('load', async () => {
  pictures = await fetchPictures()
  btnLoadMore.addEventListener('click', async () => {
    appendCards(nextImages, pictures)
  })

  appendCards(nextImages, pictures)
})
