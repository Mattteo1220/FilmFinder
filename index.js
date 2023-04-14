let playBtn = document.getElementById("play");
let randomMovieBox = document.getElementById("movie-data");
let genresDropDown = document.getElementById("genres-dropdown");

let title = document.getElementById("title");
let overview = document.getElementById("overview");
let poster = document.getElementById("poster");
let releaseDate = document.getElementById("release-date");
let runtime = document.getElementById("runtime");


const tmbdKey = '5120fa4aad8f3c25fb9eade36e1eb6ac';
const tmbdBaseUrl = "https://api.themoviedb.org/3";
const imageUrl = "https://image.tmdb.org/t/p/w1280";
let requestParams = `?api_key=${tmbdKey}`;

let movie = {
    PosterPath: "",
    Overview: "",
    ReleaseDate: "",
    Runtime: 0
}




async function getSuggestionsAsync(){
    const genrePath = "/genre/movie/list";
    let genreRequestEndpoint = `${tmbdBaseUrl}${genrePath}${requestParams}`;

    try{
        let response = await fetch(genreRequestEndpoint);
        if(response.ok){
            let data = await response.json();
            console.log(data.genres);
            return data.genres;
        }
    }
    catch(error){
        console.log(error);
    }
}

function populateDropDown(genres){
    if(genres.length === 0){
        throw new Error("No genres provided.");
    }

    for(let genre of genres){
        let newOption = document.createElement("option");
        newOption.value = genre.id;
        newOption.text = genre.name;
        genresDropDown.options.add(newOption);
    }
}

async function fetchRandomMovieAsync(){
    let randomInt = Math.floor(Math.random() * 1000);
    const moviePath = `/movie/${randomInt}`;
    let movieRequestEndpoint = `${tmbdBaseUrl}${moviePath}${requestParams}`;
    

    try{
        let response = await fetch(movieRequestEndpoint);
        if(response.ok){
            let data = await response.json();
            console.log(data);
            movie.Overview = `Overview: ${data.overview}`;
            movie.PosterPath = `${imageUrl}${data.poster_path}`;
            movie.ReleaseDate = `Release Date: ${data.release_date}`;
            movie.Runtime = `Runtime: ${data.runtime} minutes`;
            return movie;
        }
        else{
            movie.Title = "No movie was found. Retry!";
        }
    }   
    catch(error){
        console.log(error);
    }
}

function populateRandomMovieBox(movie){
    overview.innerHTML = movie.Overview;
    poster.src = movie.PosterPath;
    releaseDate.innerHTML = movie.ReleaseDate;
    runtime.innerHTML = movie.Runtime;
    randomMovieBox.hidden = false;
}

getSuggestionsAsync().then(populateDropDown);
playBtn.addEventListener("click", () =>{ 
    fetchRandomMovieAsync().then(populateRandomMovieBox)
}
);