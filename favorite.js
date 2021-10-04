const BASE_URL = 'https://movie-list.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/v1/movies/'
const POSTER_URL = BASE_URL + '/posters/'


const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')

const movies = JSON.parse(localStorage.getItem('favoriteMovies')) || []

function renderMovieList(data) {
  let rawHTML = ''

  data.forEach(item => {
    rawHTML += `
    <div class="col-sm-3">
        <div class="mb-2">
          <div class="card">
            <img
              src=${POSTER_URL + item.image}
              class="card-img-top" alt="Movie Poster">
            <div class="card-body">
              <h5 class="card-title">${item.title}</h5>
            </div>

            <div class="card-footer">
              <button type="button" class="btn btn-primary btn-show-movie" data-toggle="modal"
                data-target="#movie-modal" data-id=${item.id}>More</button>
              <button type="button" class="btn btn-danger btn-delete-favorite" data-id=${item.id}>X</button>
            </div>
          </div>
        </div>
      </div>
    `
  })

  dataPanel.innerHTML = rawHTML
}

dataPanel.addEventListener('click', function onPanelClicked(event) {
  if (event.target.matches('.btn-show-movie')) {
    showMovieModal(event.target.dataset.id)
  } else if (event.target.matches('.btn-delete-favorite')) {
    console.log(event.target.dataset.id)
    removeFromFavorite(Number(event.target.dataset.id))
  }
})

function showMovieModal(id) {
  const modalTitle = document.querySelector('#movie-modal-title')
  const modalImage = document.querySelector('#movie-modal-image')
  const modalDate = document.querySelector('#movie-modal-date')
  const modalDescription = document.querySelector('#movie-modal-description')

  axios.get(INDEX_URL + id)
    .then((response) => {
      const data = response.data.results
      modalTitle.innerText = data.title
      modalImage.innerHTML = `<img src=${POSTER_URL + data.image} class="card-fluid"
       alt="Movie Poster">`
      modalDate.innerText = 'Release at ：' + data.release_date
      modalDescription.innerText = data.description
    })
}

function removeFromFavorite(id) {
  if (!movies) return //一旦收藏清單是空的，就結束這個函式。

  const movieIndex = movies.findIndex(movie => movie.id === id) //找到符合條件的項目索引值
  if (movieIndex === -1) return //傳入的 id 在收藏清單中不存在，就結束這個函式。

  movies.splice(movieIndex, 1)

  localStorage.setItem('favoriteMovies', JSON.stringify(movies))
  renderMovieList(movies)

}



renderMovieList(movies)

