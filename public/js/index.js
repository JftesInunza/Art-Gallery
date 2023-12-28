const btnLoadMore = document.getElementById('btn-load-more')
const gallery = document.getElementById('gallery')

const nextImages = 10
let lastPictureIdx = 0
let data = null

const appendCard = async (pictureId) => {
  await fetch(`/pictures/${pictureId}`)
    .then(response => response.text())
    // TODO: validate if has images before append to html.
    .then(htmlStr => {
      const node = document.createElement('div')
      node.innerHTML = htmlStr
      gallery.appendChild(node)
    })
    .catch(error => { console.error('Could not fetch render picture', error) })
}

const fetchPictures = async (onLoad) => {
  await fetch('/pictures')
    .then(response => response.json())
    .then(picture => {
      data = picture
      onLoad(picture)
    })
    .catch(error => { console.error('Could not fetch pictures', error) })
}

const appendNextImages = (pictures) => {
  for (let i = lastPictureIdx; i < lastPictureIdx + nextImages; i++) {
    const pictureId = pictures.objectIDs[i]
    appendCard(pictureId)
  }
  lastPictureIdx += nextImages
}

btnLoadMore.addEventListener('click', () => {
  console.log('Button Load More')
  if (!data) return
  if (lastPictureIdx + nextImages >= data.total) return
  appendNextImages(data)
})

fetchPictures(appendNextImages)
