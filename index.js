const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization:
      'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlOWJiOTJmNjQ4ZDQxOTExNTVkMTdjOGU0M2YyNWU2OCIsInN1YiI6IjY0NzIxZmM1ZGQ3MzFiMDBjMGJhYWU5MyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Y3E-hG7rguBwXeMYwJDAuXRxZp8nBSidYbJb6AFhSf0',
  },
};

const apiKey = 'e9bb92f648d4191155d17c8e43f25e68&language=ko';

const movieCardBox = document.getElementById('cards-box');
const popularTab = document.getElementById('popular-category');
const nowPlayingTab = document.getElementById('nowplaying-category');
const topRatedTab = document.getElementById('toprate-category');
const upcomingTab = document.getElementById('upcoming-category');
const clickButton = document.getElementById('click-btn');
const searchBox = document.getElementById('search-box');
const mainH1 = document.getElementById('mainH1');

const popular = 'https://api.themoviedb.org/3/movie/popular?';
const NowPlaying = 'https://api.themoviedb.org/3/movie/now_playing?';
const TopRated = 'https://api.themoviedb.org/3/movie/top_rated?';
const Upcoming = 'https://api.themoviedb.org/3/movie/upcoming?';
// 매개변수로 필요한 영화 api주소를 받아서 api키와 붙여 showMovieList에 넘겨줍니다.
const url = (movieUrl) =>
  showMovieList(movieUrl + 'api_key=' + apiKey, options);

// 카테고리 클릭시 붙는 영화들이, 기존 영화 뒤에 붙게되어서 textContent를 사용해 기존 카드를 지우고, 새 카드들을 붙이는 함수를 실행하는 함수입니다.
const cardsRemove = (movieUrl) => {
  movieCardBox.textContent = '';
  url(movieUrl);
};
// 매개변수로 필요한 api 주소를 받아서 영화들을 보여주는 함수입니다.
const showMovieList = (moviesUrl) => {
  fetch(moviesUrl, options)
    .then((response) => response.json())
    .then((data) => {
      let rows = data['results'];
      rows.forEach((item) => {
        let movieTitle = item['title'];
        let movieDesc = item['overview'];
        let movieRate = Math.round(item['vote_average'] * 10) / 10;
        let movieImg = item['poster_path'];
        let movieId = item['id'];

        let temp_html = `<div class="col" style="color: white">
                             <div class="solo-card" style="background-color: rgb(58, 58, 57)">
                                 <img src="https://image.tmdb.org/t/p/w500${movieImg}"
                                    class="card-img-top" id="cardPost-${movieId}"/>
                                 <div class="card-body" id="desc-body-${movieId}">
                                    <h2 class="card-title">${movieTitle}</h2>
                                    <p class="${getRatingColor(
                                      movieRate
                                    )}">${movieRate}</p>
                                    <p class="card-text">${movieDesc}</p>
                                </div>
                            </div>
                        </div>`;

        movieCardBox.insertAdjacentHTML('beforeend', temp_html);
        // 카드의 이미지 클릭시 발생하는 이벤트 지정
        const clickCardBox = document.getElementById(`cardPost-${movieId}`);
        clickCardBox.addEventListener('click', () => clickCard(movieId));
      });
    });
};
// 카드 이미지 클릭시 id를 얼럿창으로 띄우는 함수
const clickCard = (movieId) => alert(`id: ${movieId}`);

// 매개변수로 사용자가 입력한 키워드(searchBoxValue)를 불러와서 사용합니다.
const searchMovie = (searchBoxValue) => {
  const searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=ko&query=${searchBoxValue}`;

  fetch(searchUrl, options)
    .then((response) => response.json())
    .then((data) => {
      const results = data['results'];
      if (results.length === 0) {
        alert('일치하는 검색 결과를 찾을 수 없습니다.'); // 사용자가 하나도 입력하지 않고 검색버튼을 누르거나 엔터를 눌렀을때 나오는 얼럿창
      } else {
        movieCardBox.textContent = ''; // 검색에 해당되는 영화들이 기존 영화들 뒤에 붙어서 위와같이 기존 카드를 지워줍니다.

        results.forEach((item) => {
          const movieTitle = item.title;
          const movieDesc = item.overview;
          const movieRate = Math.round(item.vote_average * 10) / 10; // 평점이 소수점이 길어서, Math.round를 사용해 반올림.
          const movieImg = item.poster_path;
          const movieId = item.id;

          const temp_html = `<div class="col" style="color: white">
                                  <div class="solo-card" style="background-color: rgb(58, 58, 57)">
                                      <img src="https://image.tmdb.org/t/p/w500${movieImg}"
                                        class="card-img-top" id="cardPost-${movieId}"/>
                                      <div class="card-body" id="desc-body-${movieId}">
                                        <h2 class="card-title">${movieTitle}</h2>
                                        <p class="${getRatingColor(
                                          movieRate
                                        )}">${movieRate}</p>
                                        <p class="card-text">${movieDesc}</p>
                                    </div>
                                </div>
                            </div>`;

          movieCardBox.insertAdjacentHTML('beforeend', temp_html);
          // 위와 같이 영화 이미지 클릭시 발생하는 이벤트 지정.
          const clickCardBox = document.getElementById(`cardPost-${movieId}`);
          clickCardBox.addEventListener('click', () => clickCard(movieId));
        });
      }
    });
};

// 검색 버튼을 눌렀을때 발생하는 이벤트 지정.
clickButton.addEventListener('click', () => {
  const searchBoxValue = searchBox.value;
  searchMovie(searchBoxValue);
});

// 검색창에서 엔터키를 눌렀을때도 버튼을 누른것과 같은 결과를 가지게 지정.
searchBox.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    const searchBoxValue = searchBox.value;
    searchMovie(searchBoxValue);
  }
});

// header 부분에 Carrot Movie 글자 클릭시 메인 페이지로 넘어가는 함수입니다.
const main = () => {
  window.location.href = '/index.html';
};
mainH1.addEventListener('click', main);

// 영화리뷰를 조건에 맞춰서 색을 바꿔서 보여주는 함수입니다.
const getRatingColor = (rate) => {
  if (rate >= 8) {
    return 'green';
  } else if (rate >= 5) {
    return 'orange';
  } else {
    return 'red';
  }
};

url(TopRated);
// 메인페이지 카테고리 클릭이벤트 지정
popularTab.addEventListener('click', () => cardsRemove(popular));
nowPlayingTab.addEventListener('click', () => cardsRemove(NowPlaying));
topRatedTab.addEventListener('click', () => cardsRemove(TopRated));
upcomingTab.addEventListener('click', () => cardsRemove(Upcoming));
