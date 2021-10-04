const BASE_URL = 'https://movie-list.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/v1/movies/'
const POSTER_URL = BASE_URL + '/posters/'


const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
const paginator = document.querySelector('#paginator')

const MOVIES_PER_PAGE = 12

const movies = []
let filterMovies = []

function getMovieByPage(page) {
  //若搜尋關鍵字後，有取得資料=filterMovies有值，則該函式以filterMovie來分頁，反則還是以movies來分頁
  const data = filterMovies.length ? filterMovies : movies

  //計算起始 index 
  const startIndex = (page - 1) * MOVIES_PER_PAGE

  //回傳切割後的新陣列
  return data.slice(startIndex, startIndex + MOVIES_PER_PAGE)
}

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
              <button type="button" class="btn btn-info btn-add-favorite" data-id=${item.id}>+</button>
            </div>
          </div>
        </div>
      </div>
    `
  })

  dataPanel.innerHTML = rawHTML
}

function renderPaginator(amount) {
  const numberOfPage = Math.ceil(amount / MOVIES_PER_PAGE)
  let rawHTML = ''

  for (let page = 1; page <= numberOfPage; page++) {
    rawHTML += `
      <li class="page-item"><a class="page-link" href="#" data-page=${page}>${page}</a></li>
      `
  }

  paginator.innerHTML = rawHTML
}

dataPanel.addEventListener('click', function onPanelClicked(event) {
  if (event.target.matches('.btn-show-movie')) {
    showMovieModal(event.target.dataset.id)
  } else if (event.target.matches('.btn-add-favorite')) {
    addToFavorite(Number(event.target.dataset.id))
  }
})

paginator.addEventListener('click', function onPaginatorClicked(event) {
  if (event.target.tagName !== 'A') return

  const clickedPage = Number(event.target.dataset.page)

  renderMovieList(getMovieByPage(clickedPage))
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

function addToFavorite(id) {
  const list = JSON.parse(localStorage.getItem('favoriteMovies')) || [] //將localStorage的類json字串換換成js物件模式，若localStorage無值會回傳null 此時會觸發(||)條件取回右邊[]。 若||兩邊皆為true，則會回傳左邊的值  
  const movie = movies.find(movie => movie.id === id)

  if (list.some(movie => movie.id === id)) { return alert('此電影已在收藏清單') }
  list.push(movie)
  localStorage.setItem('favoriteMovies', JSON.stringify(list))

}



axios
  .get(INDEX_URL)
  .then((response) => {
    movies.push(...response.data.results)
    renderPaginator(movies.length)
    renderMovieList(getMovieByPage(1))
  })
  .catch((error) => {
    console.log(error)
  })

searchForm.addEventListener('submit', function onSearchFormSubmitted(event) {
  event.preventDefault()
  const keyWord = searchInput.value.trim().toLowerCase()
  filterMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(keyWord))


  if (filterMovies.length === 0) { return alert('Can not find movies with ' + keyWord) }
  renderPaginator(filterMovies.length)
  renderMovieList(getMovieByPage(1))

})

