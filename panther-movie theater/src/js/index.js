///// Initial Values
const MOVIE_DB_API = 'd8bf019d0cca372bd804735f172f67e8';
const MOVIE_DB_ENDPOINT = 'https://api.themoviedb.org';
const MOVIE_DB_IMAGE_ENDPOINT = 'https://image.tmdb.org/t/p/w500';
const DEFAULT_POST_IMAGE = 'https://via.placeholder.com/150';




/* ==================================
Selecting elements from the DOM
===========================================*/



////////BANNER
const banner = document.getElementById('banner');



////////BANNER
const homeBtns = Array.from(document.querySelectorAll('.home'));



///////NAV BAR
const navButton = document.querySelector('#navbar__btn');
const nav = document.querySelector('#navbarNav');
const navList = document.querySelector('.navbar__container');


//// search input and button
const searchButton = document.querySelector('#search-btn');
const searchInput = document.querySelector('#searchInput');


//// buttons to choose 
const discover = document.querySelector('#discover');
const trending = document.querySelector('#trending');
const topRated = document.querySelector('#topRated');

//// movie-list section 
const moviesSearchable = document.querySelector('#searchable');

//// movie section 
const moviePage = document.querySelector('#movie');


//// main section 
const main = document.querySelector('main');

//// popular section
const popular = document.querySelector('#popular');
const buttonRight1 = document.getElementById('slideRight--1');
const buttonLeft1 = document.getElementById('slideLeft--1');


//// upcoming section
const upcoming = document.querySelector('#upcoming');
const buttonRight2 = document.getElementById('slideRight--2');
const buttonLeft2 = document.getElementById('slideLeft--2');




///////design break points
const phoneXs = 450;
const phone = 600;
const tabPort = 900;
const tabLand = 1200;



/*=====================================
MANIPULATING NAVIGATION 
=========================================*/

/////EVENT LISTENER TO TOGGLE THE NAVIGATION 
function navToggle(){
    if(window.innerWidth < tabPort){
        nav.addEventListener('click', e=> {
            e.preventDefault();
            let  x = t=> e.target.classList.contains(t);
            if(x('navbar__link') || x('navbar__btn')||x('navbar__container') || x('navbar__icon') || x('navbar_nav') || x('navbar__item')){
                navList.classList.toggle('expand');
                navButton.classList.toggle('clicked');
            }
        });
    }
}

//// CHANGING NVIGATION BACKGROUND ACORDING TO SCROLL HEIGHT
function navBg(){
    if (window.scrollY < banner.scrollHeight){
        nav.style.backgroundColor = 'rgba(246, 245, 245, 0.8)'
        
    }else if (window.scrollY > banner.scrollHeight){
        nav.style.backgroundColor = 'rgba(246, 245, 245, 1)'
    }
}




/*========================================
SCROLL BEHAVIOR FUNCTION FOR POPULAR AND UPCOMING SECTION
==============================================*/
function sectionScroll(btnR,btnL,section){
    
    function scrollx(num){
        btnL.onclick = function () {
          section.scrollLeft -= num;
        }
        btnR.onclick = function () {
          section.scrollLeft += num;
        }
    };

    if(window.innerWidth > 0){
        scrollx(250);
    }
    if(window.innerWidth > phoneXs){
        scrollx(450);
    }
    if(window.innerWidth > phone){
        scrollx(650);
    }
    if(window.innerWidth > tabPort){
        scrollx(800);
    }
    if(window.innerWidth > tabLand){
        scrollx(950);
    }
}
sectionScroll(buttonRight1,buttonLeft1,popular);
sectionScroll(buttonRight2,buttonLeft2,upcoming);




/*============================================
FETCHING FROM API
============================================ */


//MAIN FUNCTION TO FETCH
function requestMovies(url, onComplete, onError) {
    fetch(url)
    .then((res) => res.json())
    .then(onComplete)
    .catch(onError);
}


//FUNCTION TO HANDEL ERROR
function handleGeneralError(error) {
    console.log('Error: ', error.message);
    alert(error.message || 'Internal Server');
}


//FUNCTION TO  GENERATE THE URL 
function generateMovieDBUrl(path) {
    const url = `${MOVIE_DB_ENDPOINT}/3${path}?api_key=${MOVIE_DB_API}`;
    return url;
}




/*===============================
RENDERING DATA
================================*/

///SEARCHABLE SECTION
function renderMoviesList(data) {
    moviesSearchable.innerHTML = '';
    const moviesBlock = generateMoviesBlock(data);
}

//POPULAR SECTION
function renderMoviesPopular(data) {
    popular.innerHTML = '';
    const moviesBlock = generateMoviesItem(data,popular);
    return moviesBlock
}

//UPCOMING SECTION
function renderMoviesUpcoming(data) {
    upcoming.innerHTML = '';
    const moviesBlock = generateMoviesItem(data,upcoming);
    return moviesBlock
}



/*================================
FETCHING AND RENDERING SECTIONS
================================= */

// FETCHING SEARCH AND RENDER IT TO THE UI
function searchMovie(value) {
    const url = generateMovieDBUrl('/search/movie') + '&query=' + value;
    requestMovies(url, renderMoviesList, handleGeneralError);
}

//FETCHING TRENDING AND RENDER IT TO THE UI
function getTrendingMovies() {
    const url = generateMovieDBUrl('/trending/movie/day') + '&language=en-US&page=1';
    requestMovies(url, renderMoviesList, handleGeneralError);
}

// FETCHING DISCOVER AND RENDER IT TO THE UI
function getDiscoverMovies() {
    const url = generateMovieDBUrl('/discover/movie');
    requestMovies(url, renderMoviesList, handleGeneralError);
}

//FETCHING TOPRATED AND RENDER IT TO THE UI
function getTopRatedMovies() {
    const url = generateMovieDBUrl('/movie/top_rated');
    requestMovies(url, renderMoviesList, handleGeneralError);
}

//FETCHING POPULAR AND RENDER IT TO THE UI
function getPopularMovies() {
    const url = generateMovieDBUrl('/movie/popular');
    requestMovies(url, renderMoviesPopular, handleGeneralError);
}


//FETCHING UPCOMING AND RENDER IT TO THE UI
function getUpcomingMovies() {
    const url = generateMovieDBUrl('/movie/upcoming');
    requestMovies(url, renderMoviesUpcoming, handleGeneralError);
}





//FETCHING MOVIE INFO RENDER IT TO THE UI
function getById(movieId) {
    const url = generateMovieDBUrl(`/movie/${movieId}`);
    requestMovies(url, generateMoviesPage, handleGeneralError);
}
//FETCHING MOVIE VIDEO
function getVideo(movieId) {
    const url = generateMovieDBUrl(`/movie/${movieId}/videos`);
    requestMovies(url, generatevideo, handleGeneralError);
}

    
    
    



function noResults(){ 
    const messege = `<p class="mx-auto text-center">No results found</p>`
    
    
    return moviesSearchable.insertAdjacentHTML('beforeend', messege)
};








function resetInput() {
    searchInput.value = '';
}



/*===================================
CREATING TEMPLATES
===================================== */


///CREATE A MOVIE BLOCK IN SEARCHABLE SECTION
function createMovieContainer(title, date, rate, imageUrl, id, imdbId) {
    
    const tempDiv = `
    <div id="${id}" class="movie-list__item col-xs-12 col-sm-6 col-md-4 col-lg-3 my-4 w-75 mx-auto" data-id="">
        <div id="movie-container" class="movie-list__img mb-4">
                <a href="#${id}" class=" goto-movie text-decoration-none " movieId="${id}">
                    <img src="${imageUrl}" alt="" class="img-fluid movie-list__img--in goto-movie"  movieId="${id}">
                </a>
        </div>
        <div class="movie-list__info text-left ">
                
                <h3 class="w-70 ">
                <a href="#${id}" class=" goto-movie text-decoration-none  movie-list__info--link " movieId="${id}">${title}</a>
                </h3>
            <div class=" justify-content-between d-flex mt-auto">
                <h4 class="w-40 d-inline-block mt-auto">
                <span class=" text-warning ">${rate} <i class="fa fa-star" aria-hidden="true"></i></span>
                </h4>
                <h4 class="text-muted text-right w-40 d-inline-block  mt-auto">${date}</h4>
            </div>
        </div>
    </div>
                `;
                
                return tempDiv;
}
         

////CREATE MOVIE ITEM IN POPULAR AND UPCOMING SECTION
function createMovieItem(title, imageUrl, id) {
    
    const tempDivItem = `
            <div id="${id}" class="movies__movie">
                <div class="movies__poster">
                    <a href="#${id}" class="  text-decoration-none " movieId="${id}">
                        <img  class="img-fluid goto-movie" src="${imageUrl}" alt=""  movieId="${id}">
                    </a>
                </div>
                <div class="movies__movie__heading  pl-2">
                    <h3>${title}</h3>
                </div>
            </div>
                `;
                
                return tempDivItem;
}

////CREATE MOVIE IN MOVIE PAGE
function createMoviePage(id, title, imageUrl, date, overview, vote) {
    
    const tempDivItem = `
                
                    <div class="movie__info px-4">
                        <div class="movie__poster">
                            <img src="${imageUrl}" alt="" >
                        </div>
                        <div class="movie__text ">
                            <h1 class="movie__title ">${title}</h1>
                            <h3 class="movie__date text-muted">${date}</h3>
                            <h3 class="movie_rating text-warning">${vote}<i class="fa fa-star" aria-hidden="true"></i></h3>
                        </div>
                    </div>
                    <div class="movie__overview px-4 p-lg-4">
                        <h2 class="movie__overview--heading"> Overview</h2>
                        <p class="movie__overview--p">
                                ${overview}
                        </p>
                    </div>
                    
                `;
                
                return tempDivItem;
}
////CREATE VIDEO IFRAME
function createVideo(videoKey) {
    
    const tempDivItem = `
                <div class="movie__video">
                            <iframe id="video" src="https://www.youtube.com/embed/${videoKey}" frameborder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowfullscreen></iframe>
                        </div>
                `;
                
                return tempDivItem;
}




/* ============================
LOOPING OVER FETCHED DATA AND RENDER IT
==================================== */

//SEARCHABLE SECTION
function generateMoviesBlock(data) {
    const movies = data.results;
                
                
    for (let i = 0; i < movies.length; i++) {
        const { title, release_date, vote_average ,poster_path, id } = movies[i];
                    
    if (title && release_date && vote_average && poster_path && id) {
        const imageUrl = MOVIE_DB_IMAGE_ENDPOINT + poster_path;
        if(title.length > 25){
            const movieContainer = createMovieContainer(title.substring(0,25)+ '...', release_date.substring(0,4) , vote_average, imageUrl, id);
            moviesSearchable.insertAdjacentHTML('beforeend', movieContainer);
            
        } else{
            
            const movieContainer = createMovieContainer(title, release_date.substring(0,4), vote_average, imageUrl, id);
            moviesSearchable.insertAdjacentHTML('beforeend', movieContainer);
        }           

        }
    }
}



//POPULAR AND UPCOMING SECTIONS
function generateMoviesItem(data, section) {
    const movies = data.results;
                
                
    for (let i = 0; i < movies.length; i++) {
        const { title, release_date, vote_average ,poster_path, id } = movies[i];
                    
    if (title && release_date && vote_average && poster_path && id) {
        const imageUrl = MOVIE_DB_IMAGE_ENDPOINT + poster_path;
        if(title.length > 25){
            const movieContainer = createMovieItem(title.substring(0,25)+ '...', imageUrl, id);
            section.insertAdjacentHTML('beforeend', movieContainer);
            
        } else{
            
            const movieContainer = createMovieItem(title,imageUrl, id);
            section.insertAdjacentHTML('beforeend', movieContainer);
        }           

        }
    }
}


// MOVIE PAGE
function generateMoviesPage(data) {
    const movie = data;
                
    const { title, release_date, vote_average ,poster_path, id, overview } = movie;
                    
    if (title && release_date && vote_average && poster_path && id && overview) {
        const imageUrl = MOVIE_DB_IMAGE_ENDPOINT + poster_path;
            const movieContainer = createMoviePage(id, title, imageUrl, release_date.substring(0,4), overview, vote_average, getVideo(id));
            moviePage.insertAdjacentHTML('beforeend', movieContainer)
    }
}
// Video
function generatevideo(data) {
    const video = data.results;
                
    const { key } = video[0];
                    
    if (key) {
        
            const videoContainer = createVideo(key);
            moviePage.insertAdjacentHTML('beforeend', videoContainer)
    }
}




/* ==============================
EVENT LISTENERS
=================================== */

//SEARCH BUTTON
searchButton.addEventListener('click', e =>{
    e.preventDefault()
    const value = searchInput.value
    
    if(discover.classList.contains('active')){
        discover.classList.remove('active')
    }
    if(topRated.classList.contains('active')){
        topRated.classList.remove('active')
    }
    if(trending.classList.contains('active')){
        trending.classList.remove('active')
    }
    
    if (value) {
        searchMovie(value);
    }
    resetInput();
})

/// FUNTION TO TOGGLE STYLES BETWEEN BUTTON IN SEARCHABLE SECTION
function toggleButtons(add, remove1, remove2){

    add.classList.add('active')
    if(remove1.classList.contains('active')){
        remove1.classList.remove('active')
    }
    if(remove2.classList.contains('active')){
        remove2.classList.remove('active')
    }
}

//TRENDING, DISCOVER, TOPRATED BUTTONS EVENT LISTENERS AND TOGGLERS 
trending.addEventListener('click', e =>{
    e.preventDefault()
    toggleButtons(trending, discover, topRated)
    getTrendingMovies()
})
discover.addEventListener('click', e =>{
    e.preventDefault()
    toggleButtons(discover, trending, topRated)
    getDiscoverMovies()
})
topRated.addEventListener('click', e =>{
    e.preventDefault()
    toggleButtons(topRated, discover, trending)
    getTopRatedMovies()
})

/*=======================================
INITIAL CALLED FUNCTIONS
=========================================== */
getDiscoverMovies()//SHOW DISCOVER MOVIES AS DEFAULLT WHEN LOADING THE PAGE
getPopularMovies()// RENDER POPULAR MOVIES IN POPULAR SECTION
getUpcomingMovies()// RENDER UPCOMING MOVIES IN UPCOMING SECTION

navBg()//CHANGE NAV BACKGROUND ON SCROLL AND RESIZE
navToggle()//CHANGE NAV Toggling ON SCROLL AND RESIZE
 window.onscroll = navBg , navToggle
 window.onresize = navBg ,navToggle


/*============================
GETTING FULL INFO
=========================== */
window.onhashchange = function() {
    if(window.location.hash.replace('#', '')){
        const movieId= window.location.hash.replace('#', '');
        main.innerHTML = '';
        moviePage.innerHTML = '';
        moviePage.style.paddingTop = '10rem'
        moviePage.style.paddingBottom = '5rem'
        getById(movieId);
        window.scrollTo(0, 0);
    }else {
        location.reload()
        moviePage.style.paddingTop = '0'
        window.scrollTo(0, 0);
    }
    
}

function remove_hash_from_url() { 
    let uri = window.location.toString(); 
  
    if (uri.indexOf("#") > 0) { 
        let clean_uri = uri.substring(0,  
                        uri.indexOf("#")); 
  
                window.history.replaceState({},  
                document.title, clean_uri); 
    } 
    location.reload()
    window.scrollTo(0, 0);

} 

window.onload= window.scrollTo(0, 0);

homeBtns.forEach(curr=>{
    curr.addEventListener('click', remove_hash_from_url)
})


